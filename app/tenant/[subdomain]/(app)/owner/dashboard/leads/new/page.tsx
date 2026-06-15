"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { createLead } from "@/features/leads/actions";
import { PageHeader } from "@/components/dashboard/page-header";

export default function NewLeadPage() {
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
      const result = await createLead(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/owner/dashboard/leads");
      }
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
        title="Add Lead"
        description="Record a new inquiry or trial request."
        breadcrumbs={[
          { label: "Dashboard", href: "/owner/dashboard" },
          { label: "Leads", href: "/owner/dashboard/leads" },
          { label: "Add Lead" },
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
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Name *</label>
              <input name="name" required placeholder="Siddharth Roy" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Phone Number *</label>
              <input name="phone" required placeholder="9876543210" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Status</label>
              <select name="status" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Trial">Trial</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Source</label>
              <select name="source" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                <option value="dashboard">Manual Entry</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="walk_in">Walk-in</option>
                <option value="referral">Referral</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid var(--color-border-muted)" }}>
            <Link href="/owner/dashboard/leads" className="flex-1 py-3 rounded-xl text-sm font-medium text-center" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
