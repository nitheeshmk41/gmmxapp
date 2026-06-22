import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentGym } from "@/lib/auth/context";
import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  TrendingUp,
  Users,
  MessageSquare,
  Layers,
  Headphones,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Super Admin – GMMX",
};

const NAV_SECTIONS = [
  {
    label: "Platform",
    items: [
      { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/gyms", label: "Gyms", icon: Building2 },
      { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
      { href: "/admin/revenue", label: "Revenue", icon: TrendingUp },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/leads", label: "Leads", icon: MessageSquare },
    ],
  },
  {
    label: "Product",
    items: [
      { href: "/admin/templates", label: "Templates", icon: Layers },
      { href: "/admin/support", label: "Support", icon: Headphones },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function AdminSidebar({ userEmail, userName, pathname }: { userEmail: string; userName: string; pathname: string }) {
  return (
    <aside
      className="fixed inset-y-0 left-0 w-60 flex flex-col z-40"
      style={{
        background: "var(--color-sidebar)",
        borderRight: "1px solid var(--color-sidebar-border)",
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 h-14 px-5"
        style={{ borderBottom: "1px solid var(--color-sidebar-border)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg flex-shrink-0"
          style={{ background: "var(--color-brand-primary)" }}
        >
          G
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-white tracking-tight">GMMX</p>
          <div
            className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5"
            style={{ background: "#FF5C7325", color: "#FF5C73" }}
          >
            <Shield size={8} />
            SUPER ADMIN
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p
              className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1.5"
              style={{ color: "var(--color-sidebar-muted)" }}
            >
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group"
                    style={{
                      color: isActive ? "#FF5C73" : "var(--color-sidebar-muted)",
                      background: isActive ? "rgba(255,92,115,0.10)" : "transparent",
                    }}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#FF5C73" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Sign out */}
      <div
        className="p-3 space-y-1"
        style={{ borderTop: "1px solid var(--color-sidebar-border)" }}
      >
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "#1E293B" }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: "var(--color-brand-primary)" }}
          >
            {(userName || userEmail).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{userName || "Admin"}</p>
            <p className="text-[10px] truncate" style={{ color: "var(--color-sidebar-muted)" }}>
              {userEmail}
            </p>
          </div>
        </div>
        <Link
          href="/signout"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5 w-full"
          style={{ color: "var(--color-sidebar-muted)" }}
        >
          <LogOut size={14} />
          Sign out
        </Link>
      </div>
    </aside>
  );
}

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

  const headerStore = await headers();
  const xPathname = headerStore.get("x-pathname") || "";
  const referer = headerStore.get("referer") || "";
  // Derive pathname from next-url header (available in Next.js app router)
  const nextUrl = headerStore.get("next-url") || "";
  const currentPath = nextUrl || xPathname || "/admin/dashboard";

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-background)" }}>
      {/* Sidebar */}
      <AdminSidebar userEmail={user.email} userName={user.name || ""} pathname={currentPath} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen ml-60">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center h-14 px-6 gap-3"
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
            <Zap size={11} style={{ color: "var(--color-brand-primary)" }} />
            <span className="font-semibold" style={{ color: "var(--color-brand-primary)" }}>
              GMMX Platform
            </span>
            <ChevronRight size={11} />
            <span>Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "#22c55e15", color: "#22c55e" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
              />
              Live
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 animate-in">{children}</main>
      </div>
    </div>
  );
}
