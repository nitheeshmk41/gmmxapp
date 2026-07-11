"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createGymManually } from "./actions";

export default function GymActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await createGymManually(formData);

    setIsPending(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      setError(res.error || "Something went wrong.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80"
        style={{ background: "var(--color-brand-primary)" }}
      >
        <Plus size={16} /> Add Gym
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add New Gym</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Gym Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
                  placeholder="e.g. Iron Fitness"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Subdomain</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="subdomain"
                    required
                    className="w-full px-4 py-2.5 rounded-l-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
                    placeholder="ironfit"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl text-slate-500 text-sm font-medium">
                    .gmmx.app
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Owner Email</label>
                <input
                  type="email"
                  name="ownerEmail"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
                  placeholder="owner@gym.com"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                  Create Gym
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
