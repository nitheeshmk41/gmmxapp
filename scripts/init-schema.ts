import { Client, Databases, IndexType } from "node-appwrite";
import { config } from "dotenv";

config();

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "gmmx_db";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function createString(collectionId: string, key: string, size: number, required: boolean) {
  try {
    await databases.createStringAttribute(DB_ID, collectionId, key, size, required);
    console.log(`Attribute ${key} created on ${collectionId}`);
  } catch (e: any) {
    if (e.code !== 409) console.error(`Error creating ${key}: ${e.message}`);
  }
}

async function createIndex(collectionId: string, key: string, type: IndexType, attributes: string[]) {
  try {
    await databases.createIndex(DB_ID, collectionId, key, type, attributes);
    console.log(`Index ${key} created on ${collectionId}`);
  } catch (e: any) {
    if (e.code !== 409) console.error(`Error creating index ${key}: ${e.message}`);
  }
}

async function setupSchema() {
  console.log("Setting up Gyms Schema...");
  await createString("gyms", "name", 255, true);
  await createString("gyms", "subdomain", 255, true);
  await createString("gyms", "ownerId", 255, true);
  await createString("gyms", "template", 255, true);
  await createString("gyms", "logoUrl", 1024, false);
  await createString("gyms", "primaryColor", 255, false);
  await createString("gyms", "secondaryColor", 255, false);
  await createString("gyms", "trialEndsAt", 255, false);
  await createString("gyms", "coverImageUrl", 1024, false);
  await createString("gyms", "createdAt", 255, false);

  console.log("Setting up Gym Users Schema...");
  await createString("gym_users", "gymId", 255, true);
  await createString("gym_users", "userId", 255, true);
  await createString("gym_users", "role", 255, true);

  console.log("Waiting for attributes to be ready...");
  await delay(3000); // Wait for Appwrite to process attributes

  console.log("Creating Indexes...");
  await createIndex("gyms", "subdomain_idx", IndexType.Unique, ["subdomain"]);
  await createIndex("gyms", "ownerId_idx", IndexType.Key, ["ownerId"]);

  await createIndex("gym_users", "gym_user_idx", IndexType.Key, ["gymId", "userId"]);

  console.log("Schema setup complete.");
}

setupSchema();
