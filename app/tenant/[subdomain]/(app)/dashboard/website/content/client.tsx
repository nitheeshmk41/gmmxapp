"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { updateWebsiteContent } from "@/features/website/actions";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  gym: {
    name: string;
    tagline: string | null;
    description: string | null;
  } | null;
}

export function ContentClientPage({ gym }: Props) {
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
      const result = await updateWebsiteContent(formData);
      if (result?.error) setError(result.error);
      else setSaved(true);
      setLoading(false);
    });
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in pb-10">
      <PageHeader
        title="Website Content"
        description="Manage your gym's main content, name, tagline, and description."
        breadcrumbs={[{ label: "Website", href: ".." }, { label: "Content" }]}
      />

      <form onSubmit={handleSubmit} className="p-6 rounded-xl space-y-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {error && <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500">{error}</div>}
        {saved && <div className="p-3 rounded-lg text-sm flex items-center gap-2 bg-green-500/10 text-green-500"><CheckCircle2 size={16} /> Changes saved successfully!</div>}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Gym Name</label>
          <input name="name" defaultValue={gym?.name || ""} placeholder="E.g. NithQ Fitness" required className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Tagline</label>
          <input name="tagline" defaultValue={gym?.tagline || ""} placeholder="E.g. Transform your body with expert trainers." className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>About Us (Short Description)</label>
          <textarea name="description" defaultValue={gym?.description || ""} rows={4} placeholder="E.g. Welcome to NithQ Fitness. We are located in Coimbatore..." className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Content
          </button>
        </div>
      </form>
    </div>
  );
}
