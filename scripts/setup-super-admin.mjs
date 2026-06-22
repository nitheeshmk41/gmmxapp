// Script: setup-super-admin.mjs
// Creates gmmxapp@gmail.com as super admin with password admin@321
// Usage: node scripts/setup-super-admin.mjs

import { Client, Users, ID, Query } from "node-appwrite";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env manually
const envPath = resolve(__dirname, "../.env");
const envContent = readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) return;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim().replace(/^"(.*)"$/, "$1");
  process.env[key] = value;
});

const ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

const SUPER_ADMIN_EMAIL = "gmmxapp@gmail.com";
const SUPER_ADMIN_PASSWORD = "admin@321";
const SUPER_ADMIN_NAME = "GMMX Super Admin";

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error("❌ Missing Appwrite config. Check your .env file.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const users = new Users(client);

async function setupSuperAdmin() {
  console.log("🚀 Setting up Super Admin...");
  console.log(`   Endpoint: ${ENDPOINT}`);
  console.log(`   Project:  ${PROJECT_ID}`);
  console.log(`   Email:    ${SUPER_ADMIN_EMAIL}`);

  let userId = null;

  // Check if user already exists
  try {
    const list = await users.list([Query.equal("email", SUPER_ADMIN_EMAIL)]);
    if (list.users.length > 0) {
      const existingUser = list.users[0];
      userId = existingUser.$id;
      console.log(`\n✅ User already exists: ${existingUser.name} (${existingUser.$id})`);

      // Update password
      await users.updatePassword(userId, SUPER_ADMIN_PASSWORD);
      console.log("✅ Password updated to: admin@321");
    }
  } catch (err) {
    console.log("ℹ️  Checking user existence failed, will try to create:", err.message);
  }

  // Create user if not exists
  if (!userId) {
    try {
      const newUser = await users.create(
        ID.unique(),
        SUPER_ADMIN_EMAIL,
        undefined, // phone
        SUPER_ADMIN_PASSWORD,
        SUPER_ADMIN_NAME
      );
      userId = newUser.$id;
      console.log(`\n✅ Created new user: ${newUser.$id}`);
    } catch (err) {
      console.error("❌ Failed to create user:", err.message);
      process.exit(1);
    }
  }

  // Set role to super_admin in preferences
  try {
    const prefs = await users.getPrefs(userId);
    await users.updatePrefs(userId, {
      ...prefs,
      role: "super_admin",
      onboarding_status: "completed",
    });
    console.log("✅ User preferences updated: role=super_admin");
  } catch (err) {
    console.error("❌ Failed to update preferences:", err.message);
    process.exit(1);
  }

  // Verify email if not already verified
  try {
    const userInfo = await users.get(userId);
    if (!userInfo.emailVerification) {
      await users.updateEmailVerification(userId, true);
      console.log("✅ Email verified");
    } else {
      console.log("✅ Email already verified");
    }
  } catch (err) {
    console.warn("⚠️  Could not verify email:", err.message);
  }

  console.log("\n🎉 Super Admin setup complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Email:    ${SUPER_ADMIN_EMAIL}`);
  console.log(`  Password: ${SUPER_ADMIN_PASSWORD}`);
  console.log(`  Role:     super_admin`);
  console.log(`  User ID:  ${userId}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nLogin at: http://localhost:3000/signin");
}

setupSuperAdmin().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
