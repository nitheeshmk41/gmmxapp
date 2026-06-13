"use server";

export async function getMembers(params: any = {}) {
  return { data: [], total: 0, page: 1, limit: 10 };
}

export async function getMemberById(id: string) {
  return {} as any;
}

import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { ID } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";

export async function createMember(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const context = await getCurrentContext();
  if (!context || !context.gym || context.role !== "OWNER") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string; // Must be E.164 format

  if (!name || !phone) return { error: "Name and phone are required" };

  try {
    const { users, databases } = await createAdminClient();
    
    // Create Appwrite Auth User (passwordless approach: we set a strong random password since they won't use it)
    const password = ID.unique() + ID.unique();
    const appwriteUser = await users.create(
      ID.unique(),
      email || undefined,
      phone,
      password,
      name
    );

    // Link user to the current gym as MEMBER
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      ID.unique(),
      {
        gymId: context.gym.$id,
        userId: appwriteUser.$id,
        role: "MEMBER"
      }
    );

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create member" };
  }
}

export async function updateMember(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function deleteMember(id: string): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function getMembersForExport() {
  return [];
}
