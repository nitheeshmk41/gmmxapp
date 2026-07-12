"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
import {
  Users,
  CreditCard,
  AlertTriangle,
  UserPlus,
  Building2,
  Activity,
  CalendarCheck,
  CheckCircle2,
  Globe,
  ArrowRight,
  Play,
  HelpCircle,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "📋 Member Management",
    desc: "Track profiles, active plans, renewal history, and check-in statuses in a unified speed-optimized list. Supporting fast lookups and filters.",
    color: "#FF5C73",
    gridClass: "md:col-span-2",
  },
  {
    icon: CreditCard,
    title: "💳 Payment Collection",
    desc: "Record UPI, cash, cards, or bank transfers. Integrated Razorpay auto-extends memberships and sends receipts.",
    color: "#22C55E",
    gridClass: "md:col-span-1",
  },
  {
    icon: AlertTriangle,
    title: "📷 QR Attendance",
    desc: "Coordinate shifts and attendance. Allow trainers to log checks on their phone without accessing billing details.",
    color: "#F59E0B",
    gridClass: "md:col-span-1",
  },
  {
    icon: Globe,
    title: "🌐 Gym Website",
    desc: "An auto-generated, high-converting gym landing page at yourgym.gmmx.app to display schedules, plans, and capture leads.",
    color: "#8B5CF6",
    gridClass: "md:col-span-2",
  },
  {
    icon: Building2,
    title: "👥 Trainer Management",
    desc: "Monitor trainer rosters, assign member groups, and delegate coordinator access seamlessly.",
    color: "#0EA5E9",
    gridClass: "md:col-span-1",
  },
  {
    icon: UserPlus,
    title: "📈 Lead Tracking",
    desc: "Capture incoming website join forms directly into a status board. Drag-and-drop status from New to Converted.",
    color: "#EC4899",
    gridClass: "md:col-span-2",
  },
];
const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Owner, Iron Fit Gym (New Delhi)",
    quote: "Before gmmx.app, tracking renewals was a mess. Now, we check the dashboard daily, send one-click WhatsApp messages, and our retention boosted by 45%!",
    impact: "+45% Churn Reduction",
  },
  {
    name: "Pooja Hegde",
    role: "Founder, Muscle Temple (Bengaluru)",
    quote: "My trainers mark attendance on their phones easily. Setting up Razorpay online payments took us under 10 minutes. Absolute best investment.",
    impact: "10m Setup Time",
  },
  {
    name: "Amit Patel",
    role: "MD, Elite Fitness (Mumbai)",
    quote: "Managing three separate branches was a massive headache. Toggling branches in gmmx.app is seamless and billing reports are 100% accurate.",
    impact: "3 Locations Synced",
  },
  {
    name: "Sanjay Singh",
    role: "Owner, Spartan Club (Chandigarh)",
    quote: "The lead management board is a lifesaver. Website joins fall straight into 'New Leads'. We have converted over 100 website leads directly.",
    impact: "100+ Leads Converted",
  },
];

const PRICING_PREVIEW = [
  {
    name: "Starter",
    price: "₹499",
    period: "/month",
    desc: "For gyms just starting their growth journey",
    features: [
      "Up to 100 members",
      "Manual payment tracking",
      "Free gym website (gmmx.app)",
      "Membership expiry alerts",
      "Lead capture form",
    ],
    highlighted: false,
    cta: "Start 14-Day Free Trial",
  },
  {
    name: "Professional ⭐",
    price: "₹999",
    period: "/month",
    desc: "For gyms ready to scale operations",
    features: [
      "Unlimited members",
      "Automatic Razorpay integration",
      "Custom domain support",
      "Trainer assignments",
      "Attendance tracking",
      "WhatsApp reminders",
    ],
    highlighted: true,
    cta: "Start 14-Day Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For gym chains and fitness franchises",
    features: [
      "Multi-branch coordination panel",
      "Consolidated group reporting",
      "API developer access",
      "White-labeled client portal",
      "Dedicated account manager",
    ],
    highlighted: false,
    cta: "Contact Sales Team",
  },
];

