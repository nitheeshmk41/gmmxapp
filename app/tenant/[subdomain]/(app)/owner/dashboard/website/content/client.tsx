"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveDraftDetails } from "@/features/website/actions";
import { Loader2, Phone, MapPin, Edit3 } from "lucide-react";

interface Props {
  initialPhone: string;
  initialAddress: string;
  initialHeroTitle: string;
  initialHeroSubtitle: string;
}

export function ContentClient({ 
  initialPhone, 
  initialAddress, 
  initialHeroTitle, 
  initialHeroSubtitle 
}: Props) {
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [heroTitle, setHeroTitle] = useState(initialHeroTitle || "Transform Your Body Today");
  const [heroSubtitle, setHeroSubtitle] = useState(initialHeroSubtitle || "Join the best fitness community in the city.");
  
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await saveDraftDetails({
        phone,
        address,
        heroTitle,
        heroSubtitle,
      });

      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Content settings saved successfully!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-sm font-medium animate-in">{errorMsg}</div>}
      {successMsg && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm font-medium animate-in">{successMsg}</div>}

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><Phone size={18} className="text-[#FF5C73]" /> Business Details</CardTitle>
          <CardDescription className="text-slate-500">Contact info that will be displayed on your gym website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">Contact Phone</Label>
            <div className="relative">
              <Input 
                id="phone" 
                placeholder="+91 9876543210" 
                value={phone} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
                className="border-slate-300 bg-white text-slate-900 pl-10"
              />
              <Phone size={16} className="absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-700">Gym Address</Label>
            <div className="relative">
              <Input 
                id="address" 
                placeholder="123 Main St, Near Central Park" 
                value={address} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} 
                className="border-slate-300 bg-white text-slate-900 pl-10"
              />
              <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white hover:bg-slate-800">
            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : "Save Details"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><Edit3 size={18} className="text-[#FF5C73]" /> Website Hero Section</CardTitle>
          <CardDescription className="text-slate-500">The primary headline and subheadline visitors see first.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle" className="text-slate-700">Hero Title</Label>
            <Input 
              id="heroTitle" 
              placeholder="Transform Your Body Today" 
              value={heroTitle} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroTitle(e.target.value)} 
              className="border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle" className="text-slate-700">Hero Subtitle</Label>
            <Input 
              id="heroSubtitle" 
              placeholder="Premium fitness center helping you get stronger." 
              value={heroSubtitle} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroSubtitle(e.target.value)} 
              className="border-slate-300 bg-white text-slate-900"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white hover:bg-slate-800">
            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : "Save Content"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
