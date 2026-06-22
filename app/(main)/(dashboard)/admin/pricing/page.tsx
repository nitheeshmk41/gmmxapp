export const dynamic = "force-dynamic";

import { CreditCard, Check, X, Plus, Users, Globe } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatCurrency } from "@/lib/utils";
import { createSaasPlan, deleteSaasPlan } from "@/features/admin/pricing-actions";

async function getPlans() {
  try {
    const { databases } = await createAdminClient();
    const [plansRes, subsRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, [
        Query.limit(20), Query.orderAsc("price"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
        Query.equal("status", "active"), Query.limit(200),
      ]),
    ]);
    const plans = plansRes.status === "fulfilled" ? plansRes.value.documents : [];
    const subs = subsRes.status === "fulfilled" ? subsRes.value.documents : [];
    const gymCountByPlan: Record<string, number> = {};
    subs.forEach((s: any) => {
      gymCountByPlan[s.planId] = (gymCountByPlan[s.planId] || 0) + 1;
    });
    return plans.map((p: any) => ({ ...p, activeGyms: gymCountByPlan[p.$id] || 0 }));
  } catch (e) {
    return [];
  }
}

const PLAN_COLORS = ["#22c55e", "#6366f1", "#FF5C73", "#f59e0b", "#06b6d4"];

export default async function AdminPricingPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>
            Plans & Pricing
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Manage GMMX SaaS subscription plans
          </p>
        </div>
      </div>

      {/* Existing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan: any, i: number) => {
          const accent = PLAN_COLORS[i % PLAN_COLORS.length];
          const features = [
            { label: "Max Members", value: plan.maxMembers },
            { label: "Max Trainers", value: plan.maxTrainers },
            { label: "Custom Domain", value: plan.customDomain },
            { label: "Website Builder", value: plan.websiteBuilder },
            { label: "Mobile App", value: plan.mobileApp },
          ];
          return (
            <div key={plan.$id} className="card rounded-2xl overflow-hidden flex flex-col">
              {/* Accent bar */}
              <div className="h-1.5 w-full" style={{ background: accent }} />
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black" style={{ color: "var(--color-foreground)" }}>
                      {plan.name}
                    </h3>
                    <p className="text-2xl font-black mt-1" style={{ color: accent }}>
                      {formatCurrency(plan.price)}
                      <span className="text-xs font-normal ml-1" style={{ color: "var(--color-muted-foreground)" }}>
                        /mo
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${accent}15`, color: accent }}>
                    <Users size={10} />
                    {plan.activeGyms} gyms
                  </div>
                </div>

                <div className="space-y-2">
                  {features.map((f) => (
                    <div key={f.label} className="flex items-center justify-between text-xs">
                      <span style={{ color: "var(--color-muted-foreground)" }}>{f.label}</span>
                      {typeof f.value === "boolean" ? (
                        f.value
                          ? <Check size={13} style={{ color: "#22c55e" }} />
                          : <X size={13} style={{ color: "#ef4444" }} />
                      ) : (
                        <span className="font-semibold" style={{ color: "var(--color-foreground)" }}>{f.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                <form action={async () => { "use server"; await deleteSaasPlan(plan.$id); }} className="mt-auto">
                  <button
                    type="submit"
                    disabled={plan.activeGyms > 0}
                    title={plan.activeGyms > 0 ? "Cannot delete a plan with active subscribers" : "Delete plan"}
                    className="w-full text-xs font-semibold py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "#ef444415", color: "#ef4444" }}
                  >
                    {plan.activeGyms > 0 ? `${plan.activeGyms} active — cannot delete` : "Delete Plan"}
                  </button>
                </form>
              </div>
            </div>
          );
        })}

        {/* Create plan card */}
        <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 gap-3"
          style={{ borderColor: "var(--color-border)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--color-border-muted)" }}>
            <Plus size={18} style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <p className="text-sm font-semibold text-center" style={{ color: "var(--color-muted-foreground)" }}>
            Add New Plan
          </p>
        </div>
      </div>

      {/* Create Plan Form */}
      <div className="card rounded-2xl p-6">
        <h2 className="text-sm font-bold mb-5" style={{ color: "var(--color-foreground)" }}>
          Create New Plan
        </h2>
        <form action={async (formData) => { "use server"; await createSaasPlan(formData); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "name", label: "Plan Name", placeholder: "e.g. Pro, Elite", type: "text" },
            { name: "price", label: "Price (₹/month)", placeholder: "e.g. 999", type: "number" },
            { name: "maxMembers", label: "Max Members", placeholder: "e.g. 500", type: "number" },
            { name: "maxTrainers", label: "Max Trainers", placeholder: "e.g. 10", type: "number" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-xs font-semibold mb-1.5 block"
                style={{ color: "var(--color-foreground)" }}>
                {f.label}
              </label>
              <input
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                style={{
                  background: "var(--color-background)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              />
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-6">
            {[
              { name: "customDomain", label: "Custom Domain" },
              { name: "websiteBuilder", label: "Website Builder" },
              { name: "mobileApp", label: "Mobile App" },
            ].map((f) => (
              <label key={f.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={f.name} className="w-4 h-4 rounded accent-pink-500" />
                <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                  {f.label}
                </span>
              </label>
            ))}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "var(--color-brand-primary)" }}
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
