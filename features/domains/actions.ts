"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const domainSchema = z.object({
  custom_domain: z.string().min(4).regex(/^[a-z0-9][a-z0-9-]*\.[a-z]{2,}$/, "Enter a valid domain (e.g. ironfit.com)"),
});

export async function getDomains() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  return prisma.domain.findMany({ where: { gym_id: gym.id }, orderBy: { created_at: "desc" } });
}

export async function addDomain(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  // Plan check
  if (gym.plan === "starter") {
    return { error: "Custom domains require the Professional plan or above." };
  }

  const raw = { custom_domain: formData.get("custom_domain") as string };
  const parsed = domainSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Check not already taken
  const existing = await prisma.domain.findFirst({ where: { custom_domain: parsed.data.custom_domain } });
  if (existing) return { error: "This domain is already registered" };

  await prisma.domain.create({
    data: {
      gym_id: gym.id,
      tenant_id: gym.tenant_id,
      custom_domain: parsed.data.custom_domain,
      verification_status: "pending",
      dns_type: "A",
    },
  });

  revalidatePath("/dashboard/domain");
  return { success: true };
}

export async function removeDomain(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.domain.deleteMany({ where: { id, gym_id: gym.id } });
  revalidatePath("/dashboard/domain");
  return { success: true };
}
