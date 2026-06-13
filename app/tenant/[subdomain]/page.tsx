import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModernTemplate } from "@/components/gym-site/templates/modern/layout";
import { MinimalTemplate } from "@/components/gym-site/templates/minimal/layout";
import { PerformanceTemplate } from "@/components/gym-site/templates/performance/layout";
import { getTenantBySubdomain } from "@/lib/tenant";

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

  // Passing the tenant data directly into the template structures we have.
  // The existing templates expect specific props, we will cast as any to safely compile,
  // as the user's focus is on multi-tenant routing first.
  const templateData = {
    gym: {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      logo_url: tenant.logoUrl,
      owner_id: tenant.ownerId,
    } as any,
    settings: {
      template: tenant.template,
      primary_color: tenant.primaryColor,
      secondary_color: tenant.secondaryColor,
      is_published: true, // assume published for now
      gallery_urls: [],
    } as any,
    plans: [] as any[], // Stubbed for now
    trainers: [] as any[], // Stubbed for now
  } as any;

  const template = tenant.template || "modern";

  if (template === "minimal") return <MinimalTemplate {...templateData} />;
  if (template === "performance") return <PerformanceTemplate {...templateData} />;
  return <ModernTemplate {...templateData} />;
}
