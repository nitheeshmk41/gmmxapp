"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function RootError({
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Something went wrong</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            An unexpected error occurred. Please try reloading the page or contact support if the issue persists.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full py-3.5 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
          style={{ background: "#FF5C73", boxShadow: "0 4px 14px rgba(255,92,115,0.3)" }}
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
