export const dynamic = "force-dynamic";

import { BarChart3, TrendingUp, Users, Building2, PieChart, ArrowUpRight } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatCurrency } from "@/lib/utils";

async function getAnalyticsData() {
  try {
    const { databases } = await createAdminClient();
    const now = new Date();

    const [gymsRes, membersRes, subsRes, paymentsRes, plansRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false), Query.limit(200), Query.orderDesc("$createdAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
        Query.limit(200), Query.orderDesc("$createdAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [Query.limit(200)]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, [
        Query.equal("status", "success"), Query.limit(200), Query.orderDesc("paidAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, [Query.limit(20)]),
    ]);

    const gyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const members = membersRes.status === "fulfilled" ? membersRes.value.documents : [];
    const subs = subsRes.status === "fulfilled" ? subsRes.value.documents : [];
    const payments = paymentsRes.status === "fulfilled" ? paymentsRes.value.documents : [];
    const plans = plansRes.status === "fulfilled" ? plansRes.value.documents : [];

    const planMap: Record<string, string> = {};
    plans.forEach((p: any) => { planMap[p.$id] = p.name; });

    // Monthly helper
    function monthlyData(items: any[], dateField: string, months = 6) {
      return Array.from({ length: months }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
        const start = d.toISOString();
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
        const count = items.filter((x: any) => x[dateField] >= start && x[dateField] <= end).length;
        return {
          month: d.toLocaleDateString("en-IN", { month: "short" }),
          count,
        };
      });
    }

    function monthlyRevenue(months = 6) {
      return Array.from({ length: months }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
        const start = d.toISOString();
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
        const total = payments
          .filter((p: any) => p.paidAt >= start && p.paidAt <= end)
          .reduce((s: number, p: any) => s + (p.amount || 0), 0);
        return { month: d.toLocaleDateString("en-IN", { month: "short" }), count: total };
      });
    }

    const gymGrowth = monthlyData(gyms, "$createdAt");
    const memberGrowth = monthlyData(members, "$createdAt");
    const revGrowth = monthlyRevenue();

    // Plan distribution
    const planDist: Record<string, number> = {};
    subs.forEach((s: any) => {
      const name = planMap[s.planId] || "Unknown";
      planDist[name] = (planDist[name] || 0) + 1;
    });

    // Trial conversion: converted/total trials started
    const totalTrials = subs.filter((s: any) => s.status !== "cancelled").length;
    const activeOrPaid = subs.filter((s: any) => s.status === "active").length;
    const trialConversionPct = totalTrials > 0 ? Math.round((activeOrPaid / totalTrials) * 100) : 0;

    // Churn: cancelled this month / total active last month
    const cancelledThisMonth = subs.filter((s: any) => {
      if (s.status !== "cancelled") return false;
      return s.$updatedAt >= new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }).length;
    const churnRate = gyms.length > 0 ? Math.round((cancelledThisMonth / gyms.length) * 100) : 0;

    return {
      gymGrowth, memberGrowth, revGrowth, planDist,
      trialConversionPct, churnRate, cancelledThisMonth,
      totalGyms: gyms.length, totalMembers: members.length,
    };
  } catch (e) {
    console.error("[AdminAnalytics]", e);
    return {
      gymGrowth: [], memberGrowth: [], revGrowth: [], planDist: {},
      trialConversionPct: 0, churnRate: 0, cancelledThisMonth: 0,
      totalGyms: 0, totalMembers: 0,
    };
  }
}

function BarChart({
  data,
  label,
  color,
  prefix = "",
  suffix = "",
}: {
  data: { month: string; count: number }[];
  label: string;
  color: string;
  prefix?: string;
  suffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="card rounded-2xl p-5">
      <h3 className="text-sm font-bold mb-5" style={{ color: "var(--color-foreground)" }}>{label}</h3>
      <div className="flex items-end gap-2 h-28">
        {data.map((d, i) => {
          const pct = Math.round((d.count / max) * 100);
          const isLast = i === data.length - 1;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
              <p className="text-[10px] font-bold leading-none"
                style={{ color: isLast ? color : "var(--color-muted-foreground)" }}>
                {d.count > 0 ? `${prefix}${typeof d.count === "number" && d.count > 999 ? `${Math.round(d.count / 1000)}k` : d.count}${suffix}` : "—"}
              </p>
              <div className="w-full rounded-t-lg"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  background: isLast ? color : "var(--color-border)",
                  minHeight: 6,
                  transition: "height 0.3s ease",
                }} />
              <p className="text-[10px]" style={{ color: "var(--color-subtle)" }}>{d.month}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();
  const planDistEntries = Object.entries(data.planDist);
  const totalSubsForDist = planDistEntries.reduce((s, [, v]) => s + v, 0);
  const DIST_COLORS = ["#FF5C73", "#6366f1", "#22c55e", "#f59e0b", "#06b6d4"];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          Platform-wide growth and health metrics
        </p>
      </div>

      {/* Conversion + Churn row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Gyms", value: data.totalGyms, color: "#FF5C73", icon: Building2 },
          { label: "Total Members", value: data.totalMembers.toLocaleString(), color: "#6366f1", icon: Users },
          {
            label: "Trial → Paid Rate",
            value: `${data.trialConversionPct}%`,
            color: data.trialConversionPct >= 50 ? "#22c55e" : "#f59e0b",
            icon: TrendingUp,
            sub: "conversions this period",
          },
          {
            label: "Churn This Month",
            value: `${data.churnRate}%`,
            color: data.churnRate > 5 ? "#ef4444" : "#22c55e",
            icon: ArrowUpRight,
            sub: `${data.cancelledThisMonth} cancelled`,
          },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 relative overflow-hidden flex flex-col gap-3">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${c.color}, transparent 65%)` }} />
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${c.color}18` }}>
                <Icon size={16} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>{c.value}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
                {(c as any).sub && (
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--color-subtle)" }}>{(c as any).sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BarChart data={data.gymGrowth} label="Gym Growth (6 months)" color="#FF5C73" />
        <BarChart data={data.memberGrowth} label="Member Growth (6 months)" color="#6366f1" />
        <BarChart
          data={data.revGrowth}
          label="Revenue Growth (6 months)"
          color="#22c55e"
          prefix="₹"
        />
      </div>

      {/* Plan distribution */}
      <div className="card rounded-2xl p-5">
        <h3 className="text-sm font-bold mb-5" style={{ color: "var(--color-foreground)" }}>
          Plan Distribution
        </h3>
        {planDistEntries.length > 0 ? (
          <div className="space-y-3">
            {planDistEntries.map(([name, count], i) => {
              const pct = totalSubsForDist > 0 ? Math.round((count / totalSubsForDist) * 100) : 0;
              const color = DIST_COLORS[i % DIST_COLORS.length];
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {count} gyms
                      </span>
                      <span className="text-sm font-bold" style={{ color }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-center py-6" style={{ color: "var(--color-muted-foreground)" }}>
            No subscription data yet
          </p>
        )}
      </div>
    </div>
  );
}
