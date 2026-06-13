import { headers } from "next/headers";
import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, GymDocument } from "@/lib/appwrite/types";

export async function getCurrentSubdomain(): Promise<string | null> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  if (!isLocalhost && host.endsWith(`.${APP_DOMAIN}`)) {
    const subdomain = host.replace(`.${APP_DOMAIN}`, "");
    if (subdomain && subdomain !== "www") {
      return subdomain;
    }
  }

  return null;
}

export async function getCurrentTenant(): Promise<GymDocument | null> {
  const subdomain = await getCurrentSubdomain();
  if (!subdomain) return null;

  try {
    const { databases } = await createAdminClient();
    
    const response = await databases.listDocuments<GymDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      [Query.equal("subdomain", subdomain), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }
    
    return null;
  } catch (error) {
    console.error("Failed to load tenant for subdomain:", subdomain, error);
    return null;
  }
}
