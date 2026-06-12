"use server";

import { createGymTenant } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { prisma } from "@/lib/prisma";

export async function completeOnboarding(formData: FormData) {
  const context = await getCurrentContext();

  if (!context || !context.user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  if (context.user.onboarding_status === "completed") {
    return { error: "Onboarding is already completed." };
  }

  const gymName = formData.get("gymName") as string;
  const subdomain = formData.get("subdomain") as string;
  const plan = formData.get("plan") as string;
  const phone = formData.get("phone") as string;
  
  // Basic validation
  if (!gymName || !subdomain || !plan || !phone) {
    return { error: "Missing required fields." };
  }

  // Check if subdomain is taken
  const existingGym = await prisma.gym.findUnique({
    where: { subdomain },
  });

  if (existingGym) {
    return { error: "This subdomain is already taken." };
  }

  try {
    await createGymTenant({
      userId: context.user.id,
      gymName,
      ownerName: context.user.name || "Owner",
      email: context.user.email,
      phone,
      subdomain,
      plan,
    });
    
    return { success: true, subdomain };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create gym." };
  }
}
