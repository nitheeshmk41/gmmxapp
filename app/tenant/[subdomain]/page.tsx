import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModernTemplate } from "@/components/gym-site/templates/modern/layout";
import { TransformationTemplate } from "@/components/gym-site/templates/transformation/layout";
import { CommunityTemplate } from "@/components/gym-site/templates/community/layout";
import { getTenantBySubdomain } from "@/lib/tenant";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, MembershipPlanDocument, TrainerDocument, TestimonialDocument } from "@/lib/appwrite/types";
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
  let testimonialsRes = { documents: [] as TestimonialDocument[] };

  try {
    // Fetch Settings
    console.log(`[Tenant Route] Fetching SETTINGS for gym_id: ${tenant.id}`);
    const settingsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      [Query.equal("gymId", tenant.id)]
    );
    rawSettings = settingsRes.documents[0] || {};

    // Fetch active plans
    console.log(`[Tenant Route] Fetching PLANS for gym_id: ${tenant.id}`);
    plansRes = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PLANS,
      [Query.equal("gymId", tenant.id), Query.equal("isActive", true)]
    );

    // Fetch active trainers
    console.log(`[Tenant Route] Fetching TRAINERS for gym_id: ${tenant.id}`);
    trainersRes = await databases.listDocuments<TrainerDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.TRAINERS,
      [Query.equal("gymId", tenant.id), Query.equal("isActive", true)]
    );

    // Fetch testimonials
    console.log(`[Tenant Route] Fetching TESTIMONIALS for gym_id: ${tenant.id}`);
    testimonialsRes = await databases.listDocuments<TestimonialDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.TESTIMONIALS,
      [Query.equal("gymId", tenant.id)]
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
    template: tenant.template || "modern",
    hero_image_url: tenant.bannerUrl || tenant.coverImageUrl || null,
    description: tenant.description || null,
    tagline: tenant.tagline || null,
    gallery_urls: tenant.gallery || [],
    social_instagram: tenant.instagramUrl || null,
    social_facebook: tenant.facebookUrl || null,
    social_youtube: tenant.youtubeUrl || null,
    whatsapp_number: tenant.whatsapp || null,
    contact_email: tenant.email || null,
    address: tenant.address || null,
    workingHours: tenant.workingHours || null,
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

  const testimonialsData = testimonialsRes.documents.map((t) => ({
    id: t.$id,
    name: t.name,
    review: t.review,
    rating: t.rating,
  }));

  if (settingsData.template === "transformation") {
    return (
      <TransformationTemplate
        gym={gymData}
        settings={settingsData}
        plans={plansData}
        trainers={trainersData}
        testimonials={testimonialsData}
        services={tenant.services || []}
      />
    );
  }

  if (settingsData.template === "community") {
    return (
      <CommunityTemplate
        gym={gymData}
        settings={settingsData}
        plans={plansData}
        trainers={trainersData}
        testimonials={testimonialsData}
        services={tenant.services || []}
      />
    );
  }

  return (
    <ModernTemplate
      gym={gymData}
      settings={settingsData}
      plans={plansData}
      trainers={trainersData}
      testimonials={testimonialsData}
      services={tenant.services || []}
    />
  );
}
