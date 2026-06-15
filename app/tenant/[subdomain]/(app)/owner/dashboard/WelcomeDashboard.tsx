"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveDraftDetails, publishWebsite } from "@/features/website/actions";
import { storage } from "@/lib/appwrite/client";
import { ID } from "appwrite";
import { Loader2, Check, Upload, Globe, Phone, MapPin, Edit3 } from "lucide-react";

interface Props {
  gymName: string;
  subdomain: string;
  initialPhone: string;
  initialAddress: string;
  initialHeroTitle: string;
  initialHeroSubtitle: string;
  initialLogoFileId: string;
}

export default function WelcomeDashboard({
  gymName,
  subdomain,
  initialPhone,
  initialAddress,
  initialHeroTitle,
  initialHeroSubtitle,
  initialLogoFileId,
}: Props) {
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [heroTitle, setHeroTitle] = useState(initialHeroTitle || "Transform Your Body Today");
  const [heroSubtitle, setHeroSubtitle] = useState(initialHeroSubtitle || "Join the best fitness community in the city.");
  const [logoFileId, setLogoFileId] = useState(initialLogoFileId);
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Logo must be under 2MB in size.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Upload to Appwrite storage (gym-logos bucket)
      const res = await storage.createFile("gym-logos", ID.unique(), file);
      setLogoFileId(res.$id);
      setSuccessMsg("Logo uploaded successfully! Save changes to apply.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

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
        logoFileId,
      });

      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Workspace settings saved as draft!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save details.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Save draft details first
      const saveRes = await saveDraftDetails({
        phone,
        address,
        heroTitle,
        heroSubtitle,
        logoFileId,
      });

      if (saveRes.error) {
        setErrorMsg(saveRes.error);
        setPublishing(false);
        return;
      }

      // 2. Publish
      const pubRes = await publishWebsite();
      if (pubRes.error) {
        setErrorMsg(pubRes.error);
      } else {
        setSuccessMsg("Congratulations! Your website is now live!");
        // Reload to render full dashboard
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish website.");
    } finally {
      setPublishing(false);
    }
  };

  // Checklist counts
  const tasks = [
    { name: "Gym Logo", done: !!logoFileId },
    { name: "Phone Number", done: !!phone },
    { name: "Address", done: !!address },
    { name: "Hero Content", done: !!heroTitle && !!heroSubtitle }
  ];
  const completedCount = tasks.filter(t => t.done).length;
  const pct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-in">
      {/* Header card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl shadow-black/20">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-white">Welcome to {gymName}! 👋</h2>
          <p className="text-sm text-zinc-400">Your workspaces are ready. Complete these optional branding details to publish your public website at:</p>
          <a
            href="/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5C73] hover:underline"
          >
            <Globe size={14} />
            Preview Draft Website 👁️
          </a>
        </div>
        <div className="w-full md:w-64 space-y-2 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{completedCount}/{tasks.length} Completed</span>
            <span className="text-xs font-black text-[#FF5C73]">{pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-[#FF5C73] transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-zinc-500 text-center font-medium">Configure branding to go live</p>
        </div>
      </div>

      {errorMsg && <div className="p-4 rounded-2xl bg-red-950/40 text-red-400 border border-red-900/50 text-sm font-medium animate-in">{errorMsg}</div>}
      {successMsg && <div className="p-4 rounded-2xl bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 text-sm font-medium animate-in">{successMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step inputs */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Upload size={18} className="text-[#FF5C73]" /> 1. Upload Gym Logo</CardTitle>
              <CardDescription>A clean PNG/JPEG. Recommended size under 2MB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden">
                  {logoFileId ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/gym-logos/files/${logoFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`} 
                      alt="Gym logo preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-zinc-600 font-bold">{gymName[0]}</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    disabled={uploading || saving || publishing}
                    className="border-zinc-800 bg-zinc-950 text-zinc-300"
                  />
                  {uploading && <div className="text-xs text-zinc-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Uploading to Appwrite Storage...</div>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Phone size={18} className="text-[#FF5C73]" /> 2. Business Details</CardTitle>
              <CardDescription>Contact info that will be displayed on your gym website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    placeholder="+91 9876543210" 
                    value={phone} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
                    className="border-zinc-800 bg-zinc-950 text-white pl-10"
                  />
                  <Phone size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Gym Address</Label>
                <div className="relative">
                  <Input 
                    id="address" 
                    placeholder="123 Main St, Near Central Park" 
                    value={address} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} 
                    className="border-zinc-800 bg-zinc-950 text-white pl-10"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Edit3 size={18} className="text-[#FF5C73]" /> 3. Website Hero Section</CardTitle>
              <CardDescription>The primary headline and subheadline visitors see first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input 
                  id="heroTitle" 
                  placeholder="Transform Your Body Today" 
                  value={heroTitle} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroTitle(e.target.value)} 
                  className="border-zinc-800 bg-zinc-950 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Input 
                  id="heroSubtitle" 
                  placeholder="Premium fitness center helping you get stronger." 
                  value={heroSubtitle} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroSubtitle(e.target.value)} 
                  className="border-zinc-800 bg-zinc-950 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Status / Actions */}
        <div className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900 shadow-xl">
            <CardHeader>
              <CardTitle className="text-md">Setup Status</CardTitle>
              <CardDescription>Review setup before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t.name} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{t.name}</span>
                    {t.done ? (
                      <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-900/30">
                        <Check size={10} /> Configured
                      </span>
                    ) : (
                      <span className="text-zinc-600 font-semibold text-xs bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0">
              <Button 
                onClick={handleSave} 
                disabled={uploading || saving || publishing}
                variant="outline" 
                className="w-full border-zinc-800 hover:bg-zinc-800 text-zinc-300"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Draft
              </Button>
              <a 
                href="/preview"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl text-sm font-semibold transition-all h-11 flex items-center justify-center"
              >
                Preview Website 👁️
              </a>
              <Button 
                onClick={handlePublish} 
                disabled={uploading || saving || publishing}
                className="w-full bg-[#FF5C73] hover:bg-[#FF5C73]/90 text-white font-semibold"
              >
                {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Website 🚀
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
