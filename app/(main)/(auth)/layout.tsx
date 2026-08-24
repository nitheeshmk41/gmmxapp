import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GMMX – Gym Management SaaS",
  description: "Sign in to manage your gym",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50/50">
      <div className="w-full max-w-[420px] bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <img src="/gmmx_logo_trans.png" className="h-6 w-auto object-contain" alt="gmmx logo" />
            <span className="font-black text-xl tracking-tight text-slate-950">
              gmmx<span className="text-[#FF5C73]">.app</span>
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
