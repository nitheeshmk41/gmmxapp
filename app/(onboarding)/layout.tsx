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

  // Not logged in — clear stale cookie and redirect
  if (!user) {
    const cookieStore = await cookies();
    const sessionCookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    cookieStore.delete(sessionCookieName);
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
