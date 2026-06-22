export const dynamic = "force-dynamic";

import {
  Receipt, TrendingUp, Calendar, Banknote, XCircle, Clock,
  ArrowUpRight, ArrowDownRight, Download,
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";

async function getPaymentStats() {
  try {
    const { databases } = await createAdminClient();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    const [allPayRes, gymsRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, [
        Query.limit(200),
        Query.orderDesc("paidAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false), Query.limit(200),
      ]),
    ]);

    const allPayments = allPayRes.status === "fulfilled" ? allPayRes.value.documents : [];
    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const gymMap: Record<string, string> = {};
    allGyms.forEach((g: any) => { gymMap[g.$id] = g.name; });

    const success = allPayments.filter((p: any) => p.status === "success");
    const failed = allPayments.filter((p: any) => p.status === "failed");
    const pending = allPayments.filter((p: any) => p.status === "pending");

    const sum = (arr: any[], from?: string, to?: string) =>
      arr.filter((p: any) => {
        if (from && p.paidAt < from) return false;
        if (to && p.paidAt > to) return false;
        return true;
      }).reduce((s: number, p: any) => s + (p.amount || 0), 0);

    const revenueToday = sum(success, todayStart);
    const revenueMonth = sum(success, monthStart);
    const revenueYear = sum(success, yearStart);
    const revenueLastMonth = sum(success, lastMonthStart, lastMonthEnd);
    const monthGrowth = revenueLastMonth > 0
      ? Math.round(((revenueMonth - revenueLastMonth) / revenueLastMonth) * 100)
      : 0;

    // Method breakdown for success payments
    const methodBreakdown: Record<string, number> = {};
    success.forEach((p: any) => {
      methodBreakdown[p.paymentMethod] = (methodBreakdown[p.paymentMethod] || 0) + (p.amount || 0);
    });

    const enriched = allPayments.slice(0, 50).map((p: any) => ({
      id: p.$id,
      gymName: gymMap[p.gymId] || "Unknown",
      plan: p.planNameSnapshot || "—",
      amount: p.amount,
      method: p.paymentMethod,
      status: p.status,
      transactionId: p.transactionId || "—",
      date: p.paidAt,
    }));

    return {
      revenueToday, revenueMonth, revenueYear, monthGrowth,
      failedCount: failed.length, pendingCount: pending.length,
      methodBreakdown, transactions: enriched,
      totalSuccess: success.length,
    };
  } catch (e) {
    console.error("[AdminPayments]", e);
    return {
      revenueToday: 0, revenueMonth: 0, revenueYear: 0, monthGrowth: 0,
      failedCount: 0, pendingCount: 0, methodBreakdown: {}, transactions: [],
      totalSuccess: 0,
    };
  }
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  success: { bg: "#22c55e15", text: "#22c55e" },
  failed:  { bg: "#ef444415", text: "#ef4444" },
  pending: { bg: "#f59e0b15", text: "#f59e0b" },
};

export default async function AdminPaymentsPage() {
  const r = await getPaymentStats();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Transactions</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Platform-wide payment intelligence
          </p>
        </div>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Today", value: formatCurrency(r.revenueToday), icon: Calendar, color: "#6366f1" },
          { label: "This Month", value: formatCurrency(r.revenueMonth), icon: TrendingUp, color: "#FF5C73",
            trend: r.monthGrowth !== 0 ? { v: `${r.monthGrowth > 0 ? "+" : ""}${r.monthGrowth}%`, positive: r.monthGrowth >= 0 } : undefined },
          { label: "This Year", value: formatCurrency(r.revenueYear), icon: Banknote, color: "#22c55e" },
          { label: "Successful", value: r.totalSuccess, icon: Receipt, color: "#22c55e" },
          { label: "Failed", value: r.failedCount, icon: XCircle, color: "#ef4444" },
          { label: "Pending", value: r.pendingCount, icon: Clock, color: "#f59e0b" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-4 relative overflow-hidden flex flex-col gap-2">
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ background: `radial-gradient(ellipse at top left, ${c.color}, transparent 70%)` }} />
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${c.color}18` }}>
                  <Icon size={14} style={{ color: c.color }} />
                </div>
                {(c as any).trend && (
                  <span className="flex items-center gap-0.5 text-xs font-bold"
                    style={{ color: (c as any).trend.positive ? "#22c55e" : "#ef4444" }}>
                    {(c as any).trend.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {(c as any).trend.v}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>{c.value}</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Method breakdown */}
      {Object.keys(r.methodBreakdown).length > 0 && (
        <div className="card rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>
            Revenue by Payment Method
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(r.methodBreakdown).map(([method, amount]) => (
              <div key={method} className="rounded-xl p-3"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs capitalize font-medium mb-1" style={{ color: "var(--color-muted-foreground)" }}>
                  {method}
                </p>
                <p className="text-base font-black" style={{ color: "var(--color-foreground)" }}>
                  {formatCurrency(amount as number)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>All Transactions</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
              Showing last {r.transactions.length} transactions
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["Gym", "Plan", "Method", "Amount", "Status", "Txn ID", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.transactions.map((t: any, i: number) => {
                const s = STATUS_STYLE[t.status] || STATUS_STYLE.pending;
                return (
                  <tr key={t.id} className="table-row-hover"
                    style={{ borderBottom: i < r.transactions.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{t.gymName}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{t.plan}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs capitalize px-2 py-0.5 rounded-full"
                        style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
                        {t.method}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold" style={{ color: t.status === "success" ? "#22c55e" : "var(--color-foreground)" }}>
                        {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: s.bg, color: s.text }}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono" style={{ color: "var(--color-subtle)" }}>{t.transactionId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {formatRelativeDate(t.date)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {r.transactions.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
