"use client";

import { useEffect } from "react";
import { ServerCrash, RotateCcw, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-sm w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center">
        
        <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
          <ServerCrash className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Couldn't load dashboard</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          We're having trouble loading your gym's data. Please check your internet connection or try again.
        </p>

        {error.digest && (
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg mb-8">
            <p className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
              Error Code: {error.digest.slice(0, 8)}
            </p>
          </div>
        )}
        
        <div className="w-full h-px bg-slate-100 mb-6" />

        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
            style={{ background: "var(--color-brand-primary)" }}
          >
            <RotateCcw size={16} />
            Retry
          </button>
          
          <Link
            href="mailto:support@gmmx.app"
            className="flex-1 py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall size={16} />
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
