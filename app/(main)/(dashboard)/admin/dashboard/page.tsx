export const dynamic = "force-dynamic";

import {
  Building2, Users, CreditCard, TrendingUp, CheckCircle2,
  Clock, XCircle, ArrowUpRight, ArrowDownRight, Calendar,
  Globe, Activity, Flame, Target,
} from "lucide-react";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

// ─── Data fetching ──────────────────────────────────────────────────────────
async function getPlatformStats() {
  try {
    const { databases, users } = await createAdminClient();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    const [gymsRes, subsRes, membersRes, paymentsRes, plansRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false), Query.limit(100), Query.orderDesc("$createdAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [Query.limit(200)]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [Query.limit(1)]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, [
        Query.equal("status", "success"), Query.limit(200), Query.orderDesc("paidAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, [Query.limit(20)]),
    ]);

    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const totalGyms = gymsRes.status === "fulfilled" ? gymsRes.value.total : 0;
    const allSubs = subsRes.status === "fulfilled" ? subsRes.value.documents : [];
    const totalMembers = membersRes.status === "fulfilled" ? membersRes.value.total : 0;
    const allPayments = paymentsRes.status === "fulfilled" ? paymentsRes.value.documents : [];
    const allPlans = plansRes.status === "fulfilled" ? plansRes.value.documents : [];

    // Subscription breakdowns
    const activeSubs = allSubs.filter((s: any) => s.status === "active");
    const trialSubs = allSubs.filter((s: any) => s.status === "trial");
    const cancelledSubs = allSubs.filter((s: any) => s.status === "cancelled");
    const activeGyms = activeSubs.length;
    const trialGyms = trialSubs.length;
    const suspendedGyms = allGyms.filter((g: any) => g.status === "suspended").length;

    // Revenue calculations
    const totalRevenue = allPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const monthlyRevenue = allPayments
      .filter((p: any) => p.paidAt >= startOfMonth)
      .reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const lastMonthRevenue = allPayments
      .filter((p: any) => p.paidAt >= lastMonthStart && p.paidAt <= lastMonthEnd)
      .reduce((s: number, p: any) => s + (p.amount || 0), 0);

    // MRR: sum plan prices × active gyms
    const planPriceMap: Record<string, number> = {};
    allPlans.forEach((p: any) => { planPriceMap[p.$id] = p.price || 0; });
    const mrr = activeSubs.reduce((s: number, sub: any) => {
      return s + (planPriceMap[sub.planId] || 0);
    }, 0);
    const arr = mrr * 12;
    const avgRevenuePerGym = activeGyms > 0 ? Math.round(mrr / activeGyms) : 0;
    const revenueGrowth = lastMonthRevenue > 0
      ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // Growth metrics
    const newToday = allGyms.filter((g: any) => g.$createdAt >= startOfDay).length;
    const newThisWeek = allGyms.filter((g: any) => g.$createdAt >= startOfWeek).length;
    const newThisMonth = allGyms.filter((g: any) => g.$createdAt >= startOfMonth).length;
    const cancelledThisMonth = allSubs.filter(
      (s: any) => s.status === "cancelled" && s.$updatedAt >= startOfMonth
    ).length;
    const churnRate = totalGyms > 0 ? ((cancelledSubs.length / totalGyms) * 100).toFixed(1) : "0.0";

    // Trial conversion rate
    const conversionRate = (trialGyms + activeGyms) > 0
      ? Math.round((activeGyms / (trialGyms + activeGyms)) * 100)
      : 0;

    // Plan distribution
    const planDistribution = allPlans.map((plan: any) => ({
      name: plan.name,
      count: activeSubs.filter((s: any) => s.planId === plan.$id).length,
      color: plan.name?.toLowerCase().includes("pro") ? "#6366f1"
        : plan.name?.toLowerCase().includes("elite") ? "#FF5C73"
        : "#22c55e",
    }));

    // Recent gyms with sub info
    const recentGyms = allGyms.slice(0, 8).map((gym: any) => {
      const sub = allSubs.find((s: any) => s.gymId === gym.$id);
      const gymPayments = allPayments.filter((p: any) => p.gymId === gym.$id);
      return {
        id: gym.$id,
        name: gym.name,
        subdomain: gym.subdomain,
        status: gym.status,
        subscription_status: sub?.status || "unknown",
        plan: sub?.planId || "—",
        created_at: gym.$createdAt,
        revenue: gymPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0),
      };
    });

    // Recent payments
    const recentPayments = allPayments.slice(0, 6).map((p: any) => {
      const gym = allGyms.find((g: any) => g.$id === p.gymId);
      return {
        id: p.$id,
        gymName: gym?.name || "Unknown Gym",
        amount: p.amount,
        method: p.paymentMethod,
        date: p.paidAt,
      };
    });

    return {
      totalGyms, activeGyms, trialGyms, suspendedGyms,
      totalMembers, totalRevenue, monthlyRevenue, lastMonthRevenue,
      mrr, arr, avgRevenuePerGym, revenueGrowth,
      newToday, newThisWeek, newThisMonth,
      cancelledThisMonth, churnRate, conversionRate,
      planDistribution, recentGyms, recentPayments,
    };
  } catch (e) {
    console.error("[AdminOverview] Error:", e);
    return {
      totalGyms: 0, activeGyms: 0, trialGyms: 0, suspendedGyms: 0,
      totalMembers: 0, totalRevenue: 0, monthlyRevenue: 0, lastMonthRevenue: 0,
      mrr: 0, arr: 0, avgRevenuePerGym: 0, revenueGrowth: 0,
      newToday: 0, newThisWeek: 0, newThisMonth: 0,
      cancelledThisMonth: 0, churnRate: "0.0", conversionRate: 0,
      planDistribution: [], recentGyms: [], recentPayments: [],
    };
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function KpiCard({
  label, value, icon: Icon, accent, sub, trend,
}: {
  label: string; value: string | number; icon: React.ElementType;
  accent: string; sub?: string; trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 card">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}, transparent 65%)` }} />
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18` }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: trend.positive ? "#22c55e15" : "#ef444415", color: trend.positive ? "#22c55e" : "#ef4444" }}>
            {trend.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>{value}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "var(--color-subtle)" }}>{sub}</p>}
      </div>
    </div>
  );
}

const SUB_STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  active:    { bg: "#22c55e15", text: "#22c55e" },
  trial:     { bg: "#f59e0b15", text: "#f59e0b" },
  suspended: { bg: "#ef444415", text: "#ef4444" },
  cancelled: { bg: "#64748b20", text: "#64748b" },
  unknown:   { bg: "#64748b20", text: "#64748b" },
};

function StatusPill({ status }: { status: string }) {
  const s = SUB_STATUS_STYLE[status] || SUB_STATUS_STYLE.unknown;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {status}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function AdminOverviewPage() {
  const s = await getPlatformStats();

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>
            Platform Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <a href="/admin/gyms"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--color-brand-primary)" }}>
          <Building2 size={14} /> Manage Gyms
        </a>
      </div>

      {/* ── Row 1: Primary KPIs ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Total Gyms" value={s.totalGyms} icon={Building2} accent="#FF5C73"
          sub={`+${s.newThisMonth} this month`}
          trend={{ value: `+${s.newThisMonth} new`, positive: true }} />
        <KpiCard label="Active Gyms" value={s.activeGyms} icon={CheckCircle2} accent="#22c55e"
          sub="Paid subscriptions" />
        <KpiCard label="Trial Gyms" value={s.trialGyms} icon={Clock} accent="#f59e0b"
          sub="14-day free trial" />
        <KpiCard label="Total Members" value={s.totalMembers.toLocaleString()} icon={Users} accent="#6366f1"
          sub="Across all gyms" />
        <KpiCard label="MRR" value={formatCurrency(s.mrr)} icon={CreditCard} accent="#FF5C73"
          sub={`ARR: ${formatCurrency(s.arr)}`}
          trend={s.revenueGrowth !== 0 ? { value: `${s.revenueGrowth > 0 ? "+" : ""}${s.revenueGrowth}%`, positive: s.revenueGrowth > 0 } : undefined} />
      </div>

      {/* ── Row 2: Revenue + Funnel + Recent Signups ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue hero */}
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FF5C73 0%, #d63854 100%)" }}>
          <div className="absolute top-0 right-0 opacity-10 translate-x-4 -translate-y-2">
            <TrendingUp size={120} />
          </div>
          <p className="text-sm font-semibold text-white/70 mb-1">Monthly Revenue</p>
          <p className="text-4xl font-black text-white">{formatCurrency(s.monthlyRevenue)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "ARR", value: formatCurrency(s.arr) },
              { label: "Total All-time", value: formatCurrency(s.totalRevenue) },
              { label: "Avg / Gym", value: formatCurrency(s.avgRevenuePerGym) },
              { label: "Growth", value: `${s.revenueGrowth > 0 ? "+" : ""}${s.revenueGrowth}%` },
            ].map((m) => (
              <div key={m.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
                <p className="text-xs text-white/60">{m.label}</p>
                <p className="text-sm font-black text-white mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trial Conversion Funnel */}
        <div className="card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>
              Trial Conversion Funnel
            </p>
            <Target size={14} style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <div className="space-y-2">
            {[
              { label: "Total Signups", value: s.totalGyms, color: "#6366f1", width: "100%" },
              { label: "In Trial", value: s.trialGyms, color: "#f59e0b", width: s.totalGyms > 0 ? `${Math.round((s.trialGyms / s.totalGyms) * 100)}%` : "0%" },
              { label: "Converted (Active)", value: s.activeGyms, color: "#22c55e", width: s.totalGyms > 0 ? `${Math.round((s.activeGyms / s.totalGyms) * 100)}%` : "0%" },
              { label: "Suspended / Lost", value: s.suspendedGyms + s.cancelledThisMonth, color: "#ef4444", width: s.totalGyms > 0 ? `${Math.round(((s.suspendedGyms + s.cancelledThisMonth) / s.totalGyms) * 100)}%` : "0%" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>{row.label}</span>
                  <span className="text-xs font-black" style={{ color: "var(--color-foreground)" }}>{row.value}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ background: row.color, width: row.width }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--color-border)" }}>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Conversion Rate</p>
            <span className="text-sm font-black" style={{ color: "#22c55e" }}>{s.conversionRate}%</span>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Recent Signups</p>
            <a href="/admin/gyms" className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-brand-primary)" }}>
              View all <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="space-y-2">
            {s.recentGyms.slice(0, 5).map((gym: any) => (
              <a key={gym.id} href={`/admin/gyms/${gym.id}`}
                className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-gray-50 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: "var(--color-brand-primary)" }}>
                  {gym.name?.charAt(0)?.toUpperCase() || "G"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>{gym.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>
                    {formatRelativeDate(gym.created_at)}
                  </p>
                </div>
                <StatusPill status={gym.subscription_status} />
              </a>
            ))}
            {s.recentGyms.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: "var(--color-muted-foreground)" }}>No gyms yet</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: Growth strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "New Today", value: s.newToday, icon: Flame, color: "#f59e0b" },
          { label: "New This Week", value: s.newThisWeek, icon: TrendingUp, color: "#22c55e" },
          { label: "New This Month", value: s.newThisMonth, icon: Calendar, color: "#6366f1" },
          { label: "Cancelled / Mo", value: s.cancelledThisMonth, icon: XCircle, color: "#ef4444" },
          { label: "Churn Rate", value: `${s.churnRate}%`, icon: Activity, color: "#ef4444" },
          { label: "Conversion", value: `${s.conversionRate}%`, icon: Target, color: "#22c55e" },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="card rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${m.color}15` }}>
                <Icon size={14} style={{ color: m.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight" style={{ color: "var(--color-foreground)" }}>{m.value}</p>
                <p className="text-[11px] leading-tight" style={{ color: "var(--color-muted-foreground)" }}>{m.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 4: Tables ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Gyms table */}
        <div className="card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Recent Gyms</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>Latest registrations</p>
            </div>
            <a href="/admin/gyms" className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-brand-primary)" }}>
              All gyms <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Gym", "Status", "Revenue"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold"
                      style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.recentGyms.map((gym: any, i: number) => (
                  <tr key={gym.id} className="table-row-hover transition-colors"
                    style={{ borderBottom: i < s.recentGyms.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: "var(--color-brand-primary)" }}>
                          {gym.name?.charAt(0) || "G"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>{gym.name}</p>
                          <p className="text-xs flex items-center gap-1" style={{ color: "var(--color-muted-foreground)" }}>
                            <Globe size={9} />{gym.subdomain}.gmmx.app
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={gym.subscription_status} /></td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                        {formatCurrency(gym.revenue)}
                      </span>
                    </td>
                  </tr>
                ))}
                {s.recentGyms.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-sm"
                    style={{ color: "var(--color-muted-foreground)" }}>No gyms yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments table */}
        <div className="card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Recent Payments</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>Latest successful transactions</p>
            </div>
            <a href="/admin/revenue" className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-brand-primary)" }}>
              Revenue <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Gym", "Method", "Amount", "Date"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold"
                      style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.recentPayments.map((p: any, i: number) => (
                  <tr key={p.id} className="table-row-hover transition-colors"
                    style={{ borderBottom: i < s.recentPayments.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{p.gymName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs capitalize px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
                        {p.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold" style={{ color: "#22c55e" }}>{formatCurrency(p.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {formatRelativeDate(p.date)}
                      </span>
                    </td>
                  </tr>
                ))}
                {s.recentPayments.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-sm"
                    style={{ color: "var(--color-muted-foreground)" }}>No payments recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Row 5: Plan Distribution ─────────────────────────────────────────── */}
      {s.planDistribution.length > 0 && (
        <div className="card rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
            Plan Distribution
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {s.planDistribution.map((plan: any) => (
              <div key={plan.name} className="rounded-xl p-4 text-center"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)" }}>
                <p className="text-2xl font-black" style={{ color: plan.color }}>{plan.count}</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--color-muted-foreground)" }}>{plan.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
