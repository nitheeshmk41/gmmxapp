"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import TrueFocus from "@/components/TrueFocus";

export function AuthSidebar() {
  const pathname = usePathname();
  const isLogin = pathname?.includes("/signin");

  return (
    <div className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[540px] p-12 relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at top, rgba(255,92,115,.12), transparent 50%)"
        }}
      />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <img src="/gmmx_logo_trans.png" className="h-7 w-auto object-contain brightness-0 invert" alt="gmmx logo" />
            <span className="text-white font-black text-lg tracking-tight">gmmx<span className="text-[#FF5C73]">.app</span></span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Gym Management SaaS</p>
        </Link>
      </div>

      {/* Value prop */}
      <div className="space-y-6 relative z-10 my-auto pt-16 pb-8">
        <div>
          {isLogin ? (
            <>
              <div className="-ml-1">
                <TrueFocus 
                  sentence="Welcome back. Let's get to work."
                  blurAmount={1.5}
                  borderColor="#FF5C73"
                  glowColor="rgba(255, 92, 115, 0.25)"
                  animationDuration={0.8}
                  pauseBetweenAnimations={1.5}
                  className="justify-start gap-x-2.5 gap-y-1 py-1"
                  wordClassName="text-3xl xl:text-4xl"
                />
              </div>
              <p className="mt-3 text-[15px] text-slate-400 font-medium leading-relaxed max-w-sm">
                Access your dashboard to manage members, attendance, payments, and renewals.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-white text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight">
                Everything your gym needs.<br />
                <span className="text-[#FF5C73]">One platform.</span>
              </h1>
            </>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {[
            "Member Management",
            "Attendance Tracking",
            "Payment Tracking",
            "Automated Renewals",
            "Gym Website Included",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 size={12} className="text-rose-500" />
              </div>
              <span className="text-sm font-medium text-slate-300">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={12} /> 14-Day Free Trial</span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={12} /> Setup in 5 Minutes</span>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={12} /> Secure Cloud Platform</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-slate-500 text-xs flex justify-between relative z-10 font-medium">
        <span>© {new Date().getFullYear()} gmmx.app</span>
        <span className="flex gap-4">
           <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
           <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        </span>
      </div>
    </div>
  );
}
