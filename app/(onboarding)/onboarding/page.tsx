"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Settings,
  CheckCircle2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { validateSubdomain } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Gym Information", icon: Building2 },
  { id: 2, title: "Owner Information", icon: User },
  { id: 3, title: "Business Setup", icon: Settings },
  { id: 4, title: "All Set!", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 State
  const [gymDetails, setGymDetails] = useState({
    name: "",
    gymType: "",
    address: "",
    city: "",
    state: "",
    country: "India",
  });

  // Step 2 State
  const [ownerDetails, setOwnerDetails] = useState({
    name: "",
    phone: "",
    whatsapp: "",
  });

  // Step 3 State
  const [subdomain, setSubdomain] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  // Real-time subdomain check
  useEffect(() => {
    if (step !== 3) return;
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

  async function handleNextStep() {
    setLoading(true);
    setError("");

    try {
      let payload = {};
      if (step === 1) {
        if (!gymDetails.name || !gymDetails.city || !gymDetails.state) {
          throw new Error("Please fill in required fields.");
        }
        payload = { step: 1, gymDetails };
      } else if (step === 2) {
        if (!ownerDetails.name || !ownerDetails.phone) {
          throw new Error("Please fill in required fields.");
        }
        payload = { step: 2, ownerDetails };
      } else if (step === 3) {
        if (subdomainStatus !== "available") {
          throw new Error("Please choose an available subdomain.");
        }
        payload = { step: 3, businessSetup: { subdomain } };
      } else if (step === 4) {
        payload = { step: 4 };
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save step");

      if (step < 4) {
        setStep(step + 1);
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm transition-all";
  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--color-brand-primary)";
    e.target.style.boxShadow = "0 0 0 3px rgba(255,92,115,0.1)";
  };
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--color-border)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "var(--color-brand-primary)" }}
        >
          G
        </div>
        <span className="font-bold text-xl tracking-tight" style={{ color: "var(--color-foreground)" }}>
          GMMX
        </span>
        <span className="ml-2 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          — Gym Setup
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step indicators */}
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-bold"
                    style={{
                      background: step > s.id
                        ? "var(--color-success)"
                        : step === s.id
                        ? "var(--color-brand-primary)"
                        : "var(--color-border)",
                      color: step >= s.id ? "white" : "var(--color-muted-foreground)",
                    }}
                  >
                    {step > s.id ? <Check size={16} /> : s.id}
                  </div>
                  <span
                    className="mt-1.5 text-xs font-medium hidden sm:block text-center whitespace-nowrap"
                    style={{
                      color: step === s.id ? "var(--color-brand-primary)" : "var(--color-muted-foreground)",
                    }}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-0.5 w-12 sm:w-16 mx-2 transition-all"
                    style={{
                      background: step > s.id ? "var(--color-success)" : "var(--color-border)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div
            className="p-8 rounded-2xl animate-in"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Step 1: Gym Information */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-foreground)" }}>
                  Gym Information
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
                  Tell us about your gym facility.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "name", label: "Gym Name *", placeholder: "Iron Fit Arena", key: "name" },
                    { id: "gymType", label: "Gym Type", placeholder: "e.g. CrossFit, Traditional", key: "gymType" },
                    { id: "city", label: "City *", placeholder: "Mumbai", key: "city" },
                    { id: "state", label: "State *", placeholder: "Maharashtra", key: "state" },
                    { id: "country", label: "Country", placeholder: "India", key: "country" },
                  ].map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <label htmlFor={field.id} className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        placeholder={field.placeholder}
                        value={gymDetails[field.key as keyof typeof gymDetails]}
                        onChange={(e) => setGymDetails({ ...gymDetails, [field.key]: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="address" className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                      Address
                    </label>
                    <input
                      id="address"
                      placeholder="123 Fitness Street"
                      value={gymDetails.address}
                      onChange={(e) => setGymDetails({ ...gymDetails, address: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
                    style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Owner Information */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-foreground)" }}>
                  Owner Information
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
                  Your contact details.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="ownerName" className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>Full Name *</label>
                    <input
                      id="ownerName"
                      placeholder="John Doe"
                      value={ownerDetails.name}
                      onChange={(e) => setOwnerDetails({ ...ownerDetails, name: e.target.value })}
                      className={inputClass} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>Phone Number *</label>
                    <input
                      id="phone"
                      placeholder="+91 9876543210"
                      value={ownerDetails.phone}
                      onChange={(e) => setOwnerDetails({ ...ownerDetails, phone: e.target.value })}
                      className={inputClass} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="whatsapp" className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>WhatsApp Number</label>
                    <input
                      id="whatsapp"
                      placeholder="+91 9876543210"
                      value={ownerDetails.whatsapp}
                      onChange={(e) => setOwnerDetails({ ...ownerDetails, whatsapp: e.target.value })}
                      className={inputClass} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur}
                    />
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-100">
                    ← Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
                    style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Business Setup */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-foreground)" }}>
                  Business Setup
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
                  Choose your gym&apos;s subdomain. We&apos;ve activated a 14-day free trial.
                </p>
                <div className="space-y-3">
                  <label className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                    Subdomain *
                  </label>
                  <div className="flex rounded-lg overflow-hidden" style={{ border: "1.5px solid", borderColor: subdomainStatus === "available" ? "var(--color-success)" : subdomainStatus === "taken" || subdomainStatus === "invalid" ? "var(--color-danger)" : "var(--color-border)" }}>
                    <input
                      placeholder="ironfit"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1 px-4 py-3 text-sm"
                      style={{ background: "var(--color-surface)", color: "var(--color-foreground)", outline: "none" }}
                    />
                    <div
                      className="flex items-center px-4 text-sm font-medium"
                      style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)", borderLeft: "1px solid var(--color-border)" }}
                    >
                      .gmmx.app
                    </div>
                  </div>
                  {/* Status indicator */}
                  <div className="h-5 flex items-center gap-2">
                    {subdomainStatus === "checking" && (
                      <><Loader2 size={14} className="animate-spin" style={{ color: "var(--color-muted-foreground)" }} /><span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Checking availability…</span></>
                    )}
                    {subdomainStatus === "available" && (
                      <><Check size={14} style={{ color: "var(--color-success)" }} /><span className="text-xs" style={{ color: "var(--color-success)" }}><strong>{subdomain}</strong>.gmmx.app is available!</span></>
                    )}
                    {subdomainStatus === "taken" && (
                      <><X size={14} style={{ color: "var(--color-danger)" }} /><span className="text-xs" style={{ color: "var(--color-danger)" }}>This subdomain is taken. Try another.</span></>
                    )}
                    {subdomainStatus === "invalid" && (
                      <><X size={14} style={{ color: "var(--color-danger)" }} /><span className="text-xs" style={{ color: "var(--color-danger)" }}>{validateSubdomain(subdomain).error}</span></>
                    )}
                  </div>
                  
                  <div className="p-4 rounded-xl mt-6 border-l-4 border-[#FF5C73] bg-rose-50/50">
                    <h3 className="font-semibold text-sm mb-1 text-slate-800">14-Day Free Trial Activated</h3>
                    <p className="text-xs text-slate-600">Your account includes full access to all Professional tier features. Default membership plans will be added automatically to your dashboard.</p>
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gray-100">
                    ← Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={subdomainStatus !== "available" || loading}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex items-center gap-2"
                    style={{
                      background: "var(--color-brand-primary)",
                      boxShadow: "var(--shadow-brand)",
                      opacity: subdomainStatus !== "available" || loading ? 0.5 : 1,
                      cursor: subdomainStatus !== "available" || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Finish Setup →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "var(--color-success-light)" }}
                >
                  <CheckCircle2 size={36} style={{ color: "var(--color-success)" }} />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-foreground)" }}>
                  Your gym is live! 🎉
                </h2>
                <p className="text-sm mb-2" style={{ color: "var(--color-muted-foreground)" }}>
                  Setup is complete.
                </p>
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="px-8 py-3 mt-8 rounded-xl text-sm font-semibold text-white flex items-center gap-2 justify-center mx-auto"
                  style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
