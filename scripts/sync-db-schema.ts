import "dotenv/config";
import { Client, Databases, IndexType, ID } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS } from "../lib/appwrite/types";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function recreateCollection(id: string, name: string) {
  try {
    await databases.deleteCollection(APPWRITE_DB_ID, id);
    console.log(`Deleted existing collection: ${id}`);
    await delay(1000);
  } catch (e: any) {
    if (e.code !== 404) {
      console.error(`Error deleting collection ${id}:`, e.message);
    }
  }

  try {
    await databases.createCollection(APPWRITE_DB_ID, id, name);
    console.log(`Created collection: ${id} (${name})`);
    await delay(1000);
  } catch (e: any) {
    console.error(`Failed to create collection ${id}:`, e.message);
    throw e;
  }
}

async function run() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Schema sync is disabled in production to prevent accidental data loss!");
    throw new Error("Schema sync disabled in production");
  }

  console.log("=== Starting Database Schema Sync ===");
  console.log("Database ID:", APPWRITE_DB_ID);

  // 1. Recreate all collections in order
  const collectionList = [
    { id: COLLECTIONS.SAAS_PLANS, name: "SaaS Plans" },
    { id: COLLECTIONS.SUBSCRIPTIONS, name: "Subscriptions" },
    { id: COLLECTIONS.GYMS, name: "Gyms" },
    { id: COLLECTIONS.GYM_USERS, name: "Gym Users" },
    { id: COLLECTIONS.LEADS, name: "Leads" },
    { id: COLLECTIONS.MEMBERS, name: "Members" },
    { id: COLLECTIONS.MEMBERSHIP_PLANS, name: "Membership Plans" },
    { id: COLLECTIONS.TRAINERS, name: "Trainers" },
    { id: COLLECTIONS.ATTENDANCE, name: "Attendance" },
    { id: COLLECTIONS.PAYMENTS, name: "Payments" },
    { id: COLLECTIONS.TESTIMONIALS, name: "Testimonials" },
    { id: COLLECTIONS.GYM_SETTINGS, name: "Gym Settings" },
    { id: COLLECTIONS.WEBSITE_SECTIONS, name: "Website Sections" },
    { id: COLLECTIONS.GYM_PROFILE, name: "Gym Profile" },
    { id: COLLECTIONS.GYM_SOCIALS, name: "Gym Socials" },
    { id: COLLECTIONS.GYM_SERVICES, name: "Gym Services" },
    { id: COLLECTIONS.GYM_GALLERY, name: "Gym Gallery" },
    { id: COLLECTIONS.ACTIVITY_LOGS, name: "Activity Logs" }
  ];

  for (const col of collectionList) {
    await recreateCollection(col.id, col.name);
  }

  console.log("\nWaiting for collections to register...");
  await delay(3000);

  // 2. Define Attributes
  console.log("\nCreating attributes...");

  // --- SAAS PLANS ---
  console.log("Creating SAAS_PLANS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, "name", 255, true);
  await databases.createFloatAttribute(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, "price", true);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, "maxMembers", true);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, "maxTrainers", true);
  await databases.createBooleanAttribute(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, "customDomain", true);
  await databases.createBooleanAttribute(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, "websiteBuilder", true);
  await databases.createBooleanAttribute(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, "mobileApp", true);

  // --- SUBSCRIPTIONS ---
  console.log("Creating SUBSCRIPTIONS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, "planId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, "status", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, "startsAt", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, "endsAt", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, "paymentProvider", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, "featuresJson", 2000, false);

  // --- GYMS ---
  console.log("Creating GYMS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "name", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "subdomain", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "customDomain", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "status", 50, true);
  await databases.createBooleanAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "isDeleted", false, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "deletedAt", 50, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "ownerId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYMS, "template", 255, true);

  // --- GYM USERS ---
  console.log("Creating GYM_USERS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, "userId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, "role", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, "status", 50, true);

  // --- LEADS ---
  console.log("Creating LEADS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "name", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "phone", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "email", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "message", 1000, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "status", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "source", 100, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.LEADS, "createdAt", 50, true);

  // --- MEMBERS ---
  console.log("Creating MEMBERS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "memberCode", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "name", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "phone", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "email", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "notes", 2000, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "memberPhotoFileId", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "planId", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "status", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "joinedAt", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "membershipStartDate", 50, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "membershipEndDate", 50, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "createdBy", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, "updatedBy", 255, false);

  // --- MEMBERSHIP PLANS ---
  console.log("Creating MEMBERSHIP_PLANS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, "name", 255, true);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, "durationDays", true);
  await databases.createFloatAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, "amount", true);
  await databases.createBooleanAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, "isActive", true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, "createdBy", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, "updatedBy", 255, false);

  // --- TRAINERS ---
  console.log("Creating TRAINERS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, "name", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, "slug", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, "photoFileId", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, "createdBy", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, "updatedBy", 255, false);

  // --- ATTENDANCE ---
  console.log("Creating ATTENDANCE attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, "memberId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, "attendanceDate", 20, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, "checkIn", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, "checkOut", 50, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, "method", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ATTENDANCE, "source", 50, true);

  // --- PAYMENTS ---
  console.log("Creating PAYMENTS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "memberId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "membershipPlanId", 255, false);
  await databases.createFloatAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "amount", true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "planNameSnapshot", 255, false);
  await databases.createFloatAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "planAmountSnapshot", false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "status", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "paymentMethod", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "transactionId", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "paidAt", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, "renewalNotes", 500, false);

  // --- TESTIMONIALS ---
  console.log("Creating TESTIMONIALS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TESTIMONIALS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TESTIMONIALS, "name", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.TESTIMONIALS, "review", 5000, true);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.TESTIMONIALS, "rating", true);

  // --- GYM SETTINGS ---
  console.log("Creating GYM_SETTINGS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, "websiteStatus", 50, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, "publishedAt", 50, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, "theme", 255, true);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, "themeVersion", false, undefined, undefined, 1);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, "logoFileId", 255, false);

  // --- WEBSITE SECTIONS ---
  console.log("Creating WEBSITE_SECTIONS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "sectionKey", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "contentJson", 10000, true);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "version", false, undefined, undefined, 1);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "sortOrder", true);
  await databases.createBooleanAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "isEnabled", true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "createdBy", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "updatedBy", 255, false);

  // --- GYM PROFILE ---
  console.log("Creating GYM_PROFILE attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, "seoTitle", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, "seoDescription", 1000, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, "phone", 50, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, "address", 1000, false);

  // --- GYM SOCIALS ---
  console.log("Creating GYM_SOCIALS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SOCIALS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SOCIALS, "instagramUrl", 1000, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SOCIALS, "facebookUrl", 1000, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SOCIALS, "youtubeUrl", 1000, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SOCIALS, "websiteUrl", 1000, false);

  // --- GYM SERVICES ---
  console.log("Creating GYM_SERVICES attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SERVICES, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SERVICES, "title", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SERVICES, "slug", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_SERVICES, "icon", 255, false);

  // --- GYM GALLERY ---
  console.log("Creating GYM_GALLERY attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_GALLERY, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_GALLERY, "imageFileId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_GALLERY, "caption", 255, false);
  await databases.createIntegerAttribute(APPWRITE_DB_ID, COLLECTIONS.GYM_GALLERY, "sortOrder", true);

  // --- ACTIVITY LOGS ---
  console.log("Creating ACTIVITY_LOGS attributes...");
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, "gymId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, "userId", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, "action", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, "entity", 255, true);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, "entityId", 255, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, "metadataJson", 2000, false);
  await databases.createStringAttribute(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, "timestamp", 50, true);

  console.log("\nWaiting for attributes to process in Appwrite...");
  await delay(8000);

  // 3. Create Indexes
  console.log("\nCreating indexes...");
  try {
    await databases.createIndex(APPWRITE_DB_ID, COLLECTIONS.GYMS, "subdomain_idx", IndexType.Unique, ["subdomain"]);
    console.log("Created subdomain index on GYMS");
  } catch (e: any) {
    console.error("Index creation failed for GYMS subdomain:", e.message);
  }

  try {
    await databases.createIndex(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, "gymId_idx", IndexType.Key, ["gymId"]);
    console.log("Created gymId index on GYM_SETTINGS");
  } catch (e: any) {
    console.error("Index creation failed for GYM_SETTINGS:", e.message);
  }

  try {
    await databases.createIndex(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, "gymId_sectionKey_idx", IndexType.Key, ["gymId", "sectionKey"]);
    console.log("Created gymId_sectionKey index on WEBSITE_SECTIONS");
  } catch (e: any) {
    console.error("Index creation failed for WEBSITE_SECTIONS:", e.message);
  }

  // 4. Seed SaaS Starter Plan
  console.log("\nSeeding default Starter SaaS Plan...");
  try {
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, ID.unique(), {
      name: "Starter",
      price: 0.0,
      maxMembers: 100,
      maxTrainers: 3,
      customDomain: false,
      websiteBuilder: true,
      mobileApp: false
    });
    console.log("✓ Successfully seeded 'Starter' SaaS Plan");
  } catch (e: any) {
    console.error("Failed to seed SaaS Plan:", e.message);
  }

  console.log("\n=== Database Schema Sync Complete ===");
}

run().catch(err => {
  console.error("❌ Schema sync failed:", err);
});
