"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { submitMarketingLead } from "./actions";
import { Mail, MessageCircle, ArrowRight, Clock, Plus, Minus, User, Phone, Dumbbell, Star, PhoneCall, MapPin, Building2, Calendar, FileText, CheckCircle2 } from "lucide-react";

const INQUIRY_TYPES = [
  "Pricing Questions",
  "Product Demo",
  "Billing Support",
  "Feature Request",
  "Report a Bug",
  "Other"
];

const FAQS = [
  {
    question: "Can I migrate my existing Excel data?",
    answer: "Yes. Our onboarding team will help you import your existing members, payments, and plans from Excel for free."
  },
  {
    question: "How long is the setup process?",
    answer: "Setup takes less than 5 minutes. Your business website goes live instantly, and you can start adding members right away."
  },
  {
    question: "Do you support QR attendance?",
    answer: "Yes, QR code attendance and biometric integrations are fully supported."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. We don't believe in lock-in contracts. You can cancel your subscription at any time."
  },
  {
    question: "Can coaches login?",
    answer: "Yes, you can create dedicated coach accounts with restricted permissions."
  },
  {
    question: "Can members use a mobile app?",
    answer: "Members can access their profiles, plans, and attendance via a dedicated, mobile-friendly member portal."
  }
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gymName: "",
    inquiryType: "",
    message: "",
    memberCount: "",
    currentSoftware: "",
    budget: "",
    startDate: "",
    source: "Direct",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Capture UTM source or referrer automatically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    if (utmSource) {
      setFormData(prev => ({ ...prev, source: utmSource }));
    } else if (document.referrer) {
      if (document.referrer.includes("instagram")) setFormData(prev => ({ ...prev, source: "Instagram" }));
      else if (document.referrer.includes("google")) setFormData(prev => ({ ...prev, source: "Google" }));
      else if (document.referrer.includes("facebook")) setFormData(prev => ({ ...prev, source: "Facebook" }));
      else setFormData(prev => ({ ...prev, source: "Referral" }));
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      const result = await submitMarketingLead(formDataObj);
      
      if (result.success) {
        setSubmitted(true);
      } else {
        alert(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Failed to submit form. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header */}
      <section className="relative text-white min-h-[380px] flex flex-col justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/gym_assert3.jpg"
          alt="Gym Background"
          fill
          priority
          quality={75}
          className="object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Talk to the <span className="text-[#FF5C73]">gmmx.app</span> Team
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Let's help you grow your gym. We're here to answer any questions.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Team Online — Usually replies in 5 minutes
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Contact Methods & Trust */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Founder Card */}
            <div className="p-6 bg-white border border-slate-200/60 rounded-3xl shadow-sm text-center space-y-3 mb-6 relative group overflow-hidden">
               <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto overflow-hidden border-[3px] border-white shadow-md flex items-center justify-center relative">
                  <Image 
                    src="/nitheesh.jpg" 
                    alt="Nitheesh" 
                    fill 
                    className="object-cover z-10" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                  />
                  <User size={32} className="text-slate-400 absolute z-0" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Founder & CEO</p>
                  <h4 className="font-black text-slate-900 text-xl">Nitheesh</h4>
               </div>
               <p className="text-sm text-slate-600 px-2">I'm available for personalized demos to help you setup your gym.</p>
               <div className="pt-2">
                 <button className="w-full py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-[#FF5C73] hover:text-white hover:border-[#FF5C73] transition-all shadow-sm">
                    Book a Demo
                 </button>
               </div>
               <div className="flex justify-center gap-5 pt-4 border-t border-slate-100 mt-2">
                 <a href="https://linkedin.com/in/nitheesh" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0077b5] transition-colors flex items-center gap-1.5 text-xs font-bold">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
                 </a>
                 <a href="mailto:gmmxapp@gmail.com" className="text-slate-400 hover:text-[#FF5C73] transition-colors flex items-center gap-1.5 text-xs font-bold">
                   <Mail size={16} /> Email
                 </a>
               </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white border border-emerald-500/20 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-2xl flex items-center justify-center shrink-0 text-[#25D366]">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">WhatsApp</h3>
                  <p className="text-slate-500 text-xs mb-2">Average reply: 5 mins</p>
                  <div className="flex text-yellow-400 mb-2">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Used by 100+ gyms</p>
                </div>
              </div>
            </div>

            {/* Call */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-start gap-4">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 text-blue-500">
                  <PhoneCall size={22} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Call Support</h3>
                  <p className="text-slate-500 text-xs font-bold">Mon–Sat <br/>9AM–7PM</p>
               </div>
            </div>

            {/* Email */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-start gap-4">
               <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 text-[#FF5C73]">
                  <Mail size={22} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Email</h3>
                  <p className="text-slate-500 text-xs mb-1"><a href="mailto:gmmxapp@gmail.com" className="hover:text-[#FF5C73]">gmmxapp@gmail.com</a></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Reply within 24 hrs</p>
               </div>
            </div>

            {/* Based In */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex items-start gap-4">
               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 text-indigo-500">
                  <MapPin size={22} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Based in</h3>
                  <p className="text-slate-500 text-xs">Coimbatore, India</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Remote-first support</p>
               </div>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-4 px-2 pt-1">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Find us on the map</h3>
                  <p className="text-slate-500 text-xs">Visit or verify our location before you book a demo.</p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Coimbatore%2C%20India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#FF5C73] hover:text-rose-600"
                >
                  Open Maps
                </a>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <iframe
                  title="GMMX location map"
                  src="https://www.google.com/maps?q=Coimbatore%2C%20India&z=13&output=embed"
                  loading="lazy"
                  className="h-56 w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-8 bg-white border border-slate-200/60 p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/30">
            {submitted ? (
              <div className="text-center py-16 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-2">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-950">🎉 Thanks!</h3>
                <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
                  We'll reply on WhatsApp within 15 minutes to discuss how we can help your gym grow.
                </p>
                <div className="pt-8 border-t border-slate-100 max-w-md mx-auto">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Meanwhile...</p>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <a href="/features" className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100">Features</a>
                     <a href="/pricing" className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100">Pricing</a>
                     <a href="/help" className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100">Read Docs</a>
                   </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-black text-slate-950 tracking-tight mb-6">Tell us about your gym</h3>
                
                {/* Inquiry Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    What can we help you with? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INQUIRY_TYPES.map((type) => (
                      <label key={type} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${formData.inquiryType === type ? "border-[#FF5C73] bg-rose-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type}
                          checked={formData.inquiryType === type}
                          onChange={handleChange}
                          required
                          className="hidden"
                        />
                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${formData.inquiryType === type ? "border-[#FF5C73]" : "border-slate-300"}`}>
                           {formData.inquiryType === type && <div className="w-1.5 h-1.5 bg-[#FF5C73] rounded-full" />}
                        </div>
                        <span className={`text-xs font-bold ${formData.inquiryType === type ? "text-rose-900" : "text-slate-600"}`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">your name *</label>
                    <div className="relative">
                       <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">email address *</label>
                    <div className="relative">
                       <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="e.g. rahul@gmail.com" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all font-medium" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">phone number (optional)</label>
                    <div className="relative">
                       <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 98765 43210" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">gym name (optional)</label>
                    <div className="relative">
                       <Dumbbell size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" name="gymName" value={formData.gymName} onChange={handleChange} placeholder="e.g. Iron Muscle Gym" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all font-medium" />
                    </div>
                  </div>
                </div>

                {/* Qualification Fields */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2"><User size={14}/> Members</label>
                        <select name="memberCount" value={formData.memberCount} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] transition-all font-medium appearance-none">
                           <option value="">Select members...</option>
                           <option value="Under 50">Under 50</option>
                           <option value="50-150">50-150</option>
                           <option value="150-300">150-300</option>
                           <option value="300+">300+</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2"><Building2 size={14}/> Current Software</label>
                        <select name="currentSoftware" value={formData.currentSoftware} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] transition-all font-medium appearance-none">
                           <option value="">What do you use now?</option>
                           <option value="Excel">Excel / Spreadsheet</option>
                           <option value="Notebook">Notebook / Paper</option>
                           <option value="WhatsApp">WhatsApp Groups</option>
                           <option value="Other Software">Other Software</option>
                           <option value="None">None</option>
                        </select>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2"><FileText size={14}/> Monthly Budget</label>
                        <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] transition-all font-medium appearance-none">
                           <option value="">Select budget...</option>
                           <option value="< ₹500">&lt; ₹500</option>
                           <option value="₹500-1000">₹500 - ₹1000</option>
                           <option value="₹1000+">₹1000+</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2"><Calendar size={14}/> Need GMMX by</label>
                        <select name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] transition-all font-medium appearance-none">
                           <option value="">Start date...</option>
                           <option value="Immediately">Immediately</option>
                           <option value="This Month">This Month</option>
                           <option value="Just Exploring">Just Exploring</option>
                        </select>
                     </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're looking for..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all resize-none font-medium"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-wider text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  style={{ background: "#FF5C73", boxShadow: "0 4px 12px rgba(255,92,115,0.25)" }}
                >
                  {isSubmitting ? "Processing..." : (formData.inquiryType === "Product Demo" ? "Request Demo" : "Get in Touch")} <ArrowRight size={16} />
                </button>
                <p className="text-center text-[10px] font-bold text-slate-400 mt-2">NO CREDIT CARD REQUIRED • NO HIDDEN FEES</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-around gap-10">
            <div className="text-center">
               <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Trusted by</h4>
               <p className="text-4xl font-black text-slate-900 mb-1">100+</p>
               <p className="text-sm font-bold text-slate-400">Gyms across India</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-slate-200" />
            <div className="text-center">
               <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Members Managed</h4>
               <p className="text-4xl font-black text-slate-900 mb-1">15,000+</p>
               <div className="flex justify-center text-yellow-400 mt-1">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
               </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-slate-200" />
            <div className="text-center">
               <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Reliability</h4>
               <p className="text-4xl font-black text-emerald-500 mb-1">99.9%</p>
               <p className="text-sm font-bold text-slate-400">Uptime guarantee</p>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-base font-medium">Quick answers about setting up your gym.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 ${openFaq === index ? "bg-white shadow-md border-slate-300" : "bg-white hover:border-slate-300"}`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-bold text-slate-900 text-base pr-8">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? "bg-rose-100 text-[#FF5C73]" : "bg-slate-100 text-slate-500"}`}>
                    {openFaq === index ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-slate-600 text-sm font-medium leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
