"use client";

import { useState } from "react";
import { MessageSquare, Phone, MapPin, Share2, Video, Hash, Menu, X, ArrowRight, Quote, CheckCircle2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createPublicLead } from "@/features/leads/actions";

interface GymData {
  id: string;
  name: string;
  phone: string;
  email: string;
  logo_url: string | null;
}

interface Settings {
  template: string;
  hero_image_url: string | null;
  description: string | null;
  tagline: string | null;
  gallery_urls: string[];
  social_instagram: string | null;
  social_facebook: string | null;
  social_youtube: string | null;
  whatsapp_number: string | null;
  contact_email: string | null;
  address: string | null;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  description: string | null;
}

interface Trainer {
  id: string;
  name: string;
  specialization: string | null;
  experience_years: number | null;
  photo_url: string | null;
  bio: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  review: string;
  rating: number;
}

interface Props {
  gym: GymData;
  settings: Settings;
  plans: Plan[];
  trainers: Trainer[];
  testimonials: Testimonial[];
  services: string[];
}

export function TransformationTemplate({ gym, settings, plans, trainers, testimonials, services }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [joinGoal, setJoinGoal] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const whatsappUrl = settings.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number, `Hi ${gym.name}, I'm interested in starting my transformation!`)
    : null;

  async function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJoinLoading(true);
    await createPublicLead({
      gymId: gym.id,
      name: joinName,
      phone: joinPhone,
      source: `Website - Goal: ${joinGoal}`,
    });
    setJoinSuccess(true);
    setJoinLoading(false);
  }

  const primaryColor = "#F43F5E"; // Rose-500
  const secondaryColor = "#111827"; // Gray-900

  return (
    <div className="min-h-screen text-gray-900 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-transparent">
        <div className="flex items-center gap-3">
          {gym.logo_url
            ? <img src={gym.logo_url} alt={gym.name} className="w-10 h-10 rounded-full object-contain bg-white" />
            : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: primaryColor }}>{gym.name[0]}</div>
          }
          <span className="font-black tracking-tight text-white text-xl uppercase">{gym.name}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Testimonials", "Transformations", "Plans"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-white/90 hover:text-white transition-colors uppercase tracking-wider">
              {item}
            </a>
          ))}
          <a href="/login" className="text-sm font-bold text-white/90 hover:text-white transition-colors uppercase tracking-wider">
            Login
          </a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white"><Menu size={28} /></button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <span className="font-black text-gray-900 text-xl uppercase">{gym.name}</span>
            <button onClick={() => setMenuOpen(false)} className="text-gray-900"><X size={28} /></button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {["Testimonials", "Transformations", "Plans"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-3xl font-black text-gray-900 uppercase">{item}</a>
            ))}
            <a href="/login" onClick={() => setMenuOpen(false)} className="text-3xl font-black text-gray-900 uppercase">Login</a>
            <a href="#join" onClick={() => setMenuOpen(false)} className="px-10 py-4 rounded-full text-xl font-bold text-white shadow-xl shadow-rose-500/30" style={{ background: primaryColor }}>Start Your Transformation</a>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center pt-20 overflow-hidden"
        style={{
          background: settings.hero_image_url
            ? `linear-gradient(to right, rgba(17,24,39,0.9), rgba(17,24,39,0.7)), url(${settings.hero_image_url}) center/cover`
            : `linear-gradient(135deg, ${secondaryColor} 0%, #1F2937 100%)`,
        }}>
        <div className="relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-sm mb-6 border border-rose-500/30 uppercase tracking-widest">
            Results Guaranteed
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-white leading-[1.1] mb-6 uppercase tracking-tight">
            {settings.tagline || "Real People. Real Results."}
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-medium text-gray-300 max-w-3xl">
            {settings.description || "Stop guessing and start transforming. Get the exact blueprint, accountability, and coaching you need."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a href="#join" className="w-full sm:w-auto px-10 py-5 rounded-full text-lg font-black text-white hover:scale-105 transition-transform uppercase tracking-wider flex items-center justify-center gap-2" style={{ background: primaryColor, boxShadow: `0 20px 40px -10px ${primaryColor}` }}>
              Start My Journey <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-200">
            <div><div className="text-4xl font-black text-gray-900">500+</div><div className="text-sm font-bold text-gray-500 uppercase mt-1">Transformations</div></div>
            <div><div className="text-4xl font-black text-gray-900">4.9</div><div className="text-sm font-bold text-gray-500 uppercase mt-1">Average Rating</div></div>
            <div><div className="text-4xl font-black text-gray-900">{trainers.length || 5}</div><div className="text-sm font-bold text-gray-500 uppercase mt-1">Expert Coaches</div></div>
            <div><div className="text-4xl font-black text-gray-900">100%</div><div className="text-sm font-bold text-gray-500 uppercase mt-1">Commitment</div></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section id="testimonials" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">Wall of Wins</h2>
            <p className="text-lg text-gray-500 mb-16 font-medium">Don't just take our word for it.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="p-10 rounded-3xl bg-gray-50 text-left relative overflow-hidden group">
                  <Quote className="absolute top-6 right-6 text-gray-200 w-16 h-16 transform rotate-180 -z-10 group-hover:scale-110 transition-transform" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-6 h-6 ${i < t.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-xl font-medium text-gray-900 mb-8 leading-snug">"{t.review}"</p>
                  <div className="font-black text-gray-900 uppercase tracking-wide">{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery / Transformations */}
      {settings.gallery_urls.length > 0 && (
        <section id="transformations" className="py-24 px-6 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">The Proof</h2>
              <p className="text-lg text-gray-400 font-medium">Real members. Real hard work.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {settings.gallery_urls.map((url, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden group relative">
                  <img src={url} alt={`Transformation ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="font-black uppercase tracking-wider text-rose-500">Result #{i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plans */}
      {plans.length > 0 && (
        <section id="plans" className="py-24 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">Investment</h2>
              <p className="text-lg text-gray-500 font-medium">Choose your level of commitment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, i) => (
                <div key={plan.id} className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 relative border border-gray-100 flex flex-col">
                  {i === 1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg" style={{ background: primaryColor }}>Most Popular</div>}
                  <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">{plan.name}</h3>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-black text-gray-900">₹{Number(plan.price).toLocaleString("en-IN")}</span>
                    <span className="text-gray-500 font-bold mb-1">/{plan.duration_days} days</span>
                  </div>
                  {plan.description && <p className="text-gray-600 font-medium mb-8 flex-1 leading-relaxed">{plan.description}</p>}
                  <a href="#join" className="block text-center py-4 rounded-xl text-lg font-black uppercase tracking-wider transition-all"
                    style={{ background: i === 1 ? primaryColor : "transparent", border: i === 1 ? "none" : "2px solid #111827", color: i === 1 ? "white" : "#111827" }}>
                    Select Plan
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Form */}
      <section id="join" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">Ready To Start?</h2>
            <p className="text-lg text-gray-500 font-medium">Take the first step. We'll handle the rest.</p>
          </div>
          {joinSuccess ? (
            <div className="p-10 rounded-3xl text-center bg-green-50 border border-green-100">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">Application Received</h3>
              <p className="text-gray-600 font-medium">Our team will be in touch shortly to schedule your consultation.</p>
            </div>
          ) : (
            <form onSubmit={handleJoinSubmit} className="p-8 md:p-10 rounded-3xl bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase">Full Name</label>
                <input type="text" value={joinName} onChange={(e) => setJoinName(e.target.value)} required className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-rose-500 focus:bg-white transition-colors outline-none font-medium" placeholder="Rahul Sharma" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase">Phone Number</label>
                <input type="tel" value={joinPhone} onChange={(e) => setJoinPhone(e.target.value)} required className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-rose-500 focus:bg-white transition-colors outline-none font-medium" placeholder="9876543210" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase">Primary Goal</label>
                <select value={joinGoal} onChange={(e) => setJoinGoal(e.target.value)} required className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-rose-500 focus:bg-white transition-colors outline-none font-medium appearance-none">
                  <option value="" disabled>Select your goal</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
              <button type="submit" disabled={joinLoading} className="w-full py-5 rounded-xl text-lg font-black text-white uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:scale-[1.02] transition-transform mt-4" style={{ background: primaryColor }}>
                {joinLoading ? "Processing..." : "Claim Your Spot"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-black text-white text-xl uppercase tracking-widest">{gym.name}</span>
          <div className="flex gap-6">
            <a href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase">Login</a>
          </div>
          <div className="flex gap-4">
             {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Share2 size={20} /></a>}
             {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Hash size={20} /></a>}
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex gap-2">
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-2xl shadow-xl" style={{ background: "#25D366", color: "white" }}>
            <MessageSquare size={24} />
          </a>
        )}
        <a href="#join" className="flex-1 flex items-center justify-center text-lg font-black uppercase tracking-wider px-4 py-4 rounded-2xl shadow-xl text-white" style={{ background: primaryColor }}>
          Start Now
        </a>
      </div>
    </div>
  );
}
