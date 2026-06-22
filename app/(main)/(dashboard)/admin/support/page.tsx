export const dynamic = "force-dynamic";

import { Headphones, Activity, AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatRelativeDate } from "@/lib/utils";

async function getActivityLogs() {
  try {
    const { databases } = await createAdminClient();

    const [logsRes, gymsRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.ACTIVITY_LOGS, [
        Query.limit(50),
        Query.orderDesc("timestamp"),
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false), Query.limit(100),
      ]),
    ]);

    const logs = logsRes.status === "fulfilled" ? logsRes.value.documents : [];
    const gyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];
    const gymMap: Record<string, string> = {};
    gyms.forEach((g: any) => { gymMap[g.$id] = g.name; });

    const enriched = logs.map((log: any) => ({
      id: log.$id,
      gymName: gymMap[log.gymId] || "Platform",
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      timestamp: log.timestamp,
    }));

    return { logs: enriched, total: logs.length };
  } catch (e) {
    console.error("[AdminSupport]", e);
    return { logs: [], total: 0 };
  }
}

function actionIcon(action: string) {
  if (action.toLowerCase().includes("fail")) return { icon: AlertCircle, color: "#ef4444" };
  if (action.toLowerCase().includes("creat")) return { icon: CheckCircle2, color: "#22c55e" };
  if (action.toLowerCase().includes("delet")) return { icon: AlertCircle, color: "#f97316" };
  return { icon: Activity, color: "#6366f1" };
}

export default async function AdminSupportPage() {
  const { logs, total } = await getActivityLogs();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Support & Activity</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          Platform-wide activity logs and system events
        </p>
      </div>

      {/* Ticket system coming soon */}
      <div className="card rounded-2xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#FF5C7315" }}>
          <Headphones size={24} style={{ color: "#FF5C73" }} />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-black" style={{ color: "var(--color-foreground)" }}>
            Ticket System — Coming Soon
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>
            A full in-app support ticket system is planned for gyms to raise issues directly from their dashboard.
            Until then, monitor platform activity below and reach out via email.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
          style={{ background: "#f59e0b15", color: "#f59e0b" }}>
          Planned
        </span>
      </div>

      {/* Activity log */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Platform Activity Log</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
              Last {total} events across all gyms
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#22c55e" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            Live
          </div>
        </div>

        {logs.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "var(--color-border-muted)" }}>
            {logs.map((log) => {
              const { icon: Icon, color } = actionIcon(log.action);
              return (
                <div key={log.id} className="px-5 py-3.5 flex items-center gap-4 table-row-hover">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}12` }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--color-foreground)" }}>
                        {log.action}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
                        {log.entity}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                      {log.gymName}
                    </p>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: "var(--color-subtle)" }}>
                    {formatRelativeDate(log.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <Activity size={32} className="mx-auto mb-3 opacity-20" style={{ color: "var(--color-muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No activity logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
