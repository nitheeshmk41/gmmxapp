import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Fast Setup",
      desc: "Complete onboarding in less than 5 minutes. No complex configuration, no coding required.",
    },
    {
      icon: Globe,
      title: "Instant Public Webpage",
      desc: "Every gym receives a customizable, high-converting public micro-site with custom domain support.",
    },
    {
      icon: ShieldCheck,
      title: "Data Isolation",
      desc: "Multi-tenant PostgreSQL architecture ensures your client profiles and financial metrics are safe.",
    },
    {
      icon: Sparkles,
      title: "WhatsApp Automation",
      desc: "One-click shortcuts to prompt membership expiry updates, invoice notifications, and renewals.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero */}
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        <Image
          src="/gym_assert1.jpg"
          alt="Gym Background"
          fill
          priority
          quality={80}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 mt-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Our mission is to empower gym owners.
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            GMMX is the ultimate business management system to manage members, record payments, and launch professional websites instantly.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-50">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900">Why GMMX?</h2>
          <p className="text-slate-600 leading-relaxed">
            Most fitness software is overly complex, requires intensive onboarding, or ignores the gym owner's primary business driver: **revenue generation**.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We built GMMX with a **monolith-first, simplicity-driven philosophy**. It serves as an all-in-one operations hub that runs your reception desk while publishing a state-of-the-art landing page to acquire new client leads automatically.
          </p>
          <div className="space-y-3 pt-2">
            {[
              "Acquire leads with automated booking forms",
              "Retain members with expiry analytics",
              "Collect cash, card, UPI, or Razorpay payments",
              "Launch with custom subdomains in seconds",
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-800 text-sm font-semibold">
                <CheckCircle2 size={18} className="text-[#FF5C73]" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FF5C73, transparent)", filter: "blur(40px)" }} />
          <h3 className="text-xl font-bold text-slate-900 mb-4">GMMX SaaS Philosophy</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our technology helps gym owners save hours of administrative manual updates, preventing membership leakage and building a sleek, search-engine optimized presence on the web.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white py-24 px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900">Built for modern fitness businesses</h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">GMMX is designed from the ground up to solve practical management challenges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                    <Icon className="w-6 h-6 text-[#FF5C73]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{v.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden bg-slate-950 text-white border-t border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,92,115,0.12),transparent_60%)]" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">Launch your gym online today</h2>
          <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
            Acquire members, track attendance, and automate payment collections with GMMX.
          </p>
          <div className="pt-4 flex flex-col items-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold text-white transition-all bg-[#FF5C73] hover:bg-[#FF5C73]/90 shadow-lg"
            >
              Start 14-Day Free Trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
