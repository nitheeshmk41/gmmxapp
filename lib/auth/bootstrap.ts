import type { Models } from "node-appwrite";
import { ID } from "node-appwrite";
import { logEvent } from "@/lib/logger";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";

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

  // Appwrite Users API holds the core identity.
  // In our new architecture, we don't have a separate `users` DB table,
  // we just use the `gym_users` collection for mapping users to tenants.
  // We can update the Appwrite user preferences to track onboarding status.
  const { users } = await createAdminClient();
  
  const prefs = await users.getPrefs(appwriteUser.$id);
  if (!prefs.onboarding_status) {
    await users.updatePrefs(appwriteUser.$id, {
      ...prefs,
      onboarding_status: "pending",
      role: "gym_owner"
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
    onboarding_status: prefs.onboarding_status || "pending",
    role: prefs.role || "owner"
  };
}

export async function createGymTenant({
  userId,
  gymName,
  ownerName,
  email,
  phone,
  subdomain,
  plan = "starter",
  template = "modern",
  primaryColor,
  secondaryColor,
  logoUrl,
  coverImageUrl,
}: {
  userId: string;
  gymName: string;
  ownerName: string;
  email: string;
  phone: string;
  subdomain: string;
  plan?: string;
  template?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  coverImageUrl?: string;
}) {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const { databases, users } = await createAdminClient();

  // Create Gym
  const gym = await databases.createDocument(
    APPWRITE_DB_ID,
    COLLECTIONS.GYMS,
    ID.unique(),
    {
      name: gymName,
      subdomain,
      ownerId: userId,
      template,
      primaryColor,
      secondaryColor,
      logoUrl,
      coverImageUrl,
      trialEndsAt: trialEndsAt.toISOString(),
      createdAt: new Date().toISOString()
    }
  );

  // Link Owner
  await databases.createDocument(
    APPWRITE_DB_ID,
    COLLECTIONS.GYM_USERS,
    ID.unique(),
    {
      gymId: gym.$id,
      userId: userId,
      role: "OWNER"
    }
  );

  // Mark user as onboarded
  const prefs = await users.getPrefs(userId);
  await users.updatePrefs(userId, {
    ...prefs,
    onboarding_status: "completed"
  });

  return gym;
}

export function routeForUser(user: {
  role: string;
  onboarding_status: string;
  gymId?: string | null;
}) {
  if (user.role === "super_admin") return "/admin";
  if (user.onboarding_status !== "completed") return "/onboarding";
  
  const path = user.role === "TRAINER" ? "/trainer/dashboard" : user.role === "MEMBER" ? "/member/dashboard" : "/dashboard";

  return path; // Domain resolution handled by middleware/redirects
}
