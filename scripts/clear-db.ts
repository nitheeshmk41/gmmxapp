import { createAdminClient } from "../lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "../lib/appwrite/types";
import { Query } from "node-appwrite";

async function main() {
  console.log("Starting full database cleanup...");
  const { databases } = await createAdminClient();

  for (const collectionKey of Object.keys(COLLECTIONS)) {
    const collectionId = (COLLECTIONS as any)[collectionKey];
    console.log(`Cleaning collection: ${collectionId}`);
    
    let hasMore = true;
    let totalDeleted = 0;
    while (hasMore) {
      try {
        const docs = await databases.listDocuments(APPWRITE_DB_ID, collectionId, [
          Query.limit(100),
        ]);
        
        if (docs.documents.length === 0) {
          hasMore = false;
          break;
        }

        await Promise.all(
          docs.documents.map((doc: any) =>
            databases.deleteDocument(APPWRITE_DB_ID, collectionId, doc.$id)
          )
        );
        totalDeleted += docs.documents.length;
        console.log(`  - Deleted ${docs.documents.length} docs (Total: ${totalDeleted})`);
      } catch (e: any) {
        console.error(`Failed fetching/deleting ${collectionId}:`, e.message);
        hasMore = false;
      }
    }
  }

  console.log("Database cleared successfully!");
}

main().catch(console.error);
