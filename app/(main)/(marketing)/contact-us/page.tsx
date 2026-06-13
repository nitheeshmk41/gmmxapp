"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, MessageCircle, CheckCircle2, ArrowRight, Clock, Plus, Minus } from "lucide-react";

const INQUIRY_TYPES = [
  "Pricing Questions",
  "Product Demo",
  "Technical Support",
  "Partnership Inquiry",
  "Other"
];

const FAQS = [
  {
    question: "Do I need a credit card?",
    answer: "No. You can start your 14-day free trial without entering any payment details."
  },
  {
    question: "Can I use my own domain?",
    answer: "Yes. Custom domains are fully supported on our Professional and Enterprise plans."
  },
  {
    question: "How long is the free trial?",
    answer: "14 days. You get full access to all features during this period."
  },
  {
    question: "Can I import existing members?",
    answer: "Yes. You can import your existing members via a CSV file directly from your dashboard."
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        gymName: "",
        inquiryType: "",
        message: "",
      });
    }, 1200);
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
      <section className="relative text-white min-h-[420px] flex flex-col justify-center pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/gym_assert3.jpg"
          alt="Gym Background"
          fill
          priority
          quality={80}
          className="object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Contact <span className="text-[#FF5C73]">gmmx.app</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Questions about pricing, onboarding, or managing your gym? We&apos;re happy to help.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Clock size={16} /> Usually replies within 24 hours
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Methods */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">How to reach us</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Gym owners love WhatsApp. It&apos;s the fastest way to get answers to your questions.
              </p>
            </div>

            {/* WhatsApp Primary CTA */}
            <div className="bg-white border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <MessageCircle size={24} className="text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">WhatsApp Support</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Get instant answers about pricing, features, and onboarding directly from our team.
                </p>
                <a
                  href="https://wa.me/919999999999?text=Hi%20gmmx.app%20team!%20I'd%20like%20to%20learn%20more%20about%20your%20gym%20management%20platform."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1DA851] transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Email Alternative */}
            <div className="flex items-start gap-4 p-6 bg-white border border-slate-200/60 rounded-3xl">
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <Mail size={22} className="text-[#FF5C73]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-950 text-sm mb-1">Email Inquiries</h4>
                <p className="text-slate-500 text-xs mb-1">hello@gmmx.app</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  For general support or detailed partnership inquiries.
                </p>
              </div>
            </div>
            
            {/* Sales Info */}
            <div className="flex items-start gap-4 p-6 bg-white border border-slate-200/60 rounded-3xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <MessageCircle size={22} className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-950 text-sm mb-1">Sales & Demo Requests</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Book a personalized demo by filling out the contact form.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200/60 p-8 sm:p-10 rounded-3xl shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-5 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-950">Message Sent</h3>
                <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-950 tracking-tight mb-4">Send us an inquiry</h3>
                
                {/* Inquiry Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    What can we help you with? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INQUIRY_TYPES.map((type) => (
                      <label key={type} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${formData.inquiryType === type ? "border-[#FF5C73] bg-rose-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type}
                          checked={formData.inquiryType === type}
                          onChange={handleChange}
                          required
                          className="w-4 h-4 text-[#FF5C73] focus:ring-[#FF5C73] border-slate-300"
                        />
                        <span className={`text-sm font-medium ${formData.inquiryType === type ? "text-slate-900" : "text-slate-600"}`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      your name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      email address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      phone number (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 98765 43210"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Gym Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="gymName" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      gym name (optional)
                    </label>
                    <input
                      type="text"
                      id="gymName"
                      name="gymName"
                      value={formData.gymName}
                      onChange={handleChange}
                      placeholder="e.g. Iron Muscle Gym"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your questions or custom inquiries here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#FF5C73] focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  style={{
                    background: "#FF5C73",
                    boxShadow: "0 4px 12px rgba(255,92,115,0.25)",
                  }}
                >
                  {isSubmitting ? (
                    <span>Sending inquiry...</span>
                  ) : (
                    <>
                      <span>Send Inquiry</span> <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-base">Quick answers to common questions about gmmx.app.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 ${openFaq === index ? "bg-slate-50 shadow-sm" : "bg-white hover:border-slate-300"}`}
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
                  <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-4">
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
