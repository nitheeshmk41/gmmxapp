import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { ModernTemplate } from "@/components/gym-site/templates/modern/layout";
import { MinimalTemplate } from "@/components/gym-site/templates/minimal/layout";
import { PerformanceTemplate } from "@/components/gym-site/templates/performance/layout";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain } = await params;
  const gym = await prisma.gym.findUnique({
    where: { subdomain },
    include: { website_settings: true },
  });

  if (!gym) return { title: "Gym not found" };

  return {
    title: `${gym.name} – Gym Website`,
    description: gym.website_settings?.description || `Welcome to ${gym.name}. Join us today!`,
    openGraph: {
      title: gym.name,
      description: gym.website_settings?.description || "",
      images: gym.logo_url ? [gym.logo_url] : [],
    },
  };
}

export default async function GymPage({ params }: Props) {
  const { subdomain } = await params;

  const gym = await prisma.gym.findUnique({
    where: { subdomain },
    include: {
      website_settings: true,
      membership_plans: { where: { is_active: true }, orderBy: { price: "asc" } },
      trainers: { where: { is_active: true } },
    },
  });

  if (!gym) notFound();
  if (!gym.website_settings?.is_published) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F172A" }}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🚧</div>
          <h1 className="text-2xl font-bold text-white mb-2">{gym.name}</h1>
          <p style={{ color: "#94A3B8" }}>This gym website is coming soon.</p>
        </div>
      </div>
    );
  }

  const templateData = {
    gym,
    settings: {
      ...gym.website_settings,
      gallery_urls: (gym.website_settings.gallery_urls as unknown as string[]) || [],
    },
    plans: gym.membership_plans.map((p) => ({
      ...p,
      price: Number(p.price),
    })),
    trainers: gym.trainers,
  };

  const template = gym.website_settings.template;

  if (template === "minimal") return <MinimalTemplate {...templateData} />;
  if (template === "performance") return <PerformanceTemplate {...templateData} />;
  return <ModernTemplate {...templateData} />;
}
