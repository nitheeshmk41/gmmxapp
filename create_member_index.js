const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function run() {
  try {
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'gmmx_db';
    const collId = 'members';
    
    console.log("Creating members indexes...");
    await databases.createIndex(dbId, collId, "idx_gym_id", "key", ["gymId"], ["ASC"]);
    await databases.createIndex(dbId, collId, "idx_status", "key", ["status"], ["ASC"]);
    await databases.createIndex(dbId, collId, "idx_plan", "key", ["planId"], ["ASC"]);
    
    console.log("Indexes creation triggered.");
  } catch(e) {
    console.error("Error creating indexes:", e.message);
  }
}
run();
