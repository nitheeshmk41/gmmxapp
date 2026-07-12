"use client";


import { useState } from "react";
import { MessageSquare, Phone, MapPin, Share2, Video, Hash, Menu, X } from "lucide-react";
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

  const { logEvent } = useTracker(gym.id);

  const whatsappUrl = settings.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number, `Hi ${gym.name}, I'm interested in joining!`)
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
      source: "website",
      ...utmData
    });
    logEvent("join_form_submitted");
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
          <a href="/login" className="text-sm font-medium transition-colors" style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}>
            Login
          </a>
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
            <a href="/login" onClick={() => setMenuOpen(false)} className="text-2xl font-bold text-white">Login</a>
            <a href="#join" onClick={() => setMenuOpen(false)} className="px-8 py-3 rounded-xl text-lg font-bold text-white" style={{ background: "#FF5C73" }}>Book Free Trial</a>
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center pt-20"
        style={{
          background: `linear-gradient(rgba(10, 15, 30, 0.7), rgba(10, 15, 30, 0.9)), url(${
            settings.hero_image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
          }) center/cover`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FF5C73, transparent)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #3B82F6, transparent)", filter: "blur(60px)" }} />
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6">
            {settings.hero_title ? (
              settings.hero_title
            ) : (
              <>
                Train Hard. <br />
                <span style={{ color: "#FF5C73" }}>Stay Strong.</span>
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-medium" style={{ color: "#94A3B8" }}>
            {settings.tagline || `Premium Strength & Fitness Training in your city.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#join" onClick={() => logEvent("hero_join")} className="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl shadow-[#FF5C73]/20 hover:scale-105 transition-transform w-full sm:w-auto" style={{ background: "#FF5C73" }}>
              Book Free Trial
            </a>
            <a href="#plans" onClick={() => logEvent("hero_plans")} className="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform w-full sm:w-auto" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
              View Plans
            </a>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-6" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-10 md:gap-20 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black text-white mb-1">500+</div>
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FF5C73" }}>Active Members</div>
          </div>
          <div className="hidden md:block w-px h-12" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div>
            <div className="text-3xl md:text-4xl font-black text-white mb-1">10+</div>
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FF5C73" }}>Years Experience</div>
          </div>
          <div className="hidden md:block w-px h-12" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div>
            <div className="text-3xl md:text-4xl font-black text-white mb-1">5</div>
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FF5C73" }}>Expert Trainers</div>
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

      {/* Why Choose Us */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4">Why Choose Us</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Modern Equipment", icon: "🏋️‍♂️", desc: "Top of the line machines and free weights." },
              { title: "Certified Trainers", icon: "👨‍🏫", desc: "Expert guidance to reach your goals safely." },
              { title: "Nutrition Guidance", icon: "🥗", desc: "Personalized diet plans for maximum results." },
              { title: "Flexible Timings", icon: "🕒", desc: "Open early morning to late night." },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl text-center transition-transform hover:scale-105" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm" style={{ color: "#94A3B8" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
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
                  <div className="space-y-2 mb-6 text-left">
                    {["Gym Access", "Trainer Support", "Locker Access"].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm font-medium" style={{ color: i === 1 ? "white" : "#E2E8F0" }}>
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: i === 1 ? "white" : "#10B981" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
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
      <section id="trainers" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4">Our Trainers</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(trainers.length > 0 ? trainers : [
              { id: '1', name: 'Arun Kumar', specialization: 'Strength Coach', experience_years: 8, photo_url: null, bio: 'Certified strength and conditioning specialist.' },
              { id: '2', name: 'Priya Singh', specialization: 'Yoga & Mobility', experience_years: 5, photo_url: null, bio: 'Expert in flexibility, recovery, and core strength.' },
              { id: '3', name: 'Vikram Reddy', specialization: 'HIIT & Cardio', experience_years: 6, photo_url: null, bio: 'High energy trainer to push you to your limits.' },
            ]).map((trainer) => (
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
      {/* Gallery */}
      <section id="gallery" className="py-20 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4">Gallery</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(settings.gallery_urls.length > 0 ? settings.gallery_urls : [
              "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&q=80",
              "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80",
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
              "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80",
              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80",
              "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&q=80",
            ]).map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img src={url} alt={`${gym.name} gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4">Success Stories</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "#FF5C73" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(testimonials && testimonials.length > 0 ? testimonials : [
              { id: '1', name: 'Rahul', review: 'Lost 12kg in 4 months. The trainers here are incredibly supportive and the equipment is top-notch. Highly recommended!', rating: 5 },
              { id: '2', name: 'Priya', review: 'Best trainers in the city! They really push you to achieve your potential. I’ve never felt stronger.', rating: 5 },
              { id: '3', name: 'Sanjay', review: 'Great community and positive environment. The flexible timings make it super easy to stay consistent with my workouts.', rating: 5 },
            ]).map((t) => (
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
              <a href="https://share.google/rIzmolqvL89QesguI" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 rounded-xl transition-all hover:bg-white/5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin size={18} style={{ color: "#FF5C73" }} />
                  <span>{settings.address}</span>
                </div>
                <div className="w-full h-32 rounded-lg overflow-hidden relative mt-2 group">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center z-10">
                    <span className="px-4 py-2 bg-[#FF5C73] text-white text-xs font-bold rounded-full shadow-lg">View on Google Maps</span>
                  </div>
                  {/* Decorative map background since we can't iframe share.google links securely */}
                  <div className="w-full h-full bg-slate-800 opacity-50" style={{ backgroundImage: "radial-gradient(#475569 1px, transparent 1px)", backgroundSize: "12px 12px" }}></div>
                </div>
              </a>
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
      <footer className="pt-20 pb-8 px-6" style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {gym.logo_url
                ? <img src={gym.logo_url} alt={gym.name} className="w-10 h-10 rounded-xl object-contain bg-white/5" />
                : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "#FF5C73" }}>{gym.name[0]}</div>
              }
              <span className="font-bold text-white text-2xl">{gym.name}</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#94A3B8" }}>
              {settings.description || "Premium fitness center helping members build strength, lose weight and stay healthy."}
            </p>
            <div className="flex gap-4">
              {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"><Share2 size={18} /></a>}
              {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"><Hash size={18} /></a>}
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"><MessageSquare size={18} /></a>}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm" style={{ color: "#FF5C73" }}>Contact</h4>
            <div className="space-y-4">
              {gym.phone && <a href={`tel:${gym.phone}`} className="flex items-center gap-3 text-sm hover:text-white transition-colors" style={{ color: "#94A3B8" }}><Phone size={16} /> {gym.phone}</a>}
              {settings.contact_email && <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 text-sm hover:text-white transition-colors" style={{ color: "#94A3B8" }}>✉️ {settings.contact_email}</a>}
              {settings.address && <div className="flex items-start gap-3 text-sm" style={{ color: "#94A3B8" }}><MapPin size={16} className="mt-0.5 flex-shrink-0" /> {settings.address}</div>}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm" style={{ color: "#FF5C73" }}>Links</h4>
            <div className="space-y-3">
              <a href="/login" className="block text-sm hover:text-white transition-colors" style={{ color: "#94A3B8" }}>Member Login</a>
              <a href="/login" className="block text-sm hover:text-white transition-colors" style={{ color: "#94A3B8" }}>Trainer Login</a>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-sm" style={{ color: "#475569" }}>
            © {new Date().getFullYear()} {gym.name}. Powered by <a href="https://gmmx.app" className="font-bold hover:underline" style={{ color: "#FF5C73" }}>GMMX</a>
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp CTA */}
      {whatsappUrl && (
        <a href={whatsappUrl} onClick={() => logEvent("whatsapp_floating")} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform" style={{ background: "#25D366", color: "white" }}>
          <MessageSquare size={24} />
          <span className="font-bold hidden sm:block text-sm">Chat on WhatsApp</span>
        </a>
      )}

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-6 left-6 z-50 flex gap-2" style={{ right: whatsappUrl ? '90px' : '24px' }}>
        <a href="#join" onClick={() => logEvent("join_sticky")} className="flex-1 flex items-center justify-center font-bold px-4 py-3 rounded-full shadow-2xl shadow-[#FF5C73]/20 text-white text-sm" style={{ background: "#FF5C73" }}>
          Book Free Trial
        </a>
      </div>
    </div>
  );
}
