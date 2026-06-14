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
  coverImageUrl: string | null;
  bannerUrl?: string | null;
  tagline?: string | null;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  workingHours?: string | null;
  mapsLink?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  services?: string[];
  gallery?: string[];
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
      coverImageUrl: gym.coverImageUrl || gym.cover_image_url || null,
      bannerUrl: gym.bannerUrl || null,
      tagline: gym.tagline || null,
      description: gym.description || null,
      city: gym.city || null,
      address: gym.address || null,
      phone: gym.phone || null,
      whatsapp: gym.whatsapp || null,
      email: gym.email || null,
      workingHours: gym.workingHours || null,
      mapsLink: gym.mapsLink || null,
      instagramUrl: gym.instagramUrl || null,
      facebookUrl: gym.facebookUrl || null,
      youtubeUrl: gym.youtubeUrl || null,
      services: gym.services || [],
      gallery: gym.gallery || [],
      createdAt: gym.$createdAt,
    };
  } catch (error) {
    console.error(`[Tenant Lookup Error] Failed to fetch tenant for ${subdomain}:`, error);
    return null;
  }
}
