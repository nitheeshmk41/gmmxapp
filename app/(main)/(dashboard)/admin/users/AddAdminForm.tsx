"use client";

import { useState } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";
import { createSuperAdmin } from "./actions";

export default function AddAdminForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await createSuperAdmin(formData);

    setIsPending(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      setError(res.error || "Something went wrong.");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80"
        style={{ background: "var(--color-brand-primary)" }}
      >
        <UserPlus size={16} /> Add Super Admin
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Add Super Admin</h2>
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
            <label className="text-xs font-bold text-slate-700 uppercase">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
              placeholder="Admin Name"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
              placeholder="admin@gmmx.app"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] transition-all"
              placeholder="Min 8 characters"
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
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
