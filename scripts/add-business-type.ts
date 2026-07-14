import "dotenv/config";
import { Client, Databases } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS } from "../lib/appwrite/types";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

async function run() {
  console.log("=== Adding businessType to GYMS ===");
  try {
    await databases.createStringAttribute(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      "businessType",
      50,
      false, // not required for backward compatibility
      "Gym"  // default value
    );
    console.log("✓ Successfully added businessType attribute to GYMS.");
  } catch (e: any) {
    if (e.code === 409) {
      console.log("Attribute businessType already exists.");
    } else {
      console.error("Failed to add attribute:", e.message);
    }
  }
}

run();
