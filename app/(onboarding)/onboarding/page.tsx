"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Globe,
  Palette,
  LayoutTemplate,
  Rocket,
  CheckCircle2,
  Loader2,
  Check,
  X,
  Upload,
} from "lucide-react";
import { validateSubdomain } from "@/lib/utils";
import { completeOnboarding } from "@/features/onboarding/actions";

const STEPS = [
  { id: 1, title: "Gym Info", icon: Building2 },
  { id: 2, title: "Subdomain", icon: Globe },
  { id: 3, title: "Branding", icon: Palette },
  { id: 4, title: "Template", icon: LayoutTemplate },
  { id: 5, title: "Launch", icon: Rocket },
];

function OnboardingContent() {
  const searchParams = useSearchParams();
  const initialGymName = searchParams?.get("gymName") || "";
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Gym Details
  const [gymDetails, setGymDetails] = useState({
    name: initialGymName,
    phone: "",
    city: "",
    state: "",
    country: "India",
  });

  // Step 2: Subdomain
  const [subdomain, setSubdomain] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  // Step 3: Branding
  const [branding, setBranding] = useState({
    primaryColor: "#FF5C73",
    secondaryColor: "#1A1A1A",
    logoUrl: "", // Mocked for now
    coverImageUrl: "", // Mocked for now
  });

  // Step 4: Template
  const [template, setTemplate] = useState("modern"); // modern, crossfit, minimal

  useEffect(() => {
    if (initialGymName && !subdomain) {
      const baseSubdomain = initialGymName.toLowerCase().replace(/[^a-z0-9]/g, "");
      setSubdomain(baseSubdomain);
    }
  }, [initialGymName]);

  // Real-time subdomain check
  useEffect(() => {
    if (step !== 2) return;
    if (!subdomain) {
      const t = setTimeout(() => setSubdomainStatus("idle"), 0);
      return () => clearTimeout(t);
    }
    const { valid } = validateSubdomain(subdomain);
    if (!valid) {
      const t = setTimeout(() => setSubdomainStatus("invalid"), 0);
      return () => clearTimeout(t);
    }
    
    const tCheck = setTimeout(() => setSubdomainStatus("checking"), 0);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/gyms/check-subdomain?subdomain=${subdomain}`);
        const data = await res.json();
        setSubdomainStatus(data.available ? "available" : "taken");
      } catch {
        setSubdomainStatus("idle");
      }
    }, 500);
    return () => {
      clearTimeout(tCheck);
      clearTimeout(timer);
    };
  }, [subdomain, step]);

  async function handleLaunch() {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("gymName", gymDetails.name);
      formData.append("phone", gymDetails.phone);
      formData.append("subdomain", subdomain);
      formData.append("plan", "starter"); // Trial starts on professional implicitly
      
      formData.append("template", template);
      formData.append("primaryColor", branding.primaryColor);
      formData.append("secondaryColor", branding.secondaryColor);
      if (branding.logoUrl) formData.append("logoUrl", branding.logoUrl);
      if (branding.coverImageUrl) formData.append("coverImageUrl", branding.coverImageUrl);
      
      const result = await completeOnboarding(formData);
      if (result.error) throw new Error(result.error);
      
      setStep(6); // Success screen
      
      // Redirect to their new subdomain
      setTimeout(() => {
        const proto = window.location.protocol;
        const host = window.location.host;
        const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
        
        if (isLocalhost) {
           window.location.href = `${proto}//${host}?gym=${result.subdomain}`;
        } else {
           const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
           window.location.href = `${proto}//${result.subdomain}.${baseDomain}`;
        }
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    setError("");
    if (step === 1 && (!gymDetails.name || !gymDetails.phone || !gymDetails.city)) {
      setError("Please fill in required fields.");
      return;
    }
    if (step === 2 && subdomainStatus !== "available") {
      setError("Please choose an available subdomain.");
      return;
    }
    if (step === 5) {
      handleLaunch();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSkipBranding = () => {
    setStep((s) => s + 1);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm transition-all bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73]";

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-[#FF5C73]">
          G
        </div>
        <span className="font-bold text-xl tracking-tight">GMMX</span>
        <span className="ml-2 text-sm text-zinc-500">— Website Setup</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Progress Indicator */}
          {step <= 5 && (
            <div className="flex items-center justify-between mb-12 relative">
              <div className="absolute left-0 top-5 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-bold border-2 ${
                      step > s.id
                        ? "bg-green-500 border-green-500 text-white"
                        : step === s.id
                        ? "bg-white dark:bg-zinc-900 border-[#FF5C73] text-[#FF5C73]"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                    }`}
                  >
                    {step > s.id ? <Check size={16} /> : <s.icon size={18} />}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      step >= s.id ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Step Content Wrapper */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5 dark:shadow-none animate-in fade-in slide-in-from-bottom-4">
            
            {/* Step 1: Gym Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Gym Information</h2>
                  <p className="text-zinc-500">Tell us a bit about your business to get started.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Gym Name *</label>
                    <input
                      placeholder="e.g. Iron Fit Arena"
                      value={gymDetails.name}
                      onChange={(e) => setGymDetails({ ...gymDetails, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mobile Number *</label>
                    <input
                      placeholder="e.g. 9876543210"
                      value={gymDetails.phone}
                      onChange={(e) => setGymDetails({ ...gymDetails, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">City *</label>
                    <input
                      placeholder="Mumbai"
                      value={gymDetails.city}
                      onChange={(e) => setGymDetails({ ...gymDetails, city: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">State / Province</label>
                    <input
                      placeholder="Maharashtra"
                      value={gymDetails.state}
                      onChange={(e) => setGymDetails({ ...gymDetails, state: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Subdomain */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Choose your website address</h2>
                  <p className="text-zinc-500">This will be your gym&apos;s primary domain.</p>
                </div>
                
                <div className="mt-8">
                  <div className={`flex rounded-xl overflow-hidden border-2 transition-colors ${
                    subdomainStatus === "available" ? "border-green-500" : 
                    subdomainStatus === "taken" || subdomainStatus === "invalid" ? "border-red-500" : 
                    "border-zinc-200 dark:border-zinc-800"
                  }`}>
                    <input
                      placeholder="ironfit"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1 px-6 py-4 text-xl outline-none bg-transparent"
                    />
                    <div className="flex items-center px-6 text-xl font-medium bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 text-zinc-500">
                      .gmmx.app
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="h-6 mt-3 flex items-center gap-2 px-1">
                    {subdomainStatus === "checking" && (
                      <><Loader2 size={16} className="animate-spin text-zinc-400" /><span className="text-sm text-zinc-400">Checking availability…</span></>
                    )}
                    {subdomainStatus === "available" && (
                      <><Check size={16} className="text-green-500" /><span className="text-sm text-green-600 dark:text-green-400"><strong>{subdomain}</strong>.gmmx.app is available!</span></>
                    )}
                    {subdomainStatus === "taken" && (
                      <><X size={16} className="text-red-500" /><span className="text-sm text-red-600 dark:text-red-400">This subdomain is already taken.</span></>
                    )}
                    {subdomainStatus === "invalid" && (
                      <><X size={16} className="text-red-500" /><span className="text-sm text-red-600 dark:text-red-400">{validateSubdomain(subdomain).error}</span></>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Branding */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Upload Branding</h2>
                    <p className="text-zinc-500">Customize your website&apos;s look and feel. You can also do this later.</p>
                  </div>
                  <button onClick={handleSkipBranding} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    Setup Later
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Colors */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Brand Colors</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                          <input 
                            type="color" 
                            value={branding.primaryColor}
                            onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium block mb-1">Primary Color</label>
                          <input type="text" value={branding.primaryColor} readOnly className={inputClass} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                          <input 
                            type="color" 
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium block mb-1">Secondary Color</label>
                          <input type="text" value={branding.secondaryColor} readOnly className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Brand Images</h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <Upload size={20} className="text-zinc-400 mb-2" />
                        <span className="text-sm font-medium">Upload Logo</span>
                        <span className="text-xs text-zinc-500 mt-1">PNG, JPG (Max 2MB)</span>
                      </div>
                      <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <Upload size={20} className="text-zinc-400 mb-2" />
                        <span className="text-sm font-medium">Upload Cover Photo</span>
                        <span className="text-xs text-zinc-500 mt-1">PNG, JPG (Max 5MB)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Template */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Choose Website Template</h2>
                  <p className="text-zinc-500">Pick a starting layout for your new website.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "modern", name: "Modern Fitness", desc: "Clean & professional" },
                    { id: "crossfit", name: "CrossFit", desc: "Aggressive & dark" },
                    { id: "minimal", name: "Minimal", desc: "Simple & elegant" }
                  ].map((tpl) => (
                    <div 
                      key={tpl.id}
                      onClick={() => setTemplate(tpl.id)}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        template === tpl.id 
                          ? "border-[#FF5C73] bg-[#FF5C73]/5 dark:bg-[#FF5C73]/10" 
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-4 mb-3 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                        <LayoutTemplate className={template === tpl.id ? "text-[#FF5C73]" : "text-zinc-400"} />
                      </div>
                      <h3 className="font-semibold">{tpl.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{tpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Launch */}
            {step === 5 && (
              <div className="text-center py-6">
                <Rocket size={48} className="text-[#FF5C73] mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Ready for Liftoff</h2>
                <p className="text-zinc-500 max-w-md mx-auto mb-8">
                  Your website <strong>{subdomain}.gmmx.app</strong> and management dashboard are ready to be created.
                </p>
                
                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 max-w-sm mx-auto mb-8 text-left">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-zinc-500">Gym Name:</span>
                    <span className="font-medium">{gymDetails.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-zinc-500">Domain:</span>
                    <span className="font-medium">{subdomain}.gmmx.app</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Plan:</span>
                    <span className="font-medium text-green-500">14-Day Free Trial</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Success Redirect */}
            {step === 6 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100 dark:bg-green-500/20">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your website is live! 🎉</h2>
                <p className="text-zinc-500 mb-8">Redirecting you to your brand new site...</p>
                <Loader2 size={24} className="animate-spin text-[#FF5C73] mx-auto" />
              </div>
            )}

            {/* Error Message */}
            {error && <div className="p-3 mt-6 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-medium border border-red-200 dark:border-red-500/20">{error}</div>}

            {/* Navigation Buttons */}
            {step < 6 && (
              <div className="mt-10 flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {step > 1 ? (
                  <button 
                    onClick={() => setStep(s => s - 1)} 
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Back
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  disabled={loading || (step === 2 && subdomainStatus !== "available")}
                  className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition-all flex items-center gap-2 bg-[#FF5C73] hover:bg-[#FF5C73]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF5C73]/20"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {step === 5 ? "Start 14-Day Free Trial" : "Continue"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
