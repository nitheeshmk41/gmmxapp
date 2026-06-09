"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: "₹499",
      yearlyPrice: "₹399",
      period: "/month",
      desc: "For small gyms getting started.",
      features: [
        "Up to 100 members",
        "Attendance tracking",
        "Payment tracking",
        "Auto-generated website",
        "WhatsApp shortcuts",
        "Basic reports",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Professional",
      monthlyPrice: "₹999",
      yearlyPrice: "₹799",
      period: "/month",
      desc: "For growing gyms looking to scale.",
      features: [
        "Unlimited members",
        "Trainer management",
        "Renewal automation",
        "Advanced reports",
        "Custom domain",
        "Lead tracking",
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      period: "",
      desc: "For multi-location and franchise gyms.",
      features: [
        "Multi-location support",
        "Dedicated account manager",
        "Custom workflows",
        "API access",
        "Advanced permissions",
        "Priority onboarding",
      ],
      cta: "Book Demo",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes. There are no long-term contracts. You can upgrade, downgrade, or cancel your plan directly from your billing dashboard at any time.",
    },
    {
      question: "Do I need technical knowledge?",
      answer: "No. Most gyms are set up in less than 5 minutes. The system is designed to be intuitive and automated.",
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
      question: "How does the automated gym website work?",
      answer: "The moment your onboarding is completed, our system sets up a public landing page for your gym. You can customize the photos, membership packages, and trainer profiles from your dashboard.",
    },
    {
      question: "Can I use my own custom domain?",
      answer: "Yes! If you are on the Professional or Enterprise plans, you can link your own custom domain (e.g., www.mygym.com) in your settings panel.",
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
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
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

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 mt-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Simple pricing for every gym.
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Start free. Upgrade when you&apos;re ready.<br/>All plans include a 14-day free trial.
          </p>

          {/* Billing Cycle Toggle Switch */}
          <div className="pt-8 flex justify-center items-center gap-4">
            <span className={`text-base font-semibold transition-colors ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-7 bg-slate-800 rounded-full p-1 transition-all duration-300 relative border border-slate-700 hover:border-slate-600 focus:outline-none"
              aria-label="Toggle billing cycle"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#FF5C73] transition-all duration-300 absolute top-0.5 ${
                  billingCycle === "yearly" ? "left-8" : "left-1"
                }`}
              />
            </button>
            <span className={`text-base font-semibold transition-colors flex items-center gap-2 ${billingCycle === "yearly" ? "text-white" : "text-slate-400"}`}>
              Yearly
              <span className="text-[#FF5C73] text-sm font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Plans Grid */}
      <section className="px-6 max-w-6xl mx-auto relative z-10 -mt-16 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const isCustom = plan.monthlyPrice === "Custom";

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
                    {plan.period && <span className="text-slate-500 font-medium text-sm">{plan.period}</span>}
                  </div>
                  
                  <p className="text-sm text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">{plan.desc}</p>

                  <div className="flex-grow">
                    <p className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Top features:</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                          <Check size={16} className="text-slate-900 shrink-0 mt-0.5" strokeWidth={3} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Link
                      href={isCustom ? "/contact-us" : "/signup"}
                      className="block text-center py-3 rounded-lg text-sm font-bold transition-colors w-full"
                      style={{
                        background: plan.highlighted ? "#FF5C73" : "white",
                        color: plan.highlighted ? "white" : "#0F172A",
                        border: plan.highlighted ? "1px solid #FF5C73" : "1px solid #CBD5E1",
                      }}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pb-24 px-6 max-w-5xl mx-auto hidden md:block">
        <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Compare Plans</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 px-6 font-bold text-slate-900 text-sm w-2/5">Feature</th>
                <th className="py-4 px-6 font-bold text-slate-900 text-sm text-center w-1/5">Starter</th>
                <th className="py-4 px-6 font-bold text-[#FF5C73] text-sm text-center w-1/5">Professional</th>
                <th className="py-4 px-6 font-bold text-slate-900 text-sm text-center w-1/5">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium text-sm">
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Members</td>
                <td className="py-4 px-6 text-center">100</td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">Unlimited</td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Attendance Tracking</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Payment Tracking</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Trainer Management</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Renewal Automation</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">WhatsApp Shortcuts</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Custom Domain</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Lead Tracking</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Advanced Reports</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Multi-Location Support</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-6">Priority Support</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
              <tr>
                <td className="py-4 px-6">API Access</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center text-slate-300">-</td>
                <td className="py-4 px-6 text-center"><Check size={18} className="mx-auto text-slate-800" strokeWidth={2.5} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 bg-white border-y border-slate-200 text-center relative z-10">
        <div className="max-w-5xl mx-auto px-6">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Enterprise-Grade Security</h3>
           <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-slate-700 font-semibold text-sm">
              <span className="flex items-center gap-2"><ShieldCheck className="text-slate-800" size={18} /> Encrypted Bank Grade Security</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-slate-800" size={18} /> Secure cloud backups</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-slate-800" size={18} /> Role-based access</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-slate-800" size={18} /> Daily database backups</span>
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
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,92,115,0.15),transparent_60%)]" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black">
            Ready to run your gym smarter?
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto">
            Manage members, payments, attendance, websites, and trainers from a single platform.
          </p>
          <div className="pt-4 flex flex-col items-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold text-white transition-all hover:bg-rose-500 mb-6"
              style={{
                background: "#FF5C73",
              }}
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
