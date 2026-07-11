export const dynamic = "force-dynamic";

import {
  Building2, Globe, Users, CreditCard, ArrowLeft, ExternalLink,
  CheckCircle2, XCircle, Activity, Calendar, Clock,
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatCurrency, formatDate, formatRelativeDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import RemoveGymButton from "./RemoveGymButton";
import AddEntityForms from "./AddEntityForms";

async function getGymDetail(gymId: string) {
  try {
    const { databases, users } = await createAdminClient();

    const [gymRes, subsRes, membersRes, paymentsRes, logsRes] = await Promise.allSettled([
      databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
        Query.equal("gymId", gymId), Query.limit(5),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
        Query.equal("gymId", gymId), Query.limit(1),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, [
        Query.equal("gymId", gymId),
        Query.equal("status", "success"),
        Query.limit(10),
        Query.orderDesc("paidAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, [
        Query.equal("gymId", gymId),
        Query.limit(10),
        Query.orderDesc("timestamp"),
      ]),
    ]);

    if (gymRes.status === "rejected") return null;
    const gym = gymRes.value as any;
    const sub = subsRes.status === "fulfilled" ? subsRes.value.documents[0] : null;
    const memberCount = membersRes.status === "fulfilled" ? membersRes.value.total : 0;
    const payments = paymentsRes.status === "fulfilled" ? paymentsRes.value.documents : [];
    const logs = logsRes.status === "fulfilled" ? logsRes.value.documents : [];
    const totalRevenue = payments.reduce((s: number, p: any) => s + (p.amount || 0), 0);

    // Try to get owner name
    let ownerName = "—";
    let ownerEmail = "—";
    try {
      const owner = await users.get(gym.ownerId);
      ownerName = owner.name || owner.email;
      ownerEmail = owner.email;
    } catch (_) {}

    return { gym, sub, memberCount, payments, logs, totalRevenue, ownerName, ownerEmail };
  } catch (e) {
    console.error("[GymDetail]", e);
    return null;
  }
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  active:    { bg: "#22c55e15", text: "#22c55e", label: "Active" },
  trial:     { bg: "#f59e0b15", text: "#f59e0b", label: "Trial" },
  suspended: { bg: "#ef444415", text: "#ef4444", label: "Suspended" },
  cancelled: { bg: "#64748b20", text: "#64748b", label: "Cancelled" },
  unknown:   { bg: "#64748b20", text: "#64748b", label: "Unknown" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.unknown;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {s.label}
    </span>
  );
}

export default async function GymDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getGymDetail(id);

  if (!data) return notFound();
  const { gym, sub, memberCount, payments, logs, totalRevenue, ownerName, ownerEmail } = data;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + header */}
      <div>
        <a href="/admin/gyms"
          className="inline-flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-muted-foreground)" }}>
          <ArrowLeft size={14} /> All Gyms
        </a>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
              style={{ background: "var(--color-brand-primary)" }}>
              {gym.name?.charAt(0)?.toUpperCase() || "G"}
            </div>
            <div>
              <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>{gym.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <a href={`https://${gym.subdomain}.gmmx.app`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono flex items-center gap-1 hover:underline"
                  style={{ color: "var(--color-brand-primary)" }}>
                  <Globe size={10} />{gym.subdomain}.gmmx.app <ExternalLink size={9} />
                </a>
                <StatusPill status={sub?.status || gym.status || "unknown"} />
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <RemoveGymButton gymId={gym.$id} />
            <a href={`https://${gym.subdomain}.gmmx.app/dashboard`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: "var(--color-border-muted)", color: "var(--color-foreground)" }}>
              <ExternalLink size={13} /> Open Gym
            </a>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: memberCount, icon: Users, color: "#6366f1" },
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: CreditCard, color: "#22c55e" },
          { label: "Payments", value: payments.length, icon: Activity, color: "#f59e0b" },
          { label: "Plan", value: sub?.planId || "Starter", icon: CheckCircle2, color: "#FF5C73" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${c.color}15` }}>
                <Icon size={18} style={{ color: c.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-black truncate" style={{ color: "var(--color-foreground)" }}>{c.value}</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <AddEntityForms gymId={gym.$id} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gym Info */}
        <div className="card rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Gym Details</h2>
          <div className="space-y-3">
            {[
              { label: "Gym Name", value: gym.name },
              { label: "Subdomain", value: `${gym.subdomain}.gmmx.app` },
              { label: "Custom Domain", value: gym.customDomain || "Not configured" },
              { label: "Owner Name", value: ownerName },
              { label: "Owner Email", value: ownerEmail },
              { label: "Status", value: <StatusPill status={gym.status || "unknown"} /> },
              { label: "Registered", value: formatDate(gym.$createdAt) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid var(--color-border-muted)" }}>
                <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>{row.label}</span>
                <span className="text-sm font-semibold text-right" style={{ color: "var(--color-foreground)" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Info */}
        <div className="card rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Subscription</h2>
          {sub ? (
            <div className="space-y-3">
              {[
                { label: "Plan", value: sub.planId || "Starter" },
                { label: "Status", value: <StatusPill status={sub.status} /> },
                { label: "Started", value: formatDate(sub.startsAt) },
                { label: "Ends / Renews", value: formatDate(sub.endsAt) },
                { label: "Payment Provider", value: sub.paymentProvider || "Manual" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid var(--color-border-muted)" }}>
                  <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>{row.label}</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Clock size={28} className="mb-2 opacity-30" style={{ color: "var(--color-muted-foreground)" }} />
              <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No subscription found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Recent Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["Plan", "Method", "Amount", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any, i: number) => (
                <tr key={p.$id} className="table-row-hover"
                  style={{ borderBottom: i < payments.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                  <td className="px-5 py-3">
                    <span className="text-sm" style={{ color: "var(--color-foreground)" }}>
                      {p.planNameSnapshot || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs capitalize px-2 py-0.5 rounded-full"
                      style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold" style={{ color: "#22c55e" }}>{formatCurrency(p.amount)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {formatRelativeDate(p.paidAt)}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>No payments recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log */}
      {logs.length > 0 && (
        <div className="card rounded-2xl overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Activity Log</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border-muted)" }}>
            {logs.map((log: any) => (
              <div key={log.$id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#6366f115" }}>
                  <Activity size={12} style={{ color: "#6366f1" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-foreground)" }}>{log.action}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    {log.entity} · {formatRelativeDate(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
