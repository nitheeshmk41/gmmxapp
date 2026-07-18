"use client";

import { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Zap, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import RazorpayCheckout from "./RazorpayCheckout";
import { useRouter } from "next/navigation";

interface BillingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  period: "monthly" | "yearly";
  gym: any;
  isTrial: boolean;
  daysLeft: number;
}

export function BillingSummaryModal({
  isOpen,
  onClose,
  planName,
  price,
  period,
  gym,
  isTrial,
  daysLeft,
}: BillingSummaryModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const gst = Math.round(price * 0.18);
  const total = price + gst;
  const displayName = planName.charAt(0).toUpperCase() + planName.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Billing Summary</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review your upgrade</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Current Plan</span>
              <span className="text-slate-900 dark:text-white px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Starter</span>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-500 dark:text-slate-400">New Plan</span>
              <span className="text-[#FF5C73] px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center gap-1">
                <Zap size={14} /> {displayName}
              </span>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Pricing breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Amount ({period})</span>
                <span className="text-slate-900 dark:text-white font-bold">₹{price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">GST (18%)</span>
                <span className="text-slate-900 dark:text-white font-bold">₹{gst}</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹{total}</span>
            </div>

            {/* Trial / Proration Warning */}
            {isTrial ? (
              <div className="flex gap-3 items-start p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                  Your current trial will end first. The {displayName} plan starts automatically afterwards.
                </p>
              </div>
            ) : (
              <div className="flex gap-2 items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium justify-center">
                <CheckCircle2 size={16} /> Remaining Starter days adjusted
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-in zoom-in spin-in-12 duration-500">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Workspace Upgraded!</h3>
              <p className="text-slate-500 font-medium">You are now on the <strong className="text-[#FF5C73]">{displayName}</strong> plan.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl text-left space-y-3">
              {["Unlimited Members", "Unlimited Trainers", "Custom Domain", "Priority Support"].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500" /> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {!isSuccess ? (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <RazorpayCheckout 
              planName={planName}
              price={total}
              period={period}
              gymId={gym.$id}
              highlighted={true}
              buttonText="Proceed to Payment"
              className="w-full py-4 text-base"
              onSuccess={() => setIsSuccess(true)}
            />
            <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck size={14} /> Secure Encrypted Checkout
            </p>
          </div>
        ) : (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <button 
              onClick={() => {
                router.push("/owner/dashboard/settings/billing");
                router.refresh();
              }}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Go to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
