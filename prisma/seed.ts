import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const adminEmail = 'admin@gmmx.app';
  const appwriteUserId = process.env.SUPER_ADMIN_APPWRITE_USER_ID;

  if (!appwriteUserId) {
    throw new Error('SUPER_ADMIN_APPWRITE_USER_ID is required to seed a super admin.');
  }

  console.log(`Checking if ${adminEmail} exists as super_admin...`);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      appwrite_user_id: appwriteUserId,
      role: 'super_admin',
      provider: 'email',
      onboarding_status: 'completed',
    },
    create: {
      appwrite_user_id: appwriteUserId,
      email: adminEmail,
      role: 'super_admin',
      provider: 'email',
      onboarding_status: 'completed',
    },
  });

  console.log('Super admin user configured successfully:', user);
  console.log('\nNOTE: Passwords are not stored in Prisma. This Appwrite user must exist with the matching SUPER_ADMIN_APPWRITE_USER_ID.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
