"use client";

import { useTransition } from "react";
import { Globe, ExternalLink, Eye, EyeOff, Users, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  gym: any;
  leadCount: number;
}

export function WebsiteClientPage({ gym, leadCount }: Props) {
  const isPublished = true;
  const websiteUrl = gym ? `https://${gym.subdomain}.gmmx.app` : "";

  const fields = [gym?.name, gym?.tagline, gym?.description, gym?.bannerUrl, gym?.phone, gym?.address];
  const filled = fields.filter(f => !!f).length;
  const completion = Math.round((filled / fields.length) * 100);

  return (
    <div className="max-w-5xl space-y-6 animate-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Website Overview"
          description="Manage your gym's online presence and public website."
        />
        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}>
          <Globe size={16} /> Preview Site
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-3 mb-2 text-green-500">
            <CheckCircle2 size={24} />
            <h3 className="font-bold" style={{ color: "var(--color-foreground)" }}>Website is Live</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--color-muted-foreground)" }}>Your website is visible to the public.</p>
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold flex items-center gap-1 text-blue-500 hover:underline">
            {gym?.subdomain}.gmmx.app <ExternalLink size={14} />
          </a>
        </div>

        <div className="p-6 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-3 mb-2 text-blue-500">
            <Users size={24} />
            <h3 className="font-bold" style={{ color: "var(--color-foreground)" }}>Website Leads</h3>
          </div>
          <p className="text-4xl font-black mb-1" style={{ color: "var(--color-foreground)" }}>{leadCount}</p>
          <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Collected from your Join form</p>
        </div>

        <div className="p-6 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <ArrowUpRight size={24} />
            <h3 className="font-bold" style={{ color: "var(--color-foreground)" }}>Profile Completion</h3>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <p className="text-4xl font-black" style={{ color: "var(--color-foreground)" }}>{completion}%</p>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Theme", desc: "Select Template", href: `/owner/dashboard/website/theme` },
            { name: "Content", desc: "Name & About", href: `/owner/dashboard/website/content` },
            { name: "Hero", desc: "Banner Image", href: `/owner/dashboard/website/hero` },
            { name: "Plans", desc: "Memberships", href: `/owner/dashboard/plans` },
            { name: "Trainers", desc: "Staff Profiles", href: `/owner/dashboard/trainers` },
            { name: "Gallery", desc: "Gym Photos", href: `/owner/dashboard/website/gallery` },
            { name: "Reviews", desc: "Testimonials", href: `/owner/dashboard/website/testimonials` },
            { name: "Contact", desc: "Phone & Maps", href: `/owner/dashboard/website/contact` },
          ].map(link => (
            <a key={link.name} href={link.href} className="p-4 rounded-xl border transition-colors hover:border-gray-400 group" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <h4 className="font-bold text-sm transition-colors group-hover:text-brand" style={{ color: "var(--color-foreground)" }}>{link.name}</h4>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>{link.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
