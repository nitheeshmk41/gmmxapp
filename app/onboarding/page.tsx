import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./client";
import { routeForUser } from "@/lib/auth/bootstrap";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin?redirectTo=/onboarding");
  if (user.onboarding_status === "completed") redirect(routeForUser(user));

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <OnboardingWizard userName={user.name} />
    </div>
  );
}
