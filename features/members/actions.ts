"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
  age: z.coerce.number().int().min(5).max(100).optional(),
  height: z.coerce.number().min(50).max(300).optional(),
  weight: z.coerce.number().min(10).max(500).optional(),
  goal: z.string().optional(),
  join_date: z.string().min(1, "Join date is required"),
  plan_id: z.string().optional().or(z.literal("")),
  trainer_id: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "expired", "paused"]).default("active"),
  notes: z.string().optional(),
});

export async function getMembers({
  search,
  status,
  plan_id,
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  status?: string;
  plan_id?: string;
  page?: number;
  pageSize?: number;
}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0 };

  const where: Record<string, unknown> = { gym_id: gym.id };
  if (status && status !== "all") where.status = status;
  if (plan_id && plan_id !== "all") where.plan_id = plan_id;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.member.findMany({
      where,
      include: {
        plan: { select: { id: true, name: true, duration_days: true, price: true } },
        trainer: { select: { id: true, name: true } },
        payments: {
          where: { status: "paid" },
          orderBy: { paid_at: "desc" },
          take: 1,
          select: { membership_end: true, membership_start: true, amount: true },
        },
      },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.member.count({ where }),
  ]);

  return { data, total };
}

export async function getMemberById(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return null;

  return prisma.member.findFirst({
    where: { id, gym_id: gym.id },
    include: {
      plan: true,
      trainer: true,
      payments: {
        include: { plan: { select: { name: true } } },
        orderBy: { paid_at: "desc" },
      },
      attendance: {
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });
}

export async function createMember(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = memberSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { email, plan_id, trainer_id, ...rest } = parsed.data;

  await prisma.member.create({
    data: {
      ...rest,
      tenant_id: gym.tenant_id,
      gym_id: gym.id,
      email: email || undefined,
      plan_id: plan_id || undefined,
      trainer_id: trainer_id || undefined,
      join_date: new Date(rest.join_date),
    },
  });

  revalidatePath("/dashboard/members");
  return { success: true };
}

export async function updateMember(id: string, formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = memberSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { email, plan_id, trainer_id, ...rest } = parsed.data;

  await prisma.member.updateMany({
    where: { id, gym_id: gym.id },
    data: {
      ...rest,
      email: email || undefined,
      plan_id: plan_id || undefined,
      trainer_id: trainer_id || undefined,
      join_date: new Date(rest.join_date),
    },
  });

  revalidatePath("/dashboard/members");
  revalidatePath(`/dashboard/members/${id}`);
  return { success: true };
}

export async function deleteMember(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.member.deleteMany({ where: { id, gym_id: gym.id } });
  revalidatePath("/dashboard/members");
  return { success: true };
}

export async function getMembersForExport() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const members = await prisma.member.findMany({
    where: { gym_id: gym.id },
    include: {
      plan: { select: { name: true } },
      payments: {
        where: { status: "paid" },
        orderBy: { paid_at: "desc" },
        take: 1,
        select: { membership_end: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return members.map((m) => ({
    Name: m.name,
    Phone: m.phone,
    Email: m.email || "",
    Gender: m.gender || "",
    Age: m.age || "",
    Status: m.status,
    Plan: m.plan?.name || "",
    "Join Date": m.join_date ? new Date(m.join_date).toLocaleDateString() : "",
    "Membership End": m.payments[0]?.membership_end
      ? new Date(m.payments[0].membership_end).toLocaleDateString()
      : "",
  }));
}
