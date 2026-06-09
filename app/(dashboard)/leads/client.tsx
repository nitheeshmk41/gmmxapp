"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Plus,
  MessageSquare,
  UserPlus,
  Trash2,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  deleteLead,
  updateLeadStatus,
  convertLeadToMember,
} from "@/features/leads/actions";
import {
  buildLeadWelcomeUrl,
} from "@/lib/whatsapp";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { AddLeadModal } from "./add-modal";
import { getCurrentGym } from "@/features/auth/actions";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  source: string;
  status: string;
  notes?: string | null;
  last_contacted_at?: Date | null;
  created_at: Date;
};

interface Props {
  leads: Lead[];
  total: number;
  page: number;
  search: string;
  status: string;
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "trial", label: "Trial" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "badge-info",
  contacted: "badge-brand",
  interested: "badge-warning",
  trial: "badge-warning",
  converted: "badge-success",
  lost: "badge-muted",
};

const SOURCE_LABELS: Record<string, string> = {
  walk_in: "Walk-in",
  website: "Website",
  referral: "Referral",
  instagram: "Instagram",
  other: "Other",
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "trial", label: "Trial" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export function LeadsClientPage({ leads, total, page, search, status }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(search);
  const [showAddModal, setShowAddModal] = useState(false);

  const pageSize = 25;
  const totalPages = Math.ceil(total / pageSize);

  function updateSearch(val: string) {
    setLocalSearch(val);
    const params = new URLSearchParams();
    if (val) params.set("search", val);
    if (status !== "all") params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
  }

  function updateStatus(val: string) {
    const params = new URLSearchParams();
    if (localSearch) params.set("search", localSearch);
    if (val !== "all") params.set("status", val);
    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleStatusChange(leadId: string, newStatus: string) {
    startTransition(async () => {
      await updateLeadStatus(leadId, newStatus);
    });
  }

  async function handleDelete(leadId: string) {
    if (!confirm("Delete this lead?")) return;
    startTransition(async () => {
      await deleteLead(leadId);
    });
  }

  async function handleConvert(leadId: string) {
    if (!confirm("Convert this lead to a member? They will be added to Members.")) return;
    startTransition(async () => {
      const result = await convertLeadToMember(leadId);
      if (result?.success) {
        router.push("/dashboard/members");
      }
    });
  }

  return (
    <div className="space-y-5 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          {total} lead{total !== 1 ? "s" : ""} total
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
        >
          <Plus size={14} />
          Add Lead
        </button>
      </div>

      {/* Search + Status filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted-foreground)" }} />
          <input
            placeholder="Search leads…"
            value={localSearch}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-lg text-sm w-64"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-foreground)", outline: "none" }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-lg flex-wrap" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateStatus(tab.value)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                background: status === tab.value ? "var(--color-brand-primary)" : "transparent",
                color: status === tab.value ? "white" : "var(--color-muted-foreground)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-border-muted)" }}>
              {["Lead", "Phone", "Source", "Status", "Last Contact", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No leads found</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="table-row-hover" style={{ borderBottom: "1px solid var(--color-border-muted)" }}>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{lead.name}</p>
                      {lead.email && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{lead.email}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                      <Phone size={13} />{lead.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="badge-muted">{SOURCE_LABELS[lead.source] || lead.source}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="text-xs rounded-full px-2 py-1 font-medium cursor-pointer"
                      style={{
                        background: "transparent",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-foreground)",
                        outline: "none",
                      }}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {lead.last_contacted_at ? formatRelativeDate(lead.last_contacted_at) : "Never"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {/* WhatsApp */}
                      <a
                        href={buildLeadWelcomeUrl(lead.phone, lead.name, "our gym")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg transition-all"
                        title="Send WhatsApp"
                        style={{ color: "#25D366" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <MessageSquare size={15} />
                      </a>
                      {/* Convert */}
                      {lead.status !== "converted" && lead.status !== "lost" && (
                        <button
                          onClick={() => handleConvert(lead.id)}
                          className="p-1.5 rounded-lg transition-all"
                          title="Convert to Member"
                          style={{ color: "var(--color-success)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-success-light)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <UserPlus size={15} />
                        </button>
                      )}
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: "var(--color-danger)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-danger-light)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--color-border)" }}>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => router.push(`${pathname}?page=${page - 1}`)}>
                <ChevronLeft size={16} style={{ color: page <= 1 ? "var(--color-border)" : "var(--color-foreground)" }} />
              </button>
              <span className="text-xs px-2" style={{ color: "var(--color-muted-foreground)" }}>{page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => router.push(`${pathname}?page=${page + 1}`)}>
                <ChevronRight size={16} style={{ color: page >= totalPages ? "var(--color-border)" : "var(--color-foreground)" }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
