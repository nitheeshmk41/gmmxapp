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
    redirect("/signin?redirectTo=/dashboard");
  }

  if (user.role === "super_admin") {
    redirect("/admin/dashboard");
  }
  
  if ((user as any).requiresPasswordChange) {
    redirect("/owner/change-password");
  }

  if (user.onboarding_status !== "completed") {
    redirect("/onboarding");
  }

  if (!gym) {
    redirect("/dashboard");
  }

  let daysLeft = 0;
  let isExpired = false;
  let isTrial = false;

  if (gym) {
    try {
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
    } catch (error) {
      console.error("[DashboardLayout] Error fetching subscriptions:", error);
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
            organizationSlug={gym.subdomain}
            userEmail={user.email}
          />
        </div>

        {/* Main content */}
        <div id="main-content-wrapper" className="flex-1 flex flex-col min-h-screen md:ml-[17rem] pb-16 md:pb-0 relative transition-all duration-300 ease-in-out">
          {gym && <TrialBanners daysLeft={daysLeft} isExpired={isExpired} gymName={gym.name} gymId={gym.$id} />}
          <Topbar gymSubdomain={gym.subdomain} organizationSlug={gym.subdomain} userEmail={user.email} gymName={gym.name} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav organizationSlug={gym.subdomain} />
      </div>
    </SubscriptionProvider>
  );
}
