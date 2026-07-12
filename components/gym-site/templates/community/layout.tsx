"use client";

import { useState } from "react";
import { MessageSquare, Phone, MapPin, Share2, Video, Hash, Menu, X, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createPublicLead } from "@/features/leads/actions";
import { useTracker } from "@/hooks/useTracker";

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
  hero_title?: string | null;
  gallery_urls: string[];
  social_instagram: string | null;
  social_facebook: string | null;
  social_youtube: string | null;
  whatsapp_number: string | null;
  contact_email: string | null;
  address: string | null;
  workingHours?: string | null;
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

export function CommunityTemplate({ gym, settings, plans, trainers, testimonials, services }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const { logEvent } = useTracker(gym.id);

  const whatsappUrl = settings.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number, `Hi ${gym.name}, I want to know more about your memberships!`)
    : null;

  async function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJoinLoading(true);
    let utmData = {};
    try {
      const stored = localStorage.getItem(`gmmx_utm_${gym.id}`);
      if (stored) utmData = JSON.parse(stored);
    } catch (e) {}

    await createPublicLead({
      gymId: gym.id,
      name: joinName,
      phone: joinPhone,
      source: `Website - Contact Form`,
      ...utmData
    });
    logEvent("join_form_submitted");
    setJoinSuccess(true);
    setJoinLoading(false);
  }

  const primaryColor = "#3B82F6"; // Blue-500
  const bgLight = "#F8FAFC"; // Slate-50

  return (
    <div className="min-h-screen text-slate-900 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-3">
          {gym.logo_url
            ? <img src={gym.logo_url} alt={gym.name} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm border border-slate-100" />
            : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm" style={{ background: primaryColor }}>{gym.name[0]}</div>
          }
          <span className="font-bold text-slate-900 text-xl">{gym.name}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Pricing", "Location", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              {item}
            </a>
          ))}
          <a href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Login
          </a>
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-sm flex items-center gap-2" style={{ background: "#25D366" }}>
              <MessageSquare size={16} /> WhatsApp Us
            </a>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-900"><Menu size={24} /></button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-xl">{gym.name}</span>
            <button onClick={() => setMenuOpen(false)} className="text-slate-900"><X size={24} /></button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {["Pricing", "Location", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-2xl font-bold text-slate-900">{item}</a>
            ))}
            <a href="/login" onClick={() => setMenuOpen(false)} className="text-2xl font-bold text-slate-900">Login</a>
            {whatsappUrl && (
               <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="px-8 py-3 rounded-xl text-lg font-bold text-white flex items-center gap-2" style={{ background: "#25D366" }}>
                 <MessageSquare size={20} /> WhatsApp Us
               </a>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-6">
              <MapPin size={16} /> {settings.address ? "Your Local Fitness Center" : "Welcome"}
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              {settings.hero_title || settings.tagline || `Join ${gym.name} Today`}
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {settings.description || "Affordable memberships, great equipment, and a friendly community right in your neighborhood."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#pricing" onClick={() => logEvent("hero_pricing")} className="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all w-full sm:w-auto text-center" style={{ background: primaryColor }}>
                View Memberships
              </a>
              <a href="#contact" onClick={() => logEvent("hero_contact")} className="px-8 py-4 rounded-xl text-lg font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all w-full sm:w-auto text-center">
                Contact Us
              </a>
            </div>
          </div>
          {settings.hero_image_url ? (
            <div className="relative z-10 w-full aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img src={settings.hero_image_url} alt={gym.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="relative z-10 w-full aspect-square md:aspect-video lg:aspect-square rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400">
              Add a hero image in dashboard
            </div>
          )}
        </div>
      </section>

      {/* Pricing / Plans */}
      {plans.length > 0 && (
        <section id="pricing" className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">No hidden fees. Choose a plan that works for you.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, i) => (
                <div key={plan.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col relative">
                  {i === 1 && <div className="absolute -top-4 inset-x-0 flex justify-center"><span className="px-4 py-1 rounded-full text-xs font-bold text-white shadow-md" style={{ background: primaryColor }}>Recommended</span></div>}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                    <span className="text-4xl font-black text-slate-900">₹{Number(plan.price).toLocaleString("en-IN")}</span>
                    <span className="text-slate-500 font-medium">/{plan.duration_days} days</span>
                  </div>
                  {plan.description && (
                    <div className="mb-8 flex-1">
                      <p className="text-slate-600 mb-4">{plan.description}</p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={16} className="text-green-500" /> Full Gym Access
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={16} className="text-green-500" /> Cardio & Weights
                        </li>
                      </ul>
                    </div>
                  )}
                  <a href="#contact" className="block text-center py-3 rounded-xl text-sm font-bold transition-all w-full"
                    style={{ background: i === 1 ? primaryColor : "transparent", border: i === 1 ? "none" : `2px solid ${primaryColor}`, color: i === 1 ? "white" : primaryColor }}>
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location & Info */}
      <section id="location" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Find Us Here</h2>
            <div className="space-y-6">
              {settings.address && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Address</h4>
                    <p className="text-slate-600">{settings.address}</p>
                  </div>
                </div>
              )}
              {settings.workingHours && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Working Hours</h4>
                    <p className="text-slate-600">{settings.workingHours}</p>
                  </div>
                </div>
              )}
              {gym.phone && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                    <a href={`tel:${gym.phone}`} className="text-slate-600 hover:text-blue-600 transition-colors">{gym.phone}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-200 rounded-3xl w-full aspect-video flex items-center justify-center text-slate-400 overflow-hidden shadow-inner">
             {settings.address ? (
               <div className="p-8 text-center">
                 <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                 <p className="text-lg font-medium text-slate-500">Map integration available</p>
                 <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline mt-2 block">Open in Google Maps</a>
               </div>
             ) : (
               "Add an address to show map"
             )}
          </div>
        </div>
      </section>

      {/* Contact / Join Form */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Have Questions? Join Us.</h2>
            <p className="text-slate-500">Send us a message and we'll reply as soon as possible.</p>
          </div>
          
          {joinSuccess ? (
            <div className="p-8 rounded-2xl text-center bg-green-50 border border-green-200">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-slate-600">We've received your details and will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleJoinSubmit} className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input type="text" value={joinName} onChange={(e) => setJoinName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone</label>
                  <input type="tel" value={joinPhone} onChange={(e) => setJoinPhone(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Enter phone number" />
                </div>
              </div>
              <button type="submit" disabled={joinLoading} className="w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all hover:opacity-90" style={{ background: primaryColor }}>
                {joinLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-400 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-bold text-white text-xl">{gym.name}</span>
          <div className="flex gap-6">
            <a href="/login" className="text-sm font-semibold hover:text-white transition-colors">Member Login</a>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} {gym.name}. Powered by <a href="https://gmmx.app" className="text-blue-400 hover:text-blue-300">GMMX</a></p>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex gap-2">
        {whatsappUrl && (
          <a href={whatsappUrl} onClick={() => logEvent("whatsapp_mobile")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-xl shadow-lg" style={{ background: "#25D366", color: "white" }}>
            <MessageSquare size={20} />
          </a>
        )}
        <a href="#contact" onClick={() => logEvent("contact_mobile")} className="flex-1 flex items-center justify-center font-bold px-4 py-4 rounded-xl shadow-lg text-white" style={{ background: primaryColor }}>
          Contact Us
        </a>
      </div>
    </div>
  );
}
