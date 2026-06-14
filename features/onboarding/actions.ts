"use server";

import { createGymTenant } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query, ID } from "node-appwrite";
import { cookies } from "next/headers";

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
  const tagline = formData.get("tagline") as string;
  const phone = formData.get("phone") as string;
  const themeStyle = formData.get("themeStyle") as string || "modern";
  const primaryColor = formData.get("primaryColor") as string || "#FF5C73";

  // Basic validation
  if (!gymName || !subdomain || !phone) {
    return { error: "Missing required fields." };
  }

  const reserved = [
    "server",
    "api",
    "www",
    "mail",
    "status",
  ];

  if (reserved.includes(subdomain.toLowerCase())) {
    return { error: "This subdomain is reserved and cannot be used." };
  }

  // Check if subdomain is taken
  const existingGym = await databases.listDocuments(
    APPWRITE_DB_ID,
    COLLECTIONS.GYMS,
    [Query.equal("subdomain", subdomain)]
  );

  if (existingGym.documents.length > 0) {
    const gym = existingGym.documents[0];
    try {
      await users.get(gym.ownerId);
      return { error: "This subdomain is already taken." };
    } catch (e: any) {
      if (e.code === 404) {
        // Owner user no longer exists, so the gym is effectively abandoned. Reclaim domain!
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gym.$id);
        console.log(`Reclaimed abandoned subdomain: ${subdomain}`);
      } else {
        return { error: "This subdomain is already taken." };
      }
    }
  }

  try {
    const gym = await createGymTenant({
      userId: context.user.id,
      gymName,
      ownerName: context.user.name || "Owner",
      email: context.user.email,
      phone,
      subdomain,
      plan: "professional", // Default plan
      template: themeStyle,
      primaryColor,
      secondaryColor: "#1A1A1A",
      tagline,
      // Pass empty arrays/strings for other fields to prevent errors
      description: "",
      bannerUrl: "",
      city: "",
      address: "",
      whatsapp: phone, // fallback whatsapp to phone
      workingHours: "Monday-Saturday 5 AM - 10 PM",
      mapsLink: "",
      instagramUrl: "",
      facebookUrl: "",
      youtubeUrl: "",
      services: [],
      gallery: [],
    });
    
    // We do NOT create plans, trainers, gallery here anymore.
    // The gym owner will do this from their dashboard.

    const cookieStore = await cookies();
    cookieStore.set("gmmx_sample_data", "true", { path: "/", maxAge: 60 * 60 * 24 * 30 });
    
    return { success: true, subdomain };
  } catch (error) {
    console.error("Onboarding Error:", error);
    return { error: error instanceof Error ? error.message : "Failed to create gym." };
  }
}
