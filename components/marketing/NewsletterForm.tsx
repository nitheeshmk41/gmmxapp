"use client";

import { Mail } from "lucide-react";

export function NewsletterForm() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm text-center">
      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
        <Mail size={24} />
      </div>
      <h3 className="font-black text-slate-900 mb-2">Weekly Growth Tips</h3>
      <p className="text-sm text-slate-500 mb-6">Join 500+ gym owners getting actionable advice every Tuesday.</p>
      
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          required
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
        />
        <button type="submit" className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
          Subscribe
        </button>
      </form>
    </div>
  );
}
