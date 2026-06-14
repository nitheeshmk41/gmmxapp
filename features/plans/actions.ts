"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { APPWRITE_DB_ID, COLLECTIONS, MembershipPlanDocument } from "@/lib/appwrite/types";
import { Query, ID } from "node-appwrite";

const planSchema = z.object({
  name: z.string().min(2, "Name is required"),
  duration_days: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().optional(),
});

export async function getPlans() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const { databases } = await createAdminClient();
  try {
    const response = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      [Query.equal("gymId", gym.$id), Query.orderAsc("amount")]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      name: doc.name,
      duration_days: doc.durationDays,
      price: doc.amount,
      description: doc.description || null,
      is_active: doc.isActive,
    }));
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return [];
  }
}

export async function createPlan(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = planSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { databases } = await createAdminClient();

  try {
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      ID.unique(),
      {
        gymId: gym.$id,
        name: parsed.data.name,
        durationDays: parsed.data.duration_days,
        amount: parsed.data.price,
        description: parsed.data.description,
        isActive: true,
      }
    );

    revalidatePath("/dashboard/plans");
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to create plan" };
  }
}

export async function updatePlan(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = planSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { databases } = await createAdminClient();

  try {
    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      id,
      {
        name: parsed.data.name,
        durationDays: parsed.data.duration_days,
        amount: parsed.data.price,
        description: parsed.data.description,
      }
    );

    revalidatePath("/dashboard/plans");
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to update plan" };
  }
}

export async function deletePlan(id: string): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const { databases } = await createAdminClient();
  try {
    await databases.deleteDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      id
    );

    revalidatePath("/dashboard/plans");
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to delete plan" };
  }
}

export async function togglePlanStatus(id: string, isActive: boolean): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const { databases } = await createAdminClient();
  try {
    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      id,
      { isActive }
    );

    revalidatePath("/dashboard/plans");
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to toggle plan status" };
  }
}

