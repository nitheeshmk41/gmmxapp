"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const trainerSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email().optional().or(z.literal("")),
  specialization: z.string().optional(),
  experience_years: z.coerce.number().int().min(0).max(50).optional(),
  bio: z.string().optional(),
  is_active: z.boolean().default(true),
});

export async function getTrainers() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  return prisma.trainer.findMany({
    where: { gym_id: gym.id },
    include: { members: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getTrainerById(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return null;

  return prisma.trainer.findFirst({
    where: { id, gym_id: gym.id },
    include: {
      members: {
        include: {
          payments: {
            where: { status: "paid" },
            orderBy: { paid_at: "desc" },
            take: 1,
            select: { membership_end: true },
          },
        },
      },
    },
  });
}

export async function createTrainer(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = trainerSchema.safeParse({ ...raw, is_active: true });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { email, ...rest } = parsed.data;

  await prisma.trainer.create({
    data: { ...rest, gym_id: gym.id, email: email || undefined },
  });

  revalidatePath("/dashboard/trainers");
  return { success: true };
}

export async function updateTrainer(id: string, formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = trainerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { email, ...rest } = parsed.data;

  await prisma.trainer.updateMany({
    where: { id, gym_id: gym.id },
    data: { ...rest, email: email || undefined },
  });

  revalidatePath("/dashboard/trainers");
  return { success: true };
}

export async function deleteTrainer(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.trainer.deleteMany({ where: { id, gym_id: gym.id } });
  revalidatePath("/dashboard/trainers");
  return { success: true };
}
