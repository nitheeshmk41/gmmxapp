"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

export async function addMemberToGym(formData: FormData) {
  try {
    const gymId = formData.get("gymId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    if (!gymId || !name || !phone) {
      return { success: false, error: "Missing required fields" };
    }

    const { databases } = await createAdminClient();

    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, ID.unique(), {
      gymId,
      name,
      phone,
      email: email || undefined,
      status: "active",
      joinDate: new Date().toISOString(),
    });

    revalidatePath(`/admin/gyms/${gymId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[AddMember Error]", error);
    return { success: false, error: error.message || "Failed to add member" };
  }
}

export async function addTrainerToGym(formData: FormData) {
  try {
    const gymId = formData.get("gymId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const specialization = formData.get("specialization") as string;

    if (!gymId || !name || !phone) {
      return { success: false, error: "Missing required fields" };
    }

    const { databases } = await createAdminClient();

    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.TRAINERS, ID.unique(), {
      gymId,
      name,
      phone,
      specialization: specialization || undefined,
      isActive: true,
    });

    revalidatePath(`/admin/gyms/${gymId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[AddTrainer Error]", error);
    return { success: false, error: error.message || "Failed to add trainer" };
  }
}
