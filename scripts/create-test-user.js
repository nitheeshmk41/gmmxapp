const { Client, Users, Databases, ID, Query } = require('node-appwrite');
require('dotenv').config({ path: '.env' });

async function run() {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
      
    const users = new Users(client);
    const db = new Databases(client);
    const email = 'test@gmmx.com';
    const password = '12345678';
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'gmmx_db';
    
    const existing = await users.list([Query.equal('email', email)]);
    let userId;
    if (existing.total > 0) {
      console.log('User already exists in Auth');
      userId = existing.users[0].$id;
      await users.updatePassword(userId, password);
    } else {
      const u = await users.create(ID.unique(), email, undefined, password, 'Test Member');
      userId = u.$id;
      console.log('Created user in Auth:', userId);
    }
    
    const gyms = await db.listDocuments(dbId, 'gyms', [Query.limit(1)]);
    if (gyms.total === 0) throw new Error('No gyms found');
    const gymId = gyms.documents[0].$id;
    
    const existingMembers = await db.listDocuments(dbId, 'members', [Query.equal('email', email)]);
    if (existingMembers.total > 0) {
      await db.updateDocument(dbId, 'members', existingMembers.documents[0].$id, { status: 'active', gymId });
      console.log('Updated existing member doc');
    } else {
      await db.createDocument(dbId, 'members', ID.unique(), { memberCode: 'MTEST', name: 'Test Member', phone: '0000000000', email, gymId, status: 'active', joinedAt: new Date().toISOString() });
      console.log('Created new member doc');
    }
    console.log('Done!');
  } catch(e) {
    console.error(e);
  }
}
run();
