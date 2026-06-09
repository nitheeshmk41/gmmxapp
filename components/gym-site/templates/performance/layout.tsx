"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createPublicLead } from "@/features/leads/actions";

interface GymData { id: string; name: string; phone: string; email: string; logo_url: string | null; }
interface Settings { hero_image_url: string | null; description: string | null; tagline: string | null; gallery_urls: string[]; social_instagram: string | null; social_facebook: string | null; social_youtube: string | null; whatsapp_number: string | null; contact_email: string | null; address: string | null; }
interface Plan { id: string; name: string; price: number; duration_days: number; description: string | null; }
interface Trainer { id: string; name: string; specialization: string | null; experience_years: number | null; photo_url: string | null; bio: string | null; }
interface Props { gym: GymData; settings: Settings; plans: Plan[]; trainers: Trainer[]; }

export function PerformanceTemplate({ gym, settings, plans }: Props) {
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);

  const whatsappUrl = settings.whatsapp_number
    ? buildWhatsAppUrl(settings.whatsapp_number, `Hi, I want to join ${gym.name}!`)
    : null;

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    await createPublicLead({ gymId: gym.id, name: joinName, phone: joinPhone, source: "website" });
    setJoinSuccess(true);
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0A0A0A", color: "white" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: "#0A0A0A", borderBottom: "2px solid #FF5C73" }}>
        <div className="flex items-center gap-2">
          <Zap size={22} style={{ color: "#FF5C73" }} />
          <span className="font-black text-xl tracking-tight uppercase">{gym.name}</span>
        </div>
        <div className="flex items-center gap-6">
          {["Plans", "Trainers", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-wider transition-colors text-gray-400 hover:text-white">{item}</a>
          ))}
          <a href="#join" className="px-4 py-2 text-sm font-black uppercase tracking-wider text-black" style={{ background: "#FF5C73" }}>JOIN NOW</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-end pb-24 px-8 pt-32" style={{
        background: settings.hero_image_url
          ? `linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.4) 100%), url(${settings.hero_image_url}) right center/cover`
          : "linear-gradient(135deg, #0A0A0A 0%, #1A0A0A 100%)",
      }}>
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12" style={{ background: "#FF5C73" }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#FF5C73" }}>
              {settings.tagline || "Elite Fitness"}
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black uppercase leading-none mb-4">
            {gym.name.split(" ").map((word, i) => (
              <span key={i} style={{ display: "block", color: i % 2 === 0 ? "white" : "#FF5C73" }}>{word}</span>
            ))}
          </h1>
          {settings.description && <p className="text-lg text-gray-400 mb-8 max-w-lg">{settings.description}</p>}
          <div className="flex gap-4">
            <a href="#join" className="px-8 py-4 text-base font-black uppercase tracking-wider text-black" style={{ background: "#FF5C73" }}>START NOW →</a>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 text-base font-black uppercase tracking-wider text-white" style={{ border: "2px solid #FF5C73" }}>
                WHATSAPP
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Plans */}
      {plans.length > 0 && (
        <section id="plans" className="py-24 px-8" style={{ background: "#111111" }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-1 w-12" style={{ background: "#FF5C73" }} />
              <h2 className="text-4xl font-black uppercase tracking-tight">Membership Plans</h2>
            </div>
            <div className="space-y-4">
              {plans.map((plan, i) => (
                <div key={plan.id} className="flex items-center justify-between p-6" style={{
                  background: i === 0 ? "#FF5C73" : "#1A1A1A",
                  border: i !== 0 ? "1px solid #2A2A2A" : "none",
                }}>
                  <div>
                    <h3 className="text-2xl font-black uppercase">{plan.name}</h3>
                    <p className="text-sm" style={{ color: i === 0 ? "rgba(0,0,0,0.6)" : "#666" }}>{plan.duration_days} days • {plan.description}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-4xl font-black">₹{Number(plan.price).toLocaleString("en-IN")}</span>
                    <a href="#join" className="px-6 py-3 text-sm font-black uppercase" style={{
                      background: i === 0 ? "black" : "#FF5C73",
                      color: "white",
                    }}>SELECT</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact + Join */}
      <section id="contact" className="py-24 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12" style={{ background: "#FF5C73" }} />
              <h2 className="text-3xl font-black uppercase">Contact</h2>
            </div>
            <div className="space-y-4">
              {gym.phone && <p className="text-lg font-bold">{gym.phone}</p>}
              {settings.address && <p className="text-gray-400">{settings.address}</p>}
            </div>
          </div>
          <div id="join">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12" style={{ background: "#FF5C73" }} />
              <h2 className="text-3xl font-black uppercase">Join Now</h2>
            </div>
            {joinSuccess ? (
              <p style={{ color: "#FF5C73", fontWeight: "bold", fontSize: "1.125rem" }}>✓ REQUEST RECEIVED. WE&apos;LL CONTACT YOU!</p>
            ) : (
              <form onSubmit={handleJoin} className="space-y-4">
                {[
                  { value: joinName, setter: setJoinName, placeholder: "YOUR NAME" },
                  { value: joinPhone, setter: setJoinPhone, placeholder: "PHONE NUMBER" },
                ].map((field) => (
                  <input key={field.placeholder} required value={field.value} onChange={(e) => field.setter(e.target.value)} placeholder={field.placeholder}
                    className="w-full px-4 py-4 text-sm font-bold tracking-wider text-white" style={{ background: "#1A1A1A", border: "none", outline: "none" }} />
                ))}
                <button type="submit" className="w-full py-4 text-base font-black uppercase tracking-wider text-black" style={{ background: "#FF5C73" }}>
                  JOIN THE TEAM →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="py-6 px-8 text-center text-xs font-bold uppercase tracking-widest text-gray-600" style={{ borderTop: "1px solid #1A1A1A" }}>
        © {new Date().getFullYear()} {gym.name} · Powered by GMMX
      </footer>
    </div>
  );
}
