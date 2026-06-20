const { Client, Users } = require('node-appwrite');
require('dotenv').config({ path: '.env' });

async function run() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  try {
    const userList = await users.list();
    for (const user of userList.users) {
      console.log('Updating password for:', user.email);
      await users.updatePassword(user.$id, '1234abcd');
      const prefs = await users.getPrefs(user.$id);
      await users.updatePrefs(user.$id, { ...prefs, requiresPasswordChange: true });
    }
    console.log('Done!');
  } catch(e) {
    console.error(e);
  }
}
run();
