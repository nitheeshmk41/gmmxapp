import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/features/auth/actions";

/**
 * Onboarding layout with auth guards.
 *
 * Guards:
 * 1. Must be authenticated → redirect to /login
 * 2. Must NOT already have a gym → redirect to /dashboard
 */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Not logged in — redirect to login
  if (!user) {
    redirect("/login");
  }

  // Super admins don't need onboarding
  if (user.role === "super_admin") {
    redirect("/admin");
  }

  // Already completed onboarding
  if (user.onboarding_status === "completed") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
