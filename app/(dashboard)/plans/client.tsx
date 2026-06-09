"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, X, Loader2, Clock, IndianRupee, ToggleLeft, ToggleRight } from "lucide-react";
import { createPlan, updatePlan, deletePlan, togglePlanStatus } from "@/features/plans/actions";

type Plan = {
  id: string;
  name: string;
  duration_days: number;
  price: number;
  description: string | null;
  is_active: boolean;
};

export function PlansClientPage({ plans }: { plans: Plan[] }) {
  const [, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
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
      const result = editPlan
        ? await updatePlan(editPlan.id, formData)
        : await createPlan(formData);
      if (result?.error) setError(result.error);
      else { setShowModal(false); setEditPlan(null); }
      setLoading(false);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this plan? Members using this plan will be unaffected.")) return;
    startTransition(async () => { await deletePlan(id); });
  }

  async function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => { await togglePlanStatus(id, !isActive); });
  }

  return (
    <div className="space-y-5 animate-in">
      <div className="flex justify-end">
        <button
          onClick={() => { setEditPlan(null); setShowModal(true); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
        >
          <Plus size={14} />
          Add Plan
        </button>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.length === 0 ? (
          <div className="col-span-3 py-16 text-center">
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No plans created yet. Add your first membership plan.</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="p-5 rounded-2xl hover-lift"
              style={{
                background: "var(--color-surface)",
                border: `1px solid ${plan.is_active ? "var(--color-border)" : "var(--color-border-muted)"}`,
                boxShadow: "var(--shadow-card)",
                opacity: plan.is_active ? 1 : 0.65,
                borderTop: plan.is_active ? `3px solid var(--color-brand-primary)` : "3px solid var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base" style={{ color: "var(--color-foreground)" }}>{plan.name}</h3>
                  <span className={plan.is_active ? "badge-success" : "badge-muted"}>{plan.is_active ? "Active" : "Inactive"}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: "var(--color-brand-primary)" }}>₹{Number(plan.price).toLocaleString("en-IN")}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>per cycle</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <Clock size={14} style={{ color: "var(--color-muted-foreground)" }} />
                <span className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                  {plan.duration_days} day{plan.duration_days !== 1 ? "s" : ""}
                </span>
              </div>
              {plan.description && (
                <p className="text-xs mb-4" style={{ color: "var(--color-muted-foreground)" }}>{plan.description}</p>
              )}
              <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid var(--color-border-muted)" }}>
                <button
                  onClick={() => handleToggle(plan.id, plan.is_active)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}
                >
                  {plan.is_active ? <ToggleRight size={14} style={{ color: "var(--color-success)" }} /> : <ToggleLeft size={14} />}
                  {plan.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => { setEditPlan(plan); setShowModal(true); }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ml-auto"
                  style={{ color: "var(--color-danger)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-danger-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-in" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: "var(--color-foreground)" }}>
                {editPlan ? "Edit Plan" : "Create Plan"}
              </h3>
              <button onClick={() => { setShowModal(false); setEditPlan(null); }} style={{ color: "var(--color-muted-foreground)" }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626" }}>{error}</div>}
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Plan Name *</label>
                <input name="name" defaultValue={editPlan?.name} required placeholder="Monthly Basic" className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Duration (days) *</label>
                  <input name="duration_days" type="number" defaultValue={editPlan?.duration_days || 30} required min={1} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Price (₹) *</label>
                  <input name="price" type="number" defaultValue={editPlan?.price || ""} required min={0} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Description</label>
                <textarea name="description" defaultValue={editPlan?.description || ""} rows={2} placeholder="What's included…" className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditPlan(null); }} className="flex-1 py-2.5 rounded-lg text-sm" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)" }}>
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {editPlan ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
