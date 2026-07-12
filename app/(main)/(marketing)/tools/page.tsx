"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calculator, Activity, CheckSquare, Target, TrendingUp, Users, Smartphone, Search, FileText } from "lucide-react";

type ToolItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isNew?: boolean;
  comingSoon?: boolean;
  color: string;
};

type ToolCategory = {
  category: string;
  items: ToolItem[];
};

export default function ToolsHubPage() {
  const tools: ToolCategory[] = [
    {
      category: "Must-Have Tools",
      items: [
        {
          title: "Gym Digital Readiness Score",
          description: "Find out if your gym is built for modern success. Get a personalized readiness score.",
          icon: <Target className="text-emerald-500" size={24} />,
          href: "/tools/gym-digital-readiness-score",
          isNew: true,
          color: "bg-emerald-50 border-emerald-200 hover:border-emerald-500",
        },
        {
          title: "Gym Profit Calculator",
          description: "Calculate your monthly and annual gym profit margins.",
          icon: <TrendingUp className="text-blue-500" size={24} />,
          href: "/tools/gym-profit-calculator",
          color: "bg-blue-50 border-blue-200 hover:border-blue-500",
        },
        {
          title: "Gym ROI Calculator",
          description: "Evaluate the return on investment for your gym business.",
          icon: <Calculator className="text-indigo-500" size={24} />,
          href: "/tools/gym-roi-calculator",
          color: "bg-indigo-50 border-indigo-200 hover:border-indigo-500",
        }
      ]
    },
    {
      category: "Fitness & Member Tools",
      items: [
        {
          title: "BMI Calculator",
          description: "Check Body Mass Index quickly and easily.",
          icon: <Activity className="text-rose-500" size={24} />,
          href: "/tools/bmi-calculator",
          color: "bg-rose-50 border-rose-200 hover:border-rose-500",
        },
        {
          title: "Calorie Calculator",
          description: "Estimate daily calorie needs for bulking or cutting.",
          icon: <Activity className="text-orange-500" size={24} />,
          href: "#",
          comingSoon: true,
          color: "bg-orange-50 border-orange-200",
        }
      ]
    },
    {
      category: "Generators & Resources",
      items: [
        {
          title: "Membership Agreement Generator",
          description: "Generate professional membership PDFs in seconds.",
          icon: <FileText className="text-purple-500" size={24} />,
          href: "#",
          comingSoon: true,
          color: "bg-purple-50 border-purple-200",
        },
        {
          title: "QR Code Generator",
          description: "Generate check-in QR codes for your gym members.",
          icon: <Smartphone className="text-slate-500" size={24} />,
          href: "#",
          comingSoon: true,
          color: "bg-slate-50 border-slate-200",
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header Section */}
      <section className="relative text-white min-h-[350px] flex flex-col justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        <Image
          src="/gym_assert1.jpg"
          alt="Gym Background"
          fill
          priority
          quality={75}
          className="object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            Free Tools for <span className="text-[#FF5C73]">Gym Owners</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Calculators, generators, and assessments designed to help you run a more profitable fitness business.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10 -mt-10">
        <div className="space-y-16">
          {tools.map((section, index) => (
            <div key={index} className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                {section.category}
                <div className="h-px bg-slate-200 flex-1 ml-4" />
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((tool, toolIndex) => (
                  tool.comingSoon ? (
                    <div key={toolIndex} className={`p-6 rounded-3xl border transition-all relative overflow-hidden bg-white border-slate-200 opacity-60 grayscale-[50%]`}>
                       <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 mb-4">
                          {tool.icon}
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed">{tool.description}</p>
                       <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                         Coming Soon
                       </div>
                    </div>
                  ) : (
                    <Link key={toolIndex} href={tool.href} className={`p-6 rounded-3xl border transition-all duration-300 relative group bg-white shadow-sm hover:shadow-xl ${tool.color}`}>
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${tool.color.split(' ')[0]}`}>
                          {tool.icon}
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">{tool.description}</p>
                       
                       <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-[#FF5C73] transition-colors mt-auto">
                         Try Tool <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                       </div>

                       {tool.isNew && (
                         <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm animate-pulse">
                           New
                         </div>
                       )}
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-24 p-10 sm:p-16 rounded-[2rem] bg-slate-950 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C73] rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2" />
           
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
             <h2 className="text-3xl sm:text-4xl font-black text-white">Ready to automate your gym?</h2>
             <p className="text-slate-300 text-lg font-medium">GMMX helps you manage members, track payments, and grow your fitness business from a single dashboard.</p>
             <div className="pt-4">
               <Link href="/signup" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full text-base font-black uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95" style={{ background: "#FF5C73", boxShadow: "0 4px 12px rgba(255,92,115,0.3)" }}>
                 Start Free Trial <ArrowRight size={18} />
               </Link>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
