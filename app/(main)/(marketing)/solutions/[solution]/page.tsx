import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { notFound } from "next/navigation";

// Define the static SEO content for the supported solutions.
const SOLUTIONS: Record<string, any> = {
  "gym": {
    name: "Gym",
    audienceLabel: "Gym Owners",
    fullName: "Gym Management",
    title: "Gym Management Software India – gmmx.app",
    desc: "Manage members, trainers, attendance, memberships & billing. The all-in-one gym management software.",
    heroSubtitle: "Track members, trainers, attendance, payments, and renewals from one platform.",
    problems: ["Member Attendance", "Renewal Tracking", "Monthly Fees", "Trainer Schedules", "Lead Management", "Staff Access"],
    whyChoose: ["Save 10+ hours/week", "Reduce missed renewals", "Track member progress", "Accept online payments", "Professional website"]
  },
  "yoga": {
    name: "Yoga Studio",
    audienceLabel: "Yoga Studios",
    fullName: "Yoga Studio Management",
    title: "Yoga Studio Management Software – gmmx.app",
    desc: "Manage classes, instructors, packages, online sessions and member attendance with ease.",
    heroSubtitle: "Manage classes, instructors, packages, online sessions and member attendance.",
    problems: ["Class Scheduling", "Instructor Roster", "Package Booking", "Online Sessions", "Member Attendance", "Payment Collection"],
    whyChoose: ["Streamline schedules", "Reduce admin work", "Easily manage instructors", "Accept online bookings", "Beautiful studio website"]
  },
  "dance": {
    name: "Dance Academy",
    audienceLabel: "Dance Academies",
    fullName: "Dance Academy Management",
    title: "Dance Academy Software – gmmx.app",
    desc: "Organize batches, performances, student progress and fee collection for your dance academy.",
    heroSubtitle: "Student batches, performances, fee management & attendance tracked effortlessly.",
    problems: ["Student Batches", "Fee Collection", "Performance Tracking", "Student Progress", "Parent Notifications", "Instructor Schedules"],
    whyChoose: ["Organize chaotic batches", "Never miss fee collections", "Track student levels", "Accept online payments", "Professional academy website"]
  },
  "swim": {
    name: "Swim Academy",
    audienceLabel: "Swimming Academies",
    fullName: "Swimming Academy Management",
    title: "Swimming Academy Management System – gmmx.app",
    desc: "Manage pool schedules, coaches, lane allocation and membership plans.",
    heroSubtitle: "Pool schedules, coaches, lane booking & memberships in one place.",
    problems: ["Pool Scheduling", "Lane Allocation", "Coach Roster", "Membership Plans", "Student Progress", "Safety Waivers"],
    whyChoose: ["Optimize pool usage", "Manage peak hours", "Easily manage coaches", "Accept online bookings", "Professional website"]
  },
};

export function generateStaticParams() {
  return Object.keys(SOLUTIONS).map((key) => ({
    solution: key,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ solution: string }> }): Promise<Metadata> {
  const { solution } = await params;
  const data = SOLUTIONS[solution];
  if (!data) return {};

  return {
    title: data.title,
    description: data.desc,
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ solution: string }> }) {
  const { solution } = await params;
  const data = SOLUTIONS[solution];
  
  if (!data) {
    notFound();
  }

  const defaultFaqs = [
    { q: "Can I manage multiple branches?", a: "Yes, GMMX allows you to easily switch between multiple branches or locations from a single dashboard." },
    { q: "Can staff mark attendance?", a: "Yes, staff can securely log check-ins using QR codes without seeing financial data." },
    { q: "Do you support online payments?", a: "Absolutely. We integrate directly with Razorpay to help you collect online payments easily." },
    { q: "Is the website really auto-generated?", a: "Yes! The moment you sign up, your business gets a beautiful, conversion-optimized public website." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,115,0.15),transparent_70%)] z-[1]" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
            <span>Built for {data.audienceLabel}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight text-white">
            Manage your {data.name} with GMMX
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            {data.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "#FF5C73", boxShadow: "0 4px 20px rgba(255,92,115,0.4)" }}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact-us"
              className="px-8 py-4 rounded-xl text-base font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
            >
              Book Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Problems We Solve</h2>
          <p className="text-slate-500 text-lg">Everything you need to run your {data.name.toLowerCase()} efficiently.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {data.problems.map((problem: string, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{problem}</h3>
            </div>
          ))}
        </div>
      </section>
      
      {/* Why Choose GMMX */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">Why {data.audienceLabel} Choose GMMX</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.whyChoose.map((reason: string, idx: number) => (
              <div key={idx} className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 text-center flex flex-col items-center gap-4 hover:bg-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-[#FF5C73] flex items-center justify-center font-black">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-slate-200 text-sm leading-tight">{reason}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {defaultFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-3 mb-2">
                <HelpCircle size={20} className="text-[#FF5C73]" /> {faq.q}
              </h3>
              <p className="text-slate-500 pl-8 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FF5C73] to-rose-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-black text-white relative z-10 mb-8">
            Start Managing Your {data.fullName} Today
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-lg font-black text-slate-900 bg-white transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10 shadow-xl"
          >
            Start Free Trial <ArrowRight size={20} />
          </Link>
        </div>
      </section>
      
    </div>
  );
}
