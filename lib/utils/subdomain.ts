import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export const RESERVED_SUBDOMAINS = new Set([
  // System / infrastructure
  "admin", "root", "api", "server", "mail", "email", "support", "help",
  "dashboard", "app", "cdn", "ftp", "www", "test", "dev", "staging",
  "localhost", "website", "shop", "system", "null", "undefined",
  "docs", "register", "status", "monitor", "metrics",

  // Auth & onboarding routes (must match RESERVED_PATHS in middleware.ts)
  "login", "signin", "signup", "signout", "auth", "onboarding",
  "forgot-password", "reset-password", "set-password", "change-password",
  "callback",

  // Marketing pages
  "pricing", "features", "about", "contact", "contact-us",
  "blog", "blogs", "privacy", "terms", "refund", "solutions",
  "testimonials", "tools", "how-it-works",

  // Reserved GMMX internal paths
  "tenant", "error", "not-found",
]);

const PROFANITY_LIST = new Set([
  "fuck", "shit", "bitch", "cunt", "asshole", "dick", "pussy", "bastard", "whore" // Basic MVP filter
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
    return { valid: false, error: "This subdomain is reserved. Please choose another one." };
  }

  // Simple profanity check (if it contains any of the words)
  for (const word of PROFANITY_LIST) {
    if (subdomain.includes(word)) {
      // Returning generic message as requested
      return { valid: false, error: "This subdomain isn't available. Please choose another name." };
    }
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
