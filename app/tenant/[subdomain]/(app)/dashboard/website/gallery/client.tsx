"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2, Plus, X } from "lucide-react";
import { updateWebsiteGallery } from "@/features/website/actions";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  gym: {
    gallery: string[];
  } | null;
}

export function GalleryClientPage({ gym }: Props) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const [urls, setUrls] = useState<string[]>(gym?.gallery || []);
  const [newUrl, setNewUrl] = useState("");

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  function addUrl() {
    if (!newUrl.trim()) return;
    setUrls([...urls, newUrl.trim()]);
    setNewUrl("");
  }

  function removeUrl(index: number) {
    setUrls(urls.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setLoading(true);
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await updateWebsiteGallery(urls);
      if (result?.error) setError(result.error);
      else setSaved(true);
      setLoading(false);
    });
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in pb-10">
      <PageHeader
        title="Website Gallery"
        description="Add photos of your gym, equipment, and members to showcase on your website."
        breadcrumbs={[{ label: "Website", href: ".." }, { label: "Gallery" }]}
      />

      <div className="p-6 rounded-xl space-y-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {error && <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500">{error}</div>}
        {saved && <div className="p-3 rounded-lg text-sm flex items-center gap-2 bg-green-500/10 text-green-500"><CheckCircle2 size={16} /> Gallery saved successfully!</div>}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Add Image URL</label>
          <div className="flex gap-2">
            <input 
              value={newUrl} 
              onChange={(e) => setNewUrl(e.target.value)} 
              placeholder="https://example.com/photo.jpg" 
              className="flex-1 px-3 py-2.5 rounded-lg text-sm" 
              style={inputStyle}
              onKeyDown={(e) => { if (e.key === 'Enter') addUrl() }}
            />
            <button type="button" onClick={addUrl} className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-opacity flex items-center gap-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}>
              <Plus size={16} /> Add
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>Paste direct links to images.</p>
        </div>

        {urls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {urls.map((url, i) => (
              <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50">
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeUrl(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {urls.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            No images in gallery yet. Add some URLs above!
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
