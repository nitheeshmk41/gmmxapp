"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { updateWebsiteContact } from "@/features/website/actions";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  gym: {
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    address: string | null;
    mapsLink: string | null;
    workingHours: string | null;
  } | null;
}

export function ContactClientPage({ gym }: Props) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

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
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateWebsiteContact(formData);
      if (result?.error) setError(result.error);
      else setSaved(true);
      setLoading(false);
    });
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in pb-10">
      <PageHeader
        title="Contact Details"
        description="Update your contact information shown on the public website."
        breadcrumbs={[{ label: "Website", href: ".." }, { label: "Contact" }]}
      />

      <form onSubmit={handleSubmit} className="p-6 rounded-xl space-y-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {error && <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500">{error}</div>}
        {saved && <div className="p-3 rounded-lg text-sm flex items-center gap-2 bg-green-500/10 text-green-500"><CheckCircle2 size={16} /> Changes saved successfully!</div>}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Phone Number</label>
            <input name="phone" defaultValue={gym?.phone || ""} placeholder="+91 9876543210" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>WhatsApp Number</label>
            <input name="whatsapp" defaultValue={gym?.whatsapp || ""} placeholder="9876543210" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Email Address</label>
          <input name="email" type="email" defaultValue={gym?.email || ""} placeholder="contact@mygym.com" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Physical Address</label>
          <textarea name="address" defaultValue={gym?.address || ""} rows={2} placeholder="123 Fitness Street, New Delhi, India" className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Google Maps URL</label>
          <input name="mapsLink" defaultValue={gym?.mapsLink || ""} placeholder="https://maps.google.com/..." className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Working Hours</label>
          <input name="workingHours" defaultValue={gym?.workingHours || ""} placeholder="Mon - Sat: 5:00 AM - 10:00 PM" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Contact Info
          </button>
        </div>
      </form>
    </div>
  );
}
