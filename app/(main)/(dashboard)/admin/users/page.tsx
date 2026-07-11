export const dynamic = "force-dynamic";

import { Users, Shield, Dumbbell, UserCircle, Calendar } from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatRelativeDate } from "@/lib/utils";

async function getPlatformUsers() {
  try {
    const { databases, users } = await createAdminClient();

    const [userListRes, gymUsersRes, gymsRes] = await Promise.allSettled([
      users.list([Query.limit(100), Query.orderDesc("$createdAt")]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, [Query.limit(200)]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYMS, [
        Query.equal("isDeleted", false), Query.limit(100),
      ]),
    ]);

    const allUsers = userListRes.status === "fulfilled" ? userListRes.value.users : [];
    const gymUsers = gymUsersRes.status === "fulfilled" ? gymUsersRes.value.documents : [];
    const allGyms = gymsRes.status === "fulfilled" ? gymsRes.value.documents : [];

    const gymMap: Record<string, string> = {};
    allGyms.forEach((g: any) => { gymMap[g.$id] = g.name; });

    const gymUsersByUserId: Record<string, any> = {};
    gymUsers.forEach((gu: any) => { gymUsersByUserId[gu.userId] = gu; });

    const enriched = allUsers.map((u: any) => {
      const prefs = u.prefs || {};
      const gu = gymUsersByUserId[u.$id];
      const role = prefs.role || gu?.role || "owner";
      return {
        id: u.$id,
        name: u.name || "—",
        email: u.email,
        role,
        gymName: gu ? (gymMap[gu.gymId] || "Unknown Gym") : "—",
        emailVerified: u.emailVerification,
        createdAt: u.$createdAt,
        onboardingStatus: prefs.onboarding_status || "pending",
      };
    });

    const owners = enriched.filter((u) => u.role === "owner");
    const trainers = enriched.filter((u) => u.role === "trainer");
    const superAdmins = enriched.filter((u) => u.role === "super_admin");

    return { all: enriched, owners, trainers, superAdmins, total: allUsers.length };
  } catch (e) {
    console.error("[AdminUsers]", e);
    return { all: [], owners: [], trainers: [], superAdmins: [], total: 0 };
  }
}

const ROLE_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  super_admin: { bg: "#FF5C7315", text: "#FF5C73", label: "Super Admin" },
  owner:       { bg: "#6366f115", text: "#6366f1", label: "Owner" },
  trainer:     { bg: "#f59e0b15", text: "#f59e0b", label: "Trainer" },
  manager:     { bg: "#22c55e15", text: "#22c55e", label: "Manager" },
  member:      { bg: "#64748b15", text: "#64748b", label: "Member" },
};

function RolePill({ role }: { role: string }) {
  const s = ROLE_STYLE[role] || ROLE_STYLE.member;
  return (
    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

import AddAdminForm from "./AddAdminForm";

export default async function AdminUsersPage() {
  const data = await getPlatformUsers();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Platform Users</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            {data.total} registered users across all gyms
          </p>
        </div>
        <AddAdminForm />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: data.total, icon: Users, color: "#6366f1" },
          { label: "Gym Owners", value: data.owners.length, icon: Shield, color: "#FF5C73" },
          { label: "Trainers", value: data.trainers.length, icon: Dumbbell, color: "#f59e0b" },
          { label: "Super Admins", value: data.superAdmins.length, icon: UserCircle, color: "#22c55e" },
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
          <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>All Platform Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                {["User", "Role", "Gym", "Onboarding", "Joined"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                    style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.all.map((u, i) => (
                <tr key={u.id} className="table-row-hover"
                  style={{ borderBottom: i < data.all.length - 1 ? "1px solid var(--color-border-muted)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                        style={{ background: "var(--color-brand-primary)" }}>
                        {(u.name || u.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>{u.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><RolePill role={u.role} /></td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{u.gymName}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      u.onboardingStatus === "completed" ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"
                    }`}>
                      {u.onboardingStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {formatRelativeDate(u.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
              {data.all.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm"
                  style={{ color: "var(--color-muted-foreground)" }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
