import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export async function deleteUserData(userId: string) {
  if (!userId) throw new Error("userId is required for user data cleanup");

  const { databases } = await createAdminClient();

  // Find all gyms owned by this user
  const gymsRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
    Query.equal("ownerId", userId),
    Query.limit(100), // Assuming one user won't own more than 100 gyms
  ]);

  if (gymsRes.total === 0) {
    console.log(`[User Cleanup] No gyms found for ownerId: ${userId}`);
  } else {
    const gymIds = gymsRes.documents.map((g: any) => g.$id);
    console.log(`[User Cleanup] Found gyms for ownerId ${userId}:`, gymIds);

    const collectionsToClean = [
      COLLECTIONS.SUBSCRIPTIONS,
      COLLECTIONS.GYM_USERS,
      COLLECTIONS.LEADS,
      COLLECTIONS.MEMBERS,
      COLLECTIONS.MEMBERSHIP_PLANS,
      COLLECTIONS.TRAINERS,
      COLLECTIONS.ATTENDANCE,
      COLLECTIONS.PAYMENTS,
      COLLECTIONS.GYM_SETTINGS,
      COLLECTIONS.WEBSITE_SECTIONS,
      COLLECTIONS.GYM_PROFILE,
      COLLECTIONS.GYM_SOCIALS,
      COLLECTIONS.GYM_SERVICES,
      COLLECTIONS.GYM_GALLERY,
      COLLECTIONS.ACTIVITY_LOGS,
      COLLECTIONS.TESTIMONIALS,
    ];

    for (const gymId of gymIds) {
      console.log(`[User Cleanup] Cleaning data for gymId: ${gymId}`);
      
      // Clean all related collections
      for (const collectionId of collectionsToClean) {
        let hasMore = true;
        while (hasMore) {
          try {
            const docs = await databases.listDocuments(APPWRITE_DB_ID, collectionId, [
              Query.equal("gymId", gymId),
              Query.limit(100),
            ]);
            if (docs.documents.length === 0) {
              hasMore = false;
              break;
            }
            await Promise.all(
              docs.documents.map((doc: any) =>
                databases.deleteDocument(APPWRITE_DB_ID, collectionId, doc.$id).catch((e) => console.error(`Failed deleting doc ${doc.$id} in ${collectionId}`, e))
              )
            );
          } catch (e: any) {
            console.error(`[User Cleanup] Failed fetching/deleting ${collectionId} for gym ${gymId}`, e.message);
            hasMore = false; // Break loop on error to avoid infinite loops if it's a permission issue
          }
        }
      }

      // Finally delete the gym document itself
      try {
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId);
        console.log(`[User Cleanup] Successfully deleted gym document: ${gymId}`);
      } catch (e: any) {
        console.error(`[User Cleanup] Failed deleting gym document: ${gymId}`, e.message);
      }
    }
  }

  // Next, regardless of if they owned a gym, clean up their records across the DB where userId is directly referenced.
  const userCollectionsToClean = [
    COLLECTIONS.GYM_USERS,
    COLLECTIONS.ACTIVITY_LOGS
  ];

  for (const collectionId of userCollectionsToClean) {
    let hasMore = true;
    while (hasMore) {
      try {
        const docs = await databases.listDocuments(APPWRITE_DB_ID, collectionId, [
          Query.equal("userId", userId),
          Query.limit(100),
        ]);
        if (docs.documents.length === 0) {
          hasMore = false;
          break;
        }
        await Promise.all(
          docs.documents.map((doc: any) =>
            databases.deleteDocument(APPWRITE_DB_ID, collectionId, doc.$id).catch((e) => console.error(`Failed deleting doc ${doc.$id} in ${collectionId}`, e))
          )
        );
      } catch (e: any) {
        console.error(`[User Cleanup] Failed fetching/deleting ${collectionId} for user ${userId}`, e.message);
        hasMore = false; // Break loop on error to avoid infinite loops
      }
    }
  }

  console.log(`[User Cleanup] Finished cleanup for userId: ${userId}`);
}
