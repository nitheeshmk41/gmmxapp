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
    const collId = 'trainers';
    
    console.log("Creating trainers attributes...");
    await databases.createStringAttribute(dbId, collId, "gymId", 36, true);
    await databases.createStringAttribute(dbId, collId, "name", 255, true);
    await databases.createStringAttribute(dbId, collId, "phone", 50, true);
    await databases.createStringAttribute(dbId, collId, "email", 255, false);
    await databases.createStringAttribute(dbId, collId, "specialization", 255, false);
    await databases.createIntegerAttribute(dbId, collId, "experienceYears", false);
    await databases.createUrlAttribute(dbId, collId, "photoUrl", false);
    await databases.createStringAttribute(dbId, collId, "bio", 2000, false);
    await databases.createBooleanAttribute(dbId, collId, "isActive", true);

    console.log("Attributes creation triggered. Creating indexes...");
    
    // We should wait for a second, but let's try creating indexes immediately
    // Wait for attributes to be created might take a little time in Appwrite
    // We'll just create the indexes in a separate try/catch
  } catch(e) {
    console.error("Error creating attributes:", e.message);
  }
}
run();
