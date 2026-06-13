import { createAdminClient, createSessionClient } from "@/lib/appwrite/server";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { APPWRITE_DB_ID, COLLECTIONS, GymUserDocument, GymDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { headers } from "next/headers";

export type AuthContext = Awaited<ReturnType<typeof getCurrentContext>>;

export async function getCurrentContext() {
  try {
    const { account } = await createSessionClient();
    const appwriteUser = await account.get();
    
    const { databases } = await createAdminClient();

    const headerStore = await headers();
    const host = headerStore.get("host") || "";
    const hostname = host.split(":")[0];
    const parts = hostname.split(".");
    
    let currentGymId: string | null = null;
    
    if (
      hostname !== "localhost" &&
      hostname !== "gmmx.app" &&
      hostname !== "www.gmmx.app" &&
      hostname !== "127.0.0.1"
    ) {
      const subdomain = parts[0];
      const gymRes = await databases.listDocuments<GymDocument>(
        APPWRITE_DB_ID,
        COLLECTIONS.GYMS,
        [Query.equal("subdomain", subdomain)]
      );
      if (gymRes.documents.length > 0) {
        currentGymId = gymRes.documents[0].$id;
      }
    }

    const queryFilters = [Query.equal("userId", appwriteUser.$id)];
    if (currentGymId) {
      queryFilters.push(Query.equal("gym_id", currentGymId));
    }

    // Query gym_users to find if the user is attached to the current gym (or any gym if on root domain)
    const gymUsersRes = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      queryFilters
    );

    let gymUser = null;
    let gym: GymDocument | null = null;
    let role = "OWNER";

    if (gymUsersRes.documents.length > 0) {
      gymUser = gymUsersRes.documents[0];
      role = gymUser.role;
      
      const gymRes = await databases.listDocuments<GymDocument>(
        APPWRITE_DB_ID,
        COLLECTIONS.GYMS,
        [Query.equal("$id", gymUser.gymId)]
      );
      if (gymRes.documents.length > 0) {
        gym = gymRes.documents[0];
      }
    }

    return {
      appwriteUser,
      user: { 
        id: appwriteUser.$id, 
        email: appwriteUser.email, 
        name: appwriteUser.name, 
        role, 
        onboarding_status: (appwriteUser.prefs && appwriteUser.prefs.onboarding_status) || "pending" 
      },
      gym,
      role,
      subscription: null, // Subscriptions handled differently now
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const context = await getCurrentContext();
  if (!context) throw new AuthenticationError();
  return context;
}

function hasRole(role: string, allowed: string[]) {
  return allowed.includes(role);
}

export async function requireRole(allowed: string[]) {
  const context = await requireAuth();
  if (!hasRole(context.role, allowed)) throw new AuthorizationError();
  return context;
}

export function requireOwner() {
  return requireRole(["OWNER", "super_admin"]);
}

export function requireManager() {
  return requireRole(["OWNER", "manager", "super_admin"]);
}

export function requireTrainer() {
  return requireRole(["OWNER", "manager", "TRAINER", "super_admin"]);
}
