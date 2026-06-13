"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query, ID } from "node-appwrite";

const websiteSchema = z.object({
  template: z.enum(["modern", "minimal", "performance", "crossfit"]).default("modern"),
  description: z.string().optional(),
  tagline: z.string().optional(),
  whatsapp_number: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  social_instagram: z.string().optional(),
  social_facebook: z.string().optional(),
  social_youtube: z.string().optional(),
  is_published: z.boolean().default(false),
});

export async function getWebsiteSettings() {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { databases } = await createAdminClient();
  const res = await databases.listDocuments(
    APPWRITE_DB_ID,
    COLLECTIONS.SETTINGS,
    [Query.equal("gym_id", gym.$id)]
  );
  return res.documents.length > 0 ? res.documents[0] : null;
}

export async function updateWebsiteSettings(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = {
    template: formData.get("template"),
    description: formData.get("description"),
    tagline: formData.get("tagline"),
    whatsapp_number: formData.get("whatsapp_number"),
    contact_email: formData.get("contact_email"),
    address: formData.get("address"),
    social_instagram: formData.get("social_instagram"),
    social_facebook: formData.get("social_facebook"),
    social_youtube: formData.get("social_youtube"),
    is_published: formData.get("is_published") === "true",
  };

  const parsed = websiteSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { databases } = await createAdminClient();
  const existing = await databases.listDocuments(
    APPWRITE_DB_ID,
    COLLECTIONS.SETTINGS,
    [Query.equal("gym_id", gym.$id)]
  );

  if (existing.documents.length > 0) {
    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      existing.documents[0].$id,
      parsed.data
    );
  } else {
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      ID.unique(),
      { ...parsed.data, gymId: gym.$id }
    );
  }

  revalidatePath("/dashboard/website");
  revalidatePath(`/gym/${gym.subdomain}`);
  return { success: true };
}

export async function toggleWebsitePublish(isPublished: boolean) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const { databases } = await createAdminClient();
  const existing = await databases.listDocuments(
    APPWRITE_DB_ID,
    COLLECTIONS.SETTINGS,
    [Query.equal("gym_id", gym.$id)]
  );

  if (existing.documents.length > 0) {
    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      existing.documents[0].$id,
      { is_published: isPublished }
    );
  } else {
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      ID.unique(),
      { gymId: gym.$id, is_published: isPublished }
    );
  }

  revalidatePath("/dashboard/website");
  return { success: true };
}
