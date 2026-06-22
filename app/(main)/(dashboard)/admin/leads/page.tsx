export const dynamic = "force-dynamic";

import {
  MessageSquare, Clock, ArrowUpRight, Mail, Phone,
  UserPlus, TrendingUp,
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { formatRelativeDate } from "@/lib/utils";
import { Query } from "node-appwrite";

async function getUnconvertedLeads() {
  try {
    const { users } = await createAdminClient();

    // Fetch users whose onboarding_status is pending (signed up but never created a gym)
    const allUsers = await users.list([
      Query.limit(100),
      Query.orderDesc("$createdAt"),
    ]);

    const leads = allUsers.users
      .filter((u: any) => {
        const prefs = u.prefs || {};
        return (
          prefs.onboarding_status === "pending" ||
          !prefs.onboarding_status
        );
      })
      .filter((u: any) => !u.email?.endsWith("@phone.gmmx.app")) // exclude phone users
      .map((u: any) => ({
        id: u.$id,
        name: u.name || "—",
        email: u.email,
        emailVerified: u.emailVerification,
        signedUpAt: u.$createdAt,
        hoursSinceSignup: Math.round(
          (Date.now() - new Date(u.$createdAt).getTime()) / (1000 * 60 * 60)
        ),
      }));

    const today = leads.filter((l) => l.hoursSinceSignup <= 24);
    const thisWeek = leads.filter((l) => l.hoursSinceSignup <= 168);

    return { leads, total: leads.length, today: today.length, thisWeek: thisWeek.length };
  } catch (e) {
    console.error("[AdminLeads]", e);
    return { leads: [], total: 0, today: 0, thisWeek: 0 };
  }
}

function urgencyColor(hours: number): { text: string; label: string } {
  if (hours <= 24) return { text: "#ef4444", label: "Hot" };
  if (hours <= 72) return { text: "#f97316", label: "Warm" };
  if (hours <= 168) return { text: "#f59e0b", label: "Follow up" };
  return { text: "#64748b", label: "Cold" };
}

export default async function AdminLeadsPage() {
  const data = await getUnconvertedLeads();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Unconverted Leads</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Users who signed up but never created a gym — your hottest sales opportunity
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "#6366f110", border: "1px solid #6366f125" }}>
        <TrendingUp size={16} style={{ color: "#6366f1" }} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#6366f1" }}>Sales Insight</p>
          <p className="text-xs mt-0.5" style={{ color: "#6366f1cc" }}>
            These users showed enough interest to sign up but got stuck before creating their gym.
            Reaching out within 24 hours can significantly improve conversion. Consider a WhatsApp or email outreach.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Unconverted", value: data.total, icon: MessageSquare, color: "#FF5C73" },
          { label: "Signed up Today", value: data.today, icon: UserPlus, color: "#22c55e" },
          { label: "This Week", value: data.thisWeek, icon: Clock, color: "#f59e0b" },
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
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>
            Lead List <span className="ml-2 text-xs font-normal" style={{ color: "var(--color-muted-foreground)" }}>
              sorted by most recent
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["User", "Signed Up", "Temperature", "Verified", "Contact"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead, i) => {
                const urgency = urgencyColor(lead.hoursSinceSignup);
                return (
                  <tr key={lead.id} className="table-row-hover"
                    style={{ borderBottom: i < data.leads.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: "var(--color-brand-primary)" }}>
                          {(lead.name !== "—" ? lead.name : lead.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>{lead.name}</p>
                          <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {formatRelativeDate(lead.signedUpAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${urgency.text}15`, color: urgency.text }}>
                        {urgency.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${lead.emailVerified ? "text-green-600" : "text-amber-600"}`}>
                        {lead.emailVerified ? "✓ Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`mailto:${lead.email}?subject=Get started with GMMX&body=Hi ${lead.name}, we noticed you signed up for GMMX but haven't created your gym yet. Need help getting started?`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                        style={{ background: "#6366f115", color: "#6366f1" }}>
                        <Mail size={11} /> Email
                      </a>
                    </td>
                  </tr>
                );
              })}
              {data.leads.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>
                  🎉 All signups have converted! No unconverted leads.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
