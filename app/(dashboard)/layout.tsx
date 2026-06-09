import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";

export const metadata: Metadata = {
  title: "Dashboard – GMMX",
  description: "Manage your gym from one place",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, gym] = await Promise.all([getCurrentUser(), getCurrentGym()]);

  if (!user) redirect("/login");
  if (user.role === "super_admin") redirect("/admin");
  if (!gym) redirect("/onboarding");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Sidebar */}
      <Sidebar
        gymName={gym.name}
        gymSubdomain={gym.subdomain}
        userEmail={user.email}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: "256px" }}>
        <Topbar gymSubdomain={gym.subdomain} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
