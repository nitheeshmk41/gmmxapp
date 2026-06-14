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
  websiteStatus: string;
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

// Map database document structures to TenantData output
async function mapGymToTenantData(databases: any, gym: any): Promise<TenantData> {
  const gymId = gym.$id;

  // Fetch related collections concurrently
  const [settingsRes, profileRes, socialsRes, servicesRes, galleryRes] = await Promise.all([
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, [Query.equal("gymId", gymId)]),
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, [Query.equal("gymId", gymId)]),
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SOCIALS, [Query.equal("gymId", gymId)]),
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SERVICES, [Query.equal("gymId", gymId)]),
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_GALLERY, [Query.equal("gymId", gymId)]),
  ]);

  const settings = settingsRes.documents[0] || null;
  const profile = profileRes.documents[0] || null;
  const socials = socialsRes.documents[0] || null;

  // Construct logoUrl from logoFileId
  let logoUrl = null;
  if (settings && settings.logoFileId) {
    logoUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/gym-logos/files/${settings.logoFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  }

  // Map template style
  let template = "modern";
  if (settings?.theme === "community_gym") {
    template = "community";
  } else if (settings?.theme === "transformation") {
    template = "transformation";
  }

  // Map services list
  const servicesList = servicesRes.documents.map((s: any) => s.title);

  // Map gallery images list
  const galleryList = galleryRes.documents.map((img: any) => 
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/gym-gallery/files/${img.imageFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  );

  return {
    id: gymId,
    name: gym.name || "Gym",
    subdomain: gym.subdomain,
    logoUrl,
    template,
    primaryColor: settings?.primaryColor || null,
    secondaryColor: null,
    ownerId: gym.ownerId || "",
    websiteStatus: settings?.websiteStatus || "draft",
    coverImageUrl: null,
    bannerUrl: null,
    tagline: null,
    description: null,
    city: null,
    address: profile?.address || null,
    phone: profile?.phone || null,
    whatsapp: socials?.whatsappUrl || null,
    email: socials?.websiteUrl || null,
    workingHours: null,
    mapsLink: null,
    instagramUrl: socials?.instagramUrl || null,
    facebookUrl: socials?.facebookUrl || null,
    youtubeUrl: socials?.youtubeUrl || null,
    services: servicesList,
    gallery: galleryList,
    createdAt: gym.$createdAt,
  };
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

    return await mapGymToTenantData(databases, gymRes.documents[0]);
  } catch (error) {
    console.error(`[Tenant Lookup Error] Failed to fetch tenant for subdomain ${subdomain}:`, error);
    return null;
  }
}

export async function getTenantByHostname(hostname: string): Promise<TenantData | null> {
  try {
    const { databases } = await createAdminClient();
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
    
    // Ignore main domains
    if (
      hostname === appDomain || 
      hostname === `www.${appDomain}` || 
      hostname === "localhost" || 
      hostname === "127.0.0.1"
    ) {
      return null;
    }

    let gym = null;

    if (hostname.endsWith(".localhost")) {
      const subdomain = hostname.replace(".localhost", "");
      const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [Query.equal("subdomain", subdomain)]);
      gym = res.documents[0] || null;
    } else if (hostname.endsWith(`.${appDomain}`)) {
      const subdomain = hostname.slice(0, -(appDomain.length + 1));
      const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [Query.equal("subdomain", subdomain)]);
      gym = res.documents[0] || null;
    } else {
      // Custom Domain Lookup
      const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [Query.equal("customDomain", hostname)]);
      gym = res.documents[0] || null;
    }

    if (!gym) return null;
    return await mapGymToTenantData(databases, gym);
  } catch (error) {
    console.error(`[Tenant Lookup Error] Failed to fetch tenant for host ${hostname}:`, error);
    return null;
  }
}
