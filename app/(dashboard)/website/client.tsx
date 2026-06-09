"use client";

import { useState, useTransition } from "react";
import { Globe, Loader2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { updateWebsiteSettings, toggleWebsitePublish } from "@/features/website/actions";

type WebsiteSettings = {
  id: string;
  template: string;
  description: string | null;
  tagline: string | null;
  whatsapp_number: string | null;
  contact_email: string | null;
  address: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_youtube: string | null;
  is_published: boolean;
};

type Gym = { name: string; subdomain: string };

interface Props {
  settings: WebsiteSettings | null;
  gym: Gym | null;
}

const TEMPLATES = [
  { id: "modern", label: "Modern Fitness", desc: "Dark premium theme", color: "#0F172A" },
  { id: "minimal", label: "Minimal", desc: "White clean theme", color: "#FFFFFF" },
  { id: "performance", label: "Performance", desc: "Bold sports style", color: "#FF5C73" },
];

export function WebsiteClientPage({ settings, gym }: Props) {
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState(settings?.template || "modern");
  const [isPublished, setIsPublished] = useState(settings?.is_published || false);

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    formData.set("template", template);
    formData.set("is_published", String(isPublished));
    startTransition(async () => {
      const result = await updateWebsiteSettings(formData);
      if (result?.error) setError(result.error);
      else setSaved(true);
      setLoading(false);
    });
  }

  async function handleTogglePublish() {
    const newStatus = !isPublished;
    setIsPublished(newStatus);
    startTransition(async () => {
      await toggleWebsitePublish(newStatus);
    });
  }

  const websiteUrl = gym ? `https://${gym.subdomain}.gmmx.app` : "";

  return (
    <div className="max-w-3xl space-y-6 animate-in">
      {/* Publish status banner */}
      <div
        className="p-4 rounded-xl flex items-center justify-between"
        style={{
          background: isPublished ? "var(--color-success-light)" : "var(--color-border-muted)",
          border: `1px solid ${isPublished ? "#86efac" : "var(--color-border)"}`,
        }}
      >
        <div className="flex items-center gap-3">
          {isPublished ? <Globe size={20} style={{ color: "var(--color-success)" }} /> : <EyeOff size={20} style={{ color: "var(--color-muted-foreground)" }} />}
          <div>
            <p className="text-sm font-semibold" style={{ color: isPublished ? "#15803d" : "var(--color-foreground)" }}>
              {isPublished ? "Your website is live!" : "Website is unpublished"}
            </p>
            {isPublished && gym && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs flex items-center gap-1" style={{ color: "var(--color-success)" }}>
                {gym.subdomain}.gmmx.app <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
        <button
          onClick={handleTogglePublish}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: isPublished ? "var(--color-danger)" : "var(--color-success)",
            color: "white",
          }}
        >
          {isPublished ? "Unpublish" : "Publish Now"}
        </button>
      </div>

      {/* Template selector */}
      <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Choose Template</h3>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                border: `2px solid ${template === t.id ? "var(--color-brand-primary)" : "var(--color-border)"}`,
                background: template === t.id ? "var(--color-brand-light)" : "var(--color-background)",
              }}
            >
              <div className="w-full h-12 rounded-lg mb-2" style={{ background: t.color, border: "1px solid var(--color-border)" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>{t.label}</p>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{t.desc}</p>
              {template === t.id && (
                <span className="mt-1 inline-block badge-brand">Selected</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl space-y-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Website Content</h3>
        {error && <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626" }}>{error}</div>}
        {saved && <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-success-light)", color: "#15803d" }}>✓ Changes saved!</div>}

        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Tagline</label>
          <input name="tagline" defaultValue={settings?.tagline || ""} placeholder="Train Hard. Live Better." className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>About / Description</label>
          <textarea name="description" defaultValue={settings?.description || ""} rows={3} placeholder="Tell visitors about your gym…" className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>WhatsApp Number</label>
            <input name="whatsapp_number" defaultValue={settings?.whatsapp_number || ""} placeholder="9876543210" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Contact Email</label>
            <input name="contact_email" type="email" defaultValue={settings?.contact_email || ""} placeholder="gym@email.com" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Address</label>
          <input name="address" defaultValue={settings?.address || ""} placeholder="123 Fitness Street, Mumbai" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--color-foreground)" }}>Social Links</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "social_instagram", placeholder: "Instagram URL", key: "social_instagram" },
              { name: "social_facebook", placeholder: "Facebook URL", key: "social_facebook" },
              { name: "social_youtube", placeholder: "YouTube URL", key: "social_youtube" },
            ].map((field) => (
              <input key={field.name} name={field.name} defaultValue={(settings as Record<string, unknown>)?.[field.key] as string || ""} placeholder={field.placeholder} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
