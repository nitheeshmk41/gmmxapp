"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, IndianRupee, Users, Home, TrendingUp, DollarSign } from "lucide-react";

export default function GymProfitCalculator() {
  const [members, setMembers] = useState<number>(100);
  const [monthlyFee, setMonthlyFee] = useState<number>(1500);
  const [ptRevenue, setPtRevenue] = useState<number>(20000);
  const [rent, setRent] = useState<number>(50000);
  const [otherExpenses, setOtherExpenses] = useState<number>(30000);

  const [results, setResults] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
  });

  useEffect(() => {
    const revenue = (members * monthlyFee) + ptRevenue;
    const expenses = rent + otherExpenses;
    const profit = revenue - expenses;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    setResults({
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: profit,
      profitMargin: margin,
    });
  }, [members, monthlyFee, ptRevenue, rent, otherExpenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-slate-950 text-white pt-32 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 mb-2">
            <TrendingUp size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Gym Profit Calculator</h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium">
            Calculate your monthly revenue, expenses, and net profit margins instantly.
          </p>
        </div>
      </section>

      {/* Main Calculator */}
      <section className="py-12 px-6 max-w-5xl mx-auto -mt-12 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="text-blue-500" /> Enter Your Numbers
              </h2>
              
              <div className="space-y-6">
                {/* Revenue Sources */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Revenue Sources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Members</label>
                      <div className="relative">
                         <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input type="number" min="0" value={members} onChange={(e) => setMembers(Number(e.target.value) || 0)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-bold focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Avg. Monthly Fee (₹)</label>
                      <div className="relative">
                         <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input type="number" min="0" value={monthlyFee} onChange={(e) => setMonthlyFee(Number(e.target.value) || 0)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-bold focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Monthly PT Revenue (₹)</label>
                      <div className="relative">
                         <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input type="number" min="0" value={ptRevenue} onChange={(e) => setPtRevenue(Number(e.target.value) || 0)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-bold focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Expenses */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monthly Expenses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rent (₹)</label>
                      <div className="relative">
                         <Home size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input type="number" min="0" value={rent} onChange={(e) => setRent(Number(e.target.value) || 0)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-bold focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Other Expenses (Salaries, EB) (₹)</label>
                      <div className="relative">
                         <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input type="number" min="0" value={otherExpenses} onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-bold focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 bg-slate-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20" />
               <h2 className="text-lg font-black text-white mb-8">Your Profit Projection</h2>
               
               <div className="space-y-6">
                 <div>
                   <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Monthly Revenue</p>
                   <p className="text-3xl font-black">{formatCurrency(results.totalRevenue)}</p>
                 </div>
                 
                 <hr className="border-white/10" />
                 
                 <div>
                   <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Net Profit</p>
                   <p className={`text-4xl font-black ${results.netProfit > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                     {formatCurrency(results.netProfit)}
                   </p>
                 </div>

                 <hr className="border-white/10" />

                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                   <p className="text-slate-300 text-sm font-bold">Net Margin</p>
                   <p className={`text-xl font-black ${results.profitMargin > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                     {results.profitMargin.toFixed(1)}%
                   </p>
                 </div>
               </div>

               <div className="mt-8 pt-8 border-t border-white/10">
                 <p className="text-slate-300 text-sm font-medium mb-4 leading-relaxed">
                   Want to track your revenue, manage members, and reduce expenses automatically?
                 </p>
                 <Link href="/signup" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-wider text-white transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: "#FF5C73" }}>
                   Try GMMX for Free <ArrowRight size={16} />
                 </Link>
               </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* SEO Content Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="prose prose-slate prose-lg max-w-none">
          <h2 className="text-2xl font-black text-slate-900 mb-4">How to Calculate Gym Profit Margin</h2>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            Knowing your gym's profit margin is critical for long-term sustainability. The formula is simple: 
            <strong>(Total Revenue - Total Expenses) = Net Profit</strong>. 
            To find your margin percentage, divide your net profit by your total revenue.
          </p>
          <h3 className="text-xl font-black text-slate-900 mb-3">What is a good profit margin for a gym?</h3>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            A healthy fitness center typically operates with a profit margin between <strong>10% and 30%</strong>. Smaller boutique studios with higher membership fees often see higher margins, whereas large commercial gyms operate on lower margins but higher volume.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <h4 className="text-blue-900 font-bold mb-2">Pro Tip to Increase Profit</h4>
            <p className="text-blue-800 text-sm font-medium">
              The easiest way to increase your gym's profit is by minimizing churn (cancellations). Using a gym management software like GMMX can help you send automated renewal reminders and track attendance drops before a member leaves.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
