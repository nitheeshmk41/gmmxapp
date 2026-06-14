import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./client";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (user.onboarding_status === "completed") redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <OnboardingWizard userName={user.name} />
    </div>
  );
}
