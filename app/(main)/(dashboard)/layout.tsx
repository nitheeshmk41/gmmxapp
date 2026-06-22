import { redirect } from "next/navigation";
import { getCurrentGym } from "@/lib/auth/context";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  CreditCard,
  LogOut,
  Shield,
  Activity,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Super Admin – GMMX",
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/gyms", label: "Gyms", icon: Building2 },
  { href: "/billing", label: "Subscriptions", icon: CreditCard },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const gymContext = await getCurrentGym();
  const user = gymContext?.user;

  if (!user) {
    redirect("/signin");
  }

  if (user.role !== "super_admin") {
    if (gymContext?.gym?.subdomain) {
      const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
      const proto = process.env.NODE_ENV === "production" ? "https" : "http";
      redirect(`${proto}://${gymContext.gym.subdomain}.${appDomain}/dashboard`);
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-background)" }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 gap-4"
        style={{
          background: "var(--color-sidebar)",
          borderBottom: "1px solid var(--color-sidebar-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg"
            style={{ background: "var(--color-brand-primary)" }}
          >
            G
          </div>
          <span className="font-bold text-white text-sm tracking-tight">GMMX</span>
          <span
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "#FF5C7325", color: "#FF5C73", border: "1px solid #FF5C7340" }}
          >
            <Shield size={9} />
            Super Admin
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:text-white"
                style={{ color: "#94A3B8" }}
              >
                <Icon size={12} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-white">{user.name || user.email}</span>
            <span className="text-xs" style={{ color: "#64748B" }}>
              {user.email}
            </span>
          </div>
          <a
            href="/signout"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: "#1e293b" }}
            title="Sign out"
          >
            <LogOut size={13} style={{ color: "#94A3B8" }} />
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 px-6 py-2.5 text-xs"
        style={{
          borderBottom: "1px solid var(--color-border-muted)",
          color: "var(--color-muted-foreground)",
        }}
      >
        <Activity size={11} />
        <span>Admin</span>
        <ChevronRight size={11} />
        <span style={{ color: "var(--color-foreground)" }} className="font-medium">
          Dashboard
        </span>
      </div>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
