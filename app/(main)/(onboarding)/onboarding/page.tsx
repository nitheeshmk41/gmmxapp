"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Globe,
  Rocket,
  CheckCircle2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { validateSubdomain } from "@/lib/utils";
import { completeOnboarding } from "@/features/onboarding/actions";

const STEPS = [
  { id: 1, title: "Gym Info", icon: Building2 },
  { id: 2, title: "Website Address", icon: Globe },
  { id: 3, title: "Create Gym", icon: Rocket },
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
  });

  // Step 2: Subdomain
  const [subdomain, setSubdomain] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  // Step 3 Progress
  const [launchProgress, setLaunchProgress] = useState(0);

  useEffect(() => {
    if (gymDetails.name && !subdomain && step === 2) {
      const baseSubdomain = gymDetails.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      setSubdomain(baseSubdomain);
    }
  }, [gymDetails.name, step]);

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
    setStep(3);
    setLaunchProgress(1); // Creating Account

    try {
      const formData = new FormData();
      formData.append("gymName", gymDetails.name);
      formData.append("phone", gymDetails.phone);
      formData.append("subdomain", subdomain);
      formData.append("plan", "professional"); // Trial starts on professional
      
      // Simulate progress Steps (Database, Website, Admin)
      setTimeout(() => setLaunchProgress(2), 1500);
      setTimeout(() => setLaunchProgress(3), 3000);
      setTimeout(() => setLaunchProgress(4), 4500);
      
      const result = await completeOnboarding(formData);
      
      if (result.error) throw new Error(result.error);
      
      setTimeout(() => {
        setLaunchProgress(5); // Done
        // No automatic redirect anymore
      }, 5000); // Ensuring the visual progress takes at least 5s

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
      setStep(2); // Go back if error
    }
  }

  const handleNext = () => {
    setError("");
    if (step === 1 && (!gymDetails.name || !gymDetails.phone || !gymDetails.city)) {
      setError("Please fill in all required fields.");
      return;
    }
    if (step === 2 && subdomainStatus !== "available") {
      setError("Please choose an available subdomain.");
      return;
    }
    if (step === 2) {
      handleLaunch();
      return;
    }
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
        <span className="ml-2 text-sm text-zinc-500">— Setup</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          {step <= 2 && (
            <div className="flex items-center justify-between mb-12 relative max-w-sm mx-auto">
              <div className="absolute left-0 top-5 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
              {STEPS.slice(0, 2).map((s) => (
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
                  <p className="text-zinc-500">Let&apos;s get your business set up.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Gym Name</label>
                    <input
                      placeholder="e.g. Iron Fit Arena"
                      value={gymDetails.name}
                      onChange={(e) => setGymDetails({ ...gymDetails, name: e.target.value })}
                      className={inputClass}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mobile Number</label>
                    <input
                      placeholder="e.g. 9876543210"
                      value={gymDetails.phone}
                      onChange={(e) => setGymDetails({ ...gymDetails, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">City</label>
                    <input
                      placeholder="e.g. Mumbai"
                      value={gymDetails.city}
                      onChange={(e) => setGymDetails({ ...gymDetails, city: e.target.value })}
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

                <div className="mt-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                   <div className="flex items-center justify-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 flex-wrap">
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> 14-Day Free Trial</div>
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Cancel Anytime</div>
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> No Credit Card</div>
                   </div>
                </div>
              </div>
            )}

            {/* Step 3: Launching */}
            {step === 3 && (
              <div className="py-8 text-center max-w-sm mx-auto">
                <div className="mb-8">
                   {launchProgress === 5 ? (
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-green-100 dark:bg-green-500/20 animate-in zoom-in duration-300">
                        <CheckCircle2 size={40} className="text-green-500" />
                      </div>
                   ) : (
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-[#FF5C73]/10 dark:bg-[#FF5C73]/20">
                        <Rocket size={40} className="text-[#FF5C73] animate-pulse" />
                      </div>
                   )}
                </div>

                <h2 className="text-2xl font-bold mb-8">
                  {launchProgress === 5 ? "Welcome to GMMX 🎉" : "Creating Your Gym..."}
                </h2>
                
                <div className="space-y-4 text-left">
                  {[
                    { step: 1, label: "Creating Account" },
                    { step: 2, label: "Creating Database" },
                    { step: 3, label: "Provisioning Website" },
                    { step: 4, label: "Setting Up Dashboard" },
                  ].map((item) => {
                     const isDone = launchProgress > item.step || launchProgress === 5;
                     const isCurrent = launchProgress === item.step;
                     
                     return (
                      <div key={item.step} className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 size={20} className="text-[#FF5C73] animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex-shrink-0" />
                        )}
                        <span className={`text-sm font-medium ${isDone ? "text-zinc-900 dark:text-zinc-100" : isCurrent ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
                          {item.label}
                        </span>
                      </div>
                     );
                  })}
                </div>

                {launchProgress === 5 && (
                  <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 text-left mb-6 space-y-4">
                       <div>
                         <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Website</span>
                         <a href={`http://${subdomain}.gmmx.app`} target="_blank" rel="noreferrer" className="block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-0.5">
                           {subdomain}.gmmx.app
                         </a>
                       </div>
                       <div>
                         <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Admin Dashboard</span>
                         <a href={`http://${subdomain}.gmmx.app/dashboard`} target="_blank" rel="noreferrer" className="block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-0.5">
                           {subdomain}.gmmx.app/dashboard
                         </a>
                       </div>
                       <div>
                         <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Member App</span>
                         <a href={`http://${subdomain}.gmmx.app/dashboard`} target="_blank" rel="noreferrer" className="block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-0.5">
                           {subdomain}.gmmx.app/dashboard
                         </a>
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                        const proto = window.location.protocol;
                        const host = window.location.host;
                        const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
                        if (isLocalhost) {
                           window.location.href = `${proto}//${host}/dashboard?gym=${subdomain}`;
                        } else {
                           const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
                           window.location.href = `${proto}//${subdomain}.${baseDomain}/dashboard`;
                        }
                      }}
                      className="w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all bg-[#FF5C73] hover:bg-[#FF5C73]/90 shadow-lg shadow-[#FF5C73]/20"
                    >
                      Go To Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && <div className="p-3 mt-6 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-medium border border-red-200 dark:border-red-500/20">{error}</div>}

            {/* Navigation Buttons */}
            {step < 3 && (
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={handleNext}
                  disabled={loading || (step === 2 && subdomainStatus !== "available")}
                  className="w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all flex items-center justify-center gap-2 bg-[#FF5C73] hover:bg-[#FF5C73]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF5C73]/20"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {step === 2 ? "Start 14-Day Free Trial" : "Continue"}
                </button>
                {step === 2 && (
                   <button onClick={() => setStep(1)} className="w-full mt-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                     Back
                   </button>
                )}
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
