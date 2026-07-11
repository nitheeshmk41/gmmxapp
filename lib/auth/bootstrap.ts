import type { Models } from "node-appwrite";
import { ID, Query } from "node-appwrite";
import { logEvent } from "@/lib/logger";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { DEFAULT_WEBSITE_SECTIONS } from "@/features/website/seed";
import { validateSubdomainFormat } from "@/lib/utils/subdomain";

export async function ensureUserRecord({
  appwriteUser,
  provider,
  correlationId,
}: {
  appwriteUser: Models.User<Models.Preferences>;
  provider: "email" | "google" | "phone";
  correlationId?: string;
}) {
  const displayName = appwriteUser.name || appwriteUser.email.split("@")[0] || "Owner";

  const { databases, users } = await createAdminClient();
  
  const prefs = await users.getPrefs(appwriteUser.$id);
  let detectedRole = prefs.role || "owner";
  let onboardingStatus = prefs.onboarding_status || "pending";

  try {
    const gymUsersRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [Query.equal("userId", appwriteUser.$id)]
    );

    if (gymUsersRes.documents.length > 0) {
      detectedRole = gymUsersRes.documents[0].role;
      onboardingStatus = "completed";
    } else {
      const queries = [];
      if (appwriteUser.email && !appwriteUser.email.endsWith('@phone.gmmx.app')) {
        queries.push(Query.equal("email", appwriteUser.email));
      } else if (appwriteUser.email && appwriteUser.email.endsWith('@phone.gmmx.app')) {
        queries.push(Query.equal("phone", appwriteUser.email.split('@')[0]));
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

  const needsUpdate = 
    prefs.onboarding_status !== onboardingStatus || 
    prefs.role !== detectedRole ||
    !prefs.onboarding_status;

  if (needsUpdate) {
    await users.updatePrefs(appwriteUser.$id, {
      ...prefs,
      onboarding_status: onboardingStatus,
      role: detectedRole
    });
  }

  logEvent("info", "user.bootstrap.completed", {
    correlationId,
    userId: appwriteUser.$id,
    provider,
  });

  return {
    id: appwriteUser.$id,
    email: appwriteUser.email,
    name: displayName,
    onboarding_status: onboardingStatus,
    role: detectedRole
  };
}

export async function createGymTenant({
  userId,
  gymName,
  subdomain,
  theme,
  country,
  timezone,
  currency,
}: {
  userId: string;
  gymName: string;
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

  const { databases, users } = await createAdminClient();

  // Validate Subdomain uniqueness
  const existingGyms = await databases.listDocuments(
    APPWRITE_DB_ID,
    COLLECTIONS.GYMS,
    [Query.equal("subdomain", subdomain)]
  );

  if (existingGyms.total > 0) {
    throw new Error("This subdomain is already taken.");
  }

  // TRANSACTION SIMULATION
  // Since Appwrite lacks native multi-document transactions, we create documents sequentially.
  // If a later step fails, we attempt to clean up the partially created tenant.
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
    let planId = "starter"; // Fallback
    try {
      const planRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.SAAS_PLANS,
        [Query.equal("name", "Starter")]
      );
      if (planRes.documents.length > 0) {
        planId = planRes.documents[0].$id;
      } else {
        // Fallback to query any plan if "Starter" isn't explicitly defined
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

    // 7. Mark User as Onboarded
    const prefs = await users.getPrefs(userId);
    await users.updatePrefs(userId, {
      ...prefs,
      onboarding_status: "completed"
    });

    return gym;

  } catch (error) {
    console.error("Tenant provisioning failed! Rolling back...", error);
    
    // Log failure to activity_logs
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

    // Attempt Rollback
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
