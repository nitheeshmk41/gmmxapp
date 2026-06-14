"use client";


import { useState } from "react";
import { MessageSquare, Phone, MapPin, Share2, Video, Hash, Menu, X } from "lucide-react";
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

export function ModernTemplate({ gym, settings, plans, trainers, testimonials, services }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const whatsappUrl = settings.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number, `Hi ${gym.name}, I'm interested in joining!`)
    : null;

  async function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJoinLoading(true);
    await createPublicLead({
      gymId: gym.id,
      name: joinName,
      phone: joinPhone,
      source: "website",
    });
    setJoinSuccess(true);
    setJoinLoading(false);
  }

  return (
    <div className="min-h-screen" style={{ background: "#0A0F1E", fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10, 15, 30, 0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          {gym.logo_url
            ? <img src={gym.logo_url} alt={gym.name} className="w-9 h-9 rounded-xl object-contain" />
            : <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "#FF5C73" }}>{gym.name[0]}</div>
          }
          <span className="font-bold text-white text-lg">{gym.name}</span>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {["About", "Plans", "Trainers", "Gallery", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium transition-colors" style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
              {item}
            </a>
          ))}
          <a href="#join"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#FF5C73" }}
          >
            Join Now
          </a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white"><Menu size={22} /></button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0A0F1E" }}>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="font-bold text-white text-lg">{gym.name}</span>
            <button onClick={() => setMenuOpen(false)} className="text-white"><X size={22} /></button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {["About", "Plans", "Trainers", "Gallery", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-2xl font-bold text-white">{item}</a>
            ))}
            <a href="#join" onClick={() => setMenuOpen(false)} className="px-8 py-3 rounded-xl text-lg font-bold text-white" style={{ background: "#FF5C73" }}>Book Free Trial</a>
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center pt-20"
        style={{
          background: settings.hero_image_url
            ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${settings.hero_image_url}) center/cover`
            : "linear-gradient(135deg, #0A0F1E 0%, #1E293B 50%, #0F172A 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FF5C73, transparent)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #3B82F6, transparent)", filter: "blur(60px)" }} />
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Transform Your Body At <br />
            <span style={{ color: "#FF5C73" }}>{gym.name}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-medium" style={{ color: "#94A3B8" }}>
            {settings.tagline || "Premium fitness center helping members build strength, lose weight and stay healthy."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#join" className="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl shadow-[#FF5C73]/20 hover:scale-105 transition-transform w-full sm:w-auto" style={{ background: "#FF5C73" }}>
              Book Free Trial
            </a>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform w-full sm:w-auto" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
                <MessageSquare size={20} />
                WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* About & Services */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">About {gym.name}</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ background: "#FF5C73" }} />
          <p className="text-lg leading-relaxed mb-10" style={{ color: "#94A3B8" }}>
            {settings.description || `${gym.name} is committed to helping you reach your fitness goals. Join our community and transform your life.`}
          </p>
          
          {services && services.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-6">What We Offer</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {services.map((service, i) => (
                  <span key={i} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {settings.address && (
            <div className="flex items-center justify-center gap-2 mt-10" style={{ color: "#94A3B8" }}>
              <MapPin size={16} style={{ color: "#FF5C73" }} />
              <span className="text-sm">{settings.address}</span>
            </div>
          )}
        </div>
      </section>

      {/* Plans */}
      {plans.length > 0 && (
        <section id="plans" className="py-20 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4">Membership Plans</h2>
              <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <div
                  key={plan.id}
                  className="p-6 rounded-2xl relative overflow-hidden"
                  style={{
                    background: i === 1 ? "linear-gradient(135deg, #FF5C73, #E64A61)" : "rgba(255,255,255,0.04)",
                    border: i === 1 ? "none" : "1px solid rgba(255,255,255,0.08)",
                    transform: i === 1 ? "scale(1.05)" : "none",
                    boxShadow: i === 1 ? "0 20px 40px rgba(255,92,115,0.3)" : "none",
                  }}
                >
                  {i === 1 && <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>Popular</div>}
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-black text-white">₹{Number(plan.price).toLocaleString("en-IN")}</span>
                    <span className="text-sm" style={{ color: i === 1 ? "rgba(255,255,255,0.7)" : "#94A3B8" }}>/ {plan.duration_days} days</span>
                  </div>
                  {plan.description && <p className="text-sm mb-4" style={{ color: i === 1 ? "rgba(255,255,255,0.8)" : "#94A3B8" }}>{plan.description}</p>}
                  <a href="#join" className="block text-center py-3 rounded-xl text-sm font-bold transition-all"
                    style={{ background: i === 1 ? "rgba(255,255,255,0.2)" : "#FF5C73", color: "white" }}>
                    Get Started →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trainers */}
      {trainers.length > 0 && (
        <section id="trainers" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4">Our Trainers</h2>
              <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer) => (
                <div key={trainer.id} className="p-6 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #FF5C73, #E64A61)" }}>
                    {trainer.photo_url ? <img src={trainer.photo_url} alt={trainer.name} className="w-full h-full object-cover" /> : trainer.name[0]}
                  </div>
                  <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
                  {trainer.specialization && <p className="text-sm" style={{ color: "#FF5C73" }}>{trainer.specialization}</p>}
                  {trainer.experience_years !== null && (
                    <p className="text-xs mt-1" style={{ color: "#64748B" }}>{trainer.experience_years} years experience</p>
                  )}
                  {trainer.bio && <p className="text-sm mt-3" style={{ color: "#94A3B8" }}>{trainer.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {settings.gallery_urls.length > 0 && (
        <section id="gallery" className="py-20 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4">Gallery</h2>
              <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {settings.gallery_urls.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden">
                  <img src={url} alt={`${gym.name} gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4">Success Stories</h2>
              <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="p-8 rounded-2xl relative" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-[#FF5C73] text-4xl font-serif absolute top-6 left-6 opacity-30">"</div>
                  <div className="flex mb-4 gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < t.rating ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-[#94A3B8] italic mb-6 leading-relaxed relative z-10">{t.review}</p>
                  <div className="font-bold text-white">— {t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Get In Touch</h2>
          <div className="w-16 h-1 rounded-full mx-auto mb-8" style={{ background: "#FF5C73" }} />
          <div className="space-y-4">
            {gym.phone && (
              <a href={`tel:${gym.phone}`} className="flex items-center justify-center gap-3 p-4 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}>
                <Phone size={18} style={{ color: "#FF5C73" }} />
                <span>{gym.phone}</span>
              </a>
            )}
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="flex items-center justify-center gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}>
                <span>{settings.contact_email}</span>
              </a>
            )}
            {settings.address && (
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                <MapPin size={18} style={{ color: "#FF5C73" }} />
                <span>{settings.address}</span>
              </div>
            )}
          </div>
          {/* Social links */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
                <Share2 size={18} />
              </a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
                <Hash size={18} />
              </a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
                <Video size={18} />
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#25D366", color: "white" }}>
                <MessageSquare size={18} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section id="join" className="py-20 px-6" style={{ background: "rgba(255,92,115,0.04)" }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Join {gym.name}</h2>
            <p style={{ color: "#94A3B8" }}>Fill in your details and we&apos;ll get back to you.</p>
          </div>
          {joinSuccess ? (
            <div className="p-8 rounded-2xl text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">Request Received!</h3>
              <p style={{ color: "#94A3B8" }}>We&apos;ll contact you soon. See you at the gym!</p>
            </div>
          ) : (
            <form onSubmit={handleJoinSubmit} className="p-6 rounded-2xl space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { label: "Full Name *", value: joinName, setter: setJoinName, type: "text", placeholder: "Rahul Sharma" },
                { label: "Phone Number *", value: joinPhone, setter: setJoinPhone, type: "tel", placeholder: "9876543210" },
                { label: "Email (optional)", value: joinEmail, setter: setJoinEmail, type: "email", placeholder: "rahul@email.com" },
              ].map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "#94A3B8" }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    required={field.label.includes("*")}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = "#FF5C73"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={joinLoading}
                className="w-full py-4 rounded-xl text-base font-bold text-white"
                style={{ background: "#FF5C73", boxShadow: "0 4px 20px rgba(255,92,115,0.4)" }}
              >
                {joinLoading ? "Submitting…" : "Submit Request 🚀"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex justify-center gap-6 mb-6">
          <a href="/login" className="text-sm font-semibold transition-colors" style={{ color: "#94A3B8" }}
             onMouseEnter={(e) => (e.currentTarget.style.color = "#FF5C73")}
             onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
            Member Login
          </a>
          <a href="/login" className="text-sm font-semibold transition-colors" style={{ color: "#94A3B8" }}
             onMouseEnter={(e) => (e.currentTarget.style.color = "#FF5C73")}
             onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
            Trainer Login
          </a>
        </div>
        <p className="text-sm mt-4" style={{ color: "#475569" }}>
          © {new Date().getFullYear()} {gym.name}. Powered by{" "}
          <a href="https://gmmx.app" style={{ color: "#FF5C73" }}>GMMX</a>
        </p>

        {/* Sticky Mobile CTA */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex gap-2">
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-xl shadow-xl shadow-black/20" style={{ background: "#25D366", color: "white" }}>
              <MessageSquare size={20} />
            </a>
          )}
          <a href="#join" className="flex-1 flex items-center justify-center font-bold px-4 py-4 rounded-xl shadow-xl shadow-[#FF5C73]/20 text-white" style={{ background: "#FF5C73" }}>
            Book Free Trial
          </a>
        </div>
      </footer>
    </div>
  );
}
