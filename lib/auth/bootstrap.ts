import { ID, Query } from "node-appwrite";
import { logEvent } from "@/lib/logger";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { DEFAULT_WEBSITE_SECTIONS } from "@/features/website/seed";
import { validateSubdomainFormat } from "@/lib/utils/subdomain";
import { clerkClient } from "@clerk/nextjs/server";

export async function ensureUserRecord({
  clerkUser,
  correlationId,
}: {
  clerkUser: any;
  correlationId?: string;
}) {
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const displayName = clerkUser.firstName 
    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() 
    : email.split("@")[0] || "Owner";

  const { databases } = await createAdminClient();
  
  let detectedRole = clerkUser.publicMetadata?.role || "owner";
  let onboardingStatus = clerkUser.publicMetadata?.onboarding_status || "pending";

  try {
    const gymUsersRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [Query.equal("userId", clerkUser.id)]
    );

    if (gymUsersRes.documents.length > 0) {
      detectedRole = gymUsersRes.documents[0].role;
      onboardingStatus = "completed";
    } else {
      const queries = [];
      if (email) {
        queries.push(Query.equal("email", email));
      }

      if (queries.length > 0) {
        const memberRes = await databases.listDocuments(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERS,
          queries
        );

        if (memberRes.documents.length > 0) {
          detectedRole = "member";
          onboardingStatus = "completed";
        }
      }
    }
  } catch (error) {
    console.error("[ensureUserRecord] Failed to query gym_users or members", error);
  }

  // Sync back to Clerk metadata if there is a mismatch
  const currentRole = clerkUser.publicMetadata?.role;
  const currentStatus = clerkUser.publicMetadata?.onboarding_status;

  if (currentRole !== detectedRole || currentStatus !== onboardingStatus) {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkUser.id, {
        publicMetadata: {
          role: detectedRole,
          onboarding_status: onboardingStatus,
        }
      });
    } catch (e) {
      console.error("[ensureUserRecord] Failed to update Clerk metadata:", e);
    }
  }

  logEvent("info", "user.bootstrap.completed", {
    correlationId,
    userId: clerkUser.id,
  });

  return {
    id: clerkUser.id,
    email,
    name: displayName,
    onboarding_status: onboardingStatus,
    role: detectedRole
  };
}

