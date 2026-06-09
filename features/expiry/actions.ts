"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export type ExpiryFilter = "today" | "week" | "month" | "expired";

export async function getExpiringMembers(filter: ExpiryFilter = "week") {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(today);
  endOfToday.setDate(endOfToday.getDate() + 1);

  let dateFilter: Record<string, Date> = {};
  switch (filter) {
    case "today":
      dateFilter = { gte: today, lt: endOfToday };
      break;
    case "week":
      const in7 = new Date(today);
      in7.setDate(in7.getDate() + 7);
      dateFilter = { gte: today, lte: in7 };
      break;
    case "month":
      const in30 = new Date(today);
      in30.setDate(in30.getDate() + 30);
      dateFilter = { gte: today, lte: in30 };
      break;
    case "expired":
      dateFilter = { lt: today };
      break;
  }

  // Get latest payment per member
  const payments = await prisma.payment.findMany({
    where: {
      gym_id: gym.id,
      status: "paid",
      membership_end: dateFilter,
    },
    include: {
      member: { select: { id: true, name: true, phone: true, status: true } },
      plan: { select: { name: true } },
    },
    orderBy: { membership_end: "asc" },
    distinct: ["member_id"],
  });

  return payments;
}

export async function renewMembership(memberId: string, planId: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const plan = await prisma.membershipPlan.findFirst({
    where: { id: planId, gym_id: gym.id },
  });
  if (!plan) return { error: "Plan not found" };

  const count = await prisma.payment.count({ where: { gym_id: gym.id } });
  const receiptNumber = `GMMX-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + plan.duration_days);

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        gym_id: gym.id,
        member_id: memberId,
        plan_id: planId,
        amount: plan.price,
        method: "cash",
        status: "paid",
        receipt_number: receiptNumber,
        membership_start: start,
        membership_end: end,
      },
    });

    await tx.member.updateMany({
      where: { id: memberId, gym_id: gym.id },
      data: { status: "active" },
    });
  });

  revalidatePath("/dashboard/expiry");
  revalidatePath("/dashboard/members");
  return { success: true };
}
