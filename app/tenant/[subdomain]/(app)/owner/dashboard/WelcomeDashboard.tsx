"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { saveDraftDetails, publishWebsite } from "@/features/website/actions";
import { uploadLogo } from "@/features/website/actions";
import { Loader2, Check, Upload, Globe, Phone, MapPin, Edit3, LayoutTemplate, Palette, Type, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const pathname = usePathname() || "";
  const router = useRouter();

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
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadLogo(formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.fileId) {
        setLogoFileId(res.fileId);
        setSuccessMsg("Logo uploaded successfully! Save changes to apply.");
      }
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome to {gymName}! 👋</h2>
          <p className="text-sm text-slate-500">Your workspaces are ready. Complete these optional branding details to publish your public website at:</p>
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
        <div className="w-full md:w-64 space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{completedCount}/{tasks.length} Completed</span>
            <span className="text-xs font-black text-[#FF5C73]">{pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-[#FF5C73] transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 text-center font-medium">Configure branding to go live</p>
        </div>
      </div>

      {errorMsg && <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-sm font-medium animate-in">{errorMsg}</div>}
      {successMsg && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm font-medium animate-in">{successMsg}</div>}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: "templates", label: "Templates", icon: <LayoutTemplate size={16} /> },
          { id: "branding", label: "Branding", icon: <Palette size={16} /> },
          { id: "content", label: "Content", icon: <Type size={16} /> },
          { id: "publish", label: "Publish", icon: <Rocket size={16} /> },
        ].map(tab => {
          const isActive = pathname.includes(`/website/${tab.id}`) || (pathname.endsWith("/website/setup") && tab.id === "branding");
          return (
            <button
              key={tab.id}
              onClick={() => router.push(`/owner/dashboard/website/${tab.id}`)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold transition-all border-b-2",
                isActive 
                  ? "border-[#FF5C73] text-[#FF5C73] bg-red-50/50" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Step inputs */}
        <div className="md:col-span-2 space-y-6">
          {(pathname.includes("/website/branding") || pathname.endsWith("/website/setup")) && (
            <div className="space-y-6">
              <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><Upload size={18} className="text-[#FF5C73]" /> 1. Upload Gym Logo</CardTitle>
              <CardDescription className="text-slate-500">A clean PNG/JPEG. Recommended size under 2MB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {logoFileId ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/gym-logos/files/${logoFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`} 
                      alt="Gym logo preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 font-bold">{gymName[0]}</span>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    disabled={uploading || saving || publishing}
                    className="border-slate-300 bg-white text-slate-900 cursor-pointer"
                  />
                  {uploading && <div className="text-xs text-slate-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Uploading to Appwrite Storage...</div>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><Phone size={18} className="text-[#FF5C73]" /> 2. Business Details</CardTitle>
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
          </Card>
          </div>
          )}

          {pathname.includes("/website/content") && (
            <div className="space-y-6">
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
              </Card>
            </div>
          )}

          {pathname.includes("/website/templates") && (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><LayoutTemplate size={18} className="text-[#FF5C73]" /> Choose Template</CardTitle>
                <CardDescription className="text-slate-500">Select a layout for your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                  <p className="text-slate-500 font-medium">Templates module coming soon. Default template applied.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {pathname.includes("/website/publish") && (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><Rocket size={18} className="text-[#FF5C73]" /> Ready to Launch</CardTitle>
                <CardDescription className="text-slate-500">Review and publish your site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                  <p className="text-slate-500 font-medium mb-4">You have completed {pct}% of your setup.</p>
                  <Button 
                    onClick={handlePublish} 
                    disabled={uploading || saving || publishing || pct < 50}
                    className="bg-[#FF5C73] hover:bg-[#ff405b] text-white"
                  >
                    {publishing ? <Loader2 size={16} className="animate-spin mr-2" /> : "Publish Website Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar Status / Actions */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-md text-slate-900">Setup Status</CardTitle>
              <CardDescription className="text-slate-500">Review setup before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{t.name}</span>
                    {t.done ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check size={10} /> Configured
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold text-xs bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                onClick={handleSave} 
                disabled={uploading || saving || publishing}
                variant="outline"
                className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900"
              >
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : "Save Draft"}
              </Button>
              <a 
                href="/preview"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-semibold transition-all h-11 flex items-center justify-center shadow-sm"
              >
                Preview Website 👁️
              </a>
              <Button 
                onClick={handlePublish} 
                disabled={uploading || saving || publishing || pct < 50}
                className="w-full bg-[#FF5C73] hover:bg-[#ff405b] text-white"
              >
                {publishing ? <Loader2 size={16} className="animate-spin mr-2" /> : "Publish Website 🚀"}
              </Button>
              {pct < 50 && (
                <p className="text-[10px] text-slate-400 text-center px-2">
                  Complete at least 50% of your branding to unlock publishing.
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
