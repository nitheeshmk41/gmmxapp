export const dynamic = "force-dynamic";

import { Layers, CheckCircle2, Eye, Zap, Building2 } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

const TEMPLATES = [
  {
    id: "modern_fitness",
    name: "Modern Fitness",
    description: "Bold, energetic design with large hero sections and vibrant colors. Best for high-intensity and CrossFit gyms.",
    enabled: true,
    accentColor: "#FF5C73",
    preview: "🏋️",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, typography-focused layout with generous whitespace. Best for boutique studios and yoga centers.",
    enabled: true,
    accentColor: "#6366f1",
    preview: "🧘",
  },
  {
    id: "performance",
    name: "Performance",
    description: "Dark theme with data-driven layouts. Best for sports performance centers and elite training facilities.",
    enabled: true,
    accentColor: "#22c55e",
    preview: "⚡",
  },
];

async function getTemplateUsage() {
  try {
    const { databases } = await createAdminClient();
    const gymsRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
      Query.equal("isDeleted", false), Query.limit(200),
    ]);
    const gyms = gymsRes.documents;

    const usage: Record<string, number> = {};
    TEMPLATES.forEach((t) => { usage[t.id] = 0; });
    gyms.forEach((g: any) => {
      if (g.template && usage[g.template] !== undefined) {
        usage[g.template]++;
      } else {
        usage["modern_fitness"] = (usage["modern_fitness"] || 0) + 1;
      }
    });

    return { usage, total: gyms.length };
  } catch (e) {
    return { usage: {}, total: 0 };
  }
}

export default async function AdminTemplatesPage() {
  const { usage, total } = await getTemplateUsage();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Website Templates</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            GMMX provides {TEMPLATES.length} website templates. Gyms choose one during onboarding.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl"
          style={{ background: "#6366f115", color: "#6366f1" }}>
          <Building2 size={12} />
          {total} gyms with websites
        </div>
      </div>

      {/* Template cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TEMPLATES.map((tpl) => {
          const gymsUsing = usage[tpl.id] || 0;
          const pct = total > 0 ? Math.round((gymsUsing / total) * 100) : 0;

          return (
            <div key={tpl.id} className="card rounded-2xl overflow-hidden flex flex-col">
              {/* Preview */}
              <div className="h-36 flex items-center justify-center relative overflow-hidden"
                style={{ background: `${tpl.accentColor}12` }}>
                <div className="absolute inset-0 opacity-5"
                  style={{ background: `radial-gradient(ellipse at center, ${tpl.accentColor}, transparent 70%)` }} />
                <div className="text-6xl">{tpl.preview}</div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: tpl.enabled ? "#22c55e15" : "#ef444415", color: tpl.enabled ? "#22c55e" : "#ef4444" }}>
                    {tpl.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-sm font-black" style={{ color: "var(--color-foreground)" }}>{tpl.name}</h3>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
                    {tpl.description}
                  </p>
                </div>

                {/* Usage bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                      {gymsUsing} gyms using
                    </span>
                    <span className="text-xs font-bold" style={{ color: tpl.accentColor }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: tpl.accentColor }} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: "var(--color-muted-foreground)" }}>
                    <Eye size={12} />
                    {gymsUsing} active
                  </div>
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: "var(--color-background)", color: "var(--color-muted-foreground)", border: "1px solid var(--color-border)" }}>
                    Template ID: {tpl.id}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming soon note */}
      <div className="card rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#f59e0b15" }}>
          <Zap size={18} style={{ color: "#f59e0b" }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Template Analytics Coming Soon</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Per-template website analytics, conversion rates, and A/B testing will be available in a future release.
          </p>
        </div>
      </div>
    </div>
  );
}
