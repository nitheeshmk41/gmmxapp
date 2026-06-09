"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createMember, updateMember } from "@/features/members/actions";
import Link from "next/link";

type Plan = { id: string; name: string; price: number; duration_days: number };
type Trainer = { id: string; name: string; specialization: string | null };
type Member = { id: string; name: string; phone: string; email: string | null; gender: string | null; age: number | null; height: number | null; weight: number | null; goal: string | null; join_date: Date; notes: string | null; status: string; plan_id: string | null; trainer_id: string | null };

interface Props {
  plans: Plan[];
  trainers: Trainer[];
  mode: "create" | "edit";
  member?: Member;
}

const FIELD_GROUPS = [
  {
    title: "Personal Information",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma", required: true, col: 2 },
      { name: "phone", label: "Phone", type: "tel", placeholder: "9876543210", required: true, col: 1 },
      { name: "email", label: "Email", type: "email", placeholder: "rahul@email.com", required: false, col: 1 },
    ],
  },
  {
    title: "Body Metrics",
    fields: [
      { name: "gender", label: "Gender", type: "select", options: ["", "male", "female", "other"], required: false, col: 1 },
      { name: "age", label: "Age", type: "number", placeholder: "25", required: false, col: 1 },
      { name: "height", label: "Height (cm)", type: "number", placeholder: "175", required: false, col: 1 },
      { name: "weight", label: "Weight (kg)", type: "number", placeholder: "75", required: false, col: 1 },
    ],
  },
];

export function MemberFormPage({ plans, trainers, mode, member }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const result = mode === "create"
        ? await createMember(formData)
        : await updateMember(member!.id, formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard/members");
      }
    });
  }

  return (
    <div className="max-w-2xl animate-in">
      {/* Back link */}
      <Link href="/dashboard/members" className="flex items-center gap-2 text-sm mb-5 transition-colors" style={{ color: "var(--color-muted-foreground)" }}>
        <ArrowLeft size={15} />
        Back to Members
      </Link>

      <div className="p-6 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-base font-bold mb-5" style={{ color: "var(--color-foreground)" }}>
          {mode === "create" ? "Add New Member" : "Edit Member"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626" }}>
              {error}
            </div>
          )}

          {FIELD_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {group.title}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {group.fields.map((field) => (
                  <div key={field.name} className={`space-y-1.5 ${field.col === 2 ? "col-span-2" : ""}`}>
                    <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>
                      {field.label} {field.required && "*"}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        defaultValue={(member as Record<string, unknown>)?.[field.name] as string || ""}
                        className="w-full px-3 py-2.5 rounded-lg text-sm"
                        style={inputStyle}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt === "" ? `Select ${field.label}` : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        defaultValue={(member as Record<string, unknown>)?.[field.name] as string || ""}
                        className="w-full px-3 py-2.5 rounded-lg text-sm"
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Membership */}
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Membership</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Join Date *</label>
                <input name="join_date" type="date" required defaultValue={member ? new Date(member.join_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Status</label>
                <select name="status" defaultValue={member?.status || "active"} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Membership Plan</label>
                <select name="plan_id" defaultValue={member?.plan_id || ""} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                  <option value="">No plan</option>
                  {plans.map((p) => <option key={p.id} value={p.id}>{p.name} – ₹{p.price}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Assigned Trainer</label>
                <select name="trainer_id" defaultValue={member?.trainer_id || ""} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                  <option value="">No trainer</option>
                  {trainers.map((t) => <option key={t.id} value={t.id}>{t.name}{t.specialization ? ` – ${t.specialization}` : ""}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Goal + Notes */}
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Additional Details</p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Fitness Goal</label>
                <input name="goal" placeholder="Weight loss, Muscle gain, Flexibility…" defaultValue={member?.goal || ""} className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>Notes</label>
                <textarea name="notes" rows={2} placeholder="Any notes about this member…" defaultValue={member?.notes || ""} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid var(--color-border-muted)" }}>
            <Link href="/dashboard/members" className="flex-1 py-3 rounded-xl text-sm font-medium text-center" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {mode === "create" ? "Add Member" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
