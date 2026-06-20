import { createAdminClient, createSessionClient } from "@/lib/appwrite/server";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { APPWRITE_DB_ID, COLLECTIONS, GymUserDocument, GymDocument, SubscriptionDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { headers } from "next/headers";

export type AuthContext = Awaited<ReturnType<typeof getCurrentContext>>;
export type TenantContext = Awaited<ReturnType<typeof getCurrentGym>>;

export async function getCurrentContext() {
  try {
    const { account } = await createSessionClient();
    const appwriteUser = await account.get();
    
    return {
      appwriteUser,
      user: { 
        id: appwriteUser.$id, 
        email: appwriteUser.email, 
        name: appwriteUser.name, 
        onboarding_status: (appwriteUser.prefs && appwriteUser.prefs.onboarding_status) || "pending",
        role: (appwriteUser.prefs && appwriteUser.prefs.role) || "owner",
        requiresPasswordChange: (appwriteUser.prefs && appwriteUser.prefs.requiresPasswordChange) || false
      }
    };
  } catch (error) {
    return null;
  }
}

export async function getCurrentGym() {
  const context = await getCurrentContext();
  if (!context) return null;

  if (context.user.role === "super_admin") {
    return {
      user: context.user,
      gym: null,
      gymId: null,
      role: "super_admin",
      subscription: null,
      permissions: ["*"]
    };
  }

  try {
    const { databases } = await createAdminClient();
    const headerStore = await headers();
    const host = headerStore.get("host") || "";
    const hostname = host.split(":")[0];
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
    const isMainDomain = 
      hostname === appDomain || 
      hostname === `www.${appDomain}` || 
      hostname === "localhost" || 
      hostname === "127.0.0.1";

    let resolvedGymId: string | null = null;

    if (!isMainDomain) {
      let gym = null;

      if (hostname.endsWith(".localhost")) {
        const subdomain = hostname.replace(".localhost", "");
        const res = await databases.listDocuments<GymDocument>(APPWRITE_DB_ID, COLLECTIONS.GYMS, [Query.equal("subdomain", subdomain)]);
        gym = res.documents[0] || null;
      } else if (hostname.endsWith(`.${appDomain}`)) {
        const subdomain = hostname.slice(0, -(appDomain.length + 1));
        const res = await databases.listDocuments<GymDocument>(APPWRITE_DB_ID, COLLECTIONS.GYMS, [Query.equal("subdomain", subdomain)]);
        gym = res.documents[0] || null;
      } else {
        // Custom Domain Lookup
        const res = await databases.listDocuments<GymDocument>(APPWRITE_DB_ID, COLLECTIONS.GYMS, [Query.equal("customDomain", hostname)]);
        gym = res.documents[0] || null;
      }

      if (gym) {
        resolvedGymId = gym.$id;
      }
    }

    const queryFilters = [Query.equal("userId", context.user.id)];
    if (resolvedGymId) {
      queryFilters.push(Query.equal("gymId", resolvedGymId));
    }

    // Resolve via gym_users table
    const gymUsersRes = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      queryFilters
    );

    if (gymUsersRes.documents.length === 0) {
      return null;
    }

    const gymUser = gymUsersRes.documents[0];
    const gymId = gymUser.gymId;
    const role = gymUser.role;

    // Fetch Gym
    const gymRes = await databases.getDocument<GymDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      gymId
    );

    // Fetch Subscription
    let subscription: SubscriptionDocument | null = null;
    const subRes = await databases.listDocuments<SubscriptionDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.SUBSCRIPTIONS,
      [Query.equal("gymId", gymId)]
    );
    
    if (subRes.documents.length > 0) {
      subscription = subRes.documents[0];
    }

    return {
      user: context.user,
      gym: gymRes,
      gymId,
      role,
      subscription,
      permissions: [] // Expand with RBAC logic if needed later
    };
  } catch (error) {
    console.error("[getCurrentGym] Error resolving tenant context:", error);
    return null;
  }
}

export async function requireAuth() {
  const context = await getCurrentContext();
  if (!context) throw new AuthenticationError();
  return context;
}

export async function requireGymContext() {
  const context = await getCurrentGym();
  if (!context) throw new AuthorizationError("No active gym context found");
  return context;
}

function hasRole(role: string, allowed: string[]) {
  return allowed.includes(role);
}

export async function requireRole(allowed: string[]) {
  const context = await requireGymContext();
  if (!hasRole(context.role, allowed)) throw new AuthorizationError();
  return context;
}

export function requireOwner() {
  return requireRole(["owner", "super_admin"]);
}

export function requireManager() {
  return requireRole(["owner", "manager", "super_admin"]);
}

export function requireTrainer() {
  return requireRole(["owner", "manager", "trainer", "super_admin"]);
}
