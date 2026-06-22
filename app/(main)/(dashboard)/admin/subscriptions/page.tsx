export const dynamic = "force-dynamic";

import {
  CreditCard, CheckCircle2, Clock, XCircle, AlertTriangle,
  Building2, ArrowUpRight, Calendar,
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatDate, formatRelativeDate } from "@/lib/utils";

async function getSubscriptions() {
  try {
    const { databases } = await createAdminClient();
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const [subsRes, gymsRes, plansRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
        Query.limit(200), Query.orderDesc("$updatedAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false), Query.limit(200),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, [Query.limit(20)]),
    ]);

    const allSubs = subsRes.status === "fulfilled" ? subsRes.value.documents : [];
    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const allPlans = plansRes.status === "fulfilled" ? plansRes.value.documents : [];

    const planMap: Record<string, string> = {};
    allPlans.forEach((p: any) => { planMap[p.$id] = p.name; });
    const gymMap: Record<string, any> = {};
    allGyms.forEach((g: any) => { gymMap[g.$id] = g; });

    const enriched = allSubs.map((sub: any) => ({
      id: sub.$id,
      gymId: sub.gymId,
      gymName: gymMap[sub.gymId]?.name || "Unknown Gym",
      gymSubdomain: gymMap[sub.gymId]?.subdomain || "—",
      plan: planMap[sub.planId] || sub.planId || "Starter",
      status: sub.status,
      startsAt: sub.startsAt,
      endsAt: sub.endsAt,
      expiringSoon: sub.endsAt && sub.endsAt <= sevenDays && sub.endsAt > now.toISOString(),
      isExpired: sub.endsAt && sub.endsAt < now.toISOString() && sub.status !== "active",
    }));

    return {
      all: enriched,
      active: enriched.filter((s) => s.status === "active"),
      trial: enriched.filter((s) => s.status === "trial"),
      expiringSoon: enriched.filter((s) => s.expiringSoon),
      cancelled: enriched.filter((s) => s.status === "cancelled"),
    };
  } catch (e) {
    console.error("[AdminSubscriptions]", e);
    return { all: [], active: [], trial: [], expiringSoon: [], cancelled: [] };
  }
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  active:    { bg: "#22c55e15", text: "#22c55e" },
  trial:     { bg: "#f59e0b15", text: "#f59e0b" },
  suspended: { bg: "#ef444415", text: "#ef4444" },
  cancelled: { bg: "#64748b20", text: "#64748b" },
  unknown:   { bg: "#64748b20", text: "#64748b" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.unknown;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {status}
    </span>
  );
}

export default async function AdminSubscriptionsPage() {
  const subs = await getSubscriptions();

  const summaryCards = [
    { label: "Active", value: subs.active.length, icon: CheckCircle2, color: "#22c55e" },
    { label: "Trial", value: subs.trial.length, icon: Clock, color: "#f59e0b" },
    { label: "Expiring Soon", value: subs.expiringSoon.length, icon: AlertTriangle, color: "#f97316" },
    { label: "Cancelled", value: subs.cancelled.length, icon: XCircle, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Subscriptions</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {subs.all.length} total subscriptions across the platform
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${c.color}15` }}>
                <Icon size={18} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>{c.value}</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expiring Soon alert */}
      {subs.expiringSoon.length > 0 && (
        <div className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "#f97316" + "12", border: "1px solid #f97316" + "30" }}>
          <AlertTriangle size={18} style={{ color: "#f97316" }} className="flex-shrink-0" />
          <div>
            <p className="text-sm font-bold" style={{ color: "#f97316" }}>
              {subs.expiringSoon.length} subscription{subs.expiringSoon.length > 1 ? "s" : ""} expiring within 7 days
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#f97316" + "cc" }}>
              {subs.expiringSoon.map((s) => s.gymName).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>All Subscriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["Gym", "Plan", "Status", "Start Date", "End Date", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.all.map((sub, i) => (
                <tr key={sub.id} className="table-row-hover"
                  style={{ borderBottom: i < subs.all.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                        style={{ background: "var(--color-brand-primary)" }}>
                        {sub.gymName?.charAt(0) || "G"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{sub.gymName}</p>
                        <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{sub.gymSubdomain}.gmmx.app</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium capitalize px-2.5 py-1 rounded-full"
                      style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5"><StatusPill status={sub.status} /></td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {formatDate(sub.startsAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium ${sub.expiringSoon ? "font-bold" : ""}`}
                      style={{ color: sub.expiringSoon ? "#f97316" : "var(--color-muted-foreground)" }}>
                      {formatDate(sub.endsAt)}
                      {sub.expiringSoon && " ⚠️"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`/admin/gyms/${sub.gymId}`}
                      className="text-xs font-semibold flex items-center gap-1 hover:underline"
                      style={{ color: "var(--color-brand-primary)" }}>
                      View <ArrowUpRight size={10} />
                    </a>
                  </td>
                </tr>
              ))}
              {subs.all.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>No subscriptions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
