import Link from "next/link";
import { Star, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

export default function TestimonialsPage() {
  const stats = [
    { value: "500+", label: "Active Gyms" },
    { value: "40%", label: "Average Renewal Boost" },
    { value: "5 Hours", label: "Saved Weekly" },
    { value: "4.9/5", label: "User Satisfaction" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Owner, Iron Fit Gym (New Delhi)",
      quote: "Before gmmx.app, tracking expiry was a mess. We had spreadsheets that were never updated. Now, we check the dashboard daily, send one-click WhatsApp messages, and our membership retention has gone up by almost 45%. The auto-generated website got us 25 new leads in the first week itself!",
      rating: 5,
      impact: "45% retention increase",
    },
    {
      name: "Pooja Hegde",
      role: "Founder, Muscle Temple (Bengaluru)",
      quote: "gmmx.app is so simple to use. My trainers can mark attendance on their phones without accessing billing data, which is great for security. Setting up integrated Razorpay payments took us under 10 minutes, and now members renew online seamlessly. Best investment we've made.",
      rating: 5,
      impact: "Razorpay enabled in 10 mins",
    },
    {
      name: "Amit Patel",
      role: "Managing Director, Elite Fitness (Mumbai)",
      quote: "Managing three separate branches was a massive headache. Toggling branches in gmmx.app is seamless. The billing reports give me exact revenue metrics instead of vanity figures. Highly recommend it to any serious gym owner who wants to grow.",
      rating: 5,
      impact: "3 locations synchronized",
    },
    {
      name: "Sanjay Singh",
      role: "Owner, Spartan Club (Chandigarh)",
      quote: "The lead management board is a lifesaver. When people inquire via our website form, they drop straight into 'New Leads'. We track follow-ups and convert them to active members in one click. We have converted over 100 leads since signing up.",
      rating: 5,
      impact: "100+ website leads converted",
    },
    {
      name: "Nisha Rao",
      role: "Operations head, Core Strength Studio (Pune)",
      quote: "We love the white-labeled feel. Mapping our custom domain was extremely fast, and the SSL certificate was automatically generated. Our website looks very clean, and our members appreciate the professional PDF receipts.",
      rating: 5,
      impact: "Custom domain verified instantly",
    },
    {
      name: "Kabir Mehta",
      role: "Owner, Powerhouse Gym (Kolkata)",
      quote: "We save at least 5 hours every single week on manual ledger books. All payments - cash, UPI, card - are stored accurately. And I can check my gym's financial health on the go from my phone.",
      rating: 5,
      impact: "5 hours saved weekly",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header with Gym Photo Background */}
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/gym_assert5.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <p className="text-rose-500 font-bold text-xs uppercase tracking-widest">real business impact</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Trusted by <span className="text-white">gym owners on gmmx</span><span className="text-[#FF5C73]">.app</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            See how gyms across India are saving time, collecting payments faster, and retaining members using gmmx<span className="text-[#FF5C73]">.app</span>.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-200/60 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <p className="text-3xl font-black text-slate-950">{s.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid of Testimonials */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <SpotlightCard
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/65 shadow-sm flex flex-col justify-between"
              spotlightColor="rgba(255, 92, 115, 0.1)"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              {/* Author & Impact */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-extrabold text-slate-950 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0 self-start sm:self-center">
                  <TrendingUp size={12} /> {t.impact}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Trust Quote CTA */}
      <section className="relative text-white py-24 px-6 text-center border-t border-white/5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/gym_assert5.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Join the fitness revolution
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Try gmmx<span className="text-[#FF5C73]">.app</span> completely free for 14 days and see if it helps you manage your members better and grow your revenue.
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
              Get Started for Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
