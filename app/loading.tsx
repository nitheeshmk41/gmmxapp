"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "Preparing your workspace...",
  "Loading your dashboard...",
  "Syncing your gym data...",
  "Getting everything ready...",
  "Almost there..."
];

export default function RootLoading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showLongWait, setShowLongWait] = useState(false);

  useEffect(() => {
    // Cycle messages every 2.5 seconds
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    
    // Show a longer wait message after 8 seconds
    const timeout = setTimeout(() => {
      setShowLongWait(true);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden z-50">
      {/* Subtle radial pink glow in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5C73] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-sm px-6">
        {/* Animated Brand Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF5C73] to-[#FF3B57] rounded-[14px] flex items-center justify-center shadow-lg shadow-red-500/20">
            <span className="text-white font-bold text-2xl tracking-tighter">G</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">GMMX</span>
        </div>

        {/* Custom Larger Spinner (slower, thicker) */}
        <div className="relative flex justify-center items-center h-12 w-12">
          <svg className="absolute w-full h-full text-slate-100" viewBox="0 0 50 50">
            <circle className="stroke-current" strokeWidth="4" cx="25" cy="25" r="20" fill="none" />
          </svg>
          <svg className="absolute w-full h-full text-[#FF5C73] animate-[spin_1.5s_linear_infinite]" viewBox="0 0 50 50">
            <circle 
              className="stroke-current opacity-90" 
              strokeWidth="4" 
              strokeLinecap="round" 
              cx="25" 
              cy="25" 
              r="20" 
              fill="none" 
              strokeDasharray="90 150" 
              strokeDashoffset="0" 
            />
          </svg>
        </div>

        {/* Dynamic Text */}
        <div className="flex flex-col items-center gap-2 text-center min-h-[60px]">
          <span 
            key={messageIndex} 
            className="text-sm font-medium text-slate-500 animate-in fade-in slide-in-from-bottom-1 duration-500"
          >
            {loadingMessages[messageIndex]}
          </span>
          
          {/* Long wait fallback */}
          {showLongWait && (
            <span className="text-xs text-slate-400 animate-in fade-in duration-700">
              This is taking a bit longer than usual...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
