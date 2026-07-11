"use client";

import { useState } from "react";
import { AlertTriangle, Clock, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import RazorpayCheckout from "@/components/payments/RazorpayCheckout";

interface TrialBannersProps {
  daysLeft: number;
  isExpired: boolean;
  gymName: string;
  gymId: string;
}

export function TrialBanners({ daysLeft, isExpired, gymName, gymId }: TrialBannersProps) {
  const [showModal, setShowModal] = useState(daysLeft <= 1 && !isExpired);

  if (isExpired) {
    return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-3 shadow-sm relative z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-red-800 font-medium">
            <ShieldAlert size={16} className="text-red-600" />
            <span>Trial Expired. Your workspace is frozen. Upgrade to continue using GMMX.</span>
          </div>
          <Link 
            href="/owner/dashboard/settings/billing/upgrade"
            className="px-4 py-1.5 bg-red-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Day 10 Banner: 4 days or less, but > 1 */}
      {daysLeft <= 4 && daysLeft > 1 && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 shadow-sm relative z-40">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-orange-800 font-medium">
              <Clock size={16} className="text-orange-600" />
              <span>Trial ends in {daysLeft} days. Upgrade now to avoid service interruption.</span>
            </div>
            <Link 
              href="/owner/dashboard/settings/billing/upgrade"
              className="px-4 py-1.5 bg-orange-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      {/* Day 13 Modal: 1 day or 0 days left */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 md:p-8 animate-in zoom-in-95 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-orange-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">{daysLeft === 0 ? "Last day of your trial" : "Your trial ends tomorrow."}</h2>
              <p className="text-slate-500 mt-2 text-sm">Choose a plan.</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-[#FF5C73] bg-red-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">Pro Plan <span className="text-lg">⭐</span></h3>
                  <p className="text-xs text-slate-600 mt-1">Full features + Custom Domain</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-slate-900">₹999<span className="text-xs font-normal text-slate-500">/mo</span></p>
                </div>
              </div>
              
              <RazorpayCheckout 
                planName="professional"
                price={999}
                period="monthly"
                gymId={gymId}
                highlighted={true}
                className="py-4 text-base"
              />
              
              <p className="text-center text-xs text-slate-400 mt-4">
                Or <Link href="/owner/dashboard/settings/billing/upgrade" className="text-blue-500 hover:underline">view all plans</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
