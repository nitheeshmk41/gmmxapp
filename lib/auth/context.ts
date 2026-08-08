import { createAdminClient } from "@/lib/appwrite/server";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { APPWRITE_DB_ID, COLLECTIONS, GymUserDocument, GymDocument, SubscriptionDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { headers } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { ensureUserRecord } from "@/lib/auth/bootstrap";

export type AuthContext = Awaited<ReturnType<typeof getCurrentContext>>;
export type TenantContext = Awaited<ReturnType<typeof getCurrentGym>>;

export async function getCurrentContext() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = clerkUser.firstName 
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() 
      : email.split("@")[0] || "Owner";

    let onboarding_status = clerkUser.publicMetadata?.onboarding_status as string;
    let role = clerkUser.publicMetadata?.role as string;

    // Bootstrap Clerk metadata dynamically if empty
    if (!onboarding_status || !role) {
      const syncedUser = await ensureUserRecord({ clerkUser });
      onboarding_status = syncedUser.onboarding_status;
      role = syncedUser.role;
    }

    return {
      clerkUser,
      user: { 
        id: clerkUser.id, 
        email, 
        name, 
        onboarding_status,
        role,
        requiresPasswordChange: false
      }
    };
  } catch (error) {
    console.error("[getCurrentContext] Error fetching Clerk context:", error);
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

    let resolvedGymId: string | null = null;
    let resolvedSlug = headerStore.get("x-organization-slug");

    // ── Primary Fallback for Server Actions / APIs: Referer header ───────────
    if (!resolvedSlug) {
      const referer = headerStore.get("referer");
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          // If referer is on the appDomain, extract first pathname segment
          const refererHost = refererUrl.host.split(":")[0];
          const isRefererMainDomain =
            refererHost === appDomain ||
            refererHost === `www.${appDomain}` ||
            refererHost === "localhost" ||
            refererHost === "127.0.0.1";

          if (isRefererMainDomain) {
            const segments = refererUrl.pathname.split("/").filter(Boolean);
            if (segments.length > 0) {
              const possibleSlug = segments[0];
              const { RESERVED_SUBDOMAINS } = await import("@/lib/utils/subdomain");
              if (!RESERVED_SUBDOMAINS.has(possibleSlug)) {
                resolvedSlug = possibleSlug;
              }
            }
          }
        } catch (e) {
          console.error("[getCurrentGym] Error parsing referer URL:", e);
        }
      }
    }

    // ── Primary: path-based routing (new architecture) ───────────────────────
    if (resolvedSlug) {
      const res = await databases.listDocuments<GymDocument>(
        APPWRITE_DB_ID,
        COLLECTIONS.GYMS,
        [Query.equal("subdomain", resolvedSlug), Query.equal("isDeleted", false), Query.limit(1)]
      );
      if (res.documents[0]) {
        resolvedGymId = res.documents[0].$id;
      }
    }

    // ── Fallback: subdomain-based routing (public sites, legacy, member/trainer portals) ──
    if (!resolvedGymId) {
      const isMainDomain =
        hostname === appDomain ||
        hostname === `www.${appDomain}` ||
        hostname === "localhost" ||
        hostname === "127.0.0.1";

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
