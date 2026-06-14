import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import OwnerDashboard from "./OwnerDashboard";
import { TrainerDashboard } from "./TrainerDashboard";
import { MemberDashboard } from "./MemberDashboard";
import { env } from "@/lib/env";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function UnifiedDashboardPage({ params }: Props) {
  const { subdomain } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  if (user.role === "super_admin") {
    // Super admin dashboard is on the root domain
    const rootUrl = env.NODE_ENV === "production" ? "https://gmmx.app/dashboard" : "http://localhost:3000/dashboard";
    redirect(rootUrl);
  }

  if (user.role === "trainer") {
    return <TrainerDashboard subdomain={subdomain} />;
  }

  if (user.role === "member") {
    return <MemberDashboard subdomain={subdomain} />;
  }

  // Default to owner dashboard
  return <OwnerDashboard />;
}
