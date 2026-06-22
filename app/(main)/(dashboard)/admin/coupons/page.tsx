export const dynamic = "force-dynamic";

import { Tag, CheckCircle2, XCircle, Percent, Banknote, Plus } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatDate } from "@/lib/utils";
import { createCoupon, toggleCoupon, deleteCoupon } from "@/features/admin/coupon-actions";

async function getCoupons() {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.COUPONS, [
      Query.limit(100),
      Query.orderDesc("createdAt"),
    ]);
    return res.documents;
  } catch (e) {
    return [];
  }
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  const active = coupons.filter((c: any) => c.isActive).length;
  const expired = coupons.filter((c: any) => c.expiresAt && new Date(c.expiresAt) < new Date()).length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Coupons</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          Create and manage discount coupons for GMMX subscriptions
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Coupons", value: coupons.length, icon: Tag, color: "#6366f1" },
          { label: "Active", value: active, icon: CheckCircle2, color: "#22c55e" },
          { label: "Expired", value: expired, icon: XCircle, color: "#ef4444" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
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

      {/* Coupon list */}
      {coupons.length > 0 && (
        <div className="card rounded-2xl overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>All Coupons</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Code", "Discount", "Usage", "Expires", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                      style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c: any, i: number) => {
                  const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
                  const usagePct = c.maxUses > 0 ? Math.round((c.usedCount / c.maxUses) * 100) : 0;
                  return (
                    <tr key={c.$id} className="table-row-hover"
                      style={{ borderBottom: i < coupons.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black font-mono tracking-widest"
                            style={{ color: "var(--color-foreground)" }}>{c.code}</span>
                          {c.description && (
                            <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                              — {c.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {c.type === "percent"
                            ? <Percent size={12} style={{ color: "#6366f1" }} />
                            : <Banknote size={12} style={{ color: "#22c55e" }} />}
                          <span className="text-sm font-bold"
                            style={{ color: c.type === "percent" ? "#6366f1" : "#22c55e" }}>
                            {c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="min-w-[80px]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>
                              {c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : ""}
                            </span>
                            {c.maxUses > 0 && (
                              <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                                {usagePct}%
                              </span>
                            )}
                          </div>
                          {c.maxUses > 0 && (
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                              <div className="h-full rounded-full transition-all"
                                style={{ width: `${usagePct}%`, background: usagePct >= 90 ? "#ef4444" : "#22c55e" }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs ${isExpired ? "font-bold" : ""}`}
                          style={{ color: isExpired ? "#ef4444" : "var(--color-muted-foreground)" }}>
                          {c.expiresAt ? formatDate(c.expiresAt) : "No expiry"}
                          {isExpired && " (expired)"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          c.isActive && !isExpired ? "text-green-700 bg-green-50" : "text-slate-500 bg-slate-100"
                        }`}>
                          {c.isActive && !isExpired ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <form action={async () => { "use server"; await toggleCoupon(c.$id, !c.isActive); }}>
                            <button type="submit"
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{
                                background: c.isActive ? "#ef444415" : "#22c55e15",
                                color: c.isActive ? "#ef4444" : "#22c55e",
                              }}>
                              {c.isActive ? "Disable" : "Enable"}
                            </button>
                          </form>
                          <form action={async () => { "use server"; await deleteCoupon(c.$id); }}>
                            <button type="submit"
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{ background: "#64748b15", color: "#64748b" }}>
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Coupon Form */}
      <div className="card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Plus size={16} style={{ color: "var(--color-brand-primary)" }} />
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Create New Coupon</h2>
        </div>
        <form action={async (formData) => { "use server"; await createCoupon(formData); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "code", label: "Coupon Code", placeholder: "e.g. WELCOME50", type: "text" },
            { name: "value", label: "Discount Value", placeholder: "e.g. 50", type: "number" },
            { name: "maxUses", label: "Max Uses (0 = unlimited)", placeholder: "0", type: "number" },
            { name: "expiresAt", label: "Expires On (optional)", placeholder: "", type: "date" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
                {f.label}
              </label>
              <input name={f.name} type={f.type} placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{
                  background: "var(--color-background)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                }} />
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Discount Type
            </label>
            <select name="type" required
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}>
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Description (optional)
            </label>
            <input name="description" type="text" placeholder="e.g. Welcome offer for new gyms"
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }} />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <button type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "var(--color-brand-primary)" }}>
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
