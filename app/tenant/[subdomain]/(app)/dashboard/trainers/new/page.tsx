"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createTrainer } from "@/features/trainers/actions";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";

export default function NewTrainerPage() {
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
      const result = await createTrainer(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard/trainers");
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
        title="Add Trainer"
        description="Add a new fitness trainer to your gym."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Trainers", href: "/dashboard/trainers" },
          { label: "Add Trainer" },
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
              <input name="name" required placeholder="Ankit Singh" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Phone *</label>
              <input name="phone" required placeholder="9876543210" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Specialization</label>
            <input name="specialization" placeholder="Strength & Conditioning, Yoga, CrossFit" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Email</label>
              <input name="email" type="email" placeholder="trainer@gym.com" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Experience (years)</label>
              <input name="experience_years" type="number" min={0} max={50} placeholder="5" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid var(--color-border-muted)" }}>
            <Link href="/dashboard/trainers" className="flex-1 py-3 rounded-xl text-sm font-medium text-center" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              Add Trainer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
