import "dotenv/config";
import { createGymTenant } from "../lib/auth/bootstrap";
import { validateSubdomainFormat } from "../lib/utils/subdomain";
import { createAdminClient } from "../lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "../lib/appwrite/types";
import { Databases, Query, ID } from "node-appwrite";


async function runTests() {
  console.log("=== Starting Onboarding Flow Verification Tests ===");
  const { databases, users } = await createAdminClient();

  // Create a temporary test user
  console.log("Creating temporary test user...");
  const tempEmail = `test-onboard-${Math.random().toString(36).substring(2, 8)}@gmmx.app`;
  const tempUser = await users.create(ID.unique(), tempEmail, undefined, "password123", "Test User");
  const testUserId = tempUser.$id;
  console.log(`Temporary test user created with ID: ${testUserId}`);

  try {
    // --- Test 6: Reserved Subdomains ---
    console.log("\n--- Running Test 6: Reserved Subdomains Check ---");
    const reservedSubdomains = ["admin", "api", "www", "dashboard"];
    for (const sub of reservedSubdomains) {
      const result = validateSubdomainFormat(sub);
      if (result.valid) {
        throw new Error(`Reserved subdomain check failed: '${sub}' was accepted but should be reserved.`);
      }
      console.log(`✓ Reserved subdomain '${sub}' correctly rejected: "${result.error}"`);
    }

    // --- Test 5: Subdomain Duplication Check ---
    console.log("\n--- Running Test 5: Subdomain Duplication Check ---");
    const dupSubdomain = "test-dup-" + Math.random().toString(36).substring(2, 8);
    
    console.log(`Creating first gym with subdomain '${dupSubdomain}'...`);
    const gym1 = await createGymTenant({
      userId: testUserId,
      gymName: "Duplicate Gym 1",
      subdomain: dupSubdomain,
      theme: "modern_fitness"
    });
    console.log(`First gym created successfully with ID: ${gym1.$id}`);

    console.log(`Attempting to create second gym with same subdomain '${dupSubdomain}'...`);
    let dupErrorThrown = false;
    try {
      await createGymTenant({
        userId: testUserId,
        gymName: "Duplicate Gym 2",
        subdomain: dupSubdomain,
        theme: "modern_fitness"
      });
    } catch (e: any) {
      dupErrorThrown = true;
      if (e.message !== "This subdomain is already taken.") {
        throw new Error(`Duplicate subdomain threw unexpected error: ${e.message}`);
      }
      console.log(`✓ Second gym creation correctly rejected with error: "${e.message}"`);
    }

    if (!dupErrorThrown) {
      throw new Error("Duplicate subdomain check failed: Second gym was created successfully!");
    }

    // Clean up first gym
    console.log("Cleaning up first gym...");
    const gymIdToDelete = gym1.$id;
    
    // Delete gym document by ID
    await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymIdToDelete);
    
    const collectionsToDelete = [
      COLLECTIONS.GYM_USERS,
      COLLECTIONS.SUBSCRIPTIONS,
      COLLECTIONS.GYM_SETTINGS,
      COLLECTIONS.GYM_PROFILE
    ];
    for (const col of collectionsToDelete) {
      const docs = await databases.listDocuments(APPWRITE_DB_ID, col, [Query.equal("gymId", gymIdToDelete)]);
      for (const d of docs.documents) {
        await databases.deleteDocument(APPWRITE_DB_ID, col, d.$id);
      }
    }
    const sections = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, [Query.equal("gymId", gymIdToDelete)]);
    for (const d of sections.documents) {
      await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, d.$id);
    }
    console.log("First gym cleaned up successfully.");

    // --- Test 7: Transaction Rollback Verification ---
    console.log("\n--- Running Test 7: Transaction Rollback Verification ---");
    
    // Save original createDocument
    const originalCreateDocument = Databases.prototype.createDocument;
    let throwSimulatedError = false;

    // Monkey-patch Databases.prototype.createDocument
    (Databases.prototype as any).createDocument = function (databaseId: string, collectionId: string, documentId: string, data: any, permissions?: string[]) {
      if (throwSimulatedError && collectionId === COLLECTIONS.WEBSITE_SECTIONS) {
        console.log("[MOCK] Simulating failure during website sections seeding...");
        throw new Error("Simulated failure during website sections seeding");
      }
      return originalCreateDocument.apply(this, arguments as any);
    };

    const failSubdomain = "test-fail-" + Math.random().toString(36).substring(2, 8);
    throwSimulatedError = true;

    let rollbackErrorThrown = false;
    try {
      console.log(`Attempting to provision tenant with subdomain '${failSubdomain}'...`);
      await createGymTenant({
        userId: testUserId,
        gymName: "Fail Gym",
        subdomain: failSubdomain,
        theme: "modern_fitness"
      });
    } catch (e: any) {
      rollbackErrorThrown = true;
      if (e.message !== "Failed to create workspace. Please try again.") {
        throw new Error(`Rollback threw unexpected error: ${e.message}`);
      }
      console.log(`✓ Provisioning failed with correct error: "${e.message}"`);
    }

    if (!rollbackErrorThrown) {
      throw new Error("Rollback check failed: Gym was created successfully!");
    }

    // Restore createDocument
    throwSimulatedError = false;

    console.log("Verifying database to ensure no orphan documents remain...");
    const gymQuery = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [Query.equal("subdomain", failSubdomain)]);
    if (gymQuery.documents.length > 0) {
      throw new Error("Orphan Gym document found!");
    }
    console.log("✓ No Gym document found.");

    const gymUsersQuery = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, [Query.equal("userId", testUserId)]);
    let orphanGymUser = false;
    for (const doc of gymUsersQuery.documents) {
      try {
        await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, doc.gymId);
      } catch (err: any) {
        if (err.code === 404) {
          orphanGymUser = true;
          // Cleanup
          await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, doc.$id);
        }
      }
    }
    if (orphanGymUser) {
      throw new Error("Orphan Gym User document found!");
    }
    console.log("✓ No orphan Gym User documents found.");
    console.log("✓ Rollback test completed successfully. No orphans detected.");

    // --- Test 8: Tenant Isolation Check ---
    console.log("\n--- Running Test 8: Tenant Isolation Check ---");
    const gymASub = "gym-a-" + Math.random().toString(36).substring(2, 8);
    const gymA = await createGymTenant({
      userId: testUserId,
      gymName: "Gym A",
      subdomain: gymASub,
      theme: "modern_fitness"
    });
    console.log(`Gym A created with subdomain '${gymASub}' and ID: ${gymA.$id}`);

    console.log("Creating second temporary test user...");
    const emailB = `test-b-${Math.random().toString(36).substring(2, 8)}@gmmx.app`;
    const userB = await users.create(ID.unique(), emailB, undefined, "password123", "User B");
    const userIdB = userB.$id;

    try {
      const resA = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, [
        Query.equal("gymId", gymA.$id),
        Query.equal("userId", testUserId)
      ]);
      if (resA.documents.length === 0) {
        throw new Error("Tenant Isolation Check failed: Owner A has no access to Gym A");
      }
      console.log(`✓ Owner A correctly has access to Gym A (Role: ${resA.documents[0].role})`);

      const resB = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, [
        Query.equal("gymId", gymA.$id),
        Query.equal("userId", userIdB)
      ]);
      if (resB.documents.length > 0) {
        throw new Error("Tenant Isolation Check failed: User B incorrectly has access to Gym A!");
      }
      console.log(`✓ User B correctly has NO access to Gym A (returned 0 matching gym_users documents)`);
    } finally {
      console.log("Cleaning up Gym A and second test user...");
      await users.delete(userIdB);
      await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymA.$id);
      
      const userDocs = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, [Query.equal("gymId", gymA.$id)]);
      for (const d of userDocs.documents) {
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, d.$id);
      }
      const subDocs = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [Query.equal("gymId", gymA.$id)]);
      for (const d of subDocs.documents) {
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, d.$id);
      }
      const settingsDocs = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, [Query.equal("gymId", gymA.$id)]);
      for (const d of settingsDocs.documents) {
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, d.$id);
      }
      const profileDocs = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, [Query.equal("gymId", gymA.$id)]);
      for (const d of profileDocs.documents) {
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, d.$id);
      }
      const sectionsDocs = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, [Query.equal("gymId", gymA.$id)]);
      for (const d of sectionsDocs.documents) {
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, d.$id);
      }
      console.log("Gym A cleanup complete.");
    }

    console.log("\n=== All Onboarding Flow Tests Passed Successfully! ===");

  } finally {
    // Delete the temporary test user
    console.log("\nDeleting temporary test user...");
    await users.delete(testUserId);
    console.log("Temporary test user deleted.");
  }
}

runTests().catch((err) => {
  console.error("❌ Test run failed:", err);
  process.exit(1);
});
