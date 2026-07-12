"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, Send, Bot, RefreshCcw } from "lucide-react";
import { submitMarketingLead } from "@/app/(main)/(marketing)/contact-us/actions";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string | React.ReactNode;
};

type ChatOption = {
  label: string;
  action: () => void;
  primary?: boolean;
};

export function GmmxAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<ChatOption[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Widget states
  const [bubbleState, setBubbleState] = useState<"icon_only" | "message" | "collapsed">("icon_only");
  
  // Lead capture state
  const [leadMode, setLeadMode] = useState<"none" | "email" | "gymName">("none");
  const [leadData, setLeadData] = useState({ email: "", gymName: "", intent: "" });
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, options, isTyping]);

  // Handle Bubble State (expand once, then collapse)
  useEffect(() => {
    if (!isOpen && bubbleState === "icon_only") {
      const timer1 = setTimeout(() => setBubbleState("message"), 7000); // Wait 7s before showing popup
      return () => clearTimeout(timer1);
    }
  }, [isOpen, bubbleState]);

  useEffect(() => {
    if (bubbleState === "message" && !isOpen) {
      const timer2 = setTimeout(() => setBubbleState("collapsed"), 5000); // Show popup for 5s then collapse
      return () => clearTimeout(timer2);
    }
  }, [bubbleState, isOpen]);

  // Initial Context-Aware Greeting in Chat Window
  useEffect(() => {
    if (messages.length === 0) {
      let greeting = "👋 Hello!\n\nHow can I help you today?";
      if (pathname === "/pricing") greeting = "👋 Need help choosing the right plan?";
      else if (pathname.startsWith("/blogs")) greeting = "👋 Looking for a feature?";
      else if (pathname.startsWith("/tools")) greeting = "👋 Want to manage your gym automatically?";
      else if (pathname === "/contact-us") greeting = "👋 Prefer WhatsApp? I can connect you to our founder.";

      setMessages([{ id: "msg-1", role: "bot", text: greeting }]);
      showMainMenu();
    }
  }, [pathname, messages.length]);

  const addMessage = (role: "bot" | "user", text: string | React.ReactNode) => {
    setMessages(prev => [...prev, { id: Math.random().toString(36).substring(7), role, text }]);
  };

  const simulateBotResponse = (text: string | React.ReactNode, nextOptions: ChatOption[] = [], delayMs = 600) => {
    setOptions([]);
    setIsTyping(true);
    setTimeout(() => {
      addMessage("bot", text);
      setOptions(nextOptions);
      setIsTyping(false);
    }, delayMs);
  };

  // --- CONVERSATION FLOWS ---
  const showMainMenu = () => {
    setLeadMode("none");
    setOptions([
      { label: "💰 Pricing", action: () => handleChoice("Pricing", flowPricing) },
      { label: "🚀 Book Demo", action: () => handleChoice("Book Demo", flowDemo) },
      { label: "✨ Features", action: () => handleChoice("Features", flowProduct) },
      { label: "🎁 Free Trial", action: () => { addMessage("user", "Free Trial"); window.location.href = "/onboarding"; } },
      { label: "⚙️ Technical Support", action: () => handleChoice("Technical Support", flowSupport) },
      { label: "💬 Talk to Founder", action: () => handleChoice("Talk to Founder", flowEscalate) }
    ]);
  };

  const handleChoice = (userText: string, nextFlow: () => void) => {
    addMessage("user", userText);
    nextFlow();
  };

  // 1. Pricing Flow
  const flowPricing = () => {
    simulateBotResponse("What would you like to know about pricing?", [
      { label: "View Plans", action: () => handleChoice("Plans", () => {
        simulateBotResponse(
          <div className="space-y-2">
            <p><strong>Professional:</strong> ₹999/month</p>
            <p><strong>Premium:</strong> ₹1,999/month (Custom Domain)</p>
            <p>All plans include a 14-day free trial.</p>
          </div>,
          [
            { label: "Start Free Trial", primary: true, action: () => window.location.href = "/onboarding" },
            { label: "Send me details", action: () => handleChoice("Send me details", () => startLeadCapture("pricing")) },
            { label: "Back to Menu", action: () => handleChoice("Back", showMainMenu) }
          ]
        );
      })},
      { label: "Free Trial Info", action: () => handleChoice("Free Trial", () => {
        simulateBotResponse("Yes! We offer a 14-day free trial.\n✅ No credit card required\n✅ Cancel anytime\n\nWould you like to create your gym?", [
          { label: "Start Free Trial", primary: true, action: () => window.location.href = "/onboarding" },
          { label: "Back", action: () => handleChoice("Back", showMainMenu) }
        ]);
      })},
      { label: "Back to Menu", action: () => handleChoice("Back", showMainMenu) }
    ]);
  };

  // 2. Demo Flow
  const flowDemo = () => {
    simulateBotResponse("Would you like to watch a recorded demo, or book a live 1-on-1 session with our founder?", [
      { label: "🎥 Watch Demo", action: () => {
        addMessage("user", "Watch Demo");
        simulateBotResponse("Awesome. You can watch our 3-minute product tour right here on our homepage.", [
          { label: "Go to Homepage", primary: true, action: () => window.location.href = "/" },
          { label: "Back", action: () => handleChoice("Back", showMainMenu) }
        ]);
      }},
      { label: "📅 Book Live Demo", action: () => handleChoice("Book Live Demo", () => startLeadCapture("demo")) },
      { label: "Back", action: () => handleChoice("Back", showMainMenu) }
    ]);
  };

  // 3. Product Questions
  const flowProduct = () => {
    simulateBotResponse("Which feature would you like to learn about?", [
      { label: "Member Management", action: () => handleChoice("Member Management", () => simulateBotResponse("Add, track, and manage all your members in one place. You get expiration alerts and complete payment histories.", [{ label: "Back", action: showMainMenu }])) },
      { label: "Attendance", action: () => handleChoice("Attendance", () => simulateBotResponse("We support manual entry, mobile portal check-ins, and QR code scanning for seamless attendance tracking.", [{ label: "Back", action: showMainMenu }])) },
      { label: "Gym Website", action: () => handleChoice("Gym Website", () => simulateBotResponse("Every gym gets a free, professional website (e.g., yourgym.gmmx.app) to capture leads online instantly.", [{ label: "Back", action: showMainMenu }])) },
      { label: "Back to Menu", action: () => handleChoice("Back", showMainMenu) }
    ]);
  };

  // 4. Support
  const flowSupport = () => {
    simulateBotResponse("What issue are you facing?", [
      { label: "🔐 Login", action: () => handleChoice("Login Issue", flowEscalate) },
      { label: "💳 Payment", action: () => handleChoice("Payment Issue", flowEscalate) },
      { label: "⚠️ Bug", action: () => handleChoice("Found a Bug", flowEscalate) },
      { label: "Other", action: () => handleChoice("Other", flowEscalate) }
    ]);
  };

  // 5. Escalate to WhatsApp
  const flowEscalate = () => {
    simulateBotResponse(
      <div className="space-y-3">
        <p>I'll connect you with our human support team!</p>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Average response time: &lt; 10 minutes
        </div>
      </div>,
      [
        { 
          label: "Open WhatsApp", 
          primary: true, 
          action: () => window.open("https://wa.me/919999999999?text=Hi%20GMMX%20Team!%20I%20need%20some%20help.", "_blank") 
        },
        { label: "Nevermind", action: () => handleChoice("Nevermind", showMainMenu) }
      ]
    );
  };

  // --- LEAD CAPTURE FLOW ---
  const startLeadCapture = (intent: string) => {
    setLeadData({ ...leadData, intent });
    setLeadMode("email");
    simulateBotResponse("Absolutely! Can I get your email address so we can reach out?", []);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const val = inputValue.trim();
    setInputValue("");
    addMessage("user", val);

    if (leadMode === "email") {
      if (!val.includes("@")) {
        simulateBotResponse("That doesn't look like a valid email. Please try again.", []);
        return;
      }
      setLeadData(prev => ({ ...prev, email: val }));
      setLeadMode("gymName");
      simulateBotResponse("Got it! And what is the name of your gym?", []);
    } 
    else if (leadMode === "gymName") {
      setLeadData(prev => ({ ...prev, gymName: val }));
      setLeadMode("none");
      setIsTyping(true);
      
      // Submit to backend
      const formData = new FormData();
      formData.append("name", "GMMX Assistant Lead");
      formData.append("email", leadData.email || "unknown@example.com");
      formData.append("gymName", val);
      formData.append("inquiryType", leadData.intent === "demo" ? "Product Demo" : "Pricing Questions");
      formData.append("message", "Captured via GMMX Assistant Chatbot");
      formData.append("source", "GMMX Assistant");

      try {
        await submitMarketingLead(formData);
        simulateBotResponse("Thanks! Our team will reach out to you very shortly. Let me know if you need anything else.", [
          { label: "Back to Menu", action: showMainMenu }
        ], 1000);
      } catch (err) {
        simulateBotResponse("Oops, something went wrong saving your details. Please use our WhatsApp instead.", [
          { label: "Talk to Human", action: flowEscalate }
        ]);
      }
    }
  };

  const getGreetingText = () => {
    if (pathname === "/pricing") return "Need help choosing a plan?";
    if (pathname.startsWith("/blogs")) return "Looking for a feature?";
    if (pathname.startsWith("/tools")) return "Want to manage your gym automatically?";
    if (pathname === "/contact-us") return "Prefer WhatsApp?";
    return "Need help choosing a plan? Ask me anything.";
  };

  return (
    <>
      {/* Closed State Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-end gap-3 group">
          
          {/* Greeting Popup */}
          {bubbleState === "message" && (
            <div 
              className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-200 mb-2 max-w-[200px] sm:max-w-[250px] animate-in slide-in-from-bottom-2 fade-in duration-300 origin-bottom-right hidden sm:block cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <div className="text-sm text-slate-700 font-medium leading-snug">
                <span className="block mb-1">👋</span>
                {getGreetingText()}
              </div>
            </div>
          )}

          {/* Main FAB */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-transform hover:scale-105 bg-[#FF5C73] text-white"
            aria-label="Ask GMMX AI"
          >
            <Bot size={24} className="shrink-0" />
            {/* Notification Pulse Dot */}
            {bubbleState === "collapsed" && (
              <span className="absolute top-0 right-0 flex h-3 w-3 sm:h-3.5 sm:w-3.5 translate-x-1/4 -translate-y-1/4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" style={{ animationDuration: "3s" }}></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border-2 border-[#FF5C73]"></span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Open Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-80px)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-[#FF5C73] text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                  <Bot size={18} />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#FF5C73]" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">GMMX Coach</h3>
                <p className="text-[10px] text-white/80">Usually replies instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { setMessages([]); showMainMenu(); }} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors" title="Restart chat">
                 <RefreshCcw size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-[#FF5C73] text-white rounded-tr-sm shadow-sm" 
                    : "bg-white text-slate-700 border border-slate-200 rounded-tl-sm shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Options / Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            {leadMode !== "none" ? (
              <form onSubmit={handleLeadSubmit} className="flex gap-2">
                <input
                  type={leadMode === "email" ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={leadMode === "email" ? "Enter your email..." : "Enter gym name..."}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5C73]"
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl bg-[#FF5C73] text-white flex items-center justify-center disabled:opacity-50 transition-all hover:bg-rose-500 shadow-sm"
                >
                  <Send size={16} />
                </button>
              </form>
            ) : options.length > 0 ? (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={opt.action}
                    className={`text-left px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
                      opt.primary 
                        ? "bg-[#FF5C73] border-[#FF5C73] text-white hover:bg-rose-500 shadow-sm" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
