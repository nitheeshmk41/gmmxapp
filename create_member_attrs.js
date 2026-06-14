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
    
    console.log("Creating members attributes...");
    await databases.createStringAttribute(dbId, collId, "gymId", 36, true);
    await databases.createStringAttribute(dbId, collId, "name", 255, true);
    await databases.createStringAttribute(dbId, collId, "phone", 50, true);
    await databases.createStringAttribute(dbId, collId, "email", 255, false);
    await databases.createStringAttribute(dbId, collId, "gender", 50, false);
    await databases.createIntegerAttribute(dbId, collId, "age", false);
    await databases.createFloatAttribute(dbId, collId, "height", false);
    await databases.createFloatAttribute(dbId, collId, "weight", false);
    await databases.createStringAttribute(dbId, collId, "goal", 255, false);
    await databases.createDatetimeAttribute(dbId, collId, "joinDate", true);
    await databases.createStringAttribute(dbId, collId, "planId", 36, false);
    await databases.createStringAttribute(dbId, collId, "trainerId", 36, false);
    await databases.createStringAttribute(dbId, collId, "status", 50, true);
    await databases.createStringAttribute(dbId, collId, "notes", 2000, false);
    await databases.createUrlAttribute(dbId, collId, "photoUrl", false);

    console.log("Attributes creation triggered.");
  } catch(e) {
    console.error("Error creating attributes:", e.message);
  }
}
run();
