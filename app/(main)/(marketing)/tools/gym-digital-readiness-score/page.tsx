"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Target, CheckCircle2, XCircle, ArrowLeft, RefreshCcw } from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: { label: string; value: number; explanation: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "website",
    text: "Do you have a professional website for your gym?",
    options: [
      { label: "Yes, fully functional with membership plans", value: 20, explanation: "Having a website is a core pillar of modern gym marketing." },
      { label: "Just an Instagram/Facebook page", value: 5, explanation: "Social media is great, but a dedicated website builds trust and captures direct leads." },
      { label: "No online presence", value: 0, explanation: "Without a website, you are losing potential members to competitors." }
    ]
  },
  {
    id: "payments",
    text: "How do you collect member payments?",
    options: [
      { label: "Automated online links (UPI/Cards)", value: 20, explanation: "Online payments reduce friction and improve cash flow." },
      { label: "Manual UPI QR scanning at desk", value: 10, explanation: "UPI is good, but tracking manual payments takes time and causes errors." },
      { label: "Cash only", value: 0, explanation: "Cash-only restricts members and makes accounting a nightmare." }
    ]
  },
  {
    id: "attendance",
    text: "How do you track member attendance?",
    options: [
      { label: "Biometric or QR code app", value: 20, explanation: "Digital attendance prevents proxy entries and tracks member engagement." },
      { label: "Excel spreadsheet", value: 10, explanation: "Excel is a start, but it doesn't scale as your gym grows." },
      { label: "Paper register or nothing", value: 0, explanation: "Paper registers are easily lost and provide zero analytics." }
    ]
  },
  {
    id: "reminders",
    text: "How do you handle membership renewals?",
    options: [
      { label: "Automated WhatsApp/SMS reminders", value: 20, explanation: "Automated reminders significantly decrease membership drop-offs." },
      { label: "Staff calls them manually", value: 10, explanation: "Manual calls are good but prone to human error and delays." },
      { label: "We wait for members to pay", value: 0, explanation: "Waiting for members guarantees lost revenue from forgotten renewals." }
    ]
  },
  {
    id: "leads",
    text: "How do you manage new inquiries (leads)?",
    options: [
      { label: "CRM software with follow-up stages", value: 20, explanation: "A CRM ensures no lead falls through the cracks." },
      { label: "Noting down in a diary or phone", value: 5, explanation: "Manual notes make systematic follow-ups nearly impossible." },
      { label: "I don't track them", value: 0, explanation: "Not tracking leads means throwing marketing money away." }
    ]
  }
];

