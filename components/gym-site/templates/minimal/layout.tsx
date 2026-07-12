"use client";

import { useState } from "react";
import { Phone, MapPin, MessageSquare } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createPublicLead } from "@/features/leads/actions";
import { useTracker } from "@/hooks/useTracker";

interface GymData { id: string; name: string; phone: string; email: string; logo_url: string | null; }
interface Settings { hero_image_url: string | null; description: string | null; tagline: string | null; gallery_urls: string[]; social_instagram: string | null; social_facebook: string | null; social_youtube: string | null; whatsapp_number: string | null; contact_email: string | null; address: string | null; }
interface Plan { id: string; name: string; price: number; duration_days: number; description: string | null; }
interface Trainer { id: string; name: string; specialization: string | null; experience_years: number | null; photo_url: string | null; bio: string | null; }
interface Testimonial { id: string; name: string; review: string; rating: number; }
interface Props { gym: GymData; settings: Settings; plans: Plan[]; trainers: Trainer[]; testimonials: Testimonial[]; services: string[]; }

export function MinimalTemplate({ gym, settings, plans, trainers, testimonials, services }: Props) {
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);

  const { logEvent } = useTracker(gym.id);

  const whatsappUrl = settings.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number, `Hi, I'm interested in joining ${gym.name}!`)
    : null;

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    let utmData = {};
    try {
      const stored = localStorage.getItem(`gmmx_utm_${gym.id}`);
      if (stored) utmData = JSON.parse(stored);
    } catch (e) {}

    await createPublicLead({ gymId: gym.id, name: joinName, phone: joinPhone, source: "website", ...utmData });
    logEvent("join_form_submitted");
    setJoinSuccess(true);
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#111827" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
        <span className="font-black text-xl tracking-tight">{gym.name}</span>
        <div className="flex items-center gap-8">
          {["Plans", "Trainers", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">{item}</a>
          ))}
          <a href="#join" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#111827" }}>Join Now</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[80vh] flex items-center px-8 py-20" style={{
        background: settings.hero_image_url
          ? `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${settings.hero_image_url}) center/cover`
          : "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
      }}>
        <div className="max-w-2xl">
          {settings.tagline && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ background: "#FFF0F2", color: "#FF5C73" }}>
              {settings.tagline}
            </div>
          )}
          <h1 className="text-6xl font-black mb-4 leading-tight">{gym.name}</h1>
          {settings.description && <p className="text-xl text-gray-500 mb-8 leading-relaxed">{settings.description}</p>}
          <div className="flex gap-4">
            <a href="#join" onClick={() => logEvent("hero_join")} className="px-8 py-4 rounded-xl text-base font-bold text-white" style={{ background: "#111827" }}>Join Today →</a>
            {whatsappUrl && (
              <a href={whatsappUrl} onClick={() => logEvent("whatsapp_hero")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold" style={{ background: "#F3F4F6", color: "#111827" }}>
                <MessageSquare size={18} style={{ color: "#25D366" }} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Plans */}
      {plans.length > 0 && (
        <section id="plans" className="py-20 px-8" style={{ background: "#F9FAFB" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-12">Membership Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="p-6 bg-white rounded-2xl" style={{ border: "1px solid #E5E7EB" }}>
                  <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-black mb-1">₹{Number(plan.price).toLocaleString("en-IN")}</p>
                  <p className="text-sm text-gray-400 mb-4">{plan.duration_days} days</p>
                  {plan.description && <p className="text-sm text-gray-500 mb-4">{plan.description}</p>}
                  <a href="#join" className="block text-center py-3 rounded-xl text-sm font-bold" style={{ background: "#111827", color: "white" }}>Select Plan</a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trainers */}
      {trainers.length > 0 && (
        <section id="trainers" className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-12">Our Trainers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trainers.map((t) => (
                <div key={t.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold" style={{ background: "#111827" }}>
                    {t.photo_url ? <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" /> : t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    {t.specialization && <p className="text-sm text-gray-500">{t.specialization}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact + Join */}
      <section id="contact" className="py-20 px-8" style={{ background: "#F9FAFB" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-black mb-6">Contact Us</h2>
            <div className="space-y-3">
              {gym.phone && <div className="flex gap-3"><Phone size={18} /><span>{gym.phone}</span></div>}
              {settings.address && <div className="flex gap-3"><MapPin size={18} /><span>{settings.address}</span></div>}
            </div>
          </div>
          <div id="join">
            <h2 className="text-2xl font-black mb-6">Join Now</h2>
            {joinSuccess ? (
              <p className="text-green-600 font-semibold">✓ Thank you! We&apos;ll contact you soon.</p>
            ) : (
              <form onSubmit={handleJoin} className="space-y-3">
                <input required value={joinName} onChange={(e) => setJoinName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 rounded-xl text-sm" style={{ border: "1px solid #E5E7EB", outline: "none" }} />
                <input required value={joinPhone} onChange={(e) => setJoinPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl text-sm" style={{ border: "1px solid #E5E7EB", outline: "none" }} />
                <button type="submit" className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#111827" }}>Send Request</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="py-6 px-8 text-center text-sm text-gray-400" style={{ borderTop: "1px solid #E5E7EB" }}>
        © {new Date().getFullYear()} {gym.name}. Powered by <a href="https://gmmx.app" style={{ color: "#FF5C73" }}>GMMX</a>
      </footer>
    </div>
  );
}
