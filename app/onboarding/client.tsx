"use client";
// Onboarding Wizard client component

import { useState } from "react";
import { completeOnboardingWizard, checkSubdomain, checkSubdomainFormat } from "@/features/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function OnboardingWizard({ userName }: { userName: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    gymName: "",
    subdomain: "",
    theme: "modern_fitness"
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!formData.gymName || !formData.subdomain) {
        setError("Gym name and subdomain are required");
        return;
      }
      setLoading(true);

      // Check format
      const formatCheck = await checkSubdomainFormat(formData.subdomain);
      if (!formatCheck.valid) {
        setError(formatCheck.error || "Reserved subdomain or invalid format");
        setLoading(false);
        return;
      }

      // Check availability
      const isAvailable = await checkSubdomain(formData.subdomain);
      setLoading(false);
      if (!isAvailable) {
        setError("This subdomain is already taken.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePublish = async () => {
    setLoading(true);
    setError("");
    const result = await completeOnboardingWizard(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Redirect to the new dashboard on their subdomain
      const proto = window.location.protocol;
      const host = window.location.host;
      
      let baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
      if (window.location.hostname === "localhost") {
        baseDomain = host.includes(".") ? host.substring(host.indexOf(".") + 1) : host;
      }
      
      window.location.href = `${proto}//${formData.subdomain}.${baseDomain}/owner/login`;
    }
  };

  return (
    <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-white" style={{ color: "#f4f4f5" }}>Welcome, {userName}</CardTitle>
        <CardDescription className="text-zinc-400" style={{ color: "#a1a1aa" }}>Let's set up your gym workspace in under 3 minutes.</CardDescription>
        <div className="flex space-x-2 pt-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 w-full rounded-full ${s <= step ? "bg-red-500" : "bg-zinc-800"}`} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {error && <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-sm">{error}</div>}
        
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Gym Name</Label>
              <Input 
                placeholder="Titan Fitness" 
                value={formData.gymName}
                className="border-zinc-800 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
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
              <Label className="text-zinc-300">Subdomain</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="titanfitness" 
                  value={formData.subdomain}
                  className="border-zinc-800 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                />
                <span className="text-zinc-500">.gmmx.app</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Theme Preference</Label>
              <select
                value={formData.theme}
                onChange={(e) => updateForm("theme", e.target.value)}
                className="block h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF5C73] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2371717a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.25rem",
                  backgroundRepeat: "no-repeat",
                  paddingRight: "2.5rem"
                }}
              >
                <option value="modern_fitness" className="bg-zinc-950 text-white">Modern Fitness (Dark & Premium)</option>
                <option value="community_gym" className="bg-zinc-950 text-white">Community Gym (Light & Friendly)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center animate-in fade-in slide-in-from-right-4 py-8">
            <h3 className="text-xl font-medium text-white" style={{ color: "#f4f4f5" }}>Create Workspace</h3>
            <p className="text-zinc-400" style={{ color: "#a1a1aa" }}>We'll provision your dashboard and set up your website at <strong className="text-white" style={{ color: "#f4f4f5" }}>{formData.subdomain}.gmmx.app</strong> in draft mode.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" disabled={step === 1 || loading} onClick={() => setStep(s => s - 1)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">Back</Button>
        {step < 3 ? (
          <Button onClick={handleNext} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        ) : (
          <Button onClick={handlePublish} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Gym
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
