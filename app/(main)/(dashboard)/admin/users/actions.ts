"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

export async function createSuperAdmin(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
      return { success: false, error: "Missing fields" };
    }

    const { users } = await createAdminClient();
    
    // Create the user
    const newUser = await users.create(ID.unique(), email, undefined, password, name);

    // Update user preferences to give them super_admin role
    await users.updatePrefs(newUser.$id, { role: "super_admin" });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("[CreateSuperAdmin Error]", error);
    return { success: false, error: error.message || "Failed to create super admin" };
  }
}
