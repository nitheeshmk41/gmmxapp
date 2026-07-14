"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, Lock, Smartphone, Globe, FileText, BarChart, Clock, LayoutDashboard, Search, Bell, Users, CreditCard, Camera, AlertTriangle } from "lucide-react";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"inr" | "usd">("inr");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (baseInr: number, baseUsd: number) => {
    if (billing === "yearly") {
      return {
        inr: `₹${Math.round(baseInr * 0.8)}`,
        usd: `$${Math.round(baseUsd * 0.8)}`,
      };
    }
    return {
      inr: `₹${baseInr}`,
      usd: `$${baseUsd}`,
    };
  };

  const starterPrice = getPrice(499, 9);
  const growthPrice = getPrice(999, 19);
  const proPrice = getPrice(1999, 39);

  const plans = [
    {
      name: "Starter",
      inrPrice: starterPrice.inr,
      usdPrice: starterPrice.usd,
      period: billing === "yearly" ? "/month, billed annually" : "/month",
      desc: "Perfect for new fitness businesses with up to 100 members",
      features: [
        "100 active members",
        "2 trainers & 1 admin",
        "1 branch location",
        "QR Attendance",
        "Member Android App",
        "Coach Mobile App",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Growth",
      inrPrice: growthPrice.inr,
      usdPrice: growthPrice.usd,
      period: billing === "yearly" ? "/month, billed annually" : "/month",
      desc: "For fitness businesses just starting their growth journey",
      features: [
        "Up to 100 members",
        "Manual payment tracking",
        "Free business website (gmmx.app)",
        "Membership expiry alerts",
        "Lead capture form",
        "Workout Plans",
        "Diet Plans",
        "Progress Photos",
        "Analytics Dashboard",
        "WhatsApp Notifications",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Pro",
      inrPrice: proPrice.inr,
      usdPrice: proPrice.usd,
      period: billing === "yearly" ? "/month, billed annually" : "/month",
      desc: "For established businesses needing advanced control.",
      features: [
        "Everything in Growth +",
        "AI Reports",
        "Member Retention Analytics",
        "Revenue Forecast",
        "Multi Branch",
        "API",
        "Integrations",
        "Priority Support",
        "Staff Roles",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Enterprise",
      inrPrice: "Custom",
      usdPrice: "Custom",
      period: "",
      desc: "For fitness franchises and multi-branch organizations",
      features: [
        "Multi-branch coordination panel",
        "Consolidated group reporting",
        "API developer access",
        "White-labeled client portal",
        "Dedicated account manager",
        "On-site Training",
        "Migration Assistance",
      ],
      cta: "Book Demo",
      highlighted: false,
    },
  ];

  const addons = [
    { name: "SMS credits", inr: "Usage-based", usd: "Usage-based" },
    { name: "WhatsApp messaging", inr: "Usage-based", usd: "Usage-based" },
    { name: "AI workout generator", inr: "₹199/mo", usd: "$5/mo" },
    { name: "AI diet planner", inr: "₹199/mo", usd: "$5/mo" },
    { name: "Extra branch", inr: "₹299/mo", usd: "$10/mo" },
    { name: "Custom domain", inr: "₹99/mo", usd: "$3/mo" },
    { name: "Data migration", inr: "₹2,999 one-time", usd: "$99 one-time" },
    { name: "Staff onboarding", inr: "₹1,999 one-time", usd: "$79 one-time" },
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes. There are no long-term contracts. You can upgrade, downgrade, or cancel your plan directly from your billing dashboard at any time.",
    },
    {
      question: "Do I need technical knowledge?",
      answer: "No. Most businesses are set up in less than 5 minutes. The system is designed to be intuitive and automated.",
    },
    {
      question: "Can I import existing members?",
      answer: "Yes. Import members from Excel or CSV easily during onboarding.",
    },
    {
      question: "Do I need a credit card to start the free trial?",
      answer: "No, you do not need a credit card to sign up. You get complete premium access to all platform features for 14 days.",
    },
    {
      question: "How does the automated business website work?",
      answer: "The moment your onboarding is completed, our system sets up a public landing page for your business. You can customize the photos, membership packages, and coach profiles from your dashboard.",
    },
    {
      question: "Can I use my own custom domain?",
      answer: "Yes! If you are on the Growth or Pro plans, you can link your own custom domain (e.g., www.mybusiness.com) in your settings panel.",
    },
  ];

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Page Header */}
      <section className="relative text-white min-h-[580px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Background Image & Overlay */}
        <Image
          src="/gym_assert1.jpg"
          alt="Gym Background"
          fill
          priority
          quality={80}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 mt-10">
          <p className="text-sm md:text-base font-bold text-rose-400 tracking-wider uppercase">
            Trusted by fitness businesses to simplify daily operations.
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Simple pricing for every business.
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Start free. Upgrade when you&apos;re ready.<br/>All plans include a 14-day free trial.
          </p>

          {/* Social Proof Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-6 text-sm font-bold text-slate-300">
             <div className="flex flex-col items-center gap-1">
                <span className="text-white text-lg">★★★★★</span>
                <span>50+ Gyms</span>
             </div>
             <div className="hidden md:block w-px h-8 bg-slate-800" />
             <div className="flex flex-col items-center gap-1">
                <span className="text-white text-lg">8,000+</span>
                <span>Members Managed</span>
             </div>
             <div className="hidden md:block w-px h-8 bg-slate-800" />
             <div className="flex flex-col items-center gap-1">
                <span className="text-white text-lg">99.9%</span>
                <span>Uptime</span>
             </div>
             <div className="hidden md:block w-px h-8 bg-slate-800" />
             <div className="flex flex-col items-center gap-1">
                <span className="text-white text-lg">🇮🇳</span>
                <span>Made in India</span>
             </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-6">
            
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-[0_0_15px_rgba(255,92,115,0.2)] flex items-center gap-2">
               <span>🎉</span> Founding Customer Offer: Lock your price forever.
            </div>

            {/* Double Toggles */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-slate-900/50 p-2 sm:p-2 rounded-2xl border border-slate-800/50 backdrop-blur-sm w-full max-w-2xl justify-between">
              
              {/* Billing Cycle Toggle */}
              <div className="flex bg-slate-800 p-1 rounded-xl w-full sm:w-auto relative">
                 <button
                   onClick={() => setBilling("monthly")}
                   className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all relative z-10 ${billing === "monthly" ? "text-white" : "text-slate-400 hover:text-white"}`}
                 >
                   Monthly
                 </button>
                 <button
                   onClick={() => setBilling("yearly")}
                   className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${billing === "yearly" ? "text-white" : "text-slate-400 hover:text-white"}`}
                 >
                   Yearly <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Save 20%</span>
                 </button>
                 {/* Sliding Background */}
                 <div
                   className={`absolute top-1 bottom-1 w-[calc(50%-4px)] sm:w-[130px] bg-slate-700 rounded-lg shadow-sm transition-all duration-300 ${
                     billing === "monthly" ? "left-1" : "left-[calc(50%+2px)] sm:left-[110px]"
                   }`}
                   style={billing === "yearly" ? { width: "160px" } : {}}
                 />
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-800" />

              {/* Currency Toggle */}
              <div className="flex items-center gap-3 px-4 w-full sm:w-auto justify-center">
                <span className={`text-sm font-bold transition-colors ${currency === "inr" ? "text-white" : "text-slate-500"}`}>
                  INR
                </span>
                <button
                  onClick={() => setCurrency(currency === "inr" ? "usd" : "inr")}
                  className="w-12 h-6 bg-slate-800 rounded-full p-1 transition-all duration-300 relative border border-slate-700 focus:outline-none flex shrink-0"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[#FF5C73] transition-all duration-300 absolute top-0.5 ${
                      currency === "usd" ? "left-7" : "left-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-bold transition-colors ${currency === "usd" ? "text-white" : "text-slate-500"}`}>
                  USD
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Plans Grid */}
      <section className="px-6 max-w-7xl mx-auto relative z-10 -mt-16 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const price = currency === "inr" ? plan.inrPrice : plan.usdPrice;
            const isCustom = plan.inrPrice === "Custom";

            return (
              <div
                key={plan.name}
                className="bg-white rounded-xl flex flex-col justify-between relative overflow-hidden"
                style={{
                  border: plan.highlighted ? "2px solid #FF5C73" : "1px solid #E5E7EB",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                {plan.highlighted && (
                  <div className="bg-[#FF5C73] text-white text-[11px] uppercase tracking-widest font-black py-2 text-center w-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 flex flex-col h-full">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h2>
                  
                  <div className="flex items-baseline gap-1 mt-4 mb-1">
                    <span className="text-4xl font-black text-slate-900">{price}</span>
                  </div>
                  {plan.period && (
                    <div className="text-slate-500 font-medium text-xs mb-4 h-4">
                      {plan.period}
                    </div>
                  )}
                  {!plan.period && <div className="h-4 mb-4" />}
                  
                  <p className="text-sm text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">{plan.desc}</p>

                  <div className="flex-grow">
                    <p className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Top features:</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => {
                        const isEverythingIn = feature.startsWith("Everything in");
                        return (
                        <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                          {isEverythingIn ? (
                             <ArrowRight size={16} className="text-[#FF5C73] shrink-0 mt-0.5" strokeWidth={3} />
                          ) : (
                             <Check size={16} className="text-slate-900 shrink-0 mt-0.5" strokeWidth={3} />
                          )}
                          <span className={isEverythingIn ? "font-bold text-slate-900" : "text-slate-700"}>{feature}</span>
                        </li>
                      )})}
                    </ul>
                  </div>

                  <div className="pt-4 mt-auto">
                    {isCustom ? (
                      <Link
                        href="/contact-us"
                        className="block text-center py-3 rounded-lg text-sm font-bold transition-colors w-full"
                        style={{
                          background: plan.highlighted ? "#FF5C73" : "white",
                          color: plan.highlighted ? "white" : "#0F172A",
                          border: plan.highlighted ? "1px solid #FF5C73" : "1px solid #CBD5E1",
                        }}
                      >
                        {plan.cta}
                      </Link>
                    ) : (
                      <Link
                        href="/signup"
                        className="block text-center py-3 rounded-lg text-sm font-bold transition-colors w-full"
                        style={{
                          background: plan.highlighted ? "#FF5C73" : "white",
                          color: plan.highlighted ? "white" : "#0F172A",
                          border: plan.highlighted ? "1px solid #FF5C73" : "1px solid #CBD5E1",
                        }}
                      >
                        {plan.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="pb-16 pt-4 px-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-bold text-slate-500">
           <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500" /> SSL Secured</span>
           <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Daily Backup</span>
           <span className="flex items-center gap-1.5"><Lock size={16} className="text-emerald-500" /> GDPR Ready</span>
           <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500" /> Razorpay Secure</span>
           <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> No Hidden Fees</span>
           <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Cancel Anytime</span>
        </div>
      </section>

      {/* Why Gym Owners Choose GMMX */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
             <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">
               Why Fitness Business Owners Choose GMMX
             </h2>
             <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
               Stop spending your evenings matching Excel sheets with bank statements. GMMX automates the boring work so you can focus on your members.
             </p>
             <ul className="space-y-5">
               {[
                 { title: "Save 5+ hours every week", icon: Clock },
                 { title: "Reduce missed membership renewals", icon: AlertTriangle },
                 { title: "Accept payments online instantly", icon: CreditCard },
                 { title: "Build a professional gym website", icon: Globe },
                 { title: "Let members check attendance and plans", icon: Smartphone },
                 { title: "Track business performance with analytics", icon: BarChart },
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
                     <item.icon size={18} className="text-[#FF5C73]" />
                   </div>
                   <span className="text-lg font-bold text-slate-200">{item.title}</span>
                 </li>
               ))}
             </ul>
           </div>

           {/* Product Mockup Collage */}
           <div className="relative h-[500px] w-full hidden md:block">
              {/* Dashboard Mock */}
              <div className="absolute top-0 right-0 w-[80%] h-[280px] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 flex flex-col gap-4 overflow-hidden">
                 <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-xs font-bold text-slate-300">Overview Dashboard</span>
                    <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600"/><span className="w-2.5 h-2.5 rounded-full bg-slate-600"/><span className="w-2.5 h-2.5 rounded-full bg-slate-600"/></div>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50"><div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Members</div><div className="text-xl font-black text-white">1,248</div></div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50"><div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Revenue</div><div className="text-xl font-black text-emerald-400">₹2.4L</div></div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50"><div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Renewals</div><div className="text-xl font-black text-rose-400">14 pending</div></div>
                 </div>
                 <div className="bg-slate-900 flex-1 rounded-lg border border-slate-700/50 p-3 flex flex-col gap-2">
                   <div className="h-3 w-1/4 bg-slate-800 rounded-full"/>
                   <div className="h-2 w-full bg-slate-800 rounded-full"/>
                   <div className="h-2 w-full bg-slate-800 rounded-full"/>
                   <div className="h-2 w-3/4 bg-slate-800 rounded-full"/>
                 </div>
              </div>

              {/* Mobile App Mock */}
              <div className="absolute bottom-0 left-0 w-[40%] h-[320px] bg-slate-950 border-4 border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col">
                 <div className="bg-[#FF5C73] pt-6 pb-4 px-4 flex justify-between items-center text-white">
                    <div className="w-6 h-6 rounded-full bg-white/20"/>
                    <span className="text-xs font-bold">Coach App</span>
                    <Search size={14}/>
                 </div>
                 <div className="p-4 flex flex-col gap-3 flex-1 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Today&apos;s Classes</span>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                       <div className="w-10 h-10 bg-rose-100 rounded-lg text-rose-500 flex items-center justify-center font-black">AM</div>
                       <div><div className="text-xs font-bold text-slate-900">Morning Yoga</div><div className="text-[9px] text-slate-500">12 Attendees</div></div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-100 rounded-lg text-blue-500 flex items-center justify-center font-black">PM</div>
                       <div><div className="text-xs font-bold text-slate-900">CrossFit WOD</div><div className="text-[9px] text-slate-500">24 Attendees</div></div>
                    </div>
                 </div>
                 <div className="bg-white border-t border-slate-100 p-3 flex justify-between px-6 text-slate-400">
                    <LayoutDashboard size={18} className="text-rose-500"/>
                    <Users size={18} />
                    <Bell size={18} />
                 </div>
              </div>

              {/* Payment Success Mock */}
              <div className="absolute top-[40%] right-[10%] w-[50%] bg-emerald-500 border border-emerald-400 rounded-xl shadow-2xl p-4 flex items-center gap-4 z-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                 </div>
                 <div>
                    <div className="text-white font-black text-sm">Payment Received</div>
                    <div className="text-emerald-100 text-[10px] font-bold">₹1,999 from Amit Singh</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Why GMMX vs Excel vs Paper Table */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">GMMX vs The Old Way</h2>
        <p className="text-slate-500 text-center font-medium mb-10 max-w-xl mx-auto">
           A clear view of why modern fitness businesses are ditching paper registers and messy spreadsheets.
        </p>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 px-6 font-bold text-slate-900 text-sm">Feature</th>
                <th className="py-4 px-6 font-black text-[#FF5C73] text-sm text-center">GMMX</th>
                <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Excel</th>
                <th className="py-4 px-6 font-bold text-slate-700 text-sm text-center">Paper Register</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium text-sm">
              {[
                { name: "Attendance", g: "✅", e: "⚠️", p: "❌" },
                { name: "Payments Collection", g: "✅", e: "⚠️", p: "❌" },
                { name: "Automated Reports", g: "✅", e: "❌", p: "❌" },
                { name: "Business Website", g: "✅", e: "❌", p: "❌" },
                { name: "Mobile App", g: "✅", e: "❌", p: "❌" },
                { name: "Lead CRM", g: "✅", e: "⚠️", p: "❌" },
              ].map((row, i) => (
                <tr key={row.name} className={i !== 5 ? "border-b border-slate-100" : ""}>
                   <td className="py-4 px-6 font-bold text-slate-800">{row.name}</td>
                   <td className="py-4 px-6 text-center text-lg">{row.g}</td>
                   <td className="py-4 px-6 text-center text-lg">{row.e}</td>
                   <td className="py-4 px-6 text-center text-lg">{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="pb-24 px-6 max-w-6xl mx-auto hidden md:block">
        <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Compare Plans in Detail</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 px-6 font-bold text-slate-900 text-sm w-1/5">Feature</th>
                <th className="py-4 px-6 font-bold text-slate-900 text-sm text-center w-1/5">Starter</th>
                <th className="py-4 px-6 font-bold text-[#FF5C73] text-sm text-center w-1/5">Growth</th>
                <th className="py-4 px-6 font-bold text-slate-900 text-sm text-center w-1/5">Pro</th>
                <th className="py-4 px-6 font-bold text-slate-900 text-sm text-center w-1/5">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium text-sm">
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Members</td>
                <td className="py-4 px-6 text-center">100</td>
                <td className="py-4 px-6 text-center">500</td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">Unlimited</td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Coaches</td>
                <td className="py-4 px-6 text-center">2</td>
                <td className="py-4 px-6 text-center">10</td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">Unlimited</td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Branches</td>
                <td className="py-4 px-6 text-center">1</td>
                <td className="py-4 px-6 text-center">1</td>
                <td className="py-4 px-6 text-center">5</td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Automated Payment Reminders</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Business Website</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Custom Domain</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center text-slate-500 font-bold">Add-on</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Lead CRM</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Staff Roles & Permissions</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6 font-bold text-slate-800">Financial Dashboard</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-slate-800">API Access</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center text-slate-400">—</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-emerald-500" strokeWidth={3} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-3">
           <h2 className="text-2xl font-black text-slate-900">Optional Premium Add-ons</h2>
           <p className="text-slate-500 font-medium">Enhance your plan with flexible add-ons tailored to your specific needs.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 px-6 font-bold text-slate-900 text-sm w-1/2">Add-on</th>
                <th className="py-4 px-6 font-bold text-slate-900 text-sm text-right">Price</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium text-sm">
              {addons.map((addon, i) => (
                <tr key={addon.name} className={i !== addons.length - 1 ? "border-b border-slate-100" : ""}>
                   <td className="py-4 px-6 font-bold text-slate-800">{addon.name}</td>
                   <td className="py-4 px-6 text-right text-slate-600 font-bold">
                      {currency === "inr" ? addon.inr : addon.usd}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Customer Testimonial */}
      <section className="py-16 px-6 bg-[#FF5C73] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
           <div className="flex justify-center mb-4">
              <div className="flex gap-1 text-yellow-300">
                <Star fill="currentColor" size={24} />
                <Star fill="currentColor" size={24} />
                <Star fill="currentColor" size={24} />
                <Star fill="currentColor" size={24} />
                <Star fill="currentColor" size={24} />
              </div>
           </div>
           <blockquote className="text-2xl sm:text-3xl font-black leading-tight italic">
             &quot;GMMX reduced our admin work and made membership tracking much easier. Setting up Razorpay online payments took us under 10 minutes. Absolute best investment.&quot;
           </blockquote>
           <div className="pt-4">
              <p className="font-bold text-lg">Rajesh Kumar</p>
              <p className="text-rose-200 font-medium text-sm">Owner, Iron Fit Gym</p>
           </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-slate-900">Got questions?</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:text-slate-700 transition-colors"
                >
                  <span className="text-[15px]">{faq.question}</span>
                  <HelpCircle
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-slate-900" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA & Footer Alternative */}
      <section className="pt-24 px-6 text-center relative overflow-hidden bg-slate-950 text-white flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,92,115,0.15),transparent_60%)]" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8 mb-24">
          <h2 className="text-4xl sm:text-5xl font-black">
            Ready to run your business smarter?
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto font-medium">
            Helping fitness businesses spend less time on paperwork and more time growing.
          </p>
          <div className="pt-4 flex flex-col items-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all hover:bg-rose-500 hover:scale-105"
              style={{
                background: "#FF5C73",
                boxShadow: "0 4px 20px rgba(255,92,115,0.4)",
              }}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <p className="mt-4 text-xs font-bold text-slate-400">14-day free trial. No credit card required.</p>
          </div>
        </div>

        {/* Mini Footer */}
        <div className="relative z-10 border-t border-slate-800 py-8 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-500 max-w-6xl mx-auto w-full gap-4 mt-auto">
           <div>&copy; {new Date().getFullYear()} GMMX. All rights reserved.</div>
           <div className="flex gap-6">
              <a href="mailto:support@gmmx.app" className="hover:text-white transition-colors">support@gmmx.app</a>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
           </div>
        </div>
      </section>
    </div>
  );
}

function Star({ size, fill, className }: { size: number; fill: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
