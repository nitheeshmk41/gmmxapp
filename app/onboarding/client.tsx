"use client";

import { useState, useEffect } from "react";
import { completeOnboardingWizard, checkSubdomain, checkSubdomainFormat } from "@/features/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Globe, Building2, Palette, Activity, XCircle, Users, CreditCard, Calendar, Circle, Hourglass, PartyPopper } from "lucide-react";

export function OnboardingWizard({ userName }: { userName: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provisioningStep, setProvisioningStep] = useState(0);
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [subdomainError, setSubdomainError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);
  const formattedTrialEnd = trialEndDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

  const [formData, setFormData] = useState({
    gymName: "",
    businessType: "Gym",
    subdomain: "",
    country: "India",
    timezone: "IST",
    currency: "INR",
    theme: "modern_fitness"
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCountryChange = (country: string) => {
    let timezone = "IST";
    let currency = "INR";
    if (country === "United States") { timezone = "EST"; currency = "USD"; }
    else if (country === "United Kingdom") { timezone = "GMT"; currency = "GBP"; }
    else if (country === "Australia") { timezone = "AEST"; currency = "AUD"; }
    else if (country === "Canada") { timezone = "EST"; currency = "CAD"; }
    
    setFormData(prev => ({ ...prev, country, timezone, currency }));
  };

  useEffect(() => {
    if (formData.subdomain.length < 3) {
      setSubdomainStatus("idle");
      setSubdomainError("");
      return;
    }
    const timer = setTimeout(async () => {
      setSubdomainStatus("checking");
      setSubdomainError("");
      const formatCheck = await checkSubdomainFormat(formData.subdomain);
      if (!formatCheck.valid) {
        setSubdomainStatus("unavailable");
        setSubdomainError(formatCheck.error || "Invalid subdomain");
        return;
      }
      const isAvailable = await checkSubdomain(formData.subdomain);
      if (isAvailable) {
        setSubdomainStatus("available");
      } else {
        setSubdomainStatus("unavailable");
        setSubdomainError("This subdomain is already taken.");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.subdomain]);

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!formData.gymName || !formData.subdomain || !formData.country || !formData.businessType) {
        setError("Business name, type, subdomain, and country are required");
        return;
      }
      
      if (subdomainStatus === "unavailable" || subdomainStatus === "checking") {
        setError("Please choose a valid and available subdomain");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleCreate = async () => {
    setStep(4);
    
    // Step 1: Creating account & Reserving subdomain
    setProvisioningStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 2: Setting up your gym
    setProvisioningStep(2);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 3: Building your website & preparing dashboard (Actual API call)
    setProvisioningStep(3);
    const result = await completeOnboardingWizard(formData);
    
    if (result.error) {
      setError(result.error);
      setStep(3); // Go back if error
      return;
    }
    
    // Step 4: Applying theme
    setProvisioningStep(4);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 5: Success screen
    setProvisioningStep(5);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const proto = window.location.protocol;
    const host = window.location.host;
    let baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
    if (window.location.hostname === "localhost") {
      baseDomain = host.includes(".") ? host.substring(host.indexOf(".") + 1) : host;
    }
    window.location.href = `${proto}//${formData.subdomain}.${baseDomain}/owner/dashboard`;
  };

  const themes = [
    { id: "modern_fitness", name: "Modern Fitness", color: "from-zinc-900 to-black", text: "Dark & Premium" },
    { id: "luxury", name: "Luxury", color: "from-amber-900 to-black", text: "Gold & Elegant" },
    { id: "minimal", name: "Minimal", color: "from-slate-100 to-white", text: "Clean & Bright", light: true },
    { id: "crossfit", name: "Crossfit", color: "from-red-900 to-black", text: "Bold & Aggressive" },
  ];

  return (
    <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl">
      {step < 4 && (
        <CardHeader className="border-b border-zinc-800/50 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Step {step} of 3</span>
            <span className="text-xs font-bold text-zinc-500">
              {step === 1 ? "Workspace" : step === 2 ? "Website Theme" : "Review"}
            </span>
          </div>
          <CardTitle className="text-2xl text-white">
            {step === 1 ? `Welcome to GMMX, ${userName.split(' ')[0]}` : step === 2 ? "Choose a Website Theme" : "Ready to Launch"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {step === 1 ? "Let's set up your digital workspace." : step === 2 ? "Select a starting theme for your professional website." : "Review what you're about to create."}
          </CardDescription>
        </CardHeader>
      )}

      <CardContent className="space-y-6 pt-6">
        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>}
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label className="text-zinc-300 font-bold">Business Name</Label>
              <Input 
                placeholder="e.g. Titan Fitness" 
                value={formData.gymName}
                className="border-zinc-800 bg-zinc-950/50 text-zinc-100 h-12 text-lg placeholder:text-zinc-600 focus-visible:ring-red-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    gymName: val,
                    subdomain: prev.subdomain === prev.gymName.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      ? val.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      : prev.subdomain
                  }));
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-300 font-bold">Business Type</Label>
              <select 
                value={formData.businessType} 
                onChange={(e) => {
                   const type = e.target.value;
                   let newTheme = formData.theme;
                   if (type === "Yoga Studio") newTheme = "minimal";
                   else if (type === "CrossFit") newTheme = "crossfit";
                   else if (type === "Dance Academy") newTheme = "luxury";
                   else newTheme = "modern_fitness";
                   
                   setFormData(prev => ({ ...prev, businessType: type, theme: newTheme }));
                }}
                className="w-full border border-zinc-700 bg-zinc-900 text-zinc-100 h-12 rounded-md px-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-zinc-800 transition-colors appearance-none cursor-pointer"
              >
                <option value="Gym">Gym</option>
                <option value="Yoga Studio">Yoga Studio</option>
                <option value="Dance Academy">Dance Academy</option>
                <option value="Swimming Academy">Swimming Academy</option>
                <option value="Martial Arts">Martial Arts</option>
                <option value="CrossFit">CrossFit</option>
                <option value="Sports Academy">Sports Academy</option>
                <option value="Personal Trainer">Personal Trainer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300 font-bold">Subdomain</Label>
              <div className="flex items-center p-1 border border-zinc-800 bg-zinc-950/50 rounded-md focus-within:ring-2 focus-within:ring-red-500 transition-all">
                <span className="pl-3 text-zinc-500 font-medium">https://</span>
                <input 
                  placeholder="titanfitness" 
                  value={formData.subdomain}
                  className="bg-transparent border-none text-zinc-100 px-1 py-2 w-full focus:outline-none min-w-0"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                />
                <span className="pr-3 text-zinc-500 font-medium">.gmmx.app</span>
              </div>
              {subdomainStatus === "checking" && (
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1 font-medium">
                  <Loader2 size={12} className="animate-spin" /> Checking availability...
                </p>
              )}
              {subdomainStatus === "available" && (
                <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1 font-medium">
                  <CheckCircle2 size={12} /> Available
                </p>
              )}
              {subdomainStatus === "unavailable" && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
                  <XCircle size={12} /> {subdomainError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Country</Label>
                <select value={formData.country} onChange={e => handleCountryChange(e.target.value)} className="w-full border border-zinc-700 bg-zinc-900 text-zinc-100 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-zinc-800 transition-colors appearance-none cursor-pointer">
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div className="space-y-2 opacity-60">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Timezone</Label>
                <select disabled value={formData.timezone} onChange={e => updateForm("timezone", e.target.value)} className="w-full border border-zinc-800 bg-zinc-950/30 text-zinc-500 rounded-md py-2 px-3 text-sm focus:outline-none appearance-none cursor-not-allowed">
                  <option value="IST">IST</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                  <option value="GMT">GMT</option>
                  <option value="AEST">AEST</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <div className="space-y-2 opacity-60">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Currency</Label>
                <select disabled value={formData.currency} onChange={e => updateForm("currency", e.target.value)} className="w-full border border-zinc-800 bg-zinc-950/30 text-zinc-500 rounded-md py-2 px-3 text-sm focus:outline-none appearance-none cursor-not-allowed">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-2 gap-4">
              {themes.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => updateForm("theme", t.id)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all group relative bg-zinc-900 flex flex-col h-40 ${formData.theme === t.id ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-zinc-800 hover:border-zinc-700'}`}
                >
                  <div className="flex-1 p-3 overflow-hidden relative">
                    <div className="absolute inset-0 bg-zinc-800 m-2 rounded-lg flex flex-col gap-1 p-2">
                      <div className="h-2 w-1/3 bg-zinc-700 rounded-full mb-2"></div>
                      <div className="h-8 w-full bg-zinc-700/50 rounded flex items-center justify-center">
                        <Palette size={16} className="text-zinc-500" />
                      </div>
                      <div className="flex gap-1 mt-1">
                        <div className="h-4 flex-1 bg-zinc-700/30 rounded"></div>
                        <div className="h-4 flex-1 bg-zinc-700/30 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-950 border-t border-zinc-800 z-10">
                    <p className="font-bold text-zinc-100">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.text}</p>
                  </div>
                  {formData.theme === t.id && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1 z-20 shadow-md">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-2">
              <button onClick={() => setStep(3)} className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 py-4">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">🚀 Ready to Launch</h2>
              <p className="text-sm text-zinc-400">Almost done! Review your workspace before creating it.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-center">
                <Globe size={16} className="text-blue-400 mx-auto mb-1" />
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Website</p>
                <p className="text-sm font-semibold text-zinc-200 truncate px-1">{formData.subdomain}.gmmx.app</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-center">
                <Users size={16} className="text-emerald-400 mx-auto mb-1" />
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Members</p>
                <p className="text-sm font-semibold text-zinc-200">Unlimited (Trial)</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-center">
                <CreditCard size={16} className="text-yellow-400 mx-auto mb-1" />
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Billing</p>
                <p className="text-sm font-semibold text-zinc-200">₹0 Today</p>
              </div>
              <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-center">
                <Calendar size={16} className="text-purple-400 mx-auto mb-1" />
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Trial</p>
                <p className="text-sm font-semibold text-zinc-200">14 Days</p>
              </div>
            </div>

            {/* Workspace Details */}
            <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={16} /> Your Workspace
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-zinc-500">Gym Name</p>
                  <p className="font-semibold text-zinc-200">{formData.gymName}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs text-zinc-500">Country & Timezone</p>
                  <p className="font-semibold text-zinc-200">{formData.country} ({formData.timezone})</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Theme</p>
                  <p className="font-semibold text-zinc-200 capitalize">{formData.theme.replace("_", " ")}</p>
                </div>
              </div>
            </div>

            {/* What's Included & Trial */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Features */}
              <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/50 p-5">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">🎁 Included in Trial</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">Management Dashboard</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Manage members, trainers, attendance and payments.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">Professional Website</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Ready-to-publish gym website with your own subdomain.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">Member & Trainer Portals</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Dedicated mobile views for your staff and clients.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">Analytics Dashboard</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Track memberships, revenue and attendance.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trial details */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="rounded-xl bg-gradient-to-b from-red-500/10 to-transparent border border-red-500/20 p-5">
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={16} /> 14-Day Pro Trial
                  </h3>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">• Starts immediately</li>
                    <li className="flex items-center gap-2">• No credit card required</li>
                    <li className="flex items-center gap-2">• Access to every Pro feature</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-red-500/20">
                    <p className="text-xs text-zinc-500">Trial ends on</p>
                    <p className="font-bold text-red-400 text-lg">{formattedTrialEnd}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/50 p-5">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">After Your Trial Ends</h3>
                  <ul className="space-y-2 text-xs text-zinc-400 grid grid-cols-2">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-zinc-600" /> Upgrade anytime</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-zinc-600" /> Keep data safe</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-zinc-600" /> No auto charges</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-zinc-600" /> Cancel anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors border border-zinc-800/50 hover:border-zinc-700">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-red-500 focus:ring-red-500 focus:ring-offset-zinc-950"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                </div>
                <div className="text-sm">
                  <span className="text-zinc-300">I agree to the </span>
                  <a href="/terms" target="_blank" className="text-red-400 hover:text-red-300 underline underline-offset-2">Terms of Service</a>
                  <span className="text-zinc-300"> and </span>
                  <a href="/privacy" target="_blank" className="text-red-400 hover:text-red-300 underline underline-offset-2">Privacy Policy</a>
                  <span className="text-zinc-300">.</span>
                </div>
              </label>
            </div>

          </div>
        )}

        {step === 4 && (
          <div className="py-12 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 max-w-md mx-auto w-full">
            
            {provisioningStep < 5 ? (
              <>
                <div className="text-center space-y-2 mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    🚀 Creating Your Workspace
                  </h3>
                  <p className="text-sm text-zinc-400">This usually takes 10–20 seconds.</p>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-6"></div>

                <div className="w-full space-y-6">
                  {/* Item 1: Creating Account & Reserving Subdomain */}
                  <div className="flex items-center gap-4">
                    {provisioningStep > 1 ? (
                      <CheckCircle2 size={24} className="text-emerald-500 shrink-0 animate-in zoom-in" />
                    ) : provisioningStep === 1 ? (
                      <Loader2 size={24} className="text-red-500 shrink-0 animate-spin" />
                    ) : (
                      <Circle size={24} className="text-zinc-700 shrink-0" />
                    )}
                    <span className={`font-medium ${provisioningStep > 1 ? "text-emerald-400" : provisioningStep === 1 ? "text-white" : "text-zinc-600"}`}>
                      Creating your account
                    </span>
                  </div>

                  {/* Item 2: Setting up your gym */}
                  <div className="flex items-center gap-4">
                    {provisioningStep > 2 ? (
                      <CheckCircle2 size={24} className="text-emerald-500 shrink-0 animate-in zoom-in" />
                    ) : provisioningStep === 2 ? (
                      <Hourglass size={24} className="text-red-500 shrink-0 animate-pulse" />
                    ) : (
                      <Circle size={24} className="text-zinc-700 shrink-0" />
                    )}
                    <span className={`font-medium ${provisioningStep > 2 ? "text-emerald-400" : provisioningStep === 2 ? "text-white" : "text-zinc-600"}`}>
                      Setting up your gym
                    </span>
                  </div>

                  {/* Item 3: Building your website */}
                  <div className="flex items-center gap-4">
                    {provisioningStep > 3 ? (
                      <CheckCircle2 size={24} className="text-emerald-500 shrink-0 animate-in zoom-in" />
                    ) : provisioningStep === 3 ? (
                      <Loader2 size={24} className="text-red-500 shrink-0 animate-spin" />
                    ) : (
                      <Circle size={24} className="text-zinc-700 shrink-0" />
                    )}
                    <span className={`font-medium ${provisioningStep > 3 ? "text-emerald-400" : provisioningStep === 3 ? "text-white" : "text-zinc-600"}`}>
                      Building your website
                    </span>
                  </div>

                  {/* Item 4: Applying theme & Preparing dashboard */}
                  <div className="flex items-center gap-4">
                    {provisioningStep > 4 ? (
                      <CheckCircle2 size={24} className="text-emerald-500 shrink-0 animate-in zoom-in" />
                    ) : provisioningStep === 4 ? (
                      <Hourglass size={24} className="text-red-500 shrink-0 animate-pulse" />
                    ) : (
                      <Circle size={24} className="text-zinc-700 shrink-0" />
                    )}
                    <span className={`font-medium ${provisioningStep > 4 ? "text-emerald-400" : provisioningStep === 4 ? "text-white" : "text-zinc-600"}`}>
                      Preparing dashboard
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-6"></div>
                <p className="text-xs text-zinc-500 italic">Please don't close this window.</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                  <PartyPopper size={40} className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-white">🎉 Your gym is live!</h3>
                  <p className="text-xl font-medium text-zinc-200 mt-2">{formData.gymName}</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 w-full flex items-center justify-center gap-3">
                  <Globe size={18} className="text-zinc-400" />
                  <span className="font-mono text-zinc-300">https://{formData.subdomain}.gmmx.app</span>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 w-full text-center">
                  <p className="text-sm font-medium text-red-400">Your 14-day Pro trial has started.</p>
                </div>

                <div className="mt-8 flex items-center text-zinc-500 gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Redirecting to Dashboard...</span>
                </div>
              </div>
            )}

          </div>
        )}

      </CardContent>
      
      {step < 4 && (
        <CardFooter className={`flex border-t border-zinc-800/50 pt-6 ${step === 3 ? "flex-col gap-4 items-end" : "justify-between"}`}>
          {step < 3 ? (
            <>
              <Button variant="ghost" disabled={step === 1 || loading} onClick={() => setStep(s => s - 1)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">Back</Button>
              <Button onClick={handleNext} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white font-bold px-8">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between w-full items-center">
                <Button variant="ghost" disabled={loading} onClick={() => setStep(s => s - 1)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">Back</Button>
                <Button onClick={handleCreate} disabled={loading || !agreedToTerms} className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  🚀 Start My 14-Day Free Trial
                </Button>
              </div>
              <div className="text-right text-xs text-zinc-500 border-t border-zinc-800/50 pt-4 flex flex-col items-end">
                <p>By creating your workspace, your 14-day Pro trial begins immediately.</p>
                <p>No payment method is required today. You won't be charged automatically after the trial ends.</p>
              </div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
