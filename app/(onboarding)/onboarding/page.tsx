"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Globe,
  CreditCard,
  CheckCircle2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { validateSubdomain } from "@/lib/utils";
import { PRICING_PLANS } from "@/types";

const STEPS = [
  { id: 1, title: "Gym Details", icon: Building2 },
  { id: 2, title: "Subdomain", icon: Globe },
  { id: 3, title: "Choose Plan", icon: CreditCard },
  { id: 4, title: "All Set!", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [gymDetails, setGymDetails] = useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });
  const [subdomain, setSubdomain] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "professional" | "enterprise">("starter");

  // Real-time subdomain check
  useEffect(() => {
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
  }, [subdomain]);

  async function handleCreateGym() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gyms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...gymDetails, subdomain, plan: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create gym");
      setStep(4);
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
                    className="mt-1.5 text-xs font-medium hidden sm:block"
                    style={{
                      color: step === s.id ? "var(--color-brand-primary)" : "var(--color-muted-foreground)",
                    }}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-0.5 w-12 sm:w-20 mx-2 transition-all"
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
            {/* Step 1: Gym Details */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-foreground)" }}>
                  Tell us about your gym
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
                  This information will appear on your gym website and profile.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "name", label: "Gym name *", placeholder: "Iron Fit Gym", key: "name" },
                    { id: "ownerName", label: "Your name *", placeholder: "Rajesh Kumar", key: "ownerName" },
                    { id: "phone", label: "Phone number *", placeholder: "+91 98765 43210", key: "phone" },
                    { id: "email", label: "Email address *", placeholder: "gym@ironfit.in", key: "email" },
                    { id: "city", label: "City *", placeholder: "Mumbai", key: "city" },
                    { id: "state", label: "State *", placeholder: "Maharashtra", key: "state" },
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
                      placeholder="123 Fitness Street, Andheri West"
                      value={gymDetails.address}
                      onChange={(e) => setGymDetails({ ...gymDetails, address: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      if (!gymDetails.name || !gymDetails.ownerName || !gymDetails.phone || !gymDetails.email || !gymDetails.city || !gymDetails.state) {
                        setError("Please fill in all required fields");
                        return;
                      }
                      setError("");
                      setStep(2);
                    }}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Subdomain */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-foreground)" }}>
                  Choose your subdomain
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
                  This will be your gym&apos;s website address on GMMX.
                </p>
                <div className="space-y-3">
                  <label className="block text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                    Subdomain
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
                  {subdomainStatus === "available" && (
                    <div
                      className="p-4 rounded-xl mt-2"
                      style={{ background: "var(--color-success-light)", border: "1px solid #86efac" }}
                    >
                      <p className="text-sm font-medium" style={{ color: "#15803d" }}>
                        Your website will be available at:
                      </p>
                      <p className="text-lg font-bold mt-1" style={{ color: "#166534" }}>
                        🌐 {subdomain}.gmmx.app
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={subdomainStatus !== "available"}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{
                      background: "var(--color-brand-primary)",
                      boxShadow: "var(--shadow-brand)",
                      opacity: subdomainStatus !== "available" ? 0.5 : 1,
                      cursor: subdomainStatus !== "available" ? "not-allowed" : "pointer",
                    }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Choose Plan */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-foreground)" }}>
                  Choose your plan
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
                  Start with a 14-day free trial. No credit card required.
                </p>
                <div className="space-y-3">
                  {PRICING_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className="w-full p-4 rounded-xl text-left transition-all"
                      style={{
                        border: `2px solid ${selectedPlan === plan.id ? "var(--color-brand-primary)" : "var(--color-border)"}`,
                        background: selectedPlan === plan.id ? "var(--color-brand-light)" : "var(--color-surface)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: selectedPlan === plan.id ? "var(--color-brand-primary)" : "var(--color-border)" }}
                          >
                            {selectedPlan === plan.id && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-brand-primary)" }} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm" style={{ color: "var(--color-foreground)" }}>
                                {plan.name}
                              </span>
                              {plan.highlighted && (
                                <span className="badge-brand text-xs">Most Popular</span>
                              )}
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                              {plan.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {plan.price > 0 ? (
                            <>
                              <span className="text-lg font-bold" style={{ color: "var(--color-foreground)" }}>₹{plan.price}</span>
                              <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>/mo</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold" style={{ color: "var(--color-brand-primary)" }}>Custom</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {error && (
                  <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626", border: "1px solid #fca5a5" }}>
                    {error}
                  </div>
                )}
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}>
                    ← Back
                  </button>
                  <button
                    onClick={handleCreateGym}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
                    style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)", opacity: loading ? 0.8 : 1 }}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {loading ? "Creating your gym…" : "Launch My Gym 🚀"}
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
                  {gymDetails.name} is now on GMMX.
                </p>
                <p className="text-base font-semibold mb-8" style={{ color: "var(--color-brand-primary)" }}>
                  🌐 {subdomain}.gmmx.app
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
                >
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
