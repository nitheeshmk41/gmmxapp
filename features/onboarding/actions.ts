"use server";

import { createGymTenant } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

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

    const { users } = await createAdminClient();
    
    // 1. Update user password to the gymcode (subdomain)
    await users.updatePassword(context.user.id, formData.subdomain);
    
    // 2. Set user prefs requiring password change
    const prefs = await users.getPrefs(context.user.id);
    await users.updatePrefs(context.user.id, {
      ...prefs,
      requiresPasswordChange: true
    });

    // 3. Delete session cookie to log them out
    const cookieStore = await cookies();
    cookieStore.delete(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);

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

