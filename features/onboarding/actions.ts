"use server";

import { createGymTenant } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export async function completeOnboarding(formData: FormData) {
  const context = await getCurrentContext();

  if (!context || !context.user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  // We need to fetch user's prefs to check if onboarding is already completed
  const { users, databases } = await createAdminClient();
  const prefs = await users.getPrefs(context.user.id);
  
  if (prefs.onboarding_status === "completed") {
    return { error: "Onboarding is already completed." };
  }

  const gymName = formData.get("gymName") as string;
  const subdomain = formData.get("subdomain") as string;
  const plan = formData.get("plan") as string;
  const phone = formData.get("phone") as string;
  
  const template = formData.get("template") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const secondaryColor = formData.get("secondaryColor") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;
  
  // Basic validation
  if (!gymName || !subdomain || !plan || !phone) {
    return { error: "Missing required fields." };
  }

  // Check if subdomain is taken
  const existingGym = await databases.listDocuments(
    APPWRITE_DB_ID,
    COLLECTIONS.GYMS,
    [Query.equal("subdomain", subdomain)]
  );

  if (existingGym.documents.length > 0) {
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
      template,
      primaryColor,
      secondaryColor,
      logoUrl,
      coverImageUrl,
    });
    
    return { success: true, subdomain };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create gym." };
  }
}
