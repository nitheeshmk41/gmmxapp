export const dynamic = "force-dynamic";

import {
  Users, CheckCircle2, XCircle, AlertTriangle, Globe,
  ArrowUpRight, Phone, Calendar,
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatDate, formatRelativeDate } from "@/lib/utils";

async function getAllMembers() {
  try {
    const { databases } = await createAdminClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [membersRes, gymsRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
        Query.limit(200),
        Query.orderDesc("$createdAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false),
        Query.limit(200),
      ]),
    ]);

    const allMembers = membersRes.status === "fulfilled" ? membersRes.value.documents : [];
    const totalCount = membersRes.status === "fulfilled" ? membersRes.value.total : 0;
    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const gymMap: Record<string, string> = {};
    allGyms.forEach((g: any) => { gymMap[g.$id] = g.name; });

    const todayStr = today.toISOString().split("T")[0];

    const enriched = allMembers.map((m: any) => {
      const endDate = m.membershipEndDate ? new Date(m.membershipEndDate) : null;
      const daysLeft = endDate
        ? Math.round((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
      return {
        id: m.$id,
        name: m.name,
        phone: m.phone,
        email: m.email || "—",
        gymName: gymMap[m.gymId] || "Unknown Gym",
        gymId: m.gymId,
        status: m.status,
        membershipEnd: m.membershipEndDate || null,
        daysLeft,
        joinedAt: m.joinedAt,
      };
    });

    const active = enriched.filter((m) => m.status === "active").length;
    const expired = enriched.filter((m) => m.status === "expired").length;
    const renewalsToday = enriched.filter(
      (m) => m.daysLeft !== null && m.daysLeft >= 0 && m.daysLeft <= 1
    ).length;

    return { members: enriched, total: totalCount, active, expired, renewalsToday };
  } catch (e) {
    console.error("[AdminMembers]", e);
    return { members: [], total: 0, active: 0, expired: 0, renewalsToday: 0 };
  }
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  active:  { bg: "#22c55e15", text: "#22c55e" },
  expired: { bg: "#ef444415", text: "#ef4444" },
};

function daysLeftBadge(days: number | null) {
  if (days === null) return null;
  if (days < 0) return { text: "Expired", bg: "#ef444415", color: "#ef4444" };
  if (days === 0) return { text: "Expires today!", bg: "#ef444415", color: "#ef4444" };
  if (days <= 3) return { text: `${days}d left`, bg: "#f9731615", color: "#f97316" };
  if (days <= 7) return { text: `${days}d left`, bg: "#f59e0b15", color: "#f59e0b" };
  return null;
}

export default async function AdminMembersPage() {
  const data = await getAllMembers();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>
          Members
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {data.total.toLocaleString()} members across all gyms
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: data.total.toLocaleString(), icon: Users, color: "#6366f1" },
          { label: "Active", value: data.active, icon: CheckCircle2, color: "#22c55e" },
          { label: "Expired", value: data.expired, icon: XCircle, color: "#ef4444" },
          { label: "Renewing Today", value: data.renewalsToday, icon: AlertTriangle, color: "#f97316" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${c.color}15` }}>
                <Icon size={18} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>{c.value}</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>
            All Members
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
            Showing {data.members.length} of {data.total}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["Member", "Phone", "Gym", "Status", "Membership End", "Joined"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.members.map((m, i) => {
                const s = STATUS_STYLE[m.status] || STATUS_STYLE.expired;
                const expBadge = daysLeftBadge(m.daysLeft);
                return (
                  <tr key={m.id} className="table-row-hover transition-colors"
                    style={{ borderBottom: i < data.members.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: "var(--color-brand-primary)" }}>
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>{m.name}</p>
                          <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--color-muted-foreground)" }}>
                        <Phone size={10} />{m.phone}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Globe size={10} style={{ color: "var(--color-subtle)" }} />
                        <span style={{ color: "var(--color-muted-foreground)" }}>{m.gymName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                          {m.membershipEnd ? formatDate(m.membershipEnd) : "—"}
                        </span>
                        {expBadge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: expBadge.bg, color: expBadge.color }}>
                            {expBadge.text}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {formatRelativeDate(m.joinedAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.members.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>No members found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
