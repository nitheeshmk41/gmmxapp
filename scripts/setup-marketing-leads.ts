import "dotenv/config";
import { Client, Databases } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS } from "../lib/appwrite/types";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

async function setupMarketingLeads() {
  const collectionId = COLLECTIONS.MARKETING_LEADS;
  const name = "Marketing Leads";

  console.log(`Setting up ${name} collection...`);

  try {
    try {
      await databases.getCollection(APPWRITE_DB_ID, collectionId);
      console.log(`Collection ${collectionId} already exists. Skipping creation.`);
    } catch (e: any) {
      if (e.code === 404 || String(e.message).includes("not found")) {
        console.log(`Creating collection ${collectionId}...`);
        await databases.createCollection(APPWRITE_DB_ID, collectionId, name);
        console.log(`Collection created.`);
      } else {
        throw e;
      }
    }

    // Add Attributes
    console.log("Adding attributes...");
    const stringAttributes = [
      { key: "name", size: 255, required: true },
      { key: "email", size: 255, required: true },
      { key: "phone", size: 50, required: false },
      { key: "gymName", size: 255, required: false },
      { key: "inquiryType", size: 255, required: true },
      { key: "memberCount", size: 100, required: false },
      { key: "currentSoftware", size: 255, required: false },
      { key: "budget", size: 100, required: false },
      { key: "startDate", size: 100, required: false },
      { key: "message", size: 5000, required: true },
      { key: "source", size: 255, required: true },
      { key: "status", size: 50, required: true }, // "new" | "contacted"
    ];

    for (const attr of stringAttributes) {
      try {
        await databases.createStringAttribute(
          APPWRITE_DB_ID,
          collectionId,
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`Created attribute: ${attr.key}`);
        // Appwrite requires a small delay to process attribute creation
        await new Promise(res => setTimeout(res, 1000));
      } catch (e: any) {
        if (e.code === 409 || String(e.message).includes("already exists")) {
          console.log(`Attribute ${attr.key} already exists.`);
        } else {
          console.error(`Failed to create attribute ${attr.key}:`, e.message);
        }
      }
    }

    console.log("Setup complete!");
  } catch (error) {
    console.error("Setup failed:", error);
  }
}

setupMarketingLeads();