const FAQS = [
  {
    question: "Do I need a credit card to start the free trial?",
    answer: "No, you do not need a credit card to sign up. You get complete premium access to all platform features for 14 days. After the trial, you can choose a subscription plan and pay via UPI, cards, or bank transfer.",
  },
  {
    question: "How does the automated gym website work?",
    answer: "The moment your onboarding is completed, our system sets up a public landing page for your gym at 'yourgym.gmmx.app'. You can customize the photos, membership packages, and trainer profiles from your dashboard. It works out-of-the-box.",
  },
  {
    question: "Can I use my own custom domain?",
    answer: "Yes! If you are on the Professional or Enterprise plans, you can link your own custom domain (e.g., www.mygym.com) in your settings panel. We generate the SSL security certificate and handle the routing automatically.",
  },
  {
    question: "How do members pay me online?",
    answer: "By linking your Razorpay account details in gmmx.app, our platform automatically generates payment links. Members can pay using Google Pay, PhonePe, credit cards, or net banking. Once paid, their membership is extended automatically.",
  },
  {
    question: "Can I upgrade, downgrade, or cancel anytime?",
    answer: "Absolutely. gmmx.app is a month-to-month subscription service. You can upgrade, downgrade, or cancel your plan directly from your billing dashboard at any time. There are no locking contracts.",
  },
];

const ROTATING_WORDS = [
  "spreadsheets.",
  "notebooks.",
  "WhatsApp groups.",
  "paper registers.",
];

