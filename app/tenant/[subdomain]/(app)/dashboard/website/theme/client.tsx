"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { updateWebsiteTheme } from "@/features/website/actions";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  gym: {
    template: string | null;
  } | null;
}

const TEMPLATES = [
  { id: "modern", label: "Modern Fitness", desc: "Dark theme. Best for premium gyms.", color: "#0F172A" },
  { id: "transformation", label: "Transformation Coach", desc: "Focuses on before/after and testimonials. Best for personal trainers.", color: "#FF5C73" },
  { id: "community", label: "Local Community Gym", desc: "Clean & friendly. Focuses on pricing and location.", color: "#F8FAFC" },
];

export function ThemeClientPage({ gym }: Props) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState(gym?.template || "modern");
  const [, startTransition] = useTransition();

  async function handleSave() {
    setLoading(true);
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await updateWebsiteTheme(template);
      if (result?.error) setError(result.error);
      else setSaved(true);
      setLoading(false);
    });
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in pb-10">
      <PageHeader
        title="Website Theme"
        description="Choose a professionally designed template for your gym's website."
        breadcrumbs={[{ label: "Website", href: ".." }, { label: "Theme" }]}
      />

      <div className="p-6 rounded-xl space-y-6" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {error && <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500">{error}</div>}
        {saved && <div className="p-3 rounded-lg text-sm flex items-center gap-2 bg-green-500/10 text-green-500"><CheckCircle2 size={16} /> Theme updated successfully!</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className="p-5 rounded-xl text-left transition-all relative overflow-hidden group"
              style={{
                border: `2px solid ${template === t.id ? "var(--color-brand-primary)" : "var(--color-border)"}`,
                background: template === t.id ? "var(--color-brand-light)" : "var(--color-background)",
              }}
            >
              <div className="w-full aspect-video rounded-lg mb-4 shadow-sm" style={{ background: t.color, border: "1px solid var(--color-border)" }} />
              <h4 className="font-bold text-sm mb-1" style={{ color: "var(--color-foreground)" }}>{t.label}</h4>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{t.desc}</p>
              {template === t.id && (
                <div className="absolute top-2 right-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--color-brand-primary)" }}>Active</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Theme
          </button>
        </div>
      </div>
    </div>
  );
}
