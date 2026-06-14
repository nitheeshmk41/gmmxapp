"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Lock, Loader2 } from "lucide-react";

export default function SettingsSecurityPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      e.currentTarget.reset();
    }, 1000);
  };

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  return (
    <div className="max-w-xl animate-in space-y-6">
      <PageHeader
        title="Security Settings"
        description="Update your owner login password and enforce session security."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Security" },
        ]}
      />

      <div className="p-6 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-sm font-semibold rounded-lg">
              Password updated successfully!
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Current Password</label>
            <input type="password" required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">New Password</label>
            <input type="password" required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
            <input type="password" required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 mt-2"
            style={{ background: "var(--color-brand-primary)" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
