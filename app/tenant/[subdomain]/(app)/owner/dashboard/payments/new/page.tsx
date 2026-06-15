"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";

export default function RecordPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      // Mock action / client save logic for recording manual payment
      setTimeout(() => {
        router.push("/owner/dashboard/payments");
      }, 1000);
    });
  };

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  return (
    <div className="max-w-2xl animate-in space-y-5">
      <PageHeader
        title="Record Payment"
        description="Log a manual check, cash, card or UPI payment for a member."
        breadcrumbs={[
          { label: "Dashboard", href: "/owner/dashboard" },
          { label: "Payments", href: "/owner/dashboard/payments" },
          { label: "Record Payment" },
        ]}
      />

      <div className="p-6 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Select Member *</label>
              <input name="member_name" required placeholder="Type member name..." className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Amount (₹) *</label>
              <input name="amount" type="number" required placeholder="1500" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Payment Method *</label>
              <select name="method" required className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Membership Start Date</label>
              <input name="membership_start" type="date" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Membership End Date</label>
              <input name="membership_end" type="date" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Notes / Receipt Reference</label>
            <textarea name="notes" rows={2} placeholder="Optional payment description or transaction ID" className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={inputStyle} />
          </div>

          <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid var(--color-border-muted)" }}>
            <Link href="/owner/dashboard/payments" className="flex-1 py-3 rounded-xl text-sm font-medium text-center" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
