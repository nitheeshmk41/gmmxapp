"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query, ID } from "node-appwrite";

export async function getWebsiteSettings() {
  const gym = await getCurrentGym();
  return gym;
}

export async function updateWebsiteContent(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const data = {
    name: formData.get("name") as string,
    tagline: formData.get("tagline") as string,
    description: formData.get("description") as string,
  };

  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gym.$id, data);
    revalidatePath("/dashboard/website");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateWebsiteHero(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const data = {
    name: formData.get("name") as string,
    tagline: formData.get("tagline") as string,
    bannerUrl: formData.get("bannerUrl") as string,
  };

  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gym.$id, data);
    revalidatePath("/dashboard/website");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateWebsiteContact(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const data = {
    phone: formData.get("phone") as string,
    whatsapp: formData.get("whatsapp") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    mapsLink: formData.get("mapsLink") as string,
    workingHours: formData.get("workingHours") as string,
  };

  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gym.$id, data);
    revalidatePath("/dashboard/website");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateWebsiteGallery(urls: string[]) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gym.$id, { gallery: urls });
    revalidatePath("/dashboard/website");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function toggleWebsitePublish(isPublished: boolean) {
  return { success: true };
}

export async function updateWebsiteTheme(template: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gym.$id, { template });
    revalidatePath("/dashboard/website");
    revalidatePath("/dashboard/website/theme");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Testimonial Actions
export async function getTestimonials() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.TESTIMONIALS,
      [Query.equal("gymId", gym.$id)]
    );
    return res.documents;
  } catch (error) {
    return [];
  }
}

export async function createTestimonial(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const data = {
    gymId: gym.$id,
    name: formData.get("name") as string,
    review: formData.get("review") as string,
    rating: parseInt(formData.get("rating") as string) || 5,
  };

  try {
    const { databases } = await createAdminClient();
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.TESTIMONIALS, ID.unique(), data);
    revalidatePath("/dashboard/website/testimonials");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTestimonial(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.TESTIMONIALS, id);
    revalidatePath("/dashboard/website/testimonials");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function saveDraftDetails({
  phone,
  address,
  heroTitle,
  heroSubtitle,
  logoFileId,
}: {
  phone: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  logoFileId?: string;
}) {
  const gymContext = await getCurrentGym();
  if (!gymContext || !gymContext.gymId) return { error: "Unauthorized" };
  const gymId = gymContext.gymId;

  try {
    const { databases } = await createAdminClient();

    // 1. Update Profile (phone, address)
    const profileRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_PROFILE,
      [Query.equal("gymId", gymId)]
    );
    if (profileRes.documents.length > 0) {
      await databases.updateDocument(
        APPWRITE_DB_ID,
        COLLECTIONS.GYM_PROFILE,
        profileRes.documents[0].$id,
        { phone, address }
      );
    }

    // 2. Update Settings (logoFileId)
    if (logoFileId) {
      const settingsRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.GYM_SETTINGS,
        [Query.equal("gymId", gymId)]
      );
      if (settingsRes.documents.length > 0) {
        await databases.updateDocument(
          APPWRITE_DB_ID,
          COLLECTIONS.GYM_SETTINGS,
          settingsRes.documents[0].$id,
          { logoFileId }
        );
      }
    }

    // 3. Update Hero Section
    const sectionsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.WEBSITE_SECTIONS,
      [Query.equal("gymId", gymId), Query.equal("sectionKey", "hero")]
    );
    if (sectionsRes.documents.length > 0) {
      const heroSection = sectionsRes.documents[0];
      const contentJson = JSON.parse(heroSection.contentJson);
      contentJson.title = heroTitle || contentJson.title;
      contentJson.subtitle = heroSubtitle || contentJson.subtitle;

      await databases.updateDocument(
        APPWRITE_DB_ID,
        COLLECTIONS.WEBSITE_SECTIONS,
        heroSection.$id,
        {
          contentJson: JSON.stringify(contentJson)
        }
      );
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveDraftDetails] Error:", error);
    return { error: error.message || "Failed to save draft details." };
  }
}

export async function publishWebsite() {
  const gymContext = await getCurrentGym();
  if (!gymContext || !gymContext.gymId) return { error: "Unauthorized" };
  const gymId = gymContext.gymId;

  try {
    const { databases } = await createAdminClient();

    const settingsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_SETTINGS,
      [Query.equal("gymId", gymId)]
    );
    if (settingsRes.documents.length > 0) {
      await databases.updateDocument(
        APPWRITE_DB_ID,
        COLLECTIONS.GYM_SETTINGS,
        settingsRes.documents[0].$id,
        {
          websiteStatus: "published",
          publishedAt: new Date().toISOString()
        }
      );
    }

    revalidatePath("/dashboard");
    revalidatePath(`/`);
    return { success: true };
  } catch (error: any) {
    console.error("[publishWebsite] Error:", error);
    return { error: error.message || "Failed to publish website." };
  }
}
