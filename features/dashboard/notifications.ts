"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, ActivityLogDocument } from "@/lib/appwrite/types";
import { getCurrentGym } from "@/lib/auth/context";
import { Query } from "node-appwrite";

export async function getRecentNotifications() {
  try {
    const context = await getCurrentGym();
    if (!context || !context.gym) {
      return { success: false, error: "Not authenticated" };
    }

    const { databases } = await createAdminClient();

    const res = await databases.listDocuments<ActivityLogDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.ACTIVITY_LOGS,
      [
        Query.equal("gymId", context.gym.id),
        Query.orderDesc("timestamp"),
        Query.limit(10)
      ]
    );

    return { success: true, data: res.documents };
  } catch (error: any) {
    console.error("[GetRecentNotifications Error]", error);
    return { success: false, error: error.message || "Failed to fetch notifications" };
  }
}
