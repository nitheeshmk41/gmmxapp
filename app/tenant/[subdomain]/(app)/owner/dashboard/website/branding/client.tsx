"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveDraftDetails, uploadLogo } from "@/features/website/actions";
import { Loader2, Upload, Palette } from "lucide-react";

interface Props {
  gymName: string;
  initialLogoFileId: string;
}

export function BrandingClient({ gymName, initialLogoFileId }: Props) {
  const [logoFileId, setLogoFileId] = useState(initialLogoFileId);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Logo must be under 5MB in size.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadLogo(formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.fileId) {
        setLogoFileId(res.fileId);
        setSuccessMsg("Logo uploaded successfully! Save changes to apply.");
      }
    } catch (err: any) {
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
        phone: "", // These are updated in the Content tab, so we just preserve existing by omitting or passing current ones if we had them.
        address: "",
        heroTitle: "",
        heroSubtitle: "",
        logoFileId,
      });

      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Branding settings saved successfully!");
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
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><Upload size={18} className="text-[#FF5C73]" /> Upload Gym Logo</CardTitle>
          <CardDescription className="text-slate-500">A clean PNG/JPEG. Recommended size under 5MB.</CardDescription>
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
                disabled={uploading || saving}
                className="border-slate-300 bg-white text-slate-900 cursor-pointer"
              />
              {uploading && <div className="text-xs text-slate-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Uploading to Appwrite Storage...</div>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={uploading || saving} className="bg-slate-900 text-white hover:bg-slate-800">
            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : "Save Branding"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900"><Palette size={18} className="text-[#FF5C73]" /> Brand Colors</CardTitle>
          <CardDescription className="text-slate-500">Customize the look and feel of your website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
            <p className="text-slate-500 font-medium">Color customization coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
