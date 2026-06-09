"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, RefreshCw, AlertTriangle, CheckCircle2, Clock, X, Loader2 } from "lucide-react";
import { renewMembership } from "@/features/expiry/actions";
import { buildExpiryReminderUrl } from "@/lib/whatsapp";
import { formatDate, getDaysUntilExpiry } from "@/lib/utils";

type ExpiryMember = {
  id: string;
  member_id: string;
  membership_end: Date | null;
  member: { id: string; name: string; phone: string; status: string };
  plan: { name: string } | null;
};

type Plan = { id: string; name: string; price: number; duration_days: number };

interface Props {
  members: ExpiryMember[];
  plans: Plan[];
  filter: string;
}

const FILTERS = [
  { value: "today", label: "Expiring Today", icon: AlertTriangle, color: "var(--color-danger)" },
  { value: "week", label: "This Week", icon: Clock, color: "var(--color-warning)" },
  { value: "month", label: "This Month", icon: CheckCircle2, color: "var(--color-info)" },
  { value: "expired", label: "Already Expired", icon: X, color: "var(--color-danger)" },
];

function getRowStyle(days: number | null) {
  if (days === null) return {};
  if (days < 0) return { background: "#fef2f2", borderLeft: "3px solid #ef4444" };
  if (days <= 3) return { background: "#fff7ed", borderLeft: "3px solid #f97316" };
  if (days <= 7) return { background: "#fefce8", borderLeft: "3px solid #eab308" };
  return { background: "#f0fdf4", borderLeft: "3px solid #22c55e" };
}

function getDaysLabel(days: number | null) {
  if (days === null) return "—";
  if (days < 0) return `Expired ${Math.abs(days)} days ago`;
  if (days === 0) return "Expires today";
  return `${days} day${days !== 1 ? "s" : ""} left`;
}

export function ExpiryClientPage({ members, plans, filter }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [renewModal, setRenewModal] = useState<ExpiryMember | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [renewLoading, setRenewLoading] = useState(false);

  function updateFilter(val: string) {
    router.push(`${pathname}?filter=${val}`);
  }

  async function handleRenew() {
    if (!renewModal || !selectedPlan) return;
    setRenewLoading(true);
    startTransition(async () => {
      await renewMembership(renewModal.member.id, selectedPlan);
      setRenewModal(null);
      setRenewLoading(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5 animate-in">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => updateFilter(f.value)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? "var(--color-brand-primary)" : "var(--color-surface)",
                color: isActive ? "white" : "var(--color-muted-foreground)",
                border: `1px solid ${isActive ? "var(--color-brand-primary)" : "var(--color-border)"}`,
                boxShadow: isActive ? "var(--shadow-brand)" : "none",
              }}
            >
              <Icon size={14} />
              {f.label}
              <span
                className="rounded-full px-1.5 py-0.5 text-xs font-bold"
                style={{
                  background: isActive ? "rgba(255,255,255,0.25)" : "var(--color-border)",
                  color: isActive ? "white" : "var(--color-muted-foreground)",
                }}
              >
                {f.value === filter ? members.length : "–"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Color key */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { color: "#ef4444", label: "Expired / ≤3 days" },
          { color: "#f97316", label: "≤3 days" },
          { color: "#eab308", label: "≤7 days" },
          { color: "#22c55e", label: "≤30 days" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
            <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-border-muted)" }}>
              {["Name", "Phone", "Plan", "Expiry Date", "Days Left", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <CheckCircle2 size={32} className="mx-auto mb-3" style={{ color: "var(--color-success)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                    No members in this category
                  </p>
                </td>
              </tr>
            ) : (
              members.map((m) => {
                const days = getDaysUntilExpiry(m.membership_end);
                const rowStyle = getRowStyle(days);

                return (
                  <tr key={m.id} style={{ ...rowStyle, borderBottom: "1px solid var(--color-border-muted)" }}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{m.member.name}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{m.member.phone}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm" style={{ color: "var(--color-foreground)" }}>{m.plan?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium" style={{ color: (days !== null && days < 0) ? "var(--color-danger)" : "var(--color-foreground)" }}>
                        {formatDate(m.membership_end)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color: days === null ? "var(--color-muted-foreground)"
                            : days < 0 ? "#dc2626"
                            : days <= 3 ? "#ea580c"
                            : days <= 7 ? "#ca8a04"
                            : "#16a34a",
                        }}
                      >
                        {getDaysLabel(days)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setRenewModal(m); setSelectedPlan(plans[0]?.id || ""); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                          style={{ background: "var(--color-brand-primary)" }}
                        >
                          <RefreshCw size={12} />
                          Renew
                        </button>
                        <a
                          href={buildExpiryReminderUrl(m.member.phone, m.member.name, "our gym", formatDate(m.membership_end))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg transition-all"
                          title="Send WhatsApp reminder"
                          style={{ color: "#25D366" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <MessageSquare size={15} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Renewal Modal */}
      {renewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-in" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: "var(--color-foreground)" }}>
                Renew Membership
              </h3>
              <button onClick={() => setRenewModal(null)} className="p-1" style={{ color: "var(--color-muted-foreground)" }}>
                <X size={16} />
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--color-muted-foreground)" }}>
              Renewing for <strong style={{ color: "var(--color-foreground)" }}>{renewModal.member.name}</strong>
            </p>
            <div className="space-y-3 mb-5">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="w-full p-3 rounded-xl text-left text-sm transition-all"
                  style={{
                    border: `2px solid ${selectedPlan === plan.id ? "var(--color-brand-primary)" : "var(--color-border)"}`,
                    background: selectedPlan === plan.id ? "var(--color-brand-light)" : "transparent",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium" style={{ color: "var(--color-foreground)" }}>{plan.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{plan.duration_days} days</p>
                    </div>
                    <span className="font-bold" style={{ color: "var(--color-brand-primary)" }}>₹{plan.price}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRenewModal(null)} className="flex-1 py-2.5 rounded-lg text-sm" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
                Cancel
              </button>
              <button
                onClick={handleRenew}
                disabled={!selectedPlan || renewLoading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: "var(--color-brand-primary)", opacity: renewLoading ? 0.8 : 1 }}
              >
                {renewLoading && <Loader2 size={14} className="animate-spin" />}
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
