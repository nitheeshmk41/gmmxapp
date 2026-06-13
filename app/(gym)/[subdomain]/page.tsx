import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModernTemplate } from "@/components/gym-site/templates/modern/layout";
import { MinimalTemplate } from "@/components/gym-site/templates/minimal/layout";
import { PerformanceTemplate } from "@/components/gym-site/templates/performance/layout";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

interface Props {
  params: Promise<{ subdomain: string }>;
}

async function getGymData(subdomain: string) {
  try {
    const { databases } = await createAdminClient();
    const gymRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYMS,
      [Query.equal("subdomain", subdomain)]
    );
    
    if (gymRes.documents.length === 0) return null;
    const gym = gymRes.documents[0];

    const settingsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      [Query.equal("gymId", gym.$id)]
    );
    
    return {
      gym,
      website_settings: settingsRes.documents.length > 0 ? settingsRes.documents[0] : null,
      membership_plans: [], // stub
      trainers: [], // stub
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getGymData(subdomain);

  if (!data) return { title: "Gym not found" };

  return {
    title: `${data.gym.name} – Gym Website`,
    description: data.website_settings?.description || `Welcome to ${data.gym.name}. Join us today!`,
    openGraph: {
      title: data.gym.name,
      description: data.website_settings?.description || "",
      images: data.gym.logoUrl ? [data.gym.logoUrl] : [],
    },
  };
}

export default async function GymPage({ params }: Props) {
  const { subdomain } = await params;
  const data = await getGymData(subdomain);

  if (!data) notFound();
  
  if (!data.website_settings?.is_published) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F172A" }}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🚧</div>
          <h1 className="text-2xl font-bold text-white mb-2">{data.gym.name}</h1>
          <p style={{ color: "#94A3B8" }}>This gym website is coming soon.</p>
        </div>
      </div>
    );
  }

  const templateData = {
    gym: data.gym as any,
    settings: {
      ...data.website_settings,
      gallery_urls: data.website_settings.gallery_urls || [],
    } as any,
    plans: data.membership_plans as any[],
    trainers: data.trainers as any[],
  } as any;

  const template = data.website_settings.template || "modern";

  if (template === "minimal") return <MinimalTemplate {...templateData} />;
  if (template === "performance") return <PerformanceTemplate {...templateData} />;
  return <ModernTemplate {...templateData} />;
}
