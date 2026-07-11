"use client";

import { useState, useEffect } from "react";
import { completeOnboardingWizard, checkSubdomain, checkSubdomainFormat } from "@/features/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Globe, Building2, Palette, Activity } from "lucide-react";

export function OnboardingWizard({ userName }: { userName: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provisioningStep, setProvisioningStep] = useState(0);

  const [formData, setFormData] = useState({
    gymName: "",
    subdomain: "",
    country: "India",
    timezone: "IST",
    currency: "INR",
    theme: "modern_fitness"
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!formData.gymName || !formData.subdomain || !formData.country) {
        setError("Gym name, subdomain, and country are required");
        return;
      }
      setLoading(true);

      const formatCheck = await checkSubdomainFormat(formData.subdomain);
      if (!formatCheck.valid) {
        setError(formatCheck.error || "Reserved subdomain or invalid format");
        setLoading(false);
        return;
      }

      const isAvailable = await checkSubdomain(formData.subdomain);
      setLoading(false);
      if (!isAvailable) {
        setError("This subdomain is already taken.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleCreate = async () => {
    setStep(4); // Move to provisioning simulation step
    
    // Simulate Magical Provisioning
    for (let i = 1; i <= 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 800)); // 800ms per simulated step
      setProvisioningStep(i);
    }
    
    const result = await completeOnboardingWizard(formData);
    
    if (result.error) {
      setError(result.error);
      setStep(3); // Go back if error
    } else {
      await new Promise(resolve => setTimeout(resolve, 500)); // Final pause
      const proto = window.location.protocol;
      const host = window.location.host;
      let baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
      if (window.location.hostname === "localhost") {
        baseDomain = host.includes(".") ? host.substring(host.indexOf(".") + 1) : host;
      }
      window.location.href = `${proto}//${formData.subdomain}.${baseDomain}/owner/dashboard`;
    }
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
            {step === 1 ? "Let's set up your gym's digital workspace." : step === 2 ? "Select a starting theme for your professional website." : "Review what you're about to create."}
          </CardDescription>
        </CardHeader>
      )}

      <CardContent className="space-y-6 pt-6">
        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>}
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label className="text-zinc-300 font-bold">Gym Name</Label>
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
              {formData.subdomain.length > 2 && (
                <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1 font-medium">
                  <CheckCircle2 size={12} /> Available
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Country</Label>
                <select value={formData.country} onChange={e => updateForm("country", e.target.value)} className="w-full border border-zinc-800 bg-zinc-950/30 text-zinc-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none cursor-pointer">
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Timezone</Label>
                <select value={formData.timezone} onChange={e => updateForm("timezone", e.target.value)} className="w-full border border-zinc-800 bg-zinc-950/30 text-zinc-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none cursor-pointer">
                  <option value="IST">IST</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">Currency</Label>
                <select value={formData.currency} onChange={e => updateForm("currency", e.target.value)} className="w-full border border-zinc-800 bg-zinc-950/30 text-zinc-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none cursor-pointer">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD ($)</option>
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
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all group relative ${formData.theme === t.id ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-zinc-800 hover:border-zinc-700'}`}
                >
                  <div className={`h-24 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                    <Palette size={24} className={t.light ? 'text-slate-800' : 'text-white'} opacity={0.5} />
                  </div>
                  <div className="p-3 bg-zinc-900 border-t border-zinc-800">
                    <p className="font-bold text-zinc-100">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.text}</p>
                  </div>
                  {formData.theme === t.id && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
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
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 py-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Building2 size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-zinc-100 text-lg">{formData.gymName}</p>
                <p className="text-sm text-zinc-500">https://{formData.subdomain}.gmmx.app</p>
              </div>
            </div>

            <div className="space-y-3 pl-2">
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">What you get:</p>
              <div className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="font-medium">Management Dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="font-medium">Professional Website (Draft)</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="font-medium">Member & Trainer Portals</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-400 mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="font-bold">14-Day Pro Trial Included</span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-zinc-800 border-t-red-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity size={24} className="text-red-500" />
              </div>
            </div>
            
            <div className="space-y-2 h-16">
              <h3 className="text-xl font-bold text-white transition-opacity duration-300">
                {provisioningStep === 0 && "Creating Workspace..."}
                {provisioningStep === 1 && "Creating Database..."}
                {provisioningStep === 2 && "Configuring Website..."}
                {provisioningStep === 3 && "Applying Theme..."}
                {provisioningStep === 4 && "Almost Ready..."}
              </h3>
              <p className="text-sm text-zinc-400">Please do not close this window.</p>
            </div>
          </div>
        )}

      </CardContent>
      
      {step < 4 && (
        <CardFooter className="flex justify-between border-t border-zinc-800/50 pt-6">
          <Button variant="ghost" disabled={step === 1 || loading} onClick={() => setStep(s => s - 1)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">Back</Button>
          {step < 3 ? (
            <Button onClick={handleNext} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white font-bold px-8">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              Create Gym
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
