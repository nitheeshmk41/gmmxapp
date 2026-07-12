"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function GymROICalculatorPage() {
  const [members, setMembers] = useState<string>("200");
  const [avgFee, setAvgFee] = useState<string>("1500");
  const [expenses, setExpenses] = useState<string>("100000");
  const [churnRate, setChurnRate] = useState<string>("10"); // percent
  
  // Results
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [lostRevenue, setLostRevenue] = useState(0);
  const [gmmxSavings, setGmmxSavings] = useState(0);

  useEffect(() => {
    calculateROI();
  }, [members, avgFee, expenses, churnRate]);

  const calculateROI = () => {
    const m = parseInt(members) || 0;
    const fee = parseInt(avgFee) || 0;
    const exp = parseInt(expenses) || 0;
    const churn = parseInt(churnRate) || 0;

    const monthlyGross = m * fee;
    const monthlyLost = Math.floor((m * (churn / 100)) * fee);
    const monthlyNet = monthlyGross - exp;

    // GMMX reduces churn by approx 50% through automated reminders and follow-ups
    const savedFromChurn = Math.floor(monthlyLost * 0.5); 
    const gmmxCost = 999;
    const totalGmmxValue = savedFromChurn - gmmxCost;

    setGrossRevenue(monthlyGross);
    setNetProfit(monthlyNet);
    setLostRevenue(monthlyLost);
    setGmmxSavings(totalGmmxValue);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Script for JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Gym ROI Calculator",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "description": "Calculate your gym's return on investment and discover how much revenue you can save by switching to GMMX.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4 text-emerald-600">
            <Calculator size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Gym ROI Calculator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Calculate your true profit margins and see exactly how much revenue you're losing to member churn every month.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100 mb-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Inputs */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Your Gym's Metrics</h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Total Active Members</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Average Monthly Fee (₹)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={avgFee}
                    onChange={(e) => setAvgFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Total Monthly Expenses (Rent, Salary, etc)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Churn Rate (%)</label>
                <p className="text-xs text-slate-500 mb-2">The percentage of members who forget to renew or leave each month.</p>
                <div className="relative">
                  <input 
                    type="number" 
                    value={churnRate}
                    onChange={(e) => setChurnRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Estimated Monthly Outlook</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gross Revenue</p>
                  <p className="text-2xl font-black text-slate-900">{formatCurrency(grossRevenue)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Net Profit</p>
                  <p className={`text-2xl font-black ${netProfit >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                    {formatCurrency(netProfit)}
                  </p>
                </div>
              </div>

              <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                    <DollarSign size={16} />
                  </div>
                  <p className="text-sm font-bold text-rose-900">Revenue Lost to Churn</p>
                </div>
                <p className="text-3xl font-black text-rose-600 mb-1">{formatCurrency(lostRevenue)} <span className="text-sm font-medium text-rose-400">/ month</span></p>
                <p className="text-xs text-rose-500/80 font-medium">This is money walking out your door because of missed renewals.</p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 p-6 rounded-2xl shadow-xl mt-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp size={80} className="text-emerald-400" />
                </div>
                
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 relative z-10">The GMMX Impact</h4>
                <p className="text-white text-sm leading-relaxed mb-4 relative z-10">
                  By automating renewal reminders and offering online payments, GMMX typically cuts churn in half.
                </p>
                
                <div className="bg-white/10 rounded-xl p-4 border border-white/5 relative z-10">
                  <p className="text-xs text-slate-300 font-medium mb-1">Estimated Monthly ROI (After ₹999 subscription)</p>
                  <p className="text-3xl font-black text-emerald-400">
                    +{formatCurrency(gmmxSavings)}
                  </p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Marketing CTA */}
        <div className="text-center">
          <Link 
            href="/onboarding" 
            className="inline-flex items-center gap-2 bg-[#FF5C73] hover:bg-rose-500 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-rose-500/30"
          >
            Stop Losing Revenue. Try GMMX Today <ArrowRight size={18} />
          </Link>
          <p className="text-slate-500 text-sm mt-4">14-day free trial. No credit card required.</p>
        </div>

      </div>
    </div>
  );
}
