"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Activity, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    calculateBMI();
  }, [weight, height]);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to meters

    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h);
      setBmi(parseFloat(bmiValue.toFixed(1)));
      
      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue >= 18.5 && bmiValue < 25) setCategory("Normal weight");
      else if (bmiValue >= 25 && bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
    } else {
      setBmi(null);
      setCategory("");
    }
  };

  const getGaugeColor = (cat: string) => {
    switch (cat) {
      case "Underweight": return "bg-blue-400";
      case "Normal weight": return "bg-emerald-500";
      case "Overweight": return "bg-amber-500";
      case "Obese": return "bg-rose-500";
      default: return "bg-slate-200";
    }
  };
  
  const getPositionPercent = (bmiVal: number) => {
    // clamp between 15 and 40 for visual scale
    const clamped = Math.max(15, Math.min(bmiVal, 40));
    return ((clamped - 15) / (40 - 15)) * 100;
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
            "name": "Free BMI Calculator",
            "operatingSystem": "Web",
            "applicationCategory": "HealthAndFitnessApplication",
            "description": "Calculate your Body Mass Index (BMI) instantly with our free online tool.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-2xl mb-4 text-[#FF5C73]">
            <Activity size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Free BMI Calculator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Quickly check your Body Mass Index to see if you're in a healthy weight range. 
            Perfect for fitness tracking.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100 mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Height (cm)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73]"
                    placeholder="e.g. 175"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Weight (kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73]"
                    placeholder="e.g. 70"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center bg-slate-50 rounded-2xl p-8 border border-slate-100 relative overflow-hidden">
              {bmi ? (
                <div className="text-center relative z-10">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Your BMI is</p>
                  <h2 className="text-6xl font-black text-slate-900 mb-2">{bmi}</h2>
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold text-white ${getGaugeColor(category)}`}>
                    {category}
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <p className="font-medium">Enter your height and weight to see your result.</p>
                </div>
              )}
            </div>
          </div>

          {/* BMI Visual Scale */}
          {bmi && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="w-[18.5%] h-full bg-blue-400" />
                <div className="w-[26%] h-full bg-emerald-500" /> {/* 18.5 to 25 */}
                <div className="w-[20%] h-full bg-amber-500" /> {/* 25 to 30 */}
                <div className="flex-1 h-full bg-rose-500" /> {/* 30+ */}
              </div>
              <div className="relative h-6 mt-2 text-[10px] font-bold text-slate-400 hidden sm:block">
                <span className="absolute left-[18.5%] -translate-x-1/2">18.5</span>
                <span className="absolute left-[44.5%] -translate-x-1/2">25</span>
                <span className="absolute left-[64.5%] -translate-x-1/2">30</span>
              </div>
              
              <div className="relative h-6 -mt-8">
                <motion.div 
                  initial={{ left: "0%" }}
                  animate={{ left: `${getPositionPercent(bmi)}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="absolute top-0 -translate-x-1/2 -mt-4"
                >
                  <div className="w-4 h-4 bg-white border-4 border-slate-900 rounded-full shadow-lg" />
                </motion.div>
              </div>
            </div>
          )}

        </div>

        {/* Marketing CTA */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Activity size={120} className="text-white" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 relative z-10">Running a gym or fitness center?</h3>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto relative z-10">
            Track member progress, automate billing, and launch your gym website in minutes with GMMX.
          </p>
          <Link 
            href="/onboarding" 
            className="inline-flex items-center gap-2 bg-[#FF5C73] hover:bg-rose-500 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-rose-500/30 relative z-10"
          >
            Start Your Free Trial <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
