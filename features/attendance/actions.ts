"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

export async function getAttendance({
  date,
  memberId,
  page = 1,
  pageSize = 50,
}: {
  date?: string;
  memberId?: string;
  page?: number;
  pageSize?: number;
}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0 };

  const targetDate = date ? new Date(date) : new Date();
  const where: Record<string, unknown> = {
    gym_id: gym.id,
    date: { equals: targetDate },
  };
  if (memberId) where.member_id = memberId;

  const [data, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: {
        member: { select: { id: true, name: true, phone: true, photo_url: true } },
      },
      orderBy: { marked_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.attendance.count({ where }),
  ]);

  return { data, total };
}

export async function markAttendance(memberId: string, date?: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const targetDate = date ? new Date(date) : new Date();
  const dateOnly = new Date(format(targetDate, "yyyy-MM-dd"));

  // Prevent duplicate attendance
  const existing = await prisma.attendance.findFirst({
    where: { gym_id: gym.id, member_id: memberId, date: { equals: dateOnly } },
  });

  if (existing) return { error: "Attendance already marked for today" };

  await prisma.attendance.create({
    data: {
      gym_id: gym.id,
      tenant_id: gym.tenant_id,
      member_id: memberId,
      date: dateOnly,
      type: "manual",
    },
  });

  revalidatePath("/dashboard/attendance");
  return { success: true };
}

export async function bulkMarkAttendance(memberIds: string[], date?: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const targetDate = date ? new Date(date) : new Date();
  const dateOnly = new Date(format(targetDate, "yyyy-MM-dd"));

  // Get already marked
  const existing = await prisma.attendance.findMany({
    where: { gym_id: gym.id, member_id: { in: memberIds }, date: { equals: dateOnly } },
    select: { member_id: true },
  });
  const alreadyMarked = new Set(existing.map((a) => a.member_id));

  const toMark = memberIds.filter((id) => !alreadyMarked.has(id));
  if (toMark.length === 0) return { success: true, marked: 0 };

  await prisma.attendance.createMany({
    data: toMark.map((member_id) => ({
      gym_id: gym.id,
      tenant_id: gym.tenant_id,
      member_id,
      date: dateOnly,
      type: "manual",
    })),
  });

  revalidatePath("/dashboard/attendance");
  return { success: true, marked: toMark.length };
}

export async function removeAttendance(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.attendance.deleteMany({ where: { id, gym_id: gym.id } });
  revalidatePath("/dashboard/attendance");
  return { success: true };
}

export async function getMembersForAttendance() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  return prisma.member.findMany({
    where: { gym_id: gym.id, status: "active" },
    select: { id: true, name: true, phone: true, photo_url: true },
    orderBy: { name: "asc" },
  });
}
