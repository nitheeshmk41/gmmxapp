import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModernTemplate } from "@/components/gym-site/templates/modern/layout";
import { TransformationTemplate } from "@/components/gym-site/templates/transformation/layout";
import { CommunityTemplate } from "@/components/gym-site/templates/community/layout";
import { MinimalTemplate } from "@/components/gym-site/templates/minimal/layout";
import { PerformanceTemplate } from "@/components/gym-site/templates/performance/layout";
import { getTenantBySubdomain, getTenantByHostname } from "@/lib/tenant";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, MembershipPlanDocument, TrainerDocument, TestimonialDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { getCurrentContext } from "@/lib/auth/context";
import { headers } from "next/headers";

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
  const headerStore = await headers();
  const host = headerStore.get("host") || "";
  const hostname = host.split(":")[0];

  const tenant = await getTenantByHostname(hostname) || await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  // Check draft mode vs authenticated owner
  const context = await getCurrentContext();
  const isOwner = context?.user?.id === tenant.ownerId;
  const isDraft = tenant.websiteStatus === "draft" || tenant.websiteStatus === "maintenance";

  if (isDraft && !isOwner) {
    // Under construction view
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] text-white p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-md w-full text-center space-y-6 animate-in">
          <div className="w-16 h-16 rounded-3xl bg-[#FF5C73]/10 text-[#FF5C73] border border-[#FF5C73]/20 flex items-center justify-center mx-auto text-2xl">
            🚧
          </div>
          <h1 className="text-3xl font-black">{tenant.name} is coming soon!</h1>
          <p className="text-[#94A3B8] text-sm">
            We are working hard to prepare our website. Check back soon or visit us directly to get started!
          </p>
          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
            Powered by <a href="https://gmmx.app" className="text-[#FF5C73] font-semibold hover:underline">GMMX</a>
          </div>
        </div>
      </div>
    );
  }

  const { databases } = await createAdminClient();

  let plansRes = { documents: [] as MembershipPlanDocument[] };
  let trainersRes = { documents: [] as TrainerDocument[] };
  let testimonialsRes = { documents: [] as TestimonialDocument[] };
  let heroTitle = "";
  let heroSubtitle = "";

  try {
    // 1. Fetch active membership plans
    plansRes = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      [Query.equal("gymId", tenant.id), Query.equal("isActive", true)]
    );

    // 2. Fetch trainers
    trainersRes = await databases.listDocuments<TrainerDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.TRAINERS,
      [Query.equal("gymId", tenant.id)]
    );

    // 3. Fetch testimonials
    testimonialsRes = await databases.listDocuments<TestimonialDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.TESTIMONIALS,
      [Query.equal("gymId", tenant.id)]
    );

    // 4. Fetch hero section content from website_sections
    const sectionsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.WEBSITE_SECTIONS,
      [
        Query.equal("gymId", tenant.id),
        Query.equal("sectionKey", "hero")
      ]
    );
    if (sectionsRes.documents.length > 0) {
      const parsed = JSON.parse(sectionsRes.documents[0].contentJson);
      heroTitle = parsed.title || "";
      heroSubtitle = parsed.subtitle || "";
    }
  } catch (error) {
    console.error(`[Tenant Route Error] Failed to fetch Appwrite collections:`, error);
  }

  const gymData = {
    id: tenant.id,
    name: tenant.name,
    phone: tenant.phone || "",
    email: tenant.email || "", 
    logo_url: tenant.logoUrl,
  };

  const settingsData = {
    template: tenant.template || "modern",
    hero_image_url: null, // Custom cover image could be loaded here
    description: tenant.description || null,
    tagline: heroSubtitle || tenant.tagline || null,
    hero_title: heroTitle || null,
    gallery_urls: tenant.gallery || [],
    social_instagram: tenant.instagramUrl || null,
    social_facebook: tenant.facebookUrl || null,
    social_youtube: tenant.youtubeUrl || null,
    whatsapp_number: tenant.whatsapp || null,
    contact_email: tenant.email || null,
    address: tenant.address || null,
  };

  const plansData = plansRes.documents.map((p) => ({
    id: p.$id,
    name: p.name,
    price: p.amount, // Maps p.amount to template p.price
    duration_days: p.durationDays,
    description: null,
  }));

  const trainersData = trainersRes.documents.map((t) => ({
    id: t.$id,
    name: t.name,
    specialization: null,
    experience_years: null,
    photo_url: t.photoFileId ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/trainer-photos/files/${t.photoFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}` : null,
    bio: null,
  }));

  const testimonialsData = testimonialsRes.documents.map((t) => ({
    id: t.$id,
    name: t.name,
    review: t.review,
    rating: t.rating,
  }));

  const content = (() => {
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

    if (settingsData.template === "minimal") {
      return (
        <MinimalTemplate
          gym={gymData}
          settings={settingsData}
          plans={plansData}
          trainers={trainersData}
          testimonials={testimonialsData}
          services={tenant.services || []}
        />
      );
    }

    if (settingsData.template === "performance") {
      return (
        <PerformanceTemplate
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
  })();

  return (
    <div className="relative">
      {isDraft && isOwner && (
        <div className="bg-[#FF5C73] text-white text-xs font-semibold py-2.5 px-4 text-center sticky top-0 z-50 flex items-center justify-center gap-2 shadow-md">
          <span>👁️ You are viewing a draft preview of your website. Publish it from the dashboard setup wizard.</span>
          <a href={`/dashboard`} className="underline font-black hover:text-zinc-200">Go to Dashboard →</a>
        </div>
      )}
      {content}
    </div>
  );
}
