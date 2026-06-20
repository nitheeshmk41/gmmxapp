import { createAdminClient } from "./server";
import { Permission, Role } from "node-appwrite";

/**
 * Ensures that all necessary storage buckets and database infrastructure exists.
 * Call this during deployment or admin setup.
 */
export async function ensureStorageInfrastructure() {
  console.log("[Bootstrap] Ensuring storage infrastructure...");
  try {
    const { storage } = await createAdminClient();

    // 1. gym-logos
    try {
      await storage.getBucket("gym-logos");
      console.log("[Bootstrap] Bucket 'gym-logos' exists.");
    } catch (e: any) {
      if (e.code === 404 || String(e.message || e).toLowerCase().includes("not found")) {
        console.log("[Bootstrap] Creating 'gym-logos' bucket...");
        await storage.createBucket(
          "gym-logos",
          "Gym Logos",
          [Permission.read(Role.any())], // Public read access
          false,
          false,
          5 * 1024 * 1024, // 5MB
          ["png", "jpg", "jpeg", "webp", "svg", "gif"]
        );
      } else {
        throw e;
      }
    }

    // 2. gym-gallery
    try {
      await storage.getBucket("gym-gallery");
      console.log("[Bootstrap] Bucket 'gym-gallery' exists.");
    } catch (e: any) {
      if (e.code === 404 || String(e.message || e).toLowerCase().includes("not found")) {
        console.log("[Bootstrap] Creating 'gym-gallery' bucket...");
        await storage.createBucket(
          "gym-gallery",
          "Gym Gallery",
          [Permission.read(Role.any())], 
          false,
          false,
          10 * 1024 * 1024, 
          ["png", "jpg", "jpeg", "webp", "svg", "mp4"]
        );
      } else {
        throw e;
      }
    }

    // 3. trainer-images
    try {
      await storage.getBucket("trainer-images");
      console.log("[Bootstrap] Bucket 'trainer-images' exists.");
    } catch (e: any) {
      if (e.code === 404 || String(e.message || e).toLowerCase().includes("not found")) {
        console.log("[Bootstrap] Creating 'trainer-images' bucket...");
        await storage.createBucket(
          "trainer-images",
          "Trainer Images",
          [Permission.read(Role.any())], 
          false,
          false,
          5 * 1024 * 1024, 
          ["png", "jpg", "jpeg", "webp"]
        );
      } else {
        throw e;
      }
    }

    console.log("[Bootstrap] Storage infrastructure ensured successfully.");
    return { success: true };
  } catch (error: any) {
    console.error("[Bootstrap] Failed to ensure infrastructure:", error);
    return { error: error.message };
  }
}
