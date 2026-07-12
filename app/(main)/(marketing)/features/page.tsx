import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  MessageSquare
} from "lucide-react";

export default function FeaturesPage() {
  const categories = [
    {
      name: "Operations",
      description: "Everything needed to manage members, attendance, and trainers.",
      features: [
        {
          id: "member-management",
          cardBg: "bg-rose-50/60 border-rose-100",
          title: "Member Management",
          tagline: "Manage Every Member In One Place",
          description: "Keep all member profiles, active plans, renewal history, and check-in statuses organized. Lightning-fast search helps your front desk look up anyone in seconds.",
          badges: ["✓ Members", "✓ Plans", "✓ Payment History", "✓ Status Tracking"],
          screenshot: (
            <div className="w-full h-full bg-white p-3 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                 <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">JK</div>
                    <div>
                       <div className="text-[11px] font-bold text-slate-800">John Kumar</div>
                       <div className="text-[9px] text-emerald-500 font-medium">Active · Expires: Jul 28</div>
                    </div>
                 </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                 <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-600">PS</div>
                    <div>
                       <div className="text-[11px] font-bold text-slate-800">Priya Sharma</div>
                       <div className="text-[9px] text-emerald-500 font-medium">Active · Expires: Aug 12</div>
                    </div>
                 </div>
              </div>
            </div>
          ),
        },
        {
          id: "attendance-tracking",
          cardBg: "bg-blue-50/60 border-blue-100",
          title: "Attendance & Trainers",
          tagline: "Track Attendance In Real Time",
          description: "Lightning-fast QR attendance tracking for everyone. Delegate access and coordinate shift rosters seamlessly for your trainers without losing security.",
          badges: ["✓ QR Check-ins", "✓ Trainer Profiles", "✓ Shifts", "✓ Access Control"],
          screenshot: (
            <div className="w-full h-full bg-white p-4 flex flex-col justify-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Today&apos;s Check-ins</div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-black text-slate-800 leading-none">45</span>
                <span className="text-xs font-bold text-slate-500 mb-0.5">Members</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-xl font-bold text-slate-800 leading-none">12</span>
                <span className="text-[11px] font-bold text-slate-500 mb-0.5">Trainers</span>
              </div>
            </div>
          ),
        }
      ]
    },
    {
      name: "Finance",
      description: "Record every payment and completely eliminate revenue leaks.",
      features: [
        {
          id: "payment-tracking",
          cardBg: "bg-emerald-50/60 border-emerald-100",
          title: "Payment Tracking",
          tagline: "Track Every Rupee Without Spreadsheets",
          description: "Track multiple payment methods: cash, UPI, cards, and bank transfers. Generate professional PDF invoices automatically and optionally collect payments online.",
          badges: ["✓ Cash & UPI", "✓ Invoices", "✓ Online Payments", "✓ Daily Totals"],
          screenshot: (
            <div className="w-full h-full bg-white p-3 flex flex-col gap-2 justify-center">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded p-2">
                <div className="text-[10px] font-bold text-slate-600">Quarterly Plan</div>
                <div className="text-[11px] font-black text-emerald-500">+₹4,500</div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded p-2">
                <div className="text-[10px] font-bold text-slate-600">Monthly Pass</div>
                <div className="text-[11px] font-black text-emerald-500">+₹1,200</div>
              </div>
            </div>
          ),
        },
        {
          id: "renewal-management",
          cardBg: "bg-amber-50/60 border-amber-100",
          title: "Renewal Management",
          tagline: "Prevent Drop-offs Automatically",
          description: "Stop scrolling spreadsheets. See exactly who expires today, this week, or this month, and send immediate WhatsApp reminders with pre-filled messages.",
          badges: ["✓ Expiry Filters", "✓ WhatsApp Alerts", "✓ Retention Metrics", "✓ Overdue Tracking"],
          screenshot: (
            <div className="w-full h-full bg-white p-4 flex flex-col justify-center gap-3">
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-lg p-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <div className="text-[11px] font-bold text-rose-600">12 Expiring Today</div>
              </div>
              <button className="w-full py-2 bg-green-500 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5">
                <MessageSquare size={12} /> Send WhatsApp Reminders
              </button>
            </div>
          ),
        }
      ]
    },
    {
      name: "Growth",
      description: "Turn online traffic into foot traffic and analyze your success.",
      features: [
        {
          id: "lead-management",
          cardBg: "bg-purple-50/60 border-purple-100",
          title: "Lead Management",
          tagline: "Convert Inquiries Into Members",
          description: "Capture leads from your gym website directly into a Kanban pipeline. Move prospects from 'New' to 'Converted' seamlessly to ensure no inquiry gets ignored.",
          badges: ["✓ CRM Board", "✓ Follow-ups", "✓ Conversion Tracking", "✓ Auto-Capture"],
          screenshot: (
            <div className="w-full h-full bg-white p-3 flex gap-2 overflow-hidden">
              <div className="w-1/2 bg-slate-50 border border-slate-100 rounded p-2 flex flex-col gap-2">
                <div className="text-[9px] font-bold text-slate-500">NEW</div>
                <div className="h-6 bg-white border border-slate-200 rounded shadow-sm" />
                <div className="h-6 bg-white border border-slate-200 rounded shadow-sm" />
              </div>
              <div className="w-1/2 bg-emerald-50/30 border border-emerald-100 rounded p-2 flex flex-col gap-2">
                <div className="text-[9px] font-bold text-emerald-600">CONVERTED</div>
                <div className="h-6 bg-white border border-emerald-200 rounded shadow-sm" />
              </div>
            </div>
          ),
        },
        {
          id: "analytics",
          cardBg: "bg-indigo-50/60 border-indigo-100",
          title: "Analytics & Reports",
          tagline: "Understand Your Gym's Health",
          description: "Visualize monthly recurring revenue, member acquisition trends, and plan popularity. Stop guessing and start making data-driven decisions for your business.",
          badges: ["✓ Revenue Graphs", "✓ Member Growth", "✓ Plan Popularity", "✓ Exportable"],
          screenshot: (
            <div className="w-full h-full bg-white p-3 flex flex-col justify-end gap-1 relative">
              <div className="text-[10px] font-bold text-slate-400 absolute top-2 left-3">Monthly Revenue</div>
              <div className="text-lg font-black text-slate-800 absolute top-5 left-3">₹1.2L</div>
              <div className="flex items-end gap-1.5 h-12 w-full mt-8">
                <div className="w-1/6 bg-rose-100 rounded-t h-1/3" />
                <div className="w-1/6 bg-rose-200 rounded-t h-1/2" />
                <div className="w-1/6 bg-rose-300 rounded-t h-2/3" />
                <div className="w-1/6 bg-rose-400 rounded-t h-3/4" />
                <div className="w-1/6 bg-rose-500 rounded-t h-full" />
                <div className="w-1/6 bg-[#FF5C73] rounded-t h-5/6" />
              </div>
            </div>
          ),
        }
      ]
    },
    {
      name: "Website",
      description: "A professional online storefront without hiring developers.",
      features: [
        {
          id: "auto-website",
          cardBg: "bg-fuchsia-50/60 border-fuchsia-100",
          title: "Auto-Generated Website",
          tagline: "Your Online Storefront In Seconds",
          description: "Get a dedicated, conversion-optimized public website immediately. Display subscription packages, trainer qualifications, and capture leads 24/7.",
          badges: ["✓ Mobile Ready", "✓ Plan Display", "✓ Lead Form", "✓ Zero Coding"],
          screenshot: (
            <div className="w-full h-full bg-slate-900 p-0 flex flex-col relative overflow-hidden">
              <div className="h-7 bg-slate-800 border-b border-slate-700 flex items-center px-3 gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[9px] text-slate-400 font-mono ml-auto mr-auto">ironfit.gmmx.app</span>
              </div>
              <div className="p-4 text-center flex-1 flex flex-col justify-center border-b border-slate-800">
                <div className="text-sm font-black text-white mb-2">IRON FIT ARENA</div>
                <button className="px-4 py-1.5 bg-[#FF5C73] text-white text-[9px] font-bold rounded-lg mx-auto w-max">Join Now</button>
              </div>
            </div>
          ),
        },
        {
          id: "custom-domains",
          cardBg: "bg-sky-50/60 border-sky-100",
          title: "Custom Domains",
          tagline: "Own Your Gym's Brand",
          description: "Connect your own premium domain name (like www.yourgym.com) instead of our subdomain. We automatically provision and renew your SSL certificates.",
          badges: ["✓ Custom URL", "✓ Free SSL", "✓ Better SEO", "✓ Instant Setup"],
          screenshot: (
            <div className="w-full h-full bg-white p-4 flex flex-col justify-center gap-3">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-slate-400" />
                <div className="text-sm font-bold text-slate-800">www.ironfitgym.in</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded w-max border border-emerald-100">
                <ShieldCheck size={12} /> SSL Active & Secured
              </div>
            </div>
          ),
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Background Image & Overlay */}
        <Image
          src="/gym_assert2.jpg"
          alt="Gym Background"
          fill
          priority
          quality={80}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <p className="text-rose-500 font-bold text-xs uppercase tracking-widest">EVERYTHING YOU NEED TO RUN A MODERN GYM</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            <span className="text-[#E2E8F0]">Features built for</span> <span className="text-[#FF5C73]">gym growth</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Manage members, track attendance, automate renewals, collect payments, and grow your gym from a single dashboard.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-950 border-b border-white/5 relative z-10 text-center shadow-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
             <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">One Dashboard.<br />Complete Control.</h2>
          </div>
          <div className="relative w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#111933] overflow-hidden shadow-2xl">
             <div className="h-8 bg-slate-900 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
             </div>
             <div className="aspect-[16/9] w-full bg-slate-800 relative flex flex-col">
               <div className="flex flex-1">
                 <div className="w-1/5 bg-slate-900 border-r border-slate-700/50 p-4 flex flex-col gap-2">
                   <div className="h-4 bg-slate-700/50 rounded w-1/2 mb-4" />
                   {[1,2,3,4,5,6].map(i => <div key={i} className="h-6 bg-slate-800 rounded w-full" />)}
                 </div>
                 <div className="flex-1 bg-slate-800 p-6 flex flex-col gap-4">
                    <div className="h-6 bg-slate-700/50 rounded w-1/4 mb-2" />
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-700/30 rounded-xl" />)}
                    </div>
                    <div className="flex-1 bg-slate-700/30 rounded-xl" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto space-y-24">
        {categories.map((category, index) => (
          <div key={category.name}>
            <div className="mb-10 border-b border-slate-200 pb-4 text-center md:text-left">
              <div className="text-xs font-black text-slate-300 tracking-[0.2em] mb-2">━━━━━━━━━━━━━━━━━━</div>
              <h2 className="text-[2rem] font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                {category.name}
              </h2>
              <p className="text-slate-500 text-lg font-medium mt-2">{category.description}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {category.features.map((item) => {
                return (
                  <div
                    key={item.id}
                    id={item.id}
                    className={`p-10 rounded-[32px] ${item.cardBg} hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between group`}
                  >
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-[26px] font-black text-slate-950 capitalize tracking-tight leading-tight">
                          {item.title}
                        </h2>
                        <p className="text-sm font-bold text-slate-500 mt-1">
                          {item.tagline}
                        </p>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.badges.map(badge => (
                          <span key={badge} className="px-3 py-1.5 bg-white/60 text-slate-700 text-[11px] font-bold rounded-xl border border-white/40 shadow-sm backdrop-blur-sm">
                            {badge}
                          </span>
                        ))}
                      </div>

                      <div className="w-full h-32 mt-6 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-sm overflow-hidden relative shadow-sm">
                         {item.screenshot}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {index === 1 && (
              <div className="mt-20 text-center bg-white border border-slate-200 rounded-3xl p-10 max-w-4xl mx-auto shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,92,115,0.05),transparent_60%)]" />
                <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">Ready to simplify gym management?</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto relative z-10">Stop wrestling with spreadsheets. Start your free 14-day trial and get your whole gym organized today.</p>
                <Link
                  href="/signup"
                  className="relative z-10 inline-flex items-center justify-center bg-[#FF5C73] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-rose-500 transition-colors shadow-lg hover:shadow-rose-500/30"
                >
                  Start Free Trial
                </Link>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* WhatsApp & Final CTA Flow */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #020617, #111827)" }}>
        {/* WhatsApp Highlight */}
        <div className="py-16 px-6 max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center border-t border-white/5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 mb-6">
            <MessageSquare size={12} /> WhatsApp Shortcut Integrated
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#E2E8F0] mb-6">
            Follow up on members instantly<br/>through <span className="text-[#25D366]">WhatsApp</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-10">
            Send renewal reminders, contact new leads, and reconnect with inactive members in one click—without extra tools or complicated setup.
          </p>
          
          {/* WhatsApp Visual Example */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 w-full max-w-sm flex items-center justify-between shadow-2xl hover:scale-105 transition-transform duration-300">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">JK</div>
                <div className="text-left">
                   <div className="text-sm font-bold text-white">John Kumar</div>
                   <div className="text-[11px] text-rose-400 font-medium mt-0.5">Membership expired 3 days ago</div>
                </div>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                <MessageSquare size={18} />
             </div>
          </div>
        </div>
      </section>

      {/* Final Footer CTA */}
      <section className="pt-16 pb-32 px-6 text-center relative overflow-hidden bg-[#F8FAFC]">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#111827] to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-8 relative z-10 mt-8">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
            Ready to run your gym smarter?
          </h2>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg mx-auto font-medium">
            Manage members, payments, attendance, websites, and trainers from a single platform.
          </p>
          <div className="pt-4 flex flex-col items-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,92,115,0.3)] mb-8"
              style={{
                background: "#FF5C73",
                boxShadow: "0 4px 20px rgba(255,92,115,0.4)",
              }}
            >
              Start 14-Day Free Trial <ArrowRight size={20} />
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold text-slate-500">
               <span>✓ No credit card required</span>
               <span>✓ Setup in under 5 minutes</span>
               <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
