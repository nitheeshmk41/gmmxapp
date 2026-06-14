"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

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
    <div className="flex items-center justify-center py-12 px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Dashboard error</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We failed to load dashboard metrics. Try reloading or contact system admin.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full py-2.5 rounded-lg text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          style={{ background: "var(--color-brand-primary)" }}
        >
          <RotateCcw size={14} />
          Reload Section
        </button>
      </div>
    </div>
  );
}