export default function MarketingHomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePreviewTab, setActivePreviewTab] = useState("Dashboard");
  const [alertSent, setAlertSent] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Slow down the video slightly
    }
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#0F172A" }}>

      {/* Sweeping Shine Animation Keyframes */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-marquee-continuous {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Hero Section with Video Background */}
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">

        {/* Background Video & Tech Overlays */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover scale-[1.01]"
          >
            <source src="/hero_bg1.mp4" type="video/mp4" />
          </video>
          {/* Darker Video Overlays (Video more visible) */}
          <div
            className="absolute inset-0 transition-all"
            style={{ backgroundColor: "rgba(4, 6, 15, 0.60)" }}
          />
          {/* Tech Grid Pattern */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-[1]"
          />
          {/* Pink glow behind the headline */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-rose-500/10 blur-[100px] rounded-full pointer-events-none z-0 animate-pulse" />
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,115,0.15),transparent_70%)] z-[1]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">

          {/* Hero Badge
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md animate-fade-in">
            <Zap size={12} fill="currentColor" className="text-rose-400" />
            <span>Start managing members in under 5 minutes</span>
          </div> */}

          {/* Headline Alternative */}
          <h1
            className="text-4xl sm:text-5xl lg:text-5xl font-black leading-tight mb-4 tracking-tight text-white w-full max-w-5xl mx-auto flex flex-col items-center justify-center"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85)", fontFamily: "'Inter', sans-serif" }}
          >
            <div className="whitespace-nowrap mb-2 sm:mb-4">
              Run your{" "}
              <span className="text-[#FF5C73] relative inline-block">
                Gym,
              </span>
            </div>
            <div className="whitespace-nowrap flex items-center justify-center text-slate-300">
              Not your{" "}
              <span className="text-white ml-3 sm:ml-4 line-through decoration-rose-500/40 text-left transition-all duration-500 inline-block min-w-[200px] sm:min-w-[300px] lg:min-w-[380px] overflow-hidden whitespace-nowrap">
                {ROTATING_WORDS[wordIndex]}
              </span>
            </div>
          </h1>

          {/* Subheading */}
          <p
            className="text-sm sm:text-base lg:text-lg text-slate-200 mb-6 max-w-3xl mx-auto leading-relaxed font-semibold animate-fade-in"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
          >
            Manage members, collect payments, track attendance, handle trainers, and launch your gym website—all from one{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-[#FF5C73] font-bold">dashboard.</span>
          </p>


          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6">
            <Link
              href="/signup"
              className="relative overflow-hidden flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-[1.02] hover:bg-[#ff4762] hover:shadow-[0_0_25px_rgba(255,92,115,0.5)] active:scale-[0.98] group"
              style={{
                background: "#FF5C73",
                boxShadow: "0 4px 20px rgba(255,92,115,0.4)",
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shine" style={{ animationDuration: "1.5s" }} />
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white transition-all bg-white/10 hover:bg-white/20 hover:border-white/30 border border-white/15 backdrop-blur-sm"
            >
              <Play size={16} fill="currentColor" /> Watch Demo
            </button>
          </div>

          {/* Benefits Capsule Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300 font-bold mb-10">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>14-Day Free Trial</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Setup in 5 Minutes</span>
            </div>
          </div>

          {/* Floating & Tilting Dashboard Preview Card */}
          <div
            className="relative max-w-5xl mx-auto w-full rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-md overflow-hidden aspect-[16/9] flex flex-col transition-all duration-700 hover:[transform:rotateX(1deg)_rotateY(-1deg)_translateY(-12px)] hover:border-[#FF5C73]/50 hover:shadow-[0_40px_100px_rgba(255,92,115,0.25)] group"
            style={{
              transform: "translateY(-10px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            }}
          >

            {/* Mock Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200/50 text-slate-500 text-[10px] sm:text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-4 font-bold text-slate-800 tracking-tight">
                  gmmx<span className="text-[#FF5C73]">.app</span> Workspace
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-200">DB Connected</span>
                <span className="text-slate-400 font-mono hidden sm:inline">v1.2.0</span>
              </div>
            </div>

            {/* Mock Dashboard Layout */}
            <div className="flex flex-grow overflow-hidden text-left text-[11px] sm:text-xs">

              {/* Mock Sidebar */}
              <div className="w-1/5 bg-slate-50/50 border-r border-slate-200/50 p-4 flex flex-col gap-1 hidden md:flex">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">menu</div>
                {[
                  { label: "Dashboard" },
                  { label: "Members" },
                  { label: "Payments" },
                  { label: "Expiry Management" },
                  { label: "Leads" },
                  { label: "Trainers" },
                  { label: "Gym Website" },
                ].map((item) => (
                  <div
                    key={item.label}
                    onClick={() => setActivePreviewTab(item.label)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${activePreviewTab === item.label
                      ? "bg-rose-50 text-rose-600 border border-rose-100"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    {item.label}
                  </div>
                ))}
                <div className="mt-auto p-3 rounded-xl bg-white border border-slate-200/50 text-[9px] text-slate-500">
                  Logged in as <br /><span className="font-bold text-slate-800">Iron Fit Owner</span>
                </div>
              </div>

              {/* Mock Main Panel */}
              <div className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto bg-white/50">
                {/* Header / Branch Selector */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      {activePreviewTab === "Dashboard" ? "General Overview" : activePreviewTab}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500">
                      {activePreviewTab === "Dashboard" 
                        ? "Here is your gym performance metrics today." 
                        : `Manage your ${activePreviewTab.toLowerCase()} effectively.`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-xl">Main Branch</span>
                    <span className="text-[10px] bg-rose-500 text-white font-bold px-2.5 py-1.5 rounded-xl hover:bg-rose-600 cursor-pointer">+ New</span>
                  </div>
                </div>

                {activePreviewTab === "Dashboard" ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Active Members", value: "248", change: "+12% this month", theme: "text-rose-500", bg: "bg-rose-50" },
                    { label: "Monthly Revenue", value: "₹1,84,500", change: "+8% growth", theme: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Expiring Today", value: "6 members", change: "Alerts pending", theme: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Hot Leads", value: "14 new", change: "From website", theme: "text-blue-600", bg: "bg-blue-50" },
                  ].map((stat) => (
                    <div key={stat.label} className={`p-3 sm:p-4 rounded-2xl ${stat.bg} border border-slate-100 flex flex-col justify-between`}>
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">{stat.label}</span>
                      <div className="my-1 sm:my-2 text-base sm:text-xl font-black text-slate-900">{stat.value}</div>
                      <span className={`text-[8px] sm:text-[9px] font-bold leading-none ${stat.theme}`}>{stat.change}</span>
                    </div>
                  ))}
                </div>

                {/* Dashboard Rows: Payments and Expiry alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Recent Payments Mock Card */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Recent Transactions</span>
                      <span className="text-[9px] text-slate-400 hover:text-slate-600 cursor-pointer">View All</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { member: "Rajesh Kumar", amount: "₹999", plan: "Monthly", method: "UPI", date: "Just now" },
                        { member: "Pooja Hegde", amount: "₹2,999", plan: "Quarterly", method: "Card", date: "15 mins ago" },
                        { member: "Amit Patel", amount: "₹9,999", plan: "Annual", method: "Cash", date: "1 hour ago" },
                      ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] sm:text-xs">
                          <div>
                            <p className="font-bold text-slate-700">{p.member}</p>
                            <p className="text-[9px] text-slate-400">{p.plan} · {p.method}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-slate-900">{p.amount}</p>
                            <p className="text-[8px] text-emerald-600 font-bold">{p.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expiry Alerts Mock Card with WhatsApp Button */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Critical Expiries</span>
                      <span className="text-[9px] text-slate-400 hover:text-slate-600 cursor-pointer">Manage Expiries</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { member: "Amit Singh", days: "Expires in 2 days", phone: "919999999999" },
                        { member: "Suresh Nair", days: "Expires Today", phone: "919999999999" },
                        { member: "Nisha Rao", days: "Expired 1 day ago", phone: "919999999999" },
                      ].map((e, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] sm:text-xs">
                          <div>
                            <p className="font-bold text-slate-700">{e.member}</p>
                            <p className="text-[9px] text-amber-600 font-bold">{e.days}</p>
                          </div>
                          <button
                            onClick={() => setAlertSent((prev) => ({ ...prev, [i]: true }))}
                            className={`px-2 py-1 rounded border text-[9px] font-bold transition-colors ${
                              alertSent[i]
                                ? "bg-slate-100 border-slate-200 text-slate-500 cursor-default"
                                : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                            }`}
                          >
                            {alertSent[i] ? "Sent!" : "WhatsApp Alert"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activePreviewTab === "Expiry Management" ? (
              <div className="space-y-6 animate-fade-in">
                {/* Expiry Alerts Mock Card with WhatsApp Button (Full Width for Expiry Tab) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Critical Expiries</span>
                    <span className="text-[9px] text-slate-400 hover:text-slate-600 cursor-pointer">Filter</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { member: "Amit Singh", days: "Expires in 2 days", phone: "919999999999" },
                      { member: "Suresh Nair", days: "Expires Today", phone: "919999999999" },
                      { member: "Nisha Rao", days: "Expired 1 day ago", phone: "919999999999" },
                      { member: "Rahul Verma", days: "Expires in 4 days", phone: "919999999999" },
                      { member: "Priya Sharma", days: "Expires in 5 days", phone: "919999999999" },
                    ].map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] sm:text-xs">
                        <div>
                          <p className="font-bold text-slate-700">{e.member}</p>
                          <p className="text-[9px] text-amber-600 font-bold">{e.days}</p>
                        </div>
                        <button
                          onClick={() => setAlertSent((prev) => ({ ...prev, [i + 10]: true }))}
                          className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold transition-colors ${
                            alertSent[i + 10]
                              ? "bg-slate-100 border-slate-200 text-slate-500 cursor-default"
                              : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                          }`}
                        >
                          {alertSent[i + 10] ? "Sent!" : "WhatsApp Alert"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activePreviewTab === "Members" ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center p-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Recent Members</span>
                    <span className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[9px] font-bold cursor-pointer hover:bg-rose-100">+ Add Member</span>
                  </div>
                  {[
                    { name: "Rahul Sharma", phone: "+91 98765 43210", plan: "12 Months Elite", status: "Active" },
                    { name: "Sneha Reddy", phone: "+91 98765 43211", plan: "3 Months Basic", status: "Active" },
                    { name: "Arjun Kumar", phone: "+91 98765 43212", plan: "1 Month Pro", status: "Expiring Soon" },
                    { name: "Priya Desai", phone: "+91 98765 43214", plan: "6 Months Basic", status: "Expired" },
                  ].map((m, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-slate-100 text-[10px] sm:text-xs last:border-0 hover:bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">{m.name}</p>
                        <p className="text-[9px] text-slate-500 font-medium mt-0.5">{m.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-700">{m.plan}</p>
                        <p className={`text-[9px] font-bold mt-0.5 ${m.status === "Active" ? "text-emerald-500" : m.status === "Expired" ? "text-rose-500" : "text-amber-500"}`}>{m.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activePreviewTab === "Payments" ? (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center p-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Payment History</span>
                  </div>
                  {[
                    { member: "Rajesh Kumar", amount: "₹999", plan: "Monthly", method: "UPI", date: "Today, 10:42 AM" },
                    { member: "Pooja Hegde", amount: "₹2,999", plan: "Quarterly", method: "Card", date: "Today, 09:15 AM" },
                    { member: "Amit Patel", amount: "₹9,999", plan: "Annual", method: "Cash", date: "Yesterday" },
                    { member: "Karan Singh", amount: "₹1,499", plan: "Monthly Elite", method: "UPI", date: "Yesterday" },
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-slate-100 text-[10px] sm:text-xs last:border-0 hover:bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">{p.member}</p>
                        <p className="text-[9px] text-slate-500 font-medium mt-0.5">{p.plan} · {p.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">{p.amount}</p>
                        <p className="text-[9px] text-emerald-600 font-bold mt-0.5">{p.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activePreviewTab === "Leads" ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {["New (3)", "Contacted (12)", "Trial (4)", "Converted (45)"].map(stage => (
                    <div key={stage} className="px-3 py-1.5 bg-white border border-slate-200/80 shadow-sm rounded-lg text-[9px] font-bold text-slate-600 whitespace-nowrap cursor-pointer hover:border-rose-300">{stage}</div>
                  ))}
                </div>
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                  {[
                    { name: "Siddharth Jain", source: "Website", date: "2 hrs ago", status: "New" },
                    { name: "Ananya Rao", source: "Instagram", date: "5 hrs ago", status: "Contacted" },
                    { name: "Manoj Tiwari", source: "Referral", date: "1 day ago", status: "Trial" },
                  ].map((l, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-slate-100 text-[10px] sm:text-xs last:border-0 hover:bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">{l.name}</p>
                        <p className="text-[9px] text-blue-500 font-bold mt-0.5">{l.source}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-slate-400 font-medium">{l.date}</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[8px] font-bold">{l.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activePreviewTab === "Trainers" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                {[
                  { name: "Vikram Rathore", role: "Head Coach", members: 45 },
                  { name: "Neha Sharma", role: "Yoga Instructor", members: 30 },
                  { name: "Kabir Singh", role: "CrossFit Expert", members: 28 },
                ].map((t, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm flex items-center gap-3 hover:border-rose-200 cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400">{t.name[0]}</div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{t.name}</p>
                      <p className="text-[9px] text-rose-500 font-bold mb-1">{t.role}</p>
                      <p className="text-[9px] text-slate-500 font-medium">{t.members} assigned members</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : activePreviewTab === "Gym Website" ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl shadow-md flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black mb-1">ironfit.gmmx.app</h4>
                    <p className="text-[9px] text-white/80">Your website is live and collecting leads.</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-[9px] font-bold backdrop-blur-sm border border-white/20 transition-colors">
                    Edit Site
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Page Views Today", value: "142", trend: "+18%" },
                    { label: "Leads Captured", value: "3", trend: "+1" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <div className="flex items-end gap-2 mt-1">
                        <p className="text-lg font-black text-slate-800">{stat.value}</p>
                        <p className="text-[9px] font-bold text-emerald-500 mb-1">{stat.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-grow p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in mt-4 py-16">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-slate-400 text-xl">✨</span>
                </div>
                <h4 className="text-sm font-black text-slate-800 mb-1">{activePreviewTab}</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 max-w-[280px]">
                  This is a preview environment. Sign up for a free 14-day trial to experience the full {activePreviewTab.toLowerCase()} module.
                </p>
              </div>
            )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Brand Row (Immediately Below Mockup) */}
      <section className="py-12 bg-white relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-8 px-6">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Built for independent gym owners & growing chains
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full flex items-center justify-start py-2">
          {/* Edge Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Items */}
          <div className="flex animate-marquee-continuous gap-x-12 shrink-0 w-max opacity-60 grayscale hover:opacity-100 transition-opacity duration-300">
            {/* Original */}
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>IRON FIT</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>GOLD&apos;S ARENA</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>SPARTAN CLUB</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>ELITE FITNESS</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>TITAN GYM</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg mr-12">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>POWERHOUSE</span>
            </div>
            {/* Duplicate */}
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>IRON FIT</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>GOLD&apos;S ARENA</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>SPARTAN CLUB</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>ELITE FITNESS</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>TITAN GYM</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold tracking-tight text-lg mr-12">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>POWERHOUSE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Count Up styling */}
      <section className="py-16 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "500+", label: "Gyms Powered" },
            { value: "50,000+", label: "Members Managed" },
            { value: "₹2 Cr+", label: "Payments Tracked" },
            { value: "100%", label: "Cloud Backups" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-[#FF5C73]">{stat.value}</p>
              <p className="text-xs lg:text-sm mt-2 uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Premium Bento Grid */}
      <section className="py-24 px-6 lg:px-12 bg-[#0A0F24] relative z-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[#FF5C73] font-bold text-xs uppercase tracking-widest font-mono">Core Features</p>
            <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight max-w-3xl mx-auto">
              Stop managing your gym across spreadsheets, notebooks, and WhatsApp.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              GMMX brings members, payments, attendance, trainers, and your website into one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">

            {/* Member Management - Large Card */}
            <div className="md:col-span-2 rounded-3xl p-8 flex flex-col group overflow-hidden relative border border-white/5 hover:border-white/10" style={{ backgroundColor: "#111933" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C73]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-full md:w-2/3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5C73]/10 flex items-center justify-center mb-4 border border-[#FF5C73]/20">
                  <Users size={24} className="text-[#FF5C73]" />
                </div>
                <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Member Management</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">Know exactly who is active and who owes money at a glance.</p>
              </div>
              <div className="absolute right-0 bottom-0 w-[240px] h-[200px] translate-x-8 translate-y-8 bg-slate-900 border border-slate-700 rounded-tl-2xl p-5 shadow-2xl transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4 hidden sm:block">
                <div className="flex flex-col gap-5">
                  <div className="h-2.5 w-1/3 bg-slate-700 rounded-full mb-1"></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex shrink-0" /><div className="h-2 w-[120px] bg-slate-700 rounded-full" /></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex shrink-0" /><div className="h-2 w-[140px] bg-slate-700 rounded-full" /></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex shrink-0" /><div className="h-2 w-[100px] bg-slate-700 rounded-full" /></div>
                </div>
              </div>
            </div>

            {/* Payment Collection - Small Card */}
            <div className="rounded-3xl p-8 flex flex-col group overflow-hidden relative border border-white/5 hover:border-white/10" style={{ backgroundColor: "#111933" }}>
              <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <CreditCard size={24} className="text-emerald-500" />
                </div>
                <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Never miss a payment.</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Accept cash, UPI, cards, and online payments from one place.</p>
              </div>
              <div className="mt-auto relative z-10 pt-6">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex items-center justify-between shadow-xl translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">Received</span>
                  </div>
                  <span className="text-sm font-black text-emerald-400">+ ₹2,499</span>
                </div>
              </div>
            </div>

            {/* QR Attendance - Small Card */}
            <div className="rounded-3xl p-8 flex flex-col group overflow-hidden relative border border-white/5 hover:border-white/10" style={{ backgroundColor: "#111933" }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-full mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                  <AlertTriangle size={24} className="text-amber-500" />
                </div>
                <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Scan & Go</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Lightning-fast QR attendance tracking for everyone.</p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-4 grid grid-cols-3 gap-2 rotate-[12deg] group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`rounded-lg ${i % 2 === 0 ? 'bg-slate-700' : 'bg-slate-800'}`} />
                ))}
              </div>
            </div>

            {/* Gym Website - Wide Card */}
            <div className="md:col-span-2 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between group overflow-hidden relative border border-white/5 hover:border-white/10" style={{ backgroundColor: "#111933" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 md:w-1/2 flex flex-col h-full justify-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                  <Globe size={24} className="text-purple-400" />
                </div>
                <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Instant Gym Website</h3>
                <p className="text-slate-400 text-sm max-w-[280px] leading-relaxed">Capture leads while you sleep. We generate a stunning, conversion-optimized landing page automatically.</p>
              </div>
              <div className="relative z-10 md:w-1/2 w-full h-[220px] mt-6 md:mt-0 flex justify-end items-end">
                <div className="w-full max-w-[320px] h-[180px] bg-slate-900 border border-slate-700 border-b-0 rounded-t-2xl overflow-hidden shadow-2xl relative translate-y-8 group-hover:translate-y-4 transition-transform duration-500">
                  <div className="h-10 bg-slate-800 border-b border-slate-700 flex justify-start items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="mx-auto w-[180px] h-5 bg-slate-900/50 rounded flex items-center justify-center border border-slate-700/50">
                      <span className="text-[9px] text-slate-400 font-mono">yourgym.gmmx.app</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3 opacity-60">
                    <div className="w-1/2 h-3.5 bg-slate-700 rounded-full mx-auto mb-2" />
                    <div className="w-3/4 h-2 bg-slate-700 rounded-full mx-auto" />
                    <div className="w-2/3 h-2 bg-slate-700 rounded-full mx-auto" />
                    <div className="w-24 h-7 bg-[#FF5C73]/90 rounded-full mx-auto mt-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Tracking - Large Card */}
            <div className="md:col-span-2 rounded-3xl p-8 flex flex-col group overflow-hidden relative border border-white/5 hover:border-white/10" style={{ backgroundColor: "#111933" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-full md:w-1/2">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                  <UserPlus size={24} className="text-blue-400" />
                </div>
                <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Convert More Leads</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[260px]">Website inquiries flow straight into your CRM Kanban board automatically.</p>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-2/3 md:w-1/2 translate-x-8 translate-y-16 md:translate-y-12 bg-slate-900 border border-slate-700 border-b-0 rounded-tl-2xl p-5 flex gap-4 opacity-100 group-hover:-translate-x-4 transition-transform duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] hidden sm:flex">
                <div className="w-1/2 h-full flex flex-col gap-3">
                  <div className="text-[10px] text-slate-500 font-black mb-1 p-1 bg-slate-800 inline-block w-max rounded px-2">NEW LEADS</div>
                  <div className="bg-slate-800 h-16 rounded-xl border border-slate-700/50 shadow-sm" />
                  <div className="bg-slate-800 h-16 rounded-xl border border-slate-700/50 shadow-sm" />
                </div>
                <div className="w-1/2 h-full flex flex-col gap-3 mt-6">
                  <div className="text-[10px] text-emerald-500 font-black mb-1 p-1 bg-emerald-500/10 inline-block w-max rounded px-2 border border-emerald-500/20">CONVERTED</div>
                  <div className="bg-emerald-500/10 h-16 rounded-xl border border-emerald-500/20 shadow-sm" />
                </div>
              </div>
            </div>

            {/* Trainer Management - Small Card */}
            <div className="rounded-3xl p-8 flex flex-col group overflow-hidden relative border border-white/5 hover:border-white/10" style={{ backgroundColor: "#111933" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
                  <Building2 size={24} className="text-indigo-400" />
                </div>
                <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Trainer Staff</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Delegate access and coordinate shift rosters seamlessly.</p>
              </div>
              <div className="mt-auto relative z-10 w-full pt-4">
                <div className="flex -space-x-3 ml-2 group-hover:space-x-1 transition-all duration-500">
                  <div className="w-12 h-12 rounded-full border-2 border-[#111933] bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shadow-xl">AM</div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#111933] bg-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-xl">RK</div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#111933] bg-indigo-500/20 flex items-center justify-center text-[11px] font-bold text-indigo-400 shadow-xl">+3</div>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center mt-16 pb-4">
            <div className="text-slate-400 text-sm font-medium mb-6">+ 20 more platform features designed for gyms</div>
            <Link href="/features" className="inline-flex items-center justify-center gap-2 text-white bg-[#111933] border border-slate-700 hover:border-rose-500/50 hover:bg-slate-800/80 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,92,115,0.15)] group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">Explore All Features <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-slate-950 text-white relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[#FF5C73] font-bold text-xs uppercase tracking-widest font-mono">simple onboarding</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white">Launch your gym in minutes.</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              From signup to accepting payments in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FF5C73]/30 transition-all flex flex-col justify-between space-y-6">
              <div>
                <span className="text-4xl font-black text-[#FF5C73]/20 block mb-4">01</span>
                <h3 className="text-xl font-extrabold text-white capitalize mb-4">Create Your Gym</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Sign up and configure your gym in under 5 minutes.</p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FF5C73]/30 transition-all flex flex-col justify-between space-y-6">
              <div>
                <span className="text-4xl font-black text-[#FF5C73]/20 block mb-4">02</span>
                <h3 className="text-xl font-extrabold text-white capitalize mb-4">Import Members</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Add existing members or start with a clean slate.</p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FF5C73]/30 transition-all flex flex-col justify-between space-y-6">
              <div>
                <span className="text-4xl font-black text-[#FF5C73]/20 block mb-4">03</span>
                <h3 className="text-xl font-extrabold text-white capitalize mb-4">Start Managing</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Track attendance, payments, and memberships from one dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Gym Website Showcase Section */}
      <section className="py-24 px-6 lg:px-12 bg-[#FAFBFC] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
              <Globe size={14} className="text-[#FF5C73]" /> Auto-Generated Website
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight">
              Your gym website. Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C73] to-rose-400">instantly.</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-[500px]">
              Don&apos;t pay developers or wait weeks for a website. Every GMMX gym gets a professional public website with lead capture, trainer profiles, membership plans, and custom domain support from day one.
            </p>
            <p className="text-slate-500 text-sm font-medium mt-2">
              Built specifically for Indian gym businesses
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Accept membership enquiries 24/7",
                "Display plans, trainers, timings, and contact details",
                "Mobile-friendly and Google-ready",
                "Connect your own domain name"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#FF5C73] shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 w-full flex justify-end relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-rose-400/20 to-purple-500/20 blur-[60px] rounded-full pointer-events-none z-0" />
            <div className="w-full max-w-md bg-[#F3F4F6] rounded-[24px] border border-[#E5E7EB] overflow-hidden relative z-10" style={{ boxShadow: "0 10px 30px rgba(0,0,0,.04)" }}>
              <div className="h-10 bg-[#E5E7EB]/50 border-b border-[#E5E7EB] flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto px-4 h-6 bg-white rounded border border-[#E5E7EB] flex items-center justify-center shadow-sm gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">ironfit.gmmx.app</span>
                  <ArrowRight size={10} className="text-slate-300" />
                  <span className="text-[10px] text-slate-800 font-mono font-bold">www.ironfitgym.com</span>
                </div>
              </div>
              {/* Mock Website Inside */}
              <div className="p-0 text-center">
                <div className="h-40 bg-slate-900 flex flex-col items-center justify-center p-4">
                  <h4 className="text-white font-black text-xl mb-1">IRON FIT ARENA</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-300 mb-3">
                    <span className="flex items-center gap-1"><Star size={10} className="text-amber-400 fill-amber-400" /> 4.8 Rating</span>
                    <span>·</span>
                    <span>📍 Coimbatore</span>
                  </div>
                  <button className="px-5 py-2 bg-[#FF5C73] text-white text-[11px] font-bold rounded-lg hover:bg-rose-500 transition-colors">Join Now</button>
                </div>
                <div className="p-4 bg-white text-left">
                  <div className="flex justify-between items-end mb-3">
                    <h5 className="text-xs font-bold text-slate-800">Membership Plans</h5>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center p-2 rounded border border-slate-100 bg-slate-50">
                      <span className="text-[10px] font-medium text-slate-600">Monthly Pass</span>
                      <span className="text-[11px] font-bold text-slate-900">₹999/month</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded border border-slate-100 bg-slate-50">
                      <span className="text-[10px] font-medium text-slate-600">Quarterly Pass</span>
                      <span className="text-[11px] font-bold text-slate-900">₹1499/month</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-3">
                    <h5 className="text-xs font-bold text-slate-800">Trainers</h5>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded border border-slate-100 bg-slate-50">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div>
                      <div className="text-[11px] font-bold text-slate-900">Rahul Kumar</div>
                      <div className="text-[9px] text-slate-500">Strength Coach</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBFC] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Infinite Marquee */}
      <section className="py-24 bg-[#0A0F24] border-t border-slate-800 overflow-hidden relative z-10">
        <div className="max-w-6xl mx-auto px-6 mb-16 text-center space-y-4">
          <p className="text-[#FF5C73] font-bold text-xs uppercase tracking-widest font-mono">social proof</p>
          <h2 className="text-3xl lg:text-4xl font-black text-white">Loved by gym owners</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            See how gyms across India are saving hours and boosting their revenue.
          </p>
        </div>

        {/* Marquee Row */}
        <div className="relative w-full flex items-center justify-start overflow-hidden py-4">
          {/* Fading Gradients on Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0F24] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0F24] to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div className="flex animate-marquee gap-6 shrink-0 w-max">
            {/* First Set */}
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="w-[380px] p-6 rounded-3xl bg-[#111933] border border-white/5 shadow-sm flex flex-col justify-between space-y-4 whitespace-normal select-none">
                <p className="text-sm text-slate-300 italic leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t.role}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t.impact}</span>
                </div>
              </div>
            ))}
            {/* Duplicate Set for Loop */}
            {TESTIMONIALS.map((t, idx) => (
              <div key={`dup-${idx}`} className="w-[380px] p-6 rounded-3xl bg-[#111933] border border-white/5 shadow-sm flex flex-col justify-between space-y-4 whitespace-normal select-none">
                <p className="text-sm text-slate-300 italic leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t.role}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section (Expanded Starter, Professional, Enterprise Matrix) */}
      <section className="py-24 px-6 lg:px-12 bg-white relative z-10 border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-rose-500 font-bold text-xs uppercase tracking-widest">straightforward pricing</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900">Simple, transparent pricing</h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Start with a 14-day free trial. No credit card required. Cancel or upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {PRICING_PREVIEW.map((plan) => (
              <div
                key={plan.name}
                className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md"
                style={
                  plan.highlighted
                    ? {
                      borderColor: "#FF5C73",
                      boxShadow: "0 10px 30px rgba(255,92,115,0.15)",
                      transform: "scale(1.02)",
                    }
                    : {}
                }
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] uppercase tracking-widest font-black py-1.5 px-5 rounded-bl-2xl">
                    most popular
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase font-extrabold tracking-wider mb-2" style={{ color: plan.highlighted ? "#FF5C73" : "#64748B" }}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-black text-slate-950">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-xs mb-6 leading-relaxed text-slate-500">
                    {plan.desc}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 size={15} className="text-rose-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.price === "Custom" ? "/contact-us" : "/signup"}
                  className="block text-center py-3.5 rounded-2xl text-sm font-bold transition-all"
                  style={{
                    background: plan.highlighted ? "#FF5C73" : "#F1F5F9",
                    color: plan.highlighted ? "white" : "#334155",
                    border: plan.highlighted ? "none" : "1px solid #E2E8F0",
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-rose-500 hover:text-rose-600"
            >
              Compare all plans & view FAQs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-24 px-6 relative z-10 bg-[#0A0F24]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[#FF5C73] font-bold text-xs uppercase tracking-widest font-mono">FAQ</p>
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="bg-[#111933] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-white hover:text-[#FF5C73] transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <HelpCircle
                      size={20}
                      className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#FF5C73]" : ""
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center bg-[#FF5C73] relative z-10 overflow-hidden">
        {/* Subtle radial background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Ready to run your gym more efficiently?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed font-medium">
            Manage members, automate renewals, track attendance, collect payments, and grow your business—all from one dashboard.
          </p>
          <div className="pt-4 flex flex-col items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 h-[60px] rounded-2xl text-base font-bold bg-white text-rose-600 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] shadow-lg w-full sm:w-auto"
            >
              Start 14-Day Free Trial <ArrowRight size={18} />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-white/80 mt-2">
              <span>✓ No credit card required</span>
              <span>✓ Setup in 5 minutes</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
      {/* Watch Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <iframe
              src="https://www.youtube.com/embed/BhIPNAYEsb0?autoplay=1&rel=0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
