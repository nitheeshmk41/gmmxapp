import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const adminEmail = 'admin@gmmx.app';

  console.log(`Checking if ${adminEmail} exists as super_admin...`);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'super_admin',
    },
    create: {
      email: adminEmail,
      role: 'super_admin',
    },
  });

  console.log('Super admin user configured successfully:', user);
  console.log('\nNOTE: Passwords are not stored in Prisma. You must create this user in Supabase Auth (via the signup page or Supabase Dashboard) using the exact same email address (`admin@gmmx.app`) and the password of your choice.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