export async function createGymTenant({
  userId,
  gymName,
  businessType = "Gym",
  subdomain,
  theme,
  country,
  timezone,
  currency,
}: {
  userId: string;
  gymName: string;
  businessType?: string;
  subdomain: string;
  theme: string;
  country?: string;
  timezone?: string;
  currency?: string;
}) {
  const formatCheck = validateSubdomainFormat(subdomain);
  if (!formatCheck.valid) {
    throw new Error(formatCheck.error);
  }

  const { databases } = await createAdminClient();

  // Validate Subdomain uniqueness
  const existingGyms = await databases.listDocuments(
    APPWRITE_DB_ID,
    COLLECTIONS.GYMS,
    [Query.equal("subdomain", subdomain)]
  );

  if (existingGyms.total > 0) {
    throw new Error("This subdomain is already taken.");
  }

  let createdGymId: string | null = null;
  const createdDocs: { collection: string; id: string }[] = [];

  try {
    // 1. Create Gym
    const gym = await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      ID.unique(),
      {
        name: gymName,
        subdomain,
        businessType,
        ownerId: userId,
        status: "trial",
        isDeleted: false,
        template: theme || "modern_fitness"
      }
    );
    createdGymId = gym.$id;
    createdDocs.push({ collection: COLLECTIONS.GYMS, id: gym.$id });

    // 2. Create Gym User (Owner Role)
    const gymUser = await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      ID.unique(),
      {
        gymId: gym.$id,
        userId: userId,
        role: "owner",
        status: "active"
      }
    );
    createdDocs.push({ collection: COLLECTIONS.GYM_USERS, id: gymUser.$id });

    // 3. Find Starter plan document dynamically
    let planId = "starter";
    try {
      const planRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.SAAS_PLANS,
        [Query.equal("name", "Starter")]
      );
      if (planRes.documents.length > 0) {
        planId = planRes.documents[0].$id;
      } else {
        const anyPlanRes = await databases.listDocuments(
          APPWRITE_DB_ID,
          COLLECTIONS.SAAS_PLANS,
          [Query.limit(1)]
        );
        if (anyPlanRes.documents.length > 0) {
          planId = anyPlanRes.documents[0].$id;
        }
      }
    } catch (planError) {
      console.warn("[createGymTenant] Failed to fetch plan dynamically, falling back to 'starter':", planError);
    }

    // Create Subscription (Starter Trial)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const subscription = await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.SUBSCRIPTIONS,
      ID.unique(),
      {
        gymId: gym.$id,
        planId: planId,
        status: "trial",
        startsAt: new Date().toISOString(),
        endsAt: trialEndsAt.toISOString(),
      }
    );
    createdDocs.push({ collection: COLLECTIONS.SUBSCRIPTIONS, id: subscription.$id });

    // 4. Create Gym Settings (Draft Website)
    const settings = await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_SETTINGS,
      ID.unique(),
      {
        gymId: gym.$id,
        websiteStatus: "draft",
        theme: theme || "modern_fitness",
        themeVersion: 1
      }
    );
    createdDocs.push({ collection: COLLECTIONS.GYM_SETTINGS, id: settings.$id });

    // 5. Create Empty Gym Profile
    const profile = await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_PROFILE,
      ID.unique(),
      {
        gymId: gym.$id,
        phone: "",
        address: ""
      }
    );
    createdDocs.push({ collection: COLLECTIONS.GYM_PROFILE, id: profile.$id });

    // 6. Seed Website Sections
    for (const section of DEFAULT_WEBSITE_SECTIONS) {
      const secDoc = await databases.createDocument(
        APPWRITE_DB_ID,
        COLLECTIONS.WEBSITE_SECTIONS,
        ID.unique(),
        {
          gymId: gym.$id,
          sectionKey: section.sectionKey,
          contentJson: section.contentJson,
          version: 1,
          sortOrder: section.sortOrder,
          isEnabled: section.isEnabled,
          createdBy: userId,
          updatedBy: userId
        }
      );
      createdDocs.push({ collection: COLLECTIONS.WEBSITE_SECTIONS, id: secDoc.$id });
    }

    // 7. Mark User as Onboarded in Clerk
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboarding_status: "completed",
        role: "owner"
      }
    });

    return gym;

  } catch (error) {
    console.error("Tenant provisioning failed! Rolling back...", error);
    
    try {
      await databases.createDocument(
        APPWRITE_DB_ID,
        COLLECTIONS.ACTIVITY_LOGS,
        ID.unique(),
        {
          gymId: createdGymId || "failed-provisioning",
          userId: userId,
          action: "Tenant Provisioning Failed",
          entity: "gym",
          entityId: createdGymId || "",
          metadataJson: JSON.stringify({
            error: (error as any).message || String(error),
            partiallyCreatedDocsCount: createdDocs.length,
          }),
          timestamp: new Date().toISOString()
        }
      );
    } catch (logError) {
      console.error("[createGymTenant] Failed to log failure to activity_logs:", logError);
    }

    // Rollback
    for (const doc of createdDocs.reverse()) {
      try {
        await databases.deleteDocument(APPWRITE_DB_ID, doc.collection, doc.id);
      } catch (cleanupError) {
        console.error(`Rollback failed for document: ${doc.id} in collection: ${doc.collection}`, cleanupError);
      }
    }

    throw new Error("Failed to create workspace. Please try again.");
  }
}

export function routeForUser(user: {
  role: string;
  onboarding_status: string;
  gymId?: string | null;
}) {
  if (user.role === "super_admin") return "/admin/dashboard";
  if (user.onboarding_status !== "completed") return "/onboarding";
  
  const r = (user.role || "").toUpperCase();
  const path = r === "TRAINER" ? "/trainer/dashboard" : r === "MEMBER" ? "/member/dashboard" : "/owner/dashboard";

  return path;
}
