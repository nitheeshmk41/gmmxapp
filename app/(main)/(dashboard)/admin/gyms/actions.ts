"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

export async function createGymManually(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;
    const ownerEmail = formData.get("ownerEmail") as string;

    if (!name || !subdomain || !ownerEmail) {
      return { success: false, error: "Missing required fields" };
    }

    const { databases, users } = await createAdminClient();

    // Generate a temporary owner user if we don't look up by email, but Appwrite users need to be unique.
    // Let's create a placeholder user, or see if it exists.
    let ownerId = "";
    try {
      const userList = await users.list();
      const existing = userList.users.find(u => u.email === ownerEmail);
      if (existing) {
        ownerId = existing.$id;
      } else {
        const newUser = await users.create(ID.unique(), ownerEmail, undefined, ID.unique(), name);
        ownerId = newUser.$id;
      }
    } catch (e) {
      const newUser = await users.create(ID.unique(), ownerEmail, undefined, ID.unique(), name);
      ownerId = newUser.$id;
    }

    const gymId = ID.unique();
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId, {
      name,
      subdomain,
      ownerId,
      status: "active",
      isDeleted: false,
    });

    // Create default settings
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, ID.unique(), {
      gymId,
      websiteStatus: "draft",
      theme: "modern",
    });

    // Create subscription
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, ID.unique(), {
      gymId,
      planId: "professional",
      status: "trial",
      startsAt: new Date().toISOString(),
      endsAt: trialEnd.toISOString(),
      paymentProvider: "manual",
    });

    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    console.error("[CreateGymManually Error]", error);
    return { success: false, error: error.message || "Failed to create gym" };
  }
}

export async function removeGym(gymId: string) {
  try {
    if (!gymId) return { success: false, error: "Gym ID missing" };
    const { databases } = await createAdminClient();

    // Cascading delete for related collections
    const collectionsToClear = [
      COLLECTIONS.MEMBERS,
      COLLECTIONS.LEADS,
      COLLECTIONS.TRAINERS,
      COLLECTIONS.ATTENDANCE,
      COLLECTIONS.PAYMENTS,
      COLLECTIONS.SUBSCRIPTIONS,
      COLLECTIONS.GYM_SETTINGS,
      COLLECTIONS.GYM_PROFILE,
      COLLECTIONS.GYM_SOCIALS,
      COLLECTIONS.GYM_SERVICES,
      COLLECTIONS.GYM_GALLERY,
      COLLECTIONS.TESTIMONIALS,
      COLLECTIONS.WEBSITE_SECTIONS,
      COLLECTIONS.ACTIVITY_LOGS,
      COLLECTIONS.GYM_USERS,
      COLLECTIONS.MEMBERSHIP_PLANS
    ];

    for (const collection of collectionsToClear) {
      try {
        let hasMore = true;
        while (hasMore) {
          const res = await databases.listDocuments(APPWRITE_DB_ID, collection, [
            Query.equal("gymId", gymId),
            Query.limit(100)
          ]);
          if (res.documents.length === 0) {
            hasMore = false;
            break;
          }
          for (const doc of res.documents) {
            await databases.deleteDocument(APPWRITE_DB_ID, collection, doc.$id);
          }
        }
      } catch (err) {
        console.error(`Failed to clear collection ${collection} for gym ${gymId}`, err);
      }
    }

    // Finally, physically delete the gym
    await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId);

    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    console.error("[RemoveGym Error]", error);
    return { success: false, error: error.message || "Failed to remove gym" };
  }
}
