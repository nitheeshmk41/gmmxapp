"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const websiteSchema = z.object({
  template: z.enum(["modern", "minimal", "performance"]).default("modern"),
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

  return prisma.websiteSettings.findUnique({ where: { gym_id: gym.id } });
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

  await prisma.websiteSettings.upsert({
    where: { gym_id: gym.id },
    create: { ...parsed.data, tenant_id: gym.tenant_id, gym_id: gym.id },
    update: parsed.data,
  });

  revalidatePath("/dashboard/website");
  revalidatePath(`/gym/${gym.subdomain}`);
  return { success: true };
}

export async function toggleWebsitePublish(isPublished: boolean) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.websiteSettings.upsert({
    where: { gym_id: gym.id },
    create: { tenant_id: gym.tenant_id, gym_id: gym.id, is_published: isPublished },
    update: { is_published: isPublished },
  });

  revalidatePath("/dashboard/website");
  return { success: true };
}
