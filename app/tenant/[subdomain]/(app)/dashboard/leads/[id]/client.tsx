"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Phone, UserCheck, MessageSquare } from "lucide-react";
import { updateLeadStatus, deleteLead, convertLeadToMember } from "@/features/leads/actions";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Lead = {
  id: string;
  name: string;
  phone: string;
  status: "New" | "Contacted" | "Interested" | "Trial" | "Converted" | "Lost";
  source: string;
  createdAt: string;
};

export default function LeadDetailClient({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(lead.status);
  const [, startTransition] = useTransition();

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const result = await updateLeadStatus(lead.id, newStatus);
    if (result?.error) {
      setError(result.error);
    } else {
      setStatus(newStatus as any);
    }
    setLoading(false);
  };

  const handleConvert = () => {
    if (!confirm("Convert this lead to a gym member? An auth user account and member record will be created.")) return;
    setLoading(true);
    startTransition(async () => {
      const result = await convertLeadToMember(lead.id);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard/members");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setLoading(true);
    startTransition(async () => {
      const result = await deleteLead(lead.id);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard/leads");
      }
    });
  };

  const whatsappUrl = buildWhatsAppUrl(lead.phone, `Hi ${lead.name}, thanks for inquiring at our gym!`);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/leads"
          className="flex items-center gap-2 text-sm font-medium hover:text-[#FF5C73] transition-all text-slate-500"
        >
          <ChevronLeft size={16} />
          Back to Leads
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs font-semibold px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
        >
          Delete Lead
        </button>
      </div>

      <div
        className="p-6 rounded-2xl md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{lead.name}</h1>
            <p className="text-xs text-slate-400 mt-1">Source: {lead.source || "Website"} • Added {new Date(lead.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={status}
              disabled={loading}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Trial">Trial</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              <Phone size={15} />
              Call Lead
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold transition-colors"
            >
              <MessageSquare size={15} />
              WhatsApp Message
            </a>
            {status !== "Converted" && (
              <button
                onClick={handleConvert}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all"
                style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <UserCheck size={15} />}
                Convert to Member
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
