export const dynamic = "force-dynamic";

import {
  Building2, Globe, CheckCircle2, Clock, XCircle, Search,
  ArrowUpRight, MoreHorizontal, Filter, Activity
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatRelativeDate } from "@/lib/utils";
import { CountUp } from "@/components/animations/CountUp";
import { CircularRing } from "@/components/animations/CircularRing";
import { PulseAlert } from "@/components/animations/PulseAlert";

async function getAllGyms() {
  try {
    const { databases } = await createAdminClient();
    const [gymsRes, subsRes, membersCountRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false),
        Query.limit(100),
        Query.orderDesc("$createdAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [Query.limit(200)]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [Query.limit(1)]),
    ]);

    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const allSubs = subsRes.status === "fulfilled" ? subsRes.value.documents : [];
    const totalMembers = membersCountRes.status === "fulfilled" ? membersCountRes.value.total : 0;

    const gyms = await Promise.all(allGyms.map(async (gym: any) => {
      const sub = allSubs.find((s: any) => s.gymId === gym.$id);

      // Fast counts for Health Score
      const [membersRes, settingsRes] = await Promise.all([
        databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [Query.equal("gymId", gym.$id), Query.limit(1)]),
        databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, [Query.equal("gymId", gym.$id), Query.limit(1)])
      ]);

      const hasMembers = membersRes.total > 0;
      const isPublished = settingsRes.documents[0]?.websiteStatus === "published";

      let healthScore = 20;
      if (sub?.status === "active") healthScore += 30;
      if (sub?.status === "trial") healthScore += 10;
      if (hasMembers) healthScore += 30;
      if (isPublished) healthScore += 20;

      return {
        id: gym.$id,
        name: gym.name,
        subdomain: gym.subdomain,
        customDomain: gym.customDomain || null,
        status: gym.status,
        subscription_status: sub?.status || "unknown",
        plan: sub?.planId || "starter",
        endsAt: sub?.endsAt || null,
        created_at: gym.$createdAt,
        ownerId: gym.ownerId,
        healthScore,
      };
    }));

    const activeCount = gyms.filter((g) => g.subscription_status === "active").length;
    const trialCount = gyms.filter((g) => g.subscription_status === "trial").length;
    const suspendedCount = gyms.filter((g) => g.status === "suspended").length;

    return { gyms, totalMembers, activeCount, trialCount, suspendedCount };
  } catch (e) {
    console.error("[AdminGyms]", e);
    return { gyms: [], totalMembers: 0, activeCount: 0, trialCount: 0, suspendedCount: 0 };
  }
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  active:    { bg: "#22c55e15", text: "#22c55e" },
  trial:     { bg: "#f59e0b15", text: "#f59e0b" },
  suspended: { bg: "#ef444415", text: "#ef4444" },
  cancelled: { bg: "#64748b20", text: "#64748b" },
  unknown:   { bg: "#64748b20", text: "#64748b" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.unknown;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{
        background: s.text,
        boxShadow: status === "active" ? `0 0 5px ${s.text}` : "none",
      }} />
      {status}
    </span>
  );
}

import GymActions from "./GymActions";

export default async function AdminGymsPage() {
  const { gyms, activeCount, trialCount, suspendedCount } = await getAllGyms();

  const summaryCards = [
    { label: "Total Gyms", value: gyms.length, icon: Building2, color: "#FF5C73" },
    { label: "Active", value: activeCount, icon: CheckCircle2, color: "#22c55e" },
    { label: "Trial", value: trialCount, icon: Clock, color: "#f59e0b" },
    { label: "Suspended", value: suspendedCount, icon: XCircle, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Gym Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            {gyms.length} gyms registered on the platform
          </p>
        </div>
        <GymActions />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${c.color}15` }}>
                <Icon size={18} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>
                  <CountUp to={c.value} />
                </p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">All Gyms</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-500">
              {gyms.length} total
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {["Gym", "Subdomain", "Subscription", "Health Score", "Trial Ends", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gyms.map((gym, i) => (
                <tr key={gym.id} className="hover:bg-slate-50/50 transition-colors group"
                  style={{ borderBottom: i < gyms.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                        style={{ background: "var(--color-brand-primary)" }}>
                        {gym.name?.charAt(0)?.toUpperCase() || "G"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{gym.name}</p>
                        {gym.customDomain && (
                          <p className="text-xs text-slate-400">{gym.customDomain}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`https://${gym.subdomain}.gmmx.app`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono hover:underline text-blue-600">
                      <Globe size={10} />{gym.subdomain}.gmmx.app
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={gym.subscription_status} />
                  </td>
                  <td className="px-5 py-4">
                    <PulseAlert active={gym.healthScore <= 40} className="rounded-full flex items-center justify-center">
                      <CircularRing 
                        progress={gym.healthScore} 
                        size={36} 
                        strokeWidth={3} 
                        color={gym.healthScore > 70 ? "#10b981" : gym.healthScore > 40 ? "#f59e0b" : "#ef4444"} 
                      />
                    </PulseAlert>
                  </td>
                  <td className="px-5 py-4">
                    {(() => {
                      if (!gym.endsAt) return <span className="text-xs text-slate-400">—</span>;
                      if (gym.subscription_status === "trial") {
                        const diff = new Date(gym.endsAt).getTime() - new Date().getTime();
                        if (diff > 0) {
                          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          return (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-orange-600">{days}d {hours}h left</span>
                              <span className="text-[10px] text-slate-400">Ends {new Date(gym.endsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            </div>
                          );
                        }
                        return (
                          <PulseAlert active={true} colorClass="bg-red-500">
                            <span className="text-xs font-bold text-red-600 px-2 py-1 bg-red-50 rounded-md">Expired</span>
                          </PulseAlert>
                        );
                      }
                      return <span className="text-xs text-slate-500">{new Date(gym.endsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>;
                    })()}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500">
                      {formatRelativeDate(gym.created_at)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`/admin/gyms/${gym.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                      style={{ background: "#FF5C7315", color: "#FF5C73" }}>
                      View <ArrowUpRight size={10} />
                    </a>
                  </td>
                </tr>
              ))}
              {gyms.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Building2 size={32} className="mx-auto mb-3 opacity-20 text-slate-400" />
                    <p className="text-sm text-slate-500">No gyms registered yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
