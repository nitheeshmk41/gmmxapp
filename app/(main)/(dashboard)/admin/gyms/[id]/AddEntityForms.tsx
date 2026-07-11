"use client";

import { useState } from "react";
import { UserPlus, Dumbbell, X, Loader2 } from "lucide-react";
import { addMemberToGym, addTrainerToGym } from "./actions";

export default function AddEntityForms({ gymId }: { gymId: string }) {
  const [activeModal, setActiveModal] = useState<"member" | "trainer" | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleMemberSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("gymId", gymId);
    const res = await addMemberToGym(formData);

    setIsPending(false);
    if (res.success) {
      setActiveModal(null);
    } else {
      setError(res.error || "Failed to add member.");
    }
  };

  const handleTrainerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("gymId", gymId);
    const res = await addTrainerToGym(formData);

    setIsPending(false);
    if (res.success) {
      setActiveModal(null);
    } else {
      setError(res.error || "Failed to add trainer.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => setActiveModal("member")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: "#6366f115", color: "#6366f1" }}
        >
          <UserPlus size={14} /> Add Member
        </button>
        <button
          onClick={() => setActiveModal("trainer")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: "#f59e0b15", color: "#f59e0b" }}
        >
          <Dumbbell size={14} /> Add Trainer
        </button>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {activeModal === "member" ? "Add New Member" : "Add New Trainer"}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={activeModal === "member" ? handleMemberSubmit : handleTrainerSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
                  placeholder="Full Name"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
                  placeholder="+91..."
                />
              </div>

              {activeModal === "member" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
                    placeholder="member@example.com"
                  />
                </div>
              )}

              {activeModal === "trainer" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Specialization (Optional)</label>
                  <input
                    type="text"
                    name="specialization"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
                    placeholder="e.g. Strength Training"
                  />
                </div>
              )}
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--color-brand-primary)" }}
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  {activeModal === "member" ? "Add Member" : "Add Trainer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
