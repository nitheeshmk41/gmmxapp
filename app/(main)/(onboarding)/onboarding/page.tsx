"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/features/onboarding/actions";
import { Loader2, Check } from "lucide-react";

const STEPS = ["Gym Info", "Branding", "Publish"];

const THEME_COLORS = [
  { name: "Coral Pink", value: "#FF5C73" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    gymName: "", 
    tagline: "", 
    phone: "", 
    themeColor: "#FF5C73", 
    themeStyle: "modern",
    subdomain: "",
  });

  useEffect(() => {
    if (formData.gymName && !formData.subdomain && step === 1) {
      setFormData(prev => ({
        ...prev,
        subdomain: prev.gymName.toLowerCase().replace(/[^a-z0-9]/g, "")
      }));
    }
  }, [formData.gymName, step]);

  const handleNext = () => {
    setError("");
    if (step === 1 && (!formData.gymName || !formData.phone)) {
      setError("Gym Name and Phone are required.");
      return;
    }
    if (step === 2 && !formData.subdomain) {
      setError("Subdomain is required.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    const submitData = new FormData();
    submitData.append("gymName", formData.gymName);
    submitData.append("subdomain", formData.subdomain);
    submitData.append("tagline", formData.tagline);
    submitData.append("phone", formData.phone);
    submitData.append("themeStyle", formData.themeStyle);
    submitData.append("primaryColor", formData.themeColor);

    const res = await completeOnboarding(submitData);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
      const proto = window.location.protocol;
      window.location.href = `${proto}//${formData.subdomain}.${appDomain}/dashboard`;
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] outline-none transition-all";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold bg-[#FF5C73]">G</div>
        <span className="font-bold text-lg">GMMX Setup</span>
        <div className="ml-auto flex gap-2 items-center">
           <span className="text-sm font-medium text-zinc-500">Step {step} of {STEPS.length}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 py-12">
        <div className="w-full max-w-xl bg-white dark:bg-zinc-950 p-8 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div><h2 className="text-2xl font-bold">Step 1 — Gym Info</h2><p className="text-zinc-500">Let's get started.</p></div>
              <div className="space-y-4">
                <div><label className="text-sm font-medium block mb-1">Gym Name *</label><input className={inputClass} placeholder="PSG Fitness Center" value={formData.gymName} onChange={e=>setFormData({...formData, gymName: e.target.value})} /></div>
                <div><label className="text-sm font-medium block mb-1">Tagline</label><input className={inputClass} placeholder="Stronger Every Day" value={formData.tagline} onChange={e=>setFormData({...formData, tagline: e.target.value})} /></div>
                <div><label className="text-sm font-medium block mb-1">Contact Number *</label><input className={inputClass} placeholder="+91 9876543210" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div><h2 className="text-2xl font-bold">Step 2 — Branding</h2><p className="text-zinc-500">How you want to look online.</p></div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium block mb-1">Website URL *</label>
                  <div className="flex items-center gap-2">
                    <input className={inputClass} placeholder="psgfitness" value={formData.subdomain} onChange={e=>setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")})} />
                    <span className="text-zinc-500 font-medium">.gmmx.app</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Theme Color</label>
                  <div className="flex gap-3">
                    {THEME_COLORS.map(c => (
                      <button key={c.name} onClick={() => setFormData({...formData, themeColor: c.value})} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${formData.themeColor === c.value ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-white scale-110" : ""}`} style={{ backgroundColor: c.value }}>
                        {formData.themeColor === c.value && <Check size={16} color="white" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Theme Style</label>
                  <select className={inputClass} value={formData.themeStyle} onChange={e => setFormData({...formData, themeStyle: e.target.value})}>
                    <option value="modern">Modern</option>
                    <option value="luxury">Luxury</option>
                    <option value="hardcore">Hardcore</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center">
              <div><h2 className="text-2xl font-bold">Step 3 — Publish</h2><p className="text-zinc-500">You're ready to go live in 5 minutes!</p></div>
              <div className="py-8">
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Your Website URL</div>
                <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-green-50 text-green-700 font-mono text-lg border border-green-200">
                  {formData.subdomain}.gmmx.app
                </div>
                <p className="mt-6 text-sm text-zinc-500">You can update services, pricing, trainers, gallery and more from your owner dashboard later.</p>
              </div>
            </div>
          )}

          <div className="mt-10 flex gap-4">
            {step > 1 && <button onClick={handleBack} disabled={loading} className="px-6 py-3.5 rounded-xl font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors disabled:opacity-50">Back</button>}
            
            {step < STEPS.length ? (
              <button onClick={handleNext} className="flex-1 px-6 py-3.5 rounded-xl font-semibold bg-[#FF5C73] text-white hover:bg-[#FF5C73]/90 shadow-lg shadow-[#FF5C73]/20 transition-all">Next</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !formData.subdomain} className="flex-1 px-6 py-3.5 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />} Publish Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
