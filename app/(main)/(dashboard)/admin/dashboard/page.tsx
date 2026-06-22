export const dynamic = "force-dynamic";

import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  Globe,
  ArrowUpRight,
  Zap,
  BarChart3,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

async function getAdminStats() {
  try {
    const { databases } = await createAdminClient();

    // Fetch all gyms
    const gymsRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
      Query.equal("isDeleted", false),
      Query.limit(100),
      Query.orderDesc("$createdAt"),
    ]);

    const allGyms = gymsRes.documents;
    const totalGyms = gymsRes.total;

    // Fetch subscriptions to get status breakdown
    const subsRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
      Query.limit(100),
    ]);
    const allSubs = subsRes.documents;

    const activeGyms = allSubs.filter((s) => s.status === "active").length;
    const trialGyms = allSubs.filter((s) => s.status === "trial").length;
    const suspendedGyms = allGyms.filter((g) => g.status === "suspended").length;

    // Fetch total members
    const membersRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
      Query.limit(1),
    ]);
    const totalMembers = membersRes.total;

    // Fetch total payments revenue
    let totalRevenue = 0;
    try {
      const paymentsRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, [
        Query.equal("status", "success"),
        Query.limit(100),
      ]);
      totalRevenue = paymentsRes.documents.reduce(
        (sum: number, p: any) => sum + (p.amount || 0),
        0
      );
    } catch (_) {}

    // Monthly revenue (current month)
    let monthlyRevenue = 0;
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthPaymentsRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.PAYMENTS,
        [
          Query.equal("status", "success"),
          Query.greaterThanEqual("paidAt", startOfMonth),
          Query.limit(100),
        ]
      );
      monthlyRevenue = monthPaymentsRes.documents.reduce(
        (sum: number, p: any) => sum + (p.amount || 0),
        0
      );
    } catch (_) {}

    // Build recent gyms with subscription info
    const recentGyms = allGyms.slice(0, 8).map((gym: any) => {
      const sub = allSubs.find((s: any) => s.gymId === gym.$id);
      return {
        id: gym.$id,
        name: gym.name,
        subdomain: gym.subdomain,
        customDomain: gym.customDomain || null,
        status: gym.status,
        subscription_status: sub?.status || "unknown",
        plan: sub?.planId || "starter",
        created_at: gym.$createdAt,
        ownerId: gym.ownerId,
      };
    });

    // New gyms this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = allGyms.filter(
      (g: any) => new Date(g.$createdAt) >= startOfMonth
    ).length;

    return {
      totalGyms,
      activeGyms,
      trialGyms,
      suspendedGyms,
      totalMembers,
      totalRevenue,
      monthlyRevenue,
      newThisMonth,
      recentGyms,
    };
  } catch (e) {
    console.error("[AdminDashboard] Failed to load stats:", e);
    return {
      totalGyms: 0,
      activeGyms: 0,
      trialGyms: 0,
      suspendedGyms: 0,
      totalMembers: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      newThisMonth: 0,
      recentGyms: [],
    };
  }
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Glow accent */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}, transparent 70%)` }}
      />
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend.positive ? "#22c55e15" : "#ef444415",
              color: trend.positive ? "#22c55e" : "#ef4444",
            }}
          >
            <ArrowUpRight size={10} />
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>
          {value}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {label}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: "var(--color-subtle)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  active:    { bg: "#22c55e15", text: "#22c55e", dot: "#22c55e" },
  trial:     { bg: "#f59e0b15", text: "#f59e0b", dot: "#f59e0b" },
  suspended: { bg: "#ef444415", text: "#ef4444", dot: "#ef4444" },
  cancelled: { bg: "#64748b20", text: "#64748b", dot: "#64748b" },
  unknown:   { bg: "#64748b20", text: "#64748b", dot: "#64748b" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLOR[status] || STATUS_COLOR.unknown;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ background: c.bg, color: c.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: c.dot, boxShadow: status === "active" ? `0 0 6px ${c.dot}` : "none" }}
      />
      {status}
    </span>
  );
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 max-w-7xl animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}
            />
            <span className="text-xs font-medium" style={{ color: "#22c55e" }}>
              Live Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>
            Platform Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            {dateStr} · Real-time stats across all GMMX gyms
          </p>
        </div>
        <a
          href="/gyms"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "var(--color-brand-primary)",
            color: "#fff",
          }}
        >
          <Building2 size={14} />
          Manage Gyms
        </a>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Gyms"
          value={stats.totalGyms}
          icon={Building2}
          accent="#FF5C73"
          sub={`+${stats.newThisMonth} this month`}
          trend={{ value: `${stats.newThisMonth} new`, positive: true }}
        />
        <StatCard
          label="Active Gyms"
          value={stats.activeGyms}
          icon={CheckCircle2}
          accent="#22c55e"
          sub="Paid subscriptions"
        />
        <StatCard
          label="Trial Gyms"
          value={stats.trialGyms}
          icon={Clock}
          accent="#f59e0b"
          sub="In 14-day trial"
        />
        <StatCard
          label="Total Members"
          value={stats.totalMembers.toLocaleString()}
          icon={Users}
          accent="#6366f1"
          sub="Across all gyms"
        />
      </div>

      {/* Revenue Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="relative overflow-hidden rounded-2xl p-5 md:col-span-1"
          style={{
            background: "linear-gradient(135deg, #FF5C73 0%, #ff8c5a 100%)",
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <BarChart3 size={128} />
          </div>
          <p className="text-sm font-semibold text-white/70 mb-1">Monthly Revenue</p>
          <p className="text-3xl font-black text-white">{formatCurrency(stats.monthlyRevenue)}</p>
          <p className="text-xs text-white/60 mt-2">
            {new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <TrendingUp size={12} className="text-white/70" />
            <span className="text-xs text-white/70">Total all-time: {formatCurrency(stats.totalRevenue)}</span>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 md:col-span-1"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              Gym Status Breakdown
            </p>
            <Activity size={14} style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <div className="space-y-3">
            {[
              { label: "Active", value: stats.activeGyms, color: "#22c55e", total: stats.totalGyms },
              { label: "Trial", value: stats.trialGyms, color: "#f59e0b", total: stats.totalGyms },
              { label: "Suspended", value: stats.suspendedGyms, color: "#ef4444", total: stats.totalGyms },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                    {row.label}
                  </span>
                  <span className="text-xs font-bold" style={{ color: "var(--color-foreground)" }}>
                    {row.value}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--color-border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      background: row.color,
                      width: row.total > 0 ? `${Math.round((row.value / row.total) * 100)}%` : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-5 md:col-span-1"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              Quick Actions
            </p>
            <Zap size={14} style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <div className="space-y-2">
            {[
              { label: "View All Gyms", href: "/gyms", icon: Building2 },
              { label: "Subscriptions", href: "/billing", icon: CreditCard },
              { label: "Platform Logs", href: "#", icon: Activity },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                  style={{
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#FF5C7318" }}
                  >
                    <Icon size={13} style={{ color: "#FF5C73" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                    {action.label}
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--color-muted-foreground)" }}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Gyms Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>
              Recent Gyms
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
              Latest {stats.recentGyms.length} registered gyms
            </p>
          </div>
          <a
            href="/gyms"
            className="text-xs font-semibold flex items-center gap-1 hover:underline"
            style={{ color: "var(--color-brand-primary)" }}
          >
            View all <ArrowUpRight size={11} />
          </a>
        </div>

        {stats.recentGyms.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Building2 size={32} className="mx-auto mb-3 opacity-30" style={{ color: "var(--color-muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
              No gyms registered yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Gym Name", "Subdomain", "Subscription", "Plan", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentGyms.map((gym: any, idx: number) => (
                  <tr
                    key={gym.id}
                    className="group transition-colors"
                    style={{
                      borderBottom:
                        idx < stats.recentGyms.length - 1
                          ? "1px solid var(--color-border-muted)"
                          : "none",
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: "var(--color-brand-primary)" }}
                        >
                          {gym.name?.charAt(0)?.toUpperCase() || "G"}
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {gym.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Globe size={11} style={{ color: "var(--color-muted-foreground)" }} />
                        <a
                          href={`https://${gym.subdomain}.gmmx.app`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono hover:underline"
                          style={{ color: "var(--color-brand-primary)" }}
                        >
                          {gym.subdomain}.gmmx.app
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={gym.subscription_status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs capitalize font-medium"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {gym.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} style={{ color: "var(--color-subtle)" }} />
                        <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                          {new Date(gym.created_at || Date.now()).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
