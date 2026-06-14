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
    console.log("Database ID:", dbId);
    const res = await databases.listCollections(dbId);
    for (const c of res.collections) {
      const coll = await databases.getCollection(dbId, c.$id);
      console.log(`\nCollection: ${c.$id} (${c.name}) - ${coll.attributes.length} attributes`);
      console.log(coll.attributes.map(a => `${a.key} (${a.type}${a.required ? ', required' : ''})`).join(', '));
    }
  } catch(e) {
    console.error(e);
  }
}
run();
