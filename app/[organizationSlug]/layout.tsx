import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { TrialBanners } from "@/components/dashboard/TrialBanners";
import { SubscriptionProvider } from "@/components/providers/subscription-provider";
import { getCurrentContext } from "@/lib/auth/context";
import { getGymBySlug, getUserMembershipInGym } from "@/lib/auth/tenant-from-slug";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { RESERVED_ORG_SLUGS } from "@/lib/utils/org-url";

export const metadata: Metadata = {
  title: "Dashboard – GMMX",
  description: "Manage your gym from one place",
  robots: { index: false, follow: false }, // never index private dashboard
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}

export default async function OrganizationDashboardLayout({ children, params }: Props) {
  const { organizationSlug } = await params;

  // ── 1. Reserved slug guard ────────────────────────────────────────────────
  // Prevents /signin, /admin, /api, etc. from being treated as org slugs.
  if (RESERVED_ORG_SLUGS.has(organizationSlug)) {
    notFound();
  }

  // ── 2. Authentication check ───────────────────────────────────────────────
  const context = await getCurrentContext();
  if (!context) {
    redirect(`/signin?redirectTo=/${organizationSlug}/dashboard`);
  }

  const user = context.user;

  // Super admin → redirect to their own admin panel, not an org dashboard
  if (user.role === "super_admin") {
    redirect("/admin/dashboard");
  }

  // Onboarding incomplete
  if (user.onboarding_status !== "completed") {
    redirect("/onboarding");
  }

  // Password change required
  if ((user as any).requiresPasswordChange) {
    redirect("/onboarding"); // will show change-password flow
  }

  // ── 3. Gym resolution ─────────────────────────────────────────────────────
  const gym = await getGymBySlug(organizationSlug);
  if (!gym) {
    // Unknown org slug → 404
    notFound();
  }

  // ── 4. Authorization: verify user is a member of THIS gym ────────────────
  // This is the critical IDOR prevention. A user cannot access another gym's
  // dashboard by changing the slug in the URL.
  const membership = await getUserMembershipInGym(user.id, gym.$id);
  if (!membership) {
    // User is authenticated but does NOT belong to this org → 403
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] text-white p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto text-2xl">
            🚫
          </div>
          <h1 className="text-2xl font-black">Access Denied</h1>
          <p className="text-slate-400 text-sm">
            You do not have permission to access the <strong>{gym.name}</strong> workspace.
          </p>
          <a
            href="/dashboard"
            className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-[#FF5C73] text-white text-sm font-semibold hover:bg-[#e04a5f] transition-colors"
          >
            Go to your dashboard
          </a>
        </div>
      </div>
    );
  }

  // Role check: trainers and members have their own portals
  const roleUpper = (membership.role || "").toUpperCase();
  if (roleUpper === "TRAINER") {
    // Trainers use the subdomain-based trainer portal for now
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    redirect(`${proto}://${organizationSlug}.${appDomain}/trainer/dashboard`);
  }

  // ── 5. Subscription check for trial banners ───────────────────────────────
  let daysLeft = 0;
  let isExpired = false;
  let isTrial = false;

  try {
    const { databases } = await createAdminClient();
    const subRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
      Query.equal("gymId", gym.$id),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);
    const subscription = subRes.documents[0];
    if (subscription && subscription.status === "trial") {
      isTrial = true;
      daysLeft = Math.max(
        0,
        Math.ceil(
          (new Date(subscription.endsAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24),
        ),
      );
      if (daysLeft <= 0) {
        isExpired = true;
      }
    }
  } catch (error) {
    console.error("[OrgDashboardLayout] Error fetching subscription:", error);
  }

  // ── 6. Render dashboard shell ─────────────────────────────────────────────
  return (
    <SubscriptionProvider isFrozen={isExpired} isTrial={isTrial} daysLeft={daysLeft}>
      <div className="flex min-h-screen" style={{ background: "var(--color-background)" }}>
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar
            gymName={gym.name}
            gymSubdomain={gym.subdomain}
            organizationSlug={organizationSlug}
            userEmail={user.email}
          />
        </div>

        {/* Main content */}
        <div
          id="main-content-wrapper"
          className="flex-1 flex flex-col min-h-screen md:ml-[17rem] pb-16 md:pb-0 relative transition-all duration-300 ease-in-out"
        >
          {gym && (
            <TrialBanners
              daysLeft={daysLeft}
              isExpired={isExpired}
              gymName={gym.name}
              gymId={gym.$id}
            />
          )}
          <Topbar
            gymSubdomain={gym.subdomain}
            organizationSlug={organizationSlug}
            userEmail={user.email}
            gymName={gym.name}
          />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav organizationSlug={organizationSlug} />
      </div>
    </SubscriptionProvider>
  );
}
