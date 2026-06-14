import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
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

  if (user.role === "super_admin") {
    const rootUrl = process.env.NODE_ENV === "production" ? "https://gmmx.app/dashboard" : "http://localhost:3000/dashboard";
    redirect(rootUrl);
  }
  if (user.onboarding_status !== "completed") {
    redirect("/onboarding");
  }

  if (!gym) {
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    let host = appDomain;
    if (process.env.NODE_ENV !== "production") {
      host = "localhost:3000";
    }
    redirect(`${proto}://${host}/dashboard`);
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          gymName={gym.name}
          gymSubdomain={gym.subdomain}
          userEmail={user.email}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 pb-16 md:pb-0">
        <Topbar gymSubdomain={gym.subdomain} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
