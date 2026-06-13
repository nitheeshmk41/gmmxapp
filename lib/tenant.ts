import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export interface TenantData {
  id: string;
  name: string;
  subdomain: string;
  logoUrl: string | null;
  template: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  ownerId: string;
  createdAt: string;
}

export async function getTenantBySubdomain(subdomain: string): Promise<TenantData | null> {
  try {
    const { databases } = await createAdminClient();
    
    const gymRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      [Query.equal("subdomain", subdomain)]
    );

    if (gymRes.documents.length === 0) {
      return null;
    }

    const gym = gymRes.documents[0];

    return {
      id: gym.$id,
      name: gym.name || "Gym",
      subdomain: gym.subdomain,
      logoUrl: gym.logo_url || null,
      template: gym.template || "modern",
      primaryColor: gym.primary_color || null,
      secondaryColor: gym.secondary_color || null,
      ownerId: gym.owner_id,
      createdAt: gym.$createdAt,
    };
  } catch (error) {
    console.error(`[Tenant Lookup Error] Failed to fetch tenant for ${subdomain}:`, error);
    return null;
  }
}
