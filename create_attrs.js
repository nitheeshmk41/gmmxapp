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
    const collId = 'membership_plans';
    
    console.log("Creating attributes...");
    await databases.createStringAttribute(dbId, collId, "gymId", 36, true);
    await databases.createStringAttribute(dbId, collId, "name", 255, true);
    await databases.createIntegerAttribute(dbId, collId, "durationDays", true);
    await databases.createFloatAttribute(dbId, collId, "price", true);
    await databases.createStringAttribute(dbId, collId, "description", 1000, false);
    await databases.createBooleanAttribute(dbId, collId, "isActive", true);

    console.log("Attributes creation triggered.");
  } catch(e) {
    console.error(e);
  }
}
run();
