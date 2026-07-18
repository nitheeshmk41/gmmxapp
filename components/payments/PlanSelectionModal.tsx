"use client";

import { useState } from "react";
import { X, CheckCircle2, Star, Building2 } from "lucide-react";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSelectPlan: (plan: "professional" | "enterprise", period: "monthly" | "yearly") => void;
}

export function PlanSelectionModal({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan
}: PlanSelectionModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upgrade Plan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Current Plan: <span className="capitalize font-bold text-slate-700 dark:text-slate-300">{currentPlan}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex items-center relative">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={`relative z-10 px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                className={`relative z-10 px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
              >
                Yearly <span className="text-[10px] uppercase tracking-wider bg-[#FF5C73] text-white px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
              
              <div 
                className="absolute top-1 bottom-1 bg-white dark:bg-slate-700 rounded-full shadow-sm transition-all duration-300 ease-out"
                style={{ 
                  left: billingCycle === "monthly" ? "4px" : "94px",
                  width: billingCycle === "monthly" ? "86px" : "125px"
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Professional Plan */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#FF5C73] bg-red-50/50 dark:bg-red-900/10 p-5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
              <div className="absolute top-0 right-0 bg-[#FF5C73] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">Professional <Star size={16} className="text-yellow-500 fill-yellow-500" /></h3>
                  <p className="text-sm text-slate-500">For growing fitness businesses</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹{billingCycle === "monthly" ? "999" : "9,990"}</span>
                  <span className="text-xs text-slate-500 block">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                 {["Unlimited Members", "Unlimited Trainers", "AI Assistant", "Priority Support"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={16} className="text-[#FF5C73]" /> {f}
                  </div>
                 ))}
              </div>
              <button 
                onClick={() => onSelectPlan("professional", billingCycle)}
                className="w-full py-3 bg-[#FF5C73] hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-red-500/30"
              >
                Upgrade to Professional
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
                  <p className="text-sm text-slate-500">Multi-branch operations</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white">Custom Pricing</span>
                </div>
              </div>
              <a 
                href="mailto:sales@gmmx.app"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Building2 size={16} className="text-slate-500" /> Contact Sales
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
