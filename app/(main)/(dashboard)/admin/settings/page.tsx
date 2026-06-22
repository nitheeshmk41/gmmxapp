export const dynamic = "force-dynamic";

import { Settings, CreditCard, Globe, Mail, Clock, Shield, Server, Zap, CheckCircle2 } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatCurrency } from "@/lib/utils";

async function getPlatformSettings() {
  try {
    const { databases } = await createAdminClient();
    const plansRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, [
      Query.limit(20), Query.orderAsc("price"),
    ]);
    return { plans: plansRes.documents };
  } catch (e) {
    return { plans: [] };
  }
}

function ConfigRow({ label, value, badge }: { label: string; value: string; badge?: { text: string; color: string } }) {
  return (
    <div className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid var(--color-border-muted)" }}>
      <span className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${badge.color}15`, color: badge.color }}>
            {badge.text}
          </span>
        )}
        <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{value}</span>
      </div>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const { plans } = await getPlatformSettings();

  const envConfig = [
    { label: "App Domain", value: process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app" },
    { label: "App URL", value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" },
    { label: "Trial Days", value: `${process.env.NEXT_PUBLIC_TRIAL_DAYS || 14} days` },
    { label: "Environment", value: process.env.NODE_ENV || "development",
      badge: process.env.NODE_ENV === "production"
        ? { text: "Production", color: "#22c55e" }
        : { text: "Development", color: "#f59e0b" } },
    { label: "Razorpay Mode", value: process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live") ? "Live" : "Test",
      badge: process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live")
        ? { text: "Live", color: "#22c55e" }
        : { text: "Test Mode", color: "#f59e0b" } },
    { label: "Appwrite Project", value: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "—" },
    { label: "Appwrite Endpoint", value: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "—" },
  ];

  const featureFlags = [
    { label: "Website Builder", enabled: true },
    { label: "Custom Domains", enabled: true },
    { label: "Razorpay Payments", enabled: true },
    { label: "WhatsApp Shortcuts", enabled: true },
    { label: "QR Attendance", enabled: false },
    { label: "Diet Plans", enabled: false },
    { label: "Mobile App", enabled: false },
    { label: "AI Analytics", enabled: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Platform Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          GMMX platform configuration and feature flags
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Environment Config */}
        <div className="card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Server size={15} style={{ color: "#6366f1" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Platform Config</h2>
          </div>
          <div>
            {envConfig.map((c) => (
              <ConfigRow key={c.label} {...c} />
            ))}
          </div>
        </div>

        {/* Feature Flags */}
        <div className="card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} style={{ color: "#f59e0b" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Feature Flags</h2>
          </div>
          <div className="space-y-2">
            {featureFlags.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                style={{ background: "var(--color-background)" }}>
                <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{f.label}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  f.enabled
                    ? "text-green-700 bg-green-50"
                    : "text-slate-500 bg-slate-100"
                }`}>
                  {f.enabled ? "✓ Enabled" : "Planned"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SaaS Plans */}
      <div className="card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={15} style={{ color: "#FF5C73" }} />
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>SaaS Plans</h2>
          <span className="ml-auto text-xs" style={{ color: "var(--color-muted-foreground)" }}>
            {plans.length} plan{plans.length !== 1 ? "s" : ""} configured
          </span>
        </div>
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {plans.map((plan: any) => (
              <div key={plan.$id} className="rounded-xl p-4"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>{plan.name}</p>
                  <span className="text-lg font-black" style={{ color: "var(--color-brand-primary)" }}>
                    {formatCurrency(plan.price)}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                  <p>Max Members: <strong>{plan.maxMembers || "Unlimited"}</strong></p>
                  <p>Max Trainers: <strong>{plan.maxTrainers || "Unlimited"}</strong></p>
                  <p>Custom Domain: <strong>{plan.customDomain ? "✓" : "✗"}</strong></p>
                  <p>Website Builder: <strong>{plan.websiteBuilder ? "✓" : "✗"}</strong></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <CreditCard size={28} className="mx-auto mb-2 opacity-20" style={{ color: "var(--color-muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
              No SaaS plans configured in the database.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-subtle)" }}>
              Add plans to the <code className="px-1 py-0.5 rounded" style={{ background: "var(--color-border-muted)" }}>saas_plans</code> collection in Appwrite.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
