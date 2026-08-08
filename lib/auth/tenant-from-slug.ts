import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, GymDocument, GymUserDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

/**
 * Resolve a gym document by its public-facing slug (= subdomain field).
 *
 * The `subdomain` field in the gyms collection serves as the unique
 * organization slug for path-based routing: gmmx.app/{slug}/dashboard
 */
export async function getGymBySlug(slug: string): Promise<GymDocument | null> {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments<GymDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      [
        Query.equal("subdomain", slug),
        Query.equal("isDeleted", false),
        Query.limit(1),
      ],
    );

    return res.documents[0] ?? null;
  } catch (error) {
    console.error(`[getGymBySlug] Failed to resolve gym for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Verify that a given user has an active membership in a specific gym.
 *
 * This is the core IDOR-prevention check: a user must not be able to access
 * another organization's data by changing the URL slug.
 *
 * Returns the GymUserDocument if the user is a member, or null if not.
 */
export async function getUserMembershipInGym(
  userId: string,
  gymId: string,
): Promise<GymUserDocument | null> {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [
        Query.equal("userId", userId),
        Query.equal("gymId", gymId),
        Query.equal("status", "active"),
        Query.limit(1),
      ],
    );

    return res.documents[0] ?? null;
  } catch (error) {
    console.error(
      `[getUserMembershipInGym] Failed to check membership for user "${userId}" in gym "${gymId}":`,
      error,
    );
    return null;
  }
}

/**
 * Resolve all gyms a user is a member of.
 * Used for the organization switcher UI.
 */
export async function getUserGyms(userId: string): Promise<
  Array<{
    gymId: string;
    role: string;
    gymName: string;
    gymSlug: string;
  }>
> {
  try {
    const { databases } = await createAdminClient();
    const gymUsersRes = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [
        Query.equal("userId", userId),
        Query.equal("status", "active"),
        Query.limit(25),
      ],
    );

    if (gymUsersRes.documents.length === 0) return [];

    // Fetch all gym details in parallel
    const gymDetails = await Promise.all(
      gymUsersRes.documents.map(async (gymUser) => {
        try {
          const gym = await databases.getDocument<GymDocument>(
            APPWRITE_DB_ID,
            COLLECTIONS.GYMS,
            gymUser.gymId,
          );
          return {
            gymId: gymUser.gymId,
            role: gymUser.role,
            gymName: gym.name,
            gymSlug: gym.subdomain,
          };
        } catch {
          return null;
        }
      }),
    );

    return gymDetails.filter(Boolean) as Array<{
      gymId: string;
      role: string;
      gymName: string;
      gymSlug: string;
    }>;
  } catch (error) {
    console.error(`[getUserGyms] Failed to fetch gyms for user "${userId}":`, error);
    return [];
  }
}
