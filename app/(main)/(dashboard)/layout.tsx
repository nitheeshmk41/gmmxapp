import { redirect } from "next/navigation";
import { getCurrentContext } from "@/lib/auth/context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin – GMMX",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const context = await getCurrentContext();
  const user = context?.user;
  
  if (!user) {
    redirect("/signin");
  }

  if (user.role !== "super_admin") {
    // If an owner accidentally hits the root dashboard, send them to their gym
    if (context.gym?.subdomain) {
      const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
      const proto = process.env.NODE_ENV === "production" ? "https" : "http";
      redirect(`${proto}://${context.gym.subdomain}.${appDomain}/dashboard`);
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Admin top nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between h-14 px-6"
        style={{ background: "var(--color-sidebar)", borderBottom: "1px solid var(--color-sidebar-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--color-brand-primary)" }}>G</div>
          <span className="font-bold text-white text-sm">GMMX Admin</span>
          <span className="badge-danger text-xs">Super Admin</span>
        </div>
        <nav className="flex items-center gap-4">
          {[
            { href: "/dashboard", label: "Overview" },
            { href: "/gyms", label: "Gyms" },
            { href: "/billing", label: "Subscriptions" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="text-xs font-medium" style={{ color: "#94A3B8" }}>{item.label}</a>
          ))}
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