export default function GymReadinessScore() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is intro
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleStart = () => {
    setCurrentStep(0);
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
    
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setCurrentStep(QUESTIONS.length); // Results step
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentStep(-1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(-1);
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const getScoreMessage = () => {
    if (totalScore >= 80) return { title: "Excellent!", color: "text-emerald-500", desc: "Your gym is highly digitized and ready for massive scale." };
    if (totalScore >= 50) return { title: "On Track", color: "text-blue-500", desc: "You have a good foundation, but manual tasks are holding you back." };
    return { title: "Needs Work", color: "text-rose-500", desc: "Your gym relies heavily on manual work, risking revenue leaks and high admin overhead." };
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-24 flex items-center justify-center">
        
        {currentStep === -1 && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6 shadow-sm">
                <Target size={40} />
             </div>
             <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Gym Digital Readiness Score</h1>
                <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                  Is your gym running smoothly, or are you losing money to manual work? Take this 2-minute quiz to find out.
                </p>
             </div>
             <button onClick={handleStart} className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full text-base font-black uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#FF5C73]/20" style={{ background: "#FF5C73" }}>
               Start Assessment <ArrowRight size={18} />
             </button>
             <p className="text-sm font-bold text-slate-400">100% Free • No Email Required</p>
          </div>
        )}

        {currentStep >= 0 && currentStep < QUESTIONS.length && (
          <div className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
             <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-8">
               <ArrowLeft size={16} /> Back
             </button>
             
             <div className="mb-8">
               <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-3">
                 <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                 <span>{Math.round(((currentStep) / QUESTIONS.length) * 100)}%</span>
               </div>
               <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-[#FF5C73] transition-all duration-500" style={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }} />
               </div>
             </div>

             <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">{QUESTIONS[currentStep].text}</h2>
             
             <div className="space-y-4">
               {QUESTIONS[currentStep].options.map((option, index) => {
                 const isSelected = answers[QUESTIONS[currentStep].id] === option.value;
                 return (
                   <button
                     key={index}
                     onClick={() => handleAnswer(QUESTIONS[currentStep].id, option.value)}
                     className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${isSelected ? 'border-[#FF5C73] bg-rose-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                   >
                     <span className={`font-bold text-base ${isSelected ? 'text-rose-900' : 'text-slate-700 group-hover:text-slate-900'}`}>{option.label}</span>
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#FF5C73]' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-[#FF5C73] rounded-full" />}
                     </div>
                   </button>
                 );
               })}
             </div>
          </div>
        )}

        {isCalculating && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
             <div className="w-16 h-16 border-4 border-slate-200 border-t-[#FF5C73] rounded-full animate-spin mx-auto" />
             <h2 className="text-2xl font-black text-slate-900">Calculating your score...</h2>
             <p className="text-slate-500 font-medium">Analyzing your digital infrastructure.</p>
          </div>
        )}

        {currentStep === QUESTIONS.length && !isCalculating && (
          <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8 sm:p-12 animate-in slide-in-from-bottom-8 duration-700">
             
             <div className="text-center mb-12">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Your Score</p>
                <div className="flex items-end justify-center gap-2 mb-4">
                   <span className="text-7xl font-black text-slate-900 leading-none">{totalScore}</span>
                   <span className="text-3xl font-bold text-slate-400 mb-2">/ 100</span>
                </div>
                <h2 className={`text-2xl font-black ${getScoreMessage().color} mb-2`}>{getScoreMessage().title}</h2>
                <p className="text-slate-600 font-medium max-w-lg mx-auto">{getScoreMessage().desc}</p>
             </div>

             <hr className="border-slate-100 mb-12" />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
               <div>
                  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" /> Strengths</h3>
                  <ul className="space-y-4">
                    {QUESTIONS.map(q => {
                      const ansVal = answers[q.id] || 0;
                      if (ansVal === 20) {
                         const option = q.options.find(o => o.value === 20);
                         return (
                           <li key={q.id} className="flex items-start gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                             <p className="text-sm text-slate-700 font-medium">{option?.explanation}</p>
                           </li>
                         );
                      }
                      return null;
                    })}
                    {Object.values(answers).every(v => v < 20) && (
                      <p className="text-sm text-slate-500 font-medium italic">You have massive room for digital growth!</p>
                    )}
                  </ul>
               </div>
               
               <div>
                  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><XCircle className="text-rose-500" /> Needs Improvement</h3>
                  <ul className="space-y-4">
                    {QUESTIONS.map(q => {
                      const ansVal = answers[q.id] || 0;
                      if (ansVal < 20) {
                         const option = q.options.find(o => o.value === ansVal);
                         return (
                           <li key={q.id} className="flex items-start gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                             <p className="text-sm text-slate-700 font-medium">{option?.explanation}</p>
                           </li>
                         );
                      }
                      return null;
                    })}
                    {Object.values(answers).every(v => v === 20) && (
                      <p className="text-sm text-slate-500 font-medium italic">Your gym is perfectly optimized.</p>
                    )}
                  </ul>
               </div>
             </div>

             <div className="bg-slate-950 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF5C73] rounded-full blur-[60px] opacity-20" />
               <h3 className="text-2xl font-black text-white mb-4 relative z-10">Recommended Next Step</h3>
               <p className="text-slate-300 font-medium mb-8 max-w-xl mx-auto relative z-10">
                 Stop losing money to manual processes. GMMX provides you with a free website, automated payments, and attendance tracking out of the box.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                 <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl text-sm font-black uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#FF5C73]/20" style={{ background: "#FF5C73" }}>
                   Start Free Trial <ArrowRight size={16} />
                 </Link>
                 <button onClick={handleReset} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl text-sm font-black uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 transition-all">
                   <RefreshCcw size={16} /> Retake Quiz
                 </button>
               </div>
             </div>

          </div>
        )}

      </div>
    </div>
  );
}
