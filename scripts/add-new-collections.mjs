// Additive migration: creates coupons + blogs collections in Appwrite
// Safe to run on existing data — only ADDS new collections, never deletes existing ones
// Usage: node scripts/add-new-collections.mjs

import { Client, Databases, IndexType, ID } from "node-appwrite";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
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
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "gmmx_db";

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error("❌ Missing Appwrite config.");
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureCollection(id, name) {
  try {
    await databases.getCollection(DB_ID, id);
    console.log(`✅ Collection already exists: ${id}`);
    return false; // already exists
  } catch (e) {
    if (e.code === 404) {
      await databases.createCollection(DB_ID, id, name);
      console.log(`✅ Created collection: ${id} (${name})`);
      await delay(1000);
      return true; // newly created
    }
    throw e;
  }
}

async function ensureStringAttr(colId, key, size, required, defaultVal = undefined) {
  try {
    await databases.createStringAttribute(DB_ID, colId, key, size, required, defaultVal);
    await delay(300);
  } catch (e) {
    if (e.code === 409) {
      // already exists — skip
    } else {
      console.warn(`  ⚠️  ${key}: ${e.message}`);
    }
  }
}

async function ensureFloatAttr(colId, key, required, defaultVal = undefined) {
  try {
    await databases.createFloatAttribute(DB_ID, colId, key, required, undefined, undefined, defaultVal);
    await delay(300);
  } catch (e) {
    if (e.code === 409) {
      // already exists
    } else {
      console.warn(`  ⚠️  ${key}: ${e.message}`);
    }
  }
}

async function ensureIntAttr(colId, key, required, defaultVal = undefined) {
  try {
    await databases.createIntegerAttribute(DB_ID, colId, key, required, undefined, undefined, defaultVal);
    await delay(300);
  } catch (e) {
    if (e.code === 409) {
      // already exists
    } else {
      console.warn(`  ⚠️  ${key}: ${e.message}`);
    }
  }
}

async function ensureBoolAttr(colId, key, required, defaultVal = undefined) {
  try {
    await databases.createBooleanAttribute(DB_ID, colId, key, required, defaultVal);
    await delay(300);
  } catch (e) {
    if (e.code === 409) {
      // already exists
    } else {
      console.warn(`  ⚠️  ${key}: ${e.message}`);
    }
  }
}

async function run() {
  console.log("🚀 GMMX — Additive Schema Migration");
  console.log(`   DB: ${DB_ID}`);
  console.log("   This script ONLY adds new collections. Existing data is SAFE.\n");

  // ── COUPONS ──────────────────────────────────────────────────────────────
  console.log("📦 Processing: coupons");
  const couponsNew = await ensureCollection("coupons", "Coupons");
  console.log("  Creating attributes...");
  await ensureStringAttr("coupons", "code", 50, true);
  await ensureStringAttr("coupons", "type", 20, true);         // "percent" | "flat"
  await ensureFloatAttr("coupons", "value", true);
  await ensureIntAttr("coupons", "maxUses", false, 0);
  await ensureIntAttr("coupons", "usedCount", false, 0);
  await ensureStringAttr("coupons", "expiresAt", 50, false);
  await ensureBoolAttr("coupons", "isActive", false, true);
  await ensureStringAttr("coupons", "description", 500, false);
  await ensureStringAttr("coupons", "createdAt", 50, true);
  console.log("  Waiting for attributes...");
  await delay(5000);
  try {
    await databases.createIndex(DB_ID, "coupons", "code_unique_idx", IndexType.Unique, ["code"]);
    console.log("  ✅ Unique index on code");
  } catch (e) {
    if (e.code !== 409) console.warn("  ⚠️  Index:", e.message);
  }
  try {
    await databases.createIndex(DB_ID, "coupons", "isActive_idx", "key", ["isActive"]);
    console.log("  ✅ Index on isActive");
  } catch (e) {
    if (e.code !== 409) console.warn("  ⚠️  Index:", e.message);
  }

  // ── BLOGS ─────────────────────────────────────────────────────────────────
  console.log("\n📦 Processing: blogs");
  const blogsNew = await ensureCollection("blogs", "Blogs");
  console.log("  Creating attributes...");
  await ensureStringAttr("blogs", "title", 500, true);
  await ensureStringAttr("blogs", "slug", 255, true);
  await ensureStringAttr("blogs", "content", 50000, true);
  await ensureStringAttr("blogs", "excerpt", 1000, false);
  await ensureStringAttr("blogs", "status", 20, true);         // "draft" | "published"
  await ensureStringAttr("blogs", "category", 100, false);
  await ensureStringAttr("blogs", "tags", 500, false);
  await ensureStringAttr("blogs", "featuredImageFileId", 255, false);
  await ensureStringAttr("blogs", "authorId", 255, true);
  await ensureStringAttr("blogs", "publishedAt", 50, false);
  await ensureStringAttr("blogs", "createdAt", 50, true);
  console.log("  Waiting for attributes...");
  await delay(5000);
  try {
    await databases.createIndex(DB_ID, "blogs", "slug_unique_idx", IndexType.Unique, ["slug"]);
    console.log("  ✅ Unique index on slug");
  } catch (e) {
    if (e.code !== 409) console.warn("  ⚠️  Index:", e.message);
  }
  try {
    await databases.createIndex(DB_ID, "blogs", "status_idx", "key", ["status"]);
    console.log("  ✅ Index on status");
  } catch (e) {
    if (e.code !== 409) console.warn("  ⚠️  Index:", e.message);
  }

  console.log("\n🎉 Migration complete! New collections added to Appwrite.");
}

run().catch((e) => {
  console.error("❌ Migration failed:", e.message);
  process.exit(1);
});
