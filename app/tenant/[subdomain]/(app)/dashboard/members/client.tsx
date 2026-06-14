"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Phone,
  MoreVertical,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
} from "lucide-react";
import { deleteMember, getMembersForExport } from "@/features/members/actions";
import { formatDate, getExpiryStatus, downloadCSV, getInitials, formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";

type Member = {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  email?: string | null;
  status: string;
  join_date: Date;
  photo_url?: string | null;
  plan?: { name: string; price: number } | null;
  membershipEndDate: Date | null;
};

interface Props {
  members: Member[];
  total: number;
  page: number;
  search: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Members" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];

export function MembersClientPage({ members, total, page, search, status }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(search);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const pageSize = 20;
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

  async function handleExport() {
    const data = await getMembersForExport();
    downloadCSV(data, `members-${new Date().toISOString().split("T")[0]}.csv`);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this member? This cannot be undone.")) return;
    setOpenMenu(null);
    startTransition(async () => {
      await deleteMember(id);
    });
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      active: "badge-success",
      expired: "badge-danger",
      paused: "badge-warning",
    };
    return map[s] || "badge-muted";
  };

  return (
    <div className="space-y-5 animate-in">
      <PageHeader
        title="Members"
        description="Manage your gym members, track payments, and monitor expirations."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Members" }]}
        action={
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              <Download size={14} />
              Export CSV
            </button>
            <Link
              href="/dashboard/members/new"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
            >
              <Plus size={14} />
              Add Member
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted-foreground)" }} />
          <input
            placeholder="Search by name, phone, or email…"
            value={localSearch}
            onChange={(e) => updateSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-foreground)",
              outline: "none",
            }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateStatus(opt.value)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                background: status === opt.value ? "var(--color-brand-primary)" : "transparent",
                color: status === opt.value ? "white" : "var(--color-muted-foreground)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-border-muted)" }}>
              {["Member", "Phone", "Plan", "Membership End", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <User size={32} className="mx-auto mb-3" style={{ color: "var(--color-border)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                    No members found
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-subtle)" }}>
                    Add your first member to get started
                  </p>
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const membershipEnd = member.membershipEndDate;
                const expiryStatus = membershipEnd ? getExpiryStatus(membershipEnd) : null;

                return (
                  <tr
                    key={member.id}
                    className="table-row-hover"
                    style={{ borderBottom: "1px solid var(--color-border-muted)" }}
                  >
                    {/* Member */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: "var(--color-brand-primary)" }}
                        >
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                            {member.name} <span className="text-xs ml-1 font-semibold opacity-70" style={{ color: "var(--color-muted-foreground)" }}>({member.memberCode})</span>
                          </p>
                          {member.email && (
                            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Phone */}
                    <td className="px-4 py-3.5">
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1.5 text-sm"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        <Phone size={13} />
                        {member.phone}
                      </a>
                    </td>
                    {/* Plan */}
                    <td className="px-4 py-3.5">
                      {member.plan ? (
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                            {member.plan.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                            {formatCurrency(member.plan.price)}/mo
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--color-subtle)" }}>No plan</span>
                      )}
                    </td>
                    {/* Membership End */}
                    <td className="px-4 py-3.5">
                      {membershipEnd ? (
                        <span
                          className="text-sm font-medium"
                          style={{
                            color: expiryStatus === "expired" || expiryStatus === "critical"
                              ? "var(--color-danger)"
                              : expiryStatus === "warning" || expiryStatus === "upcoming"
                              ? "var(--color-warning)"
                              : "var(--color-foreground)",
                          }}
                        >
                          {formatDate(membershipEnd)}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--color-subtle)" }}>—</span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={statusBadge(member.status)}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="relative flex items-center gap-2 justify-end">
                        <Link
                          href={`/dashboard/members/${member.id}`}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: "var(--color-muted-foreground)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-border-muted)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: "var(--color-muted-foreground)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-border-muted)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <MoreVertical size={15} />
                        </button>
                        {openMenu === member.id && (
                          <div
                            className="absolute right-0 top-8 w-36 rounded-xl z-10 overflow-hidden"
                            style={{
                              background: "var(--color-surface)",
                              border: "1px solid var(--color-border)",
                              boxShadow: "var(--shadow-lg)",
                            }}
                          >
                            <Link
                              href={`/dashboard/members/${member.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm transition-all"
                              style={{ color: "var(--color-foreground)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-border-muted)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-all"
                              style={{ color: "var(--color-danger)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-danger-light)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => router.push(`${pathname}?page=${page - 1}`)}
                className="p-1.5 rounded-lg"
                style={{ color: page <= 1 ? "var(--color-border)" : "var(--color-foreground)" }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs px-2" style={{ color: "var(--color-muted-foreground)" }}>
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => router.push(`${pathname}?page=${page + 1}`)}
                className="p-1.5 rounded-lg"
                style={{ color: page >= totalPages ? "var(--color-border)" : "var(--color-foreground)" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
