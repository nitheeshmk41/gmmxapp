export const dynamic = "force-dynamic";

import { Dumbbell, Building2, Users, Globe } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatRelativeDate } from "@/lib/utils";

async function getAllTrainers() {
  try {
    const { databases } = await createAdminClient();
    const [trainersRes, gymsRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, [
        Query.limit(200),
        Query.orderDesc("$createdAt"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false),
        Query.limit(200),
      ]),
    ]);

    const allTrainers = trainersRes.status === "fulfilled" ? trainersRes.value.documents : [];
    const total = trainersRes.status === "fulfilled" ? trainersRes.value.total : 0;
    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const gymMap: Record<string, string> = {};
    allGyms.forEach((g: any) => { gymMap[g.$id] = g.name; });

    // gyms that have at least one trainer
    const gymsWithTrainers = new Set(allTrainers.map((t: any) => t.gymId)).size;
    const avgPerGym = gymsWithTrainers > 0 ? (total / gymsWithTrainers).toFixed(1) : "0";

    const trainers = allTrainers.map((t: any) => ({
      id: t.$id,
      name: t.name,
      gymId: t.gymId,
      gymName: gymMap[t.gymId] || "Unknown Gym",
      slug: t.slug,
      createdAt: t.$createdAt,
    }));

    return { trainers, total, gymsWithTrainers, avgPerGym };
  } catch (e) {
    console.error("[AdminTrainers]", e);
    return { trainers: [], total: 0, gymsWithTrainers: 0, avgPerGym: "0" };
  }
}

export default async function AdminTrainersPage() {
  const data = await getAllTrainers();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Trainers</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {data.total} trainers across all gyms
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Trainers", value: data.total, icon: Dumbbell, color: "#f59e0b" },
          { label: "Gyms with Trainers", value: data.gymsWithTrainers, icon: Building2, color: "#6366f1" },
          { label: "Avg per Gym", value: data.avgPerGym, icon: Users, color: "#22c55e" },
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
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>All Trainers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["Trainer", "Gym", "Slug", "Added"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.trainers.map((t, i) => (
                <tr key={t.id} className="table-row-hover"
                  style={{ borderBottom: i < data.trainers.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                        style={{ background: "#f59e0b" }}>
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Globe size={10} style={{ color: "var(--color-subtle)" }} />
                      <span style={{ color: "var(--color-muted-foreground)" }}>{t.gymName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
                      {t.slug}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {formatRelativeDate(t.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
              {data.trainers.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>No trainers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
