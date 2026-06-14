import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
          <Dumbbell className="w-8 h-8 text-[#FF5C73]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Page not found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="block py-3.5 rounded-xl text-white font-bold text-center transition-all bg-[#FF5C73]"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
