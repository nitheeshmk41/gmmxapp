"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2, Receipt, CreditCard } from "lucide-react";
import { createPayment } from "@/features/payments/actions";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";

type Payment = {
  id: string;
  receipt_number: string;
  amount: number;
  method: string;
  status: string;
  paid_at: Date;
  membership_start: Date | null;
  membership_end: Date | null;
  member: { name: string; phone: string };
  plan: { name: string } | null;
};

type Member = { id: string; name: string; phone: string };
type Plan = { id: string; name: string; price: number; duration_days: number };

interface Props {
  payments: Payment[];
  total: number;
  page: number;
  members: Member[];
  plans: Plan[];
}

const METHOD_COLORS: Record<string, string> = {
  cash: "badge-success",
  upi: "badge-brand",
  card: "badge-info",
  bank_transfer: "badge-warning",
  razorpay: "badge-brand",
};

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  bank_transfer: "Bank Transfer",
  razorpay: "Razorpay",
};

export function PaymentsClientPage({ payments, total, page, members, plans }: Props) {
  const [, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createPayment(formData);
      if (result?.error) setError(result.error);
      else setShowModal(false);
      setLoading(false);
    });
  }

  // Auto-fill amount when plan is selected
  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  return (
    <div className="space-y-5 animate-in">
      <PageHeader
        title="Payments"
        description="Record transactions, track revenue, and monitor pending dues."
        breadcrumbs={[{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Payments" }]}
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
          >
            <Plus size={14} />
            Record Payment
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: total },
          { label: "Paid", value: payments.filter((p) => p.status === "paid").length },
          { label: "Pending", value: payments.filter((p) => p.status === "pending").length },
          { label: "Revenue (Page)", value: formatCurrency(payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0)) },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: "var(--color-foreground)" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-border-muted)" }}>
              {["Receipt", "Member", "Plan", "Amount", "Method", "Status", "Date", "Membership End"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center">
                <Receipt size={32} className="mx-auto mb-3" style={{ color: "var(--color-border)" }} />
                <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No payments recorded yet</p>
              </td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="table-row-hover" style={{ borderBottom: "1px solid var(--color-border-muted)" }}>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono font-medium" style={{ color: "var(--color-brand-primary)" }}>{payment.receipt_number}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{payment.member.name}</p>
                    <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{payment.member.phone}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm" style={{ color: "var(--color-foreground)" }}>{payment.plan?.name || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={METHOD_COLORS[payment.method] || "badge-muted"}>{METHOD_LABELS[payment.method] || payment.method}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={payment.status === "paid" ? "badge-success" : payment.status === "pending" ? "badge-warning" : "badge-danger"}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{formatDate(payment.paid_at)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{formatDate(payment.membership_end)}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 animate-in" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: "var(--color-foreground)" }}>Record Payment</h3>
              <button onClick={() => setShowModal(false)} style={{ color: "var(--color-muted-foreground)" }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626" }}>{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Member *</label>
                  <select name="member_id" required className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                    <option value="">Select member</option>
                    {members.map((m) => <option key={m.id} value={m.id}>{m.name} – {m.phone}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Plan</label>
                  <select name="plan_id" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                    <option value="">Select plan (optional)</option>
                    {plans.map((p) => <option key={p.id} value={p.id}>{p.name} – ₹{p.price} / {p.duration_days}d</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Amount (₹) *</label>
                  <input name="amount" type="number" required min={1} value={selectedPlanData?.price || ""} onChange={() => {}}
                    placeholder="0" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Method *</label>
                  <select name="method" required className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="razorpay">Razorpay</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Membership Start</label>
                  <input name="membership_start" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Membership End</label>
                  <input name="membership_end" type="date" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Notes</label>
                <input name="notes" placeholder="Any additional notes" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)" }}>
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
