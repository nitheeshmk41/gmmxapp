"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateReceiptNumber } from "@/lib/utils";

const paymentSchema = z.object({
  member_id: z.string().min(1, "Member is required"),
  plan_id: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  method: z.enum(["cash", "upi", "card", "bank_transfer", "razorpay"]),
  status: z.enum(["paid", "pending", "failed"]).default("paid"),
  paid_at: z.string().optional(),
  membership_start: z.string().optional(),
  membership_end: z.string().optional(),
  notes: z.string().optional(),
});

export async function getPayments({
  search,
  method,
  status,
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  method?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0 };

  const where: Record<string, unknown> = { gym_id: gym.id };
  if (method && method !== "all") where.method = method;
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { member: { name: { contains: search, mode: "insensitive" } } },
      { receipt_number: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        member: { select: { id: true, name: true, phone: true } },
        plan: { select: { name: true } },
      },
      orderBy: { paid_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.payment.count({ where }),
  ]);

  return { data, total };
}

export async function createPayment(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = paymentSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { plan_id, paid_at, membership_start, membership_end, ...rest } = parsed.data;

  // Auto-generate receipt number
  const count = await prisma.payment.count({ where: { gym_id: gym.id } });
  const receiptNumber = generateReceiptNumber(count + 1);

  // If plan selected, compute membership_end from plan duration
  let computedEnd = membership_end ? new Date(membership_end) : undefined;
  const computedStart = membership_start ? new Date(membership_start) : new Date();

  if (plan_id && !membership_end) {
    const plan = await prisma.membershipPlan.findFirst({
      where: { id: plan_id, gym_id: gym.id },
    });
    if (plan) {
      computedEnd = new Date(computedStart);
      computedEnd.setDate(computedEnd.getDate() + plan.duration_days);
    }
  }

  const payment = await prisma.payment.create({
    data: {
      ...rest,
      gym_id: gym.id,
      plan_id: plan_id || undefined,
      receipt_number: receiptNumber,
      paid_at: paid_at ? new Date(paid_at) : new Date(),
      membership_start: computedStart,
      membership_end: computedEnd,
    },
  });

  // Update member status to active
  await prisma.member.updateMany({
    where: { id: rest.member_id, gym_id: gym.id },
    data: { status: "active" },
  });

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/expiry");
  return { success: true, payment };
}

export async function getPaymentById(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return null;

  return prisma.payment.findFirst({
    where: { id, gym_id: gym.id },
    include: {
      member: true,
      plan: true,
    },
  });
}
