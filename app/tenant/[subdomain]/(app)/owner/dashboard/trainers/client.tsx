"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2, Dumbbell, Phone, Mail, Trash2, Edit2 } from "lucide-react";
import { createTrainer, deleteTrainer } from "@/features/trainers/actions";
import { getInitials } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";

type Trainer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialization: string | null;
  experience_years: number | null;
  photo_url: string | null;
  is_active: boolean;
  members: { id: string; name: string }[];
};

export function TrainersClientPage({ trainers }: { trainers: Trainer[] }) {
  const [, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const result = await createTrainer(formData);
      if (result?.error) setError(result.error);
      else setShowModal(false);
      setLoading(false);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this trainer?")) return;
    startTransition(async () => { await deleteTrainer(id); });
  }

  return (
    <div className="space-y-5 animate-in">
      <PageHeader
        title="Trainers"
        description="Manage your staff, assign members, and track attendance."
        breadcrumbs={[{ label: "Dashboard", href: "/owner/dashboard" }, { label: "Trainers" }]}
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
          >
            <Plus size={14} />
            Add Trainer
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.length === 0 ? (
          <div className="col-span-3 py-16 text-center">
            <Dumbbell size={32} className="mx-auto mb-3" style={{ color: "var(--color-border)" }} />
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No trainers added yet.</p>
          </div>
        ) : (
          trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="p-5 rounded-2xl hover-lift"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-hover))" }}
                >
                  {trainer.photo_url
                    ? <img src={trainer.photo_url} alt={trainer.name} className="w-full h-full object-cover rounded-2xl" />
                    : getInitials(trainer.name)
                  }
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: "var(--color-foreground)" }}>{trainer.name}</p>
                  {trainer.specialization && (
                    <p className="text-xs" style={{ color: "var(--color-brand-primary)" }}>{trainer.specialization}</p>
                  )}
                  {trainer.experience_years !== null && (
                    <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {trainer.experience_years} yr{trainer.experience_years !== 1 ? "s" : ""} exp.
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Phone size={13} style={{ color: "var(--color-muted-foreground)" }} />
                  <span className="text-sm" style={{ color: "var(--color-foreground)" }}>{trainer.phone}</span>
                </div>
                {trainer.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={13} style={{ color: "var(--color-muted-foreground)" }} />
                    <span className="text-sm" style={{ color: "var(--color-foreground)" }}>{trainer.email}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--color-border-muted)" }}>
                <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                  {trainer.members.length} member{trainer.members.length !== 1 ? "s" : ""}
                </span>
                <div className="flex gap-2">
                  <span className={trainer.is_active ? "badge-success" : "badge-muted"}>
                    {trainer.is_active ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleDelete(trainer.id)}
                    className="p-1 rounded-lg transition-all"
                    style={{ color: "var(--color-danger)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-danger-light)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-in" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: "var(--color-foreground)" }}>Add Trainer</h3>
              <button onClick={() => setShowModal(false)} style={{ color: "var(--color-muted-foreground)" }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626" }}>{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Name *</label>
                  <input name="name" required placeholder="Ankit Singh" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Phone *</label>
                  <input name="phone" required placeholder="9876543210" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Specialization</label>
                <input name="specialization" placeholder="Strength & Conditioning" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Email</label>
                  <input name="email" type="email" placeholder="trainer@gym.com" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Experience (years)</label>
                  <input name="experience_years" type="number" min={0} max={50} placeholder="5" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)" }}>
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Add Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
