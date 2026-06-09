import Link from "next/link";
import { ArrowRight, UserPlus, Globe, TrendingUp, CheckCircle } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "onboard your gym",
      tagline: "Set up your workspace in 2 minutes",
      description: "Getting started is simple. Register your gym, add your default membership plans, and define your trainer profiles. If you have multiple locations, you can configure your branches immediately. Single-location gyms automatically start with a 'Main Branch' configuration.",
      bullets: [
        "Create gym profile and upload your brand logo",
        "Add membership plans (e.g., monthly, quarterly, annual)",
        "Configure trainers, branches, and custom settings",
      ],
      previewColor: "from-rose-500/20 to-orange-500/20",
      accentColor: "#FF5C73",
    },
    {
      number: "02",
      icon: Globe,
      title: "launch public gym website",
      tagline: "Get a professional website automatically",
      description: "No code or designers required. The moment you onboard, gmmx.app automatically compiles and hosts a professional website for your gym at yourgym.gmmx.app. Your site features your plans, trainers, galleries, and a high-converting 'Join' form.",
      bullets: [
        "Select from 3 gorgeous, responsive templates",
        "Leads captured on the website sync instantly to your dashboard",
        "Map a custom domain (e.g., yourgym.com) for a white-labeled feel",
      ],
      previewColor: "from-blue-500/20 to-indigo-500/20",
      accentColor: "#3B82F6",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "manage & scale operations",
      tagline: "Track, collect, and retain with ease",
      description: "Run your daily business smoothly. Register new members, record payments (cash, UPI, cards, or integrated Razorpay), track attendance, and get automated alerts for membership expiries. Utilize built-in WhatsApp shortcuts to follow up with expiring members or hot leads.",
      bullets: [
        "Prevent loss with the Expiry Management dashboard",
        "Manage leads from 'New' to 'Converted' using status boards",
        "Track payments and auto-generate receipts for records",
      ],
      previewColor: "from-emerald-500/20 to-teal-500/20",
      accentColor: "#22C55E",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header with Gym Photo Background */}
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/gym_assert4.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <p className="text-rose-500 font-bold text-xs uppercase tracking-widest">simple & streamlined</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            How <span className="text-white">gmmx</span><span className="text-[#FF5C73]">.app</span> works
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Go from registration to launching your gym online and managing your members in three straightforward steps.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="space-y-32">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.title}
                className={`flex flex-col lg:flex-row items-center gap-16 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <span
                      className="text-4xl sm:text-5xl font-black opacity-30 select-none"
                      style={{ color: step.accentColor }}
                    >
                      {step.number}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${step.accentColor}15` }}
                    >
                      <Icon size={20} style={{ color: step.accentColor }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight capitalize">
                      {step.title}
                    </h2>
                    <p className="text-rose-500 font-bold text-sm">
                      {step.tagline}
                    </p>
                  </div>

                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual Preview Box */}
                <div className="flex-1 w-full">
                  <div
                    className={`aspect-video rounded-3xl bg-gradient-to-br ${step.previewColor} border border-slate-200/60 p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Mock Dashboard Layout */}
                    <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4 w-full h-full flex flex-col justify-between text-white relative z-10">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                          gmmx<span className="text-[#FF5C73]">.app</span> workspace
                        </span>
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-center py-2">
                        {index === 0 && (
                          <div className="space-y-2.5">
                            <div className="h-6 w-2/3 bg-white/10 rounded-lg animate-pulse" />
                            <div className="h-4 w-full bg-white/5 rounded-md" />
                            <div className="h-4 w-5/6 bg-white/5 rounded-md" />
                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <div className="h-10 bg-rose-500/20 border border-rose-500/30 rounded-xl flex items-center justify-center text-[10px] font-bold">Plan A</div>
                              <div className="h-10 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-bold">Plan B</div>
                              <div className="h-10 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-bold">Plan C</div>
                            </div>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="space-y-3 text-center">
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/25">
                              yourgym.gmmx<span className="text-[#FF5C73]">.app</span>
                            </div>
                            <div className="text-sm font-extrabold tracking-tight">Website Online & Active</div>
                            <div className="text-[11px] text-slate-400 max-w-xs mx-auto">
                              Templates generated: &quot;Modern Fitness&quot; selected. DNS status: verified.
                            </div>
                          </div>
                        )}
                        {index === 2 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                              <span className="font-semibold text-emerald-400">UPI Payment Received</span>
                              <span className="font-bold text-white">₹999</span>
                            </div>
                            <div className="flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                              <span className="font-semibold text-amber-400">Membership Expiring</span>
                              <span className="font-bold text-white">John Doe</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative text-white py-24 px-6 text-center overflow-hidden border-t border-white/5">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/gym_assert4.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">
            Ready to setup your gym workspace?
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Create your account today, set up your plans and website in minutes, and get 14 days of free premium access.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "#FF5C73",
                boxShadow: "0 4px 20px rgba(255,92,115,0.4)",
              }}
            >
              Start Free Trial Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
