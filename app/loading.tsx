import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#FF5C73] animate-spin" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading GMMX...</span>
      </div>
    </div>
  );
}
