import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModernTemplate } from "@/components/gym-site/templates/modern/layout";
import { getTenantBySubdomain } from "@/lib/tenant";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, MembershipPlanDocument, TrainerDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) return { title: "Gym not found" };

  return {
    title: `${tenant.name} – Gym Website`,
    description: `Welcome to ${tenant.name}. Join us today!`,
    openGraph: {
      title: tenant.name,
      description: `Welcome to ${tenant.name}. Join us today!`,
      images: tenant.logoUrl ? [tenant.logoUrl] : [],
    },
  };
}

export default async function GymPage({ params }: Props) {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  const { databases } = await createAdminClient();

  let rawSettings: any = {};
  let plansRes = { documents: [] as MembershipPlanDocument[] };
  let trainersRes = { documents: [] as TrainerDocument[] };

  try {
    // Fetch Settings
    console.log(`[Tenant Route] Fetching SETTINGS for gym_id: ${tenant.id}`);
    const settingsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      [Query.equal("gym_id", tenant.id)]
    );
    rawSettings = settingsRes.documents[0] || {};

    // Fetch active plans
    console.log(`[Tenant Route] Fetching PLANS for gym_id: ${tenant.id}`);
    plansRes = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PLANS,
      [Query.equal("gym_id", tenant.id), Query.equal("isActive", true)]
    );

    // Fetch active trainers
    console.log(`[Tenant Route] Fetching TRAINERS for gym_id: ${tenant.id}`);
    trainersRes = await databases.listDocuments<TrainerDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.TRAINERS,
      [Query.equal("gym_id", tenant.id), Query.equal("isActive", true)]
    );
  } catch (error) {
    console.error(`[Tenant Route Error] Failed to fetch Appwrite collections for subdomain: ${subdomain}`, error);
    // Don't throw unhandled exceptions. We will render the template with fallback data.
  }

  const gymData = {
    id: tenant.id,
    name: tenant.name,
    phone: "", // Fetch owner phone if needed, but the template allows fallback to settings
    email: "", 
    logo_url: tenant.logoUrl || null,
  };

  const settingsData = {
    template: rawSettings.template || tenant.template || "modern",
    hero_image_url: tenant.coverImageUrl || null, // Assuming gym has coverImageUrl as per init-schema
    description: rawSettings.description || null,
    tagline: rawSettings.tagline || null,
    gallery_urls: rawSettings.gallery_urls || [],
    social_instagram: rawSettings.social_instagram || null,
    social_facebook: rawSettings.social_facebook || null,
    social_youtube: rawSettings.social_youtube || null,
    whatsapp_number: rawSettings.whatsapp_number || null,
    contact_email: rawSettings.contact_email || null,
    address: rawSettings.address || null,
  };

  const plansData = plansRes.documents.map((p) => ({
    id: p.$id,
    name: p.name,
    price: p.price,
    duration_days: p.durationDays,
    description: p.description || null,
  }));

  const trainersData = trainersRes.documents.map((t) => ({
    id: t.$id,
    name: t.name,
    specialization: t.specialization || null,
    experience_years: t.experienceYears || null,
    photo_url: t.photoUrl || null,
    bio: t.bio || null,
  }));

  // In the future, we can switch based on settingsData.template
  // if (settingsData.template === "minimal") return <MinimalTemplate ... />
  // if (settingsData.template === "performance") return <PerformanceTemplate ... />

  return (
    <ModernTemplate
      gym={gymData}
      settings={settingsData}
      plans={plansData}
      trainers={trainersData}
    />
  );
}
