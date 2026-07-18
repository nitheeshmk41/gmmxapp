"use client";

import { useState } from "react";
import { CheckCircle2, Building2, Zap, Star, ShieldCheck, Check } from "lucide-react";
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";
import { BillingSummaryModal } from "@/components/payments/BillingSummaryModal";

export default function PricingClient({ gym, isTrial, daysLeft }: { gym: any, isTrial: boolean, daysLeft: number }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"professional" | "enterprise" | null>(null);

  const starterPrice = billingCycle === "monthly" ? 499 : 4990;
  const proPrice = billingCycle === "monthly" ? 999 : 9990;

  return (
    <div className="relative min-h-screen -mt-6 -mx-6 p-6 sm:p-10 bg-slate-50 dark:bg-[#0B1120] overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#FF5C73]/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-20">
        
        {/* Header Section */}
        <div className="text-center space-y-4 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/20 text-[#FF5C73] text-sm font-bold tracking-wide uppercase border border-red-200 dark:border-red-900/30">
            <Zap size={16} fill="currentColor" /> 14-Day Free Trial
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Plans that scale with you
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            No credit card required. Cancel anytime. Choose the perfect plan for your fitness business and unlock your full potential.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full flex items-center relative">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 flex items-center gap-2 ${billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                Yearly <span className="text-[10px] uppercase tracking-wider bg-[#FF5C73] text-white px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
              
              {/* Toggle slider bg */}
              <div 
                className="absolute top-1 bottom-1 w-[100px] bg-white dark:bg-slate-700 rounded-full shadow-sm transition-all duration-300 ease-out"
                style={{ 
                  left: billingCycle === "monthly" ? "4px" : "104px",
                  width: billingCycle === "monthly" ? "96px" : "140px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start max-w-5xl mx-auto mt-8">
          
          {/* Starter Plan */}
          <div className="bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative z-0 group">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 h-10">Perfect for new gyms just getting started.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">₹{starterPrice}</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>
            
            <div className="space-y-4 mb-10 flex-1">
              {[
                "Up to 200 Members",
                "Up to 5 Trainers",
                "Gym Website (Subdomain)",
                "Basic Attendance Tracking",
                "Standard Email Support"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto">
              <button disabled className="w-full py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold border-2 border-emerald-100 dark:border-emerald-800/30 cursor-not-allowed transition-all flex justify-center items-center gap-2 group-hover:shadow-md">
                <CheckCircle2 size={18} /> Current Plan
              </button>
            </div>
          </div>

          {/* Professional Plan (Highlighted) */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] border border-slate-800 dark:border-slate-800 p-10 shadow-2xl flex flex-col relative z-10 transform md:-translate-y-6 shadow-[#FF5C73]/20 hover:shadow-[#FF5C73]/40 transition-all duration-500 overflow-hidden ring-1 ring-white/10">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C73] rounded-full blur-[80px] opacity-30 -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 hover:opacity-50"></div>
            
            <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
              <div className="bg-gradient-to-r from-[#FF5C73] to-[#FF8B9A] text-white text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-red-500/30 border border-white/20 flex items-center gap-1.5">
                <Star size={14} fill="currentColor" /> Most Popular
              </div>
            </div>
            
            <div className="mb-6 relative z-10 mt-4">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-sm text-slate-400 h-10">Best for growing gyms that need more power.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1 relative z-10">
              <span className="text-6xl font-black text-white tracking-tight transition-all duration-300">₹{proPrice}</span>
              <span className="text-sm font-bold text-slate-400">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>
            
            <div className="space-y-4 mb-10 flex-1 relative z-10">
              {[
                "Unlimited Members",
                "Unlimited Trainers",
                "Custom Domain Connection",
                "Advanced Reports & Analytics",
                "AI Assistant Features",
                "Priority 24/7 Support"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF5C73]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-[#FF5C73]" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-slate-100">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto relative z-10">
                <button 
                  onClick={() => {
                    setSelectedPlan("professional");
                    setIsModalOpen(true);
                  }}
                  className="w-full py-4 text-lg bg-[#FF5C73] hover:bg-red-500 text-white shadow-xl shadow-[#FF5C73]/30 hover:scale-[1.02] active:scale-[0.98] rounded-2xl transition-all font-bold"
                >
                  Upgrade Now
                </button>
                <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck size={14} /> Secure Razorpay Checkout
                </p>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/60 backdrop-blur-xl dark:bg-slate-900/60 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative z-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 h-10">For multi-branch gyms and franchises.</p>
            </div>
            <div className="mb-8 flex items-baseline h-[60px] items-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Custom Pricing</span>
            </div>
            
            <div className="space-y-4 mb-10 flex-1">
              {[
                "Everything in Professional",
                "Multi-Branch Dashboard",
                "Dedicated Account Manager",
                "Custom Integrations",
                "Migration Support",
                "Volume Discounts"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-blue-600 dark:text-blue-400" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto">
              <a 
                href="mailto:sales@gmmx.app"
                className="flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center group"
              >
                <Building2 size={18} className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" /> Contact Sales
              </a>
            </div>
          </div>

        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-5xl mx-auto mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">Compare Features</h2>
          
          <div className="overflow-x-auto pb-6">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 font-bold text-slate-900 dark:text-white w-1/3 text-lg">Features</th>
                  <th className="py-4 font-bold text-slate-900 dark:text-white text-center">Starter</th>
                  <th className="py-4 font-bold text-[#FF5C73] text-center text-lg">Professional</th>
                  <th className="py-4 font-bold text-slate-900 dark:text-white text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {[
                  { name: "Members", starter: "Up to 200", pro: "Unlimited", ent: "Unlimited" },
                  { name: "Trainers", starter: "Up to 5", pro: "Unlimited", ent: "Unlimited" },
                  { name: "Attendance", starter: "Basic", pro: "Advanced QR", ent: "Biometric Integration" },
                  { name: "Payments", starter: "Cash/UPI", pro: "Razorpay Checkout", ent: "Custom Gateways" },
                  { name: "Reports", starter: "Basic", pro: "Advanced & Custom", ent: "Multi-Branch Rollups" },
                  { name: "API Access", starter: "❌", pro: "❌", ent: "✅" },
                  { name: "White Label", starter: "❌", pro: "❌", ent: "✅" },
                  { name: "Support", starter: "Email", pro: "Priority 24/7", ent: "Dedicated SLA" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">{row.name}</td>
                    <td className="py-4 text-center text-slate-600 dark:text-slate-400 font-medium">{row.starter}</td>
                    <td className="py-4 text-center font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/20">{row.pro}</td>
                    <td className="py-4 text-center text-slate-600 dark:text-slate-400 font-medium">{row.ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Social Proof & FAQs */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by 150+ Fitness Businesses</p>
          <div className="flex justify-center gap-1 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">4.9/5 Average Rating</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-16 border-t border-slate-200 dark:border-slate-800 pt-16">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Can I upgrade or downgrade later?</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Yes, absolutely. You can upgrade, downgrade, or cancel your plan at any time right from your dashboard. Prorated charges will apply automatically.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">What happens after my trial ends?</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">You will be automatically downgraded to our free limits. No data will be lost, but premium features will be locked until you subscribe.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Do you provide GST invoices?</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Yes, GST invoices are automatically generated and emailed to you for every successful payment. You can also download them from the Billing section.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">What is your refund policy?</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">We offer a 7-day money-back guarantee on all our paid plans. If you are not satisfied, simply contact support for a full refund.</p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Billing Summary Modal */}
      {selectedPlan && (
        <BillingSummaryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan}
          price={selectedPlan === "professional" ? proPrice : 0}
          period={billingCycle}
          gym={gym}
          isTrial={isTrial}
          daysLeft={daysLeft}
        />
      )}
    </div>
  );
}
