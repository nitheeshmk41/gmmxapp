"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PlanSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.coerce.number().min(0),
  maxMembers: z.coerce.number().min(1),
  maxTrainers: z.coerce.number().min(0),
  customDomain: z.coerce.boolean(),
  websiteBuilder: z.coerce.boolean(),
  mobileApp: z.coerce.boolean(),
});

export async function createSaasPlan(formData: FormData) {
  try {
    const parsed = PlanSchema.parse({
      name: formData.get("name"),
      price: formData.get("price"),
      maxMembers: formData.get("maxMembers"),
      maxTrainers: formData.get("maxTrainers"),
      customDomain: formData.get("customDomain") === "on",
      websiteBuilder: formData.get("websiteBuilder") === "on",
      mobileApp: formData.get("mobileApp") === "on",
    });

    const { databases } = await createAdminClient();
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, ID.unique(), parsed);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateSaasPlan(planId: string, formData: FormData) {
  try {
    const parsed = PlanSchema.parse({
      name: formData.get("name"),
      price: formData.get("price"),
      maxMembers: formData.get("maxMembers"),
      maxTrainers: formData.get("maxTrainers"),
      customDomain: formData.get("customDomain") === "on",
      websiteBuilder: formData.get("websiteBuilder") === "on",
      mobileApp: formData.get("mobileApp") === "on",
    });

    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, planId, parsed);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteSaasPlan(planId: string) {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.SAAS_PLANS, planId);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
