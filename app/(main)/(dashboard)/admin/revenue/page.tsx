export const dynamic = "force-dynamic";

import {
  TrendingUp, CreditCard, Building2, ArrowUpRight, ArrowDownRight,
  Banknote, BarChart3, Calendar,
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";

async function getRevenueStats() {
  try {
    const { databases } = await createAdminClient();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    const [paymentsRes, gymsRes, subsRes, plansRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, [
        Query.equal("status", "success"),
        Query.limit(200),
        Query.orderDesc("paidAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false), Query.limit(100),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
        Query.equal("status", "active"), Query.limit(100),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, [Query.limit(20)]),
    ]);

    const allPayments = paymentsRes.status === "fulfilled" ? paymentsRes.value.documents : [];
    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const activeSubs = subsRes.status === "fulfilled" ? subsRes.value.documents : [];
    const allPlans = plansRes.status === "fulfilled" ? plansRes.value.documents : [];

    const gymMap: Record<string, any> = {};
    allGyms.forEach((g: any) => { gymMap[g.$id] = g; });
    const planPriceMap: Record<string, number> = {};
    allPlans.forEach((p: any) => { planPriceMap[p.$id] = p.price || 0; });

    const totalRevenue = allPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const monthlyRevenue = allPayments
      .filter((p: any) => p.paidAt >= startOfMonth)
      .reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const lastMonthRevenue = allPayments
      .filter((p: any) => p.paidAt >= lastMonthStart && p.paidAt <= lastMonthEnd)
      .reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0
      ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    const mrr = activeSubs.reduce((s: number, sub: any) => s + (planPriceMap[sub.planId] || 0), 0);
    const arr = mrr * 12;
    const avgPerGym = activeSubs.length > 0 ? Math.round(mrr / activeSubs.length) : 0;

    // Monthly breakdown (last 6 months)
    const monthlyBreakdown = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const start = d.toISOString();
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
      const rev = allPayments
        .filter((p: any) => p.paidAt >= start && p.paidAt <= end)
        .reduce((s: number, p: any) => s + (p.amount || 0), 0);
      return {
        month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        revenue: rev,
        count: allPayments.filter((p: any) => p.paidAt >= start && p.paidAt <= end).length,
      };
    });

    // Top gyms by revenue
    const gymRevMap: Record<string, number> = {};
    allPayments.forEach((p: any) => {
      gymRevMap[p.gymId] = (gymRevMap[p.gymId] || 0) + (p.amount || 0);
    });
    const topGyms = Object.entries(gymRevMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([gymId, revenue]) => ({
        gymId,
        name: gymMap[gymId]?.name || "Unknown",
        subdomain: gymMap[gymId]?.subdomain || "—",
        revenue,
      }));

    return {
      totalRevenue, monthlyRevenue, lastMonthRevenue, revenueGrowth,
      mrr, arr, avgPerGym, monthlyBreakdown, topGyms,
      recentPayments: allPayments.slice(0, 10).map((p: any) => ({
        id: p.$id, gymName: gymMap[p.gymId]?.name || "Unknown",
        amount: p.amount, method: p.paymentMethod, plan: p.planNameSnapshot || "—", date: p.paidAt,
      })),
    };
  } catch (e) {
    console.error("[AdminRevenue]", e);
    return {
      totalRevenue: 0, monthlyRevenue: 0, lastMonthRevenue: 0, revenueGrowth: 0,
      mrr: 0, arr: 0, avgPerGym: 0, monthlyBreakdown: [], topGyms: [],
      recentPayments: [],
    };
  }
}

export default async function AdminRevenuePage() {
  const r = await getRevenueStats();
  const maxMonthlyRev = Math.max(...r.monthlyBreakdown.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Revenue Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          Platform-wide revenue intelligence
        </p>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: formatCurrency(r.mrr), icon: TrendingUp, color: "#FF5C73", sub: `ARR: ${formatCurrency(r.arr)}` },
          { label: "This Month", value: formatCurrency(r.monthlyRevenue), icon: Calendar, color: "#22c55e",
            trend: r.revenueGrowth !== 0 ? { value: `${r.revenueGrowth > 0 ? "+" : ""}${r.revenueGrowth}%`, positive: r.revenueGrowth >= 0 } : undefined },
          { label: "Total All-time", value: formatCurrency(r.totalRevenue), icon: Banknote, color: "#6366f1" },
          { label: "Avg / Active Gym", value: formatCurrency(r.avgPerGym), icon: Building2, color: "#f59e0b" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 relative overflow-hidden flex flex-col gap-3">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${c.color}, transparent 65%)` }} />
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${c.color}18` }}>
                  <Icon size={16} style={{ color: c.color }} />
                </div>
                {(c as any).trend && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: (c as any).trend.positive ? "#22c55e15" : "#ef444415", color: (c as any).trend.positive ? "#22c55e" : "#ef4444" }}>
                    {(c as any).trend.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {(c as any).trend.value}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>{c.value}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
                {(c as any).sub && <p className="text-xs mt-0.5" style={{ color: "var(--color-subtle)" }}>{(c as any).sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly bar chart */}
        <div className="card rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-5" style={{ color: "var(--color-foreground)" }}>Monthly Revenue (Last 6 Months)</h2>
          <div className="flex items-end gap-2 h-36">
            {r.monthlyBreakdown.map((m, i) => {
              const pct = Math.round((m.revenue / maxMonthlyRev) * 100);
              const isLast = i === r.monthlyBreakdown.length - 1;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <p className="text-[10px] font-bold" style={{ color: isLast ? "#FF5C73" : "var(--color-muted-foreground)" }}>
                    {m.revenue > 0 ? `₹${Math.round(m.revenue / 100) / 10}k` : "—"}
                  </p>
                  <div className="w-full rounded-t-lg transition-all relative overflow-hidden"
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      background: isLast ? "var(--color-brand-primary)" : "var(--color-border)",
                      minHeight: 6,
                    }} />
                  <p className="text-[10px]" style={{ color: "var(--color-subtle)" }}>{m.month}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 gyms */}
        <div className="card rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Top Gyms by Revenue</h2>
          {r.topGyms.length > 0 ? (
            <div className="space-y-3">
              {r.topGyms.map((gym, i) => {
                const pct = Math.round((gym.revenue / r.topGyms[0].revenue) * 100);
                return (
                  <div key={gym.gymId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold w-4" style={{ color: "var(--color-subtle)" }}>#{i + 1}</span>
                        <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{gym.name}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: "#22c55e" }}>
                        {formatCurrency(gym.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--color-brand-primary)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-center py-6" style={{ color: "var(--color-muted-foreground)" }}>No revenue data yet</p>
          )}
        </div>
      </div>

      {/* Recent payments table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Recent Successful Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["Gym", "Plan", "Method", "Amount", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.recentPayments.map((p: any, i: number) => (
                <tr key={p.id} className="table-row-hover"
                  style={{ borderBottom: i < r.recentPayments.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{p.gymName}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{p.plan}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs capitalize px-2.5 py-1 rounded-full"
                      style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
                      {p.method}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold" style={{ color: "#22c55e" }}>{formatCurrency(p.amount)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {formatRelativeDate(p.date)}
                    </span>
                  </td>
                </tr>
              ))}
              {r.recentPayments.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>No payments recorded yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
