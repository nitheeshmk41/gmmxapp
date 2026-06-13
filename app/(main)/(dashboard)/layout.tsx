import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

  if (!user) {
    // Session cookie is stale/invalid. 
    // We redirect to login with a redirectTo parameter.
    // The middleware will intercept this and delete the stale cookie.
    redirect("/login?redirectTo=/dashboard");
  }

  if (user.role === "super_admin") redirect("/admin");
  if (user.role === "trainer") redirect("/trainer/dashboard");
  if (user.role === "member") redirect("/member/dashboard");
  if (!gym || user.onboarding_status !== "completed") redirect("/onboarding");

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
