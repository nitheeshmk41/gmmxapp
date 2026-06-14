"use server";

import { createGymTenant } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";

export async function completeOnboardingWizard(formData: {
  gymName: string;
  subdomain: string;
  theme: string;
}) {
  const context = await getCurrentContext();
  if (!context) {
    return { error: "Not authenticated" };
  }

  try {
    // Core safe provisioning
    const gym = await createGymTenant({
      userId: context.user.id,
      gymName: formData.gymName,
      subdomain: formData.subdomain,
      theme: formData.theme,
    });

    return { success: true, subdomain: gym.subdomain };
  } catch (error: any) {
    console.error("[completeOnboardingWizard] Error:", error);
    return { error: error.message || "Failed to complete onboarding" };
  }
}

export async function checkSubdomain(subdomain: string) {
  const { checkSubdomainAvailability } = await import("@/lib/utils/subdomain");
  return checkSubdomainAvailability(subdomain);
}

export async function checkSubdomainFormat(subdomain: string) {
  const { validateSubdomainFormat } = await import("@/lib/utils/subdomain");
  return validateSubdomainFormat(subdomain);
}

