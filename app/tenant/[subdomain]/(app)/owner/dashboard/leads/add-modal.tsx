"use client";

import { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { createLead } from "@/features/leads/actions";

export function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createLead(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 animate-in"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: "var(--color-foreground)" }}>Add New Lead</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "var(--color-muted-foreground)" }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626" }}>
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Name *</label>
              <input name="name" required placeholder="Rahul Sharma" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Phone *</label>
              <input name="phone" required placeholder="9876543210" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Email</label>
            <input name="email" type="email" placeholder="rahul@email.com" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Source</label>
              <select name="source" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
                <option value="walk_in">Walk-in</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="instagram">Instagram</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Status</label>
              <select name="status" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="trial">Trial</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Notes</label>
            <textarea name="notes" rows={2} placeholder="Any notes about this lead…" className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
