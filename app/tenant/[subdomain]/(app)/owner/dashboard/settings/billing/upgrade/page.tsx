import { CheckCircle2, Building2, Zap, Star, ShieldCheck } from "lucide-react";
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";
import { getCurrentGym } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function UpgradePage() {
  const gym = await getCurrentGym();
  if (!gym) redirect("/owner/login");

  return (
    <div className="relative min-h-screen -mt-6 -mx-6 p-6 sm:p-10 bg-slate-50 dark:bg-[#0B1120] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#FF5C73]/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-20">
        
        {/* Header Section */}
        <div className="text-center space-y-4 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/20 text-[#FF5C73] text-sm font-bold tracking-wide uppercase border border-red-200 dark:border-red-900/30">
            <Zap size={16} fill="currentColor" /> Upgrade Workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Plans that scale with you
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your fitness business. Upgrade anytime to unlock unlimited members, trainers, and advanced features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start max-w-5xl mx-auto mt-8">
          
          {/* Starter Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative z-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 h-10">Perfect for new gyms just getting started.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">₹499</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">/mo</span>
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
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto">
              <button disabled className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl font-bold border-2 border-transparent cursor-not-allowed transition-all">
                Your Current Plan
              </button>
            </div>
          </div>

          {/* Professional Plan (Highlighted) */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] border border-slate-800 dark:border-slate-800 p-10 shadow-2xl flex flex-col relative z-10 transform md:-translate-y-6 shadow-[#FF5C73]/20 overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C73] rounded-full blur-[80px] opacity-30 -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
              <div className="bg-gradient-to-r from-[#FF5C73] to-[#FF8B9A] text-white text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-red-500/30 border border-white/20 flex items-center gap-1.5">
                <Star size={14} fill="currentColor" /> Most Popular
              </div>
            </div>
            
            <div className="mb-6 relative z-10 mt-4">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-sm text-slate-400 h-10">Everything you need to scale your fitness business.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1 relative z-10">
              <span className="text-6xl font-black text-white tracking-tight">₹999</span>
              <span className="text-sm font-bold text-slate-400">/mo</span>
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
                  <div className="w-6 h-6 rounded-full bg-[#FF5C73]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} className="text-[#FF5C73]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-100">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto relative z-10">
                <RazorpayCheckout 
                  planName="professional"
                  price={999}
                  period="monthly"
                  gymId={gym.$id}
                  highlighted={true}
                  className="py-4 text-lg shadow-xl shadow-[#FF5C73]/30 hover:scale-[1.02] active:scale-[0.98] rounded-2xl"
                />
                <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck size={14} /> Secure Razorpay Checkout
                </p>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative z-0">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 h-10">For multi-branch gyms and franchises.</p>
            </div>
            <div className="mb-8 flex items-baseline h-[60px] items-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Custom</span>
            </div>
            
            <div className="space-y-4 mb-10 flex-1">
              {[
                "Everything in Professional",
                "Multi-Branch Dashboard",
                "API & Webhook Access",
                "Dedicated Account Manager",
                "Custom Integrations",
                "White-label Options"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto">
              <a 
                href="mailto:sales@gmmx.app"
                className="flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center"
              >
                <Building2 size={18} /> Contact Sales
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
