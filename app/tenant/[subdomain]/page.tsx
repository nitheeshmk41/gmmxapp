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

  return (
    <div style={{ padding: 40, background: "#0F172A", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Tenant Route Working</h1>
      <p style={{ fontSize: "1.2rem", color: "#94A3B8" }}>Subdomain: {subdomain}</p>
    </div>
  );
}
