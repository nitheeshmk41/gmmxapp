import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export async function deleteTenantData(ownerId: string) {
  if (!ownerId) throw new Error("ownerId is required for tenant cleanup");

  const { databases } = await createAdminClient();

  // Find all gyms owned by this user
  const gymsRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
    Query.equal("ownerId", ownerId),
    Query.limit(100), // Assuming one user won't own more than 100 gyms
  ]);

  if (gymsRes.total === 0) {
    console.log(`[Tenant Cleanup] No gyms found for ownerId: ${ownerId}`);
    return;
  }

  const gymIds = gymsRes.documents.map((g: any) => g.$id);
  console.log(`[Tenant Cleanup] Found gyms for ownerId ${ownerId}:`, gymIds);

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
    console.log(`[Tenant Cleanup] Cleaning data for gymId: ${gymId}`);
    
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
          console.error(`[Tenant Cleanup] Failed fetching/deleting ${collectionId} for gym ${gymId}`, e.message);
          hasMore = false; // Break loop on error to avoid infinite loops if it's a permission issue
        }
      }
    }

    // Finally delete the gym document itself
    try {
      await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId);
      console.log(`[Tenant Cleanup] Successfully deleted gym document: ${gymId}`);
    } catch (e: any) {
      console.error(`[Tenant Cleanup] Failed deleting gym document: ${gymId}`, e.message);
    }
  }

  console.log(`[Tenant Cleanup] Finished cleanup for ownerId: ${ownerId}`);
}
