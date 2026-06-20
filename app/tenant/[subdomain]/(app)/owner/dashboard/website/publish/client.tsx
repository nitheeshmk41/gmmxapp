"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { publishWebsite } from "@/features/website/actions";
import { Loader2, Rocket, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  gymName: string;
  hasLogo: boolean;
  hasPhone: boolean;
  hasHeroTitle: boolean;
  hasHeroSubtitle: boolean;
}

export function PublishClient({ gymName, hasLogo, hasPhone, hasHeroTitle, hasHeroSubtitle }: Props) {
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const tasks = [
    { name: "Gym Name Added", done: !!gymName },
    { name: "Template Selected", done: true }, // Default is applied
    { name: "Phone Number Added", done: hasPhone },
    { name: "Hero Content Configured", done: hasHeroTitle && hasHeroSubtitle },
    { name: "Logo Uploaded", done: hasLogo },
  ];

  const completedCount = tasks.filter(t => t.done).length;
  const pct = Math.round((completedCount / tasks.length) * 100);

  const handlePublish = async () => {
    setPublishing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const pubRes = await publishWebsite();
      if (pubRes.error) {
        setErrorMsg(pubRes.error);
      } else {
        setSuccessMsg("Congratulations! Your website is now live!");
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish website.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-sm font-medium animate-in">{errorMsg}</div>}
      {successMsg && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm font-medium animate-in">{successMsg}</div>}

      <Card className="border-slate-200 bg-white shadow-sm max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
            <Rocket size={24} className="text-[#FF5C73]" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Website Status</CardTitle>
          <CardDescription className="text-slate-500">Review your Launch Checklist before going live.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700">Completion: {pct}%</span>
              <span className="text-sm font-bold text-slate-500">{completedCount}/{tasks.length}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-[#FF5C73] transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="space-y-3 px-2">
            {tasks.map(t => (
              <div key={t.name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-700 font-medium">{t.name}</span>
                {t.done ? (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                ) : (
                  <XCircle size={20} className="text-slate-300" />
                )}
              </div>
            ))}
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 pb-8 border-t border-slate-100">
          <a 
            href="/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex-1 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-semibold transition-all h-11 flex items-center justify-center shadow-sm"
          >
            Preview Website
          </a>
          <Button 
            onClick={handlePublish} 
            disabled={publishing || pct < 50}
            className="w-full flex-1 bg-[#FF5C73] hover:bg-[#ff405b] text-white h-11 rounded-xl"
          >
            {publishing ? <Loader2 size={16} className="animate-spin mr-2" /> : "Publish Website"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
