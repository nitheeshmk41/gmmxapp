import { CheckCircle2, Building2 } from "lucide-react";
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";
import { getCurrentGym } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function UpgradePage() {
  const gym = await getCurrentGym();
  if (!gym) redirect("/owner/login");

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-3">Upgrade your workspace</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Choose the plan that fits your gym's growth. Upgrade anytime to unlock unlimited members, trainers, and advanced features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col transition-transform hover:-translate-y-1">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
            <p className="text-sm text-slate-500 min-h-[40px]">Perfect for new gyms just getting started.</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-slate-900">₹499</span>
            <span className="text-sm font-medium text-slate-500">/month</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {[
              "Up to 200 Members",
              "Up to 5 Trainers",
              "Gym Website (GMMX subdomain)",
              "Basic Support"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button disabled className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold border border-slate-200 cursor-not-allowed">
              Current Plan
            </button>
          </div>
        </div>

        {/* Professional Plan */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl flex flex-col relative transform md:-translate-y-4 shadow-[#FF5C73]/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5C73] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF5C73] to-orange-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
            Most Popular
          </div>
          
          <div className="mb-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Professional <span className="text-xl">⭐</span></h3>
            <p className="text-sm text-slate-400 min-h-[40px]">Everything you need to scale your gym.</p>
          </div>
          <div className="mb-6 relative z-10">
            <span className="text-4xl font-black text-white">₹999</span>
            <span className="text-sm font-medium text-slate-400">/month</span>
          </div>
          <div className="space-y-4 mb-8 flex-1 relative z-10">
            {[
              "Unlimited Members",
              "Unlimited Trainers",
              "Custom Domain Connection",
              "Advanced Reports & Analytics",
              "AI Features",
              "Priority Support"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#FF5C73] mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{feature}</span>
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
                className="py-4 text-base"
              />
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col transition-transform hover:-translate-y-1">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
            <p className="text-sm text-slate-500 min-h-[40px]">For multi-branch gyms and franchises.</p>
          </div>
          <div className="mb-6 flex items-center h-[40px]">
            <span className="text-2xl font-black text-slate-900">Custom Pricing</span>
          </div>
          <div className="space-y-4 mb-8 flex-1">
            {[
              "Everything in Professional",
              "Multi-Branch Support",
              "API Access",
              "Dedicated Account Manager",
              "Custom Integrations"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <a 
              href="mailto:sales@gmmx.app"
              className="block w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-center"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
