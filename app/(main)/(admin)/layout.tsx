import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin – GMMX",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") redirect("/dashboard");

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
            { href: "/admin", label: "Overview" },
            { href: "/admin/gyms", label: "Gyms" },
            { href: "/admin/subscriptions", label: "Subscriptions" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="text-xs font-medium" style={{ color: "#94A3B8" }}>{item.label}</a>
          ))}
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
