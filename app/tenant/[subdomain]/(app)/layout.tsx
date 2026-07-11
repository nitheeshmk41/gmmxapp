import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { TrialBanners } from "@/components/dashboard/TrialBanners";
import { SubscriptionProvider } from "@/components/providers/subscription-provider";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

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
    // We redirect to owner login with a redirectTo parameter.
    // The middleware will intercept this and delete the stale cookie.
    redirect("/owner/login?redirectTo=/owner/dashboard");
  }

  if (user.role === "super_admin") {
    const rootUrl = process.env.NODE_ENV === "production" ? "https://gmmx.app/dashboard" : "http://localhost:3000/dashboard";
    redirect(rootUrl);
  }
  
  if ((user as any).requiresPasswordChange) {
    redirect("/owner/change-password");
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

  let daysLeft = 0;
  let isExpired = false;
  let isTrial = false;

  if (gym) {
    const { databases } = await createAdminClient();
    const subRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
      Query.equal("gymId", gym.$id),
      Query.orderDesc("$createdAt"),
      Query.limit(1)
    ]);
    const subscription = subRes.documents[0];
    if (subscription && subscription.status === "trial") {
      isTrial = true;
      daysLeft = Math.max(0, Math.ceil((new Date(subscription.endsAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
      if (daysLeft <= 0) {
        isExpired = true;
      }
    }
  }

  return (
    <SubscriptionProvider isFrozen={isExpired} isTrial={isTrial} daysLeft={daysLeft}>
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
        <div className="flex-1 flex flex-col min-h-screen md:ml-64 pb-16 md:pb-0 relative">
          {gym && <TrialBanners daysLeft={daysLeft} isExpired={isExpired} gymName={gym.name} gymId={gym.$id} />}
          <Topbar gymSubdomain={gym.subdomain} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </SubscriptionProvider>
  );
}
