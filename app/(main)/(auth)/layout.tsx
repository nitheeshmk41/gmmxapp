import type { Metadata } from "next";
import { AuthSidebar } from "./AuthSidebar";

export const metadata: Metadata = {
  title: "GMMX – Gym Management SaaS",
  description: "Sign in to manage your gym",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left – Brand panel */}
      <AuthSidebar />

      {/* Right – Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <img src="/gmmx_logo_trans.png" className="h-7 w-auto object-contain" alt="gmmx logo" />
            <span className="font-black text-xl tracking-tight text-slate-950">
              gmmx<span className="text-[#FF5C73]">.app</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
