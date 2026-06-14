import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

const RESERVED_SUBDOMAINS = new Set([
  "admin",
  "api",
  "www",
  "mail",
  "cdn",
  "app",
  "dashboard",
  "support",
  "help",
  "blog",
  "docs",
  "login",
  "signup",
  "register",
  "test",
  "staging",
  "dev"
]);

const SUBDOMAIN_REGEX = /^[a-z0-9-]+$/;

export function validateSubdomainFormat(subdomain: string): { valid: boolean; error?: string } {
  if (!subdomain) {
    return { valid: false, error: "Subdomain is required" };
  }

  if (subdomain.length < 3 || subdomain.length > 30) {
    return { valid: false, error: "Subdomain must be between 3 and 30 characters" };
  }

  if (!SUBDOMAIN_REGEX.test(subdomain)) {
    return { valid: false, error: "Subdomain can only contain lowercase letters, numbers, and hyphens" };
  }

  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    return { valid: false, error: "This subdomain is reserved and cannot be used" };
  }

  return { valid: true };
}

export async function checkSubdomainAvailability(subdomain: string): Promise<boolean> {
  const formatCheck = validateSubdomainFormat(subdomain);
  if (!formatCheck.valid) {
    return false;
  }

  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      [Query.equal("subdomain", subdomain)]
    );

    return result.total === 0;
  } catch (error) {
    console.error("[checkSubdomainAvailability] Error:", error);
    // Fail safe: if we can't check, assume it's not available to prevent conflicts
    return false;
  }
}
