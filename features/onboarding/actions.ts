"use server";

import { createGymTenant } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function completeOnboardingWizard(formData: {
  gymName: string;
  businessType?: string;
  subdomain: string;
  theme: string;
  country?: string;
  timezone?: string;
  currency?: string;
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
      businessType: formData.businessType || "Gym",
      subdomain: formData.subdomain,
      theme: formData.theme,
      country: formData.country,
      timezone: formData.timezone,
      currency: formData.currency,
    });

    const { users } = await createAdminClient();
    
    // 1. Update user password to the default initial password
    const defaultPassword = "1234abcd";
    await users.updatePassword(context.user.id, defaultPassword);
    
    // 2. Set user prefs requiring password change
    const prefs = await users.getPrefs(context.user.id);
    await users.updatePrefs(context.user.id, {
      ...prefs,
      requiresPasswordChange: true
    });

    // Removed: session cookie deletion so the user stays logged in seamlessly.
    // They will be redirected directly to their dashboard.

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

