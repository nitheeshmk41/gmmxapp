"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const planSchema = z.object({
  name: z.string().min(2, "Plan name required"),
  duration_days: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export async function getPlans() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  return prisma.membershipPlan.findMany({
    where: { gym_id: gym.id },
    orderBy: { price: "asc" },
  });
}

export async function createPlan(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = {
    name: formData.get("name"),
    duration_days: formData.get("duration_days"),
    price: formData.get("price"),
    description: formData.get("description"),
    is_active: formData.get("is_active") !== "false",
  };

  const parsed = planSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.membershipPlan.create({
    data: { ...parsed.data, tenant_id: gym.tenant_id, gym_id: gym.id },
  });

  revalidatePath("/dashboard/plans");
  return { success: true };
}

export async function updatePlan(id: string, formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = {
    name: formData.get("name"),
    duration_days: formData.get("duration_days"),
    price: formData.get("price"),
    description: formData.get("description"),
    is_active: formData.get("is_active") !== "false",
  };

  const parsed = planSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.membershipPlan.updateMany({
    where: { id, gym_id: gym.id },
    data: parsed.data,
  });

  revalidatePath("/dashboard/plans");
  return { success: true };
}

export async function deletePlan(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.membershipPlan.deleteMany({ where: { id, gym_id: gym.id } });
  revalidatePath("/dashboard/plans");
  return { success: true };
}

export async function togglePlanStatus(id: string, isActive: boolean) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.membershipPlan.updateMany({
    where: { id, gym_id: gym.id },
    data: { is_active: isActive },
  });

  revalidatePath("/dashboard/plans");
  return { success: true };
}
