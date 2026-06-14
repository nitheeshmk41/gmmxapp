"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { createTestimonial, deleteTestimonial } from "@/features/website/actions";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  testimonials: any[];
}

export function TestimonialsClientPage({ testimonials }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createTestimonial(formData);
      if (result?.error) setError(result.error);
      else (e.target as HTMLFormElement).reset();
      setLoading(false);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    startTransition(async () => {
      await deleteTestimonial(id);
    });
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in pb-10">
      <PageHeader
        title="Testimonials"
        description="Add success stories and reviews from your members."
        breadcrumbs={[{ label: "Website", href: ".." }, { label: "Testimonials" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <form onSubmit={handleCreate} className="p-5 rounded-xl space-y-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <h3 className="font-bold text-sm">Add New</h3>
            {error && <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500">{error}</div>}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Member Name</label>
              <input name="name" required placeholder="John Doe" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Rating (1-5)</label>
              <input type="number" name="rating" min="1" max="5" defaultValue="5" required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--color-foreground)" }}>Review</label>
              <textarea name="review" required rows={3} placeholder="Great gym, lost 10kg in 2 months!" className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }} />
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-opacity" style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)", opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Review
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          {testimonials.length === 0 ? (
            <div className="p-10 rounded-xl text-center" style={{ border: "1px dashed var(--color-border)" }}>
              <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No testimonials yet. Add one from the sidebar.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {testimonials.map((t) => (
                <div key={t.$id} className="p-4 rounded-xl flex items-start gap-4 relative" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">{t.name}</h4>
                      <div className="flex text-yellow-400 text-xs">
                        {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                      </div>
                    </div>
                    <p className="text-sm mt-2" style={{ color: "var(--color-muted-foreground)" }}>"{t.review}"</p>
                  </div>
                  <button onClick={() => handleDelete(t.$id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
