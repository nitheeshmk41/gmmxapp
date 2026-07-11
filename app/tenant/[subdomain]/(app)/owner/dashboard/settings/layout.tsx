import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions";
import Link from "next/link";
import { headers } from "next/headers";
import { Building2, User, CreditCard, Users, ShieldAlert, Link as LinkIcon } from "lucide-react";
import { SettingsNav } from "./settings-nav";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your workspace, billing, and team.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0">
          <SettingsNav />
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

// force TS server to re-parse
