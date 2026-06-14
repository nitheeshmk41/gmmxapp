"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { updateWebsiteHero } from "@/features/website/actions";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  gym: {
    name: string;
    tagline: string | null;
    bannerUrl: string | null;
  } | null;
}

export function HeroClientPage({ gym }: Props) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

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
    startTransition(async () => {
      const result = await updateWebsiteHero(formData);
      if (result?.error) setError(result.error);
      else setSaved(true);
      setLoading(false);
    });
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in pb-10">
      <PageHeader
        title="Website Hero"
        description="Customize the main banner at the top of your public website."
        breadcrumbs={[{ label: "Website", href: ".." }, { label: "Hero" }]}
      />

      <form onSubmit={handleSubmit} className="p-6 rounded-xl space-y-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {error && <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500">{error}</div>}
        {saved && <div className="p-3 rounded-lg text-sm flex items-center gap-2 bg-green-500/10 text-green-500"><CheckCircle2 size={16} /> Changes saved successfully!</div>}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Hero Heading (Gym Name)</label>
          <input name="name" defaultValue={gym?.name || ""} placeholder="E.g. NithQ Fitness" required className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Hero Subheading (Tagline)</label>
          <input name="tagline" defaultValue={gym?.tagline || ""} placeholder="E.g. Transform your body with expert trainers." className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Hero Background Image URL</label>
          <input name="bannerUrl" defaultValue={gym?.bannerUrl || ""} placeholder="https://example.com/my-gym-photo.jpg" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
          <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>Paste a direct link to an image. Leave blank to use the default premium background.</p>
        </div>

        {gym?.bannerUrl && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10 aspect-video relative">
            <img src={gym.bannerUrl} alt="Hero Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Hero
          </button>
        </div>
      </form>
    </div>
  );
}
