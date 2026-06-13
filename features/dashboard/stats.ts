"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  format,
} from "date-fns";

export async function getDashboardStats() {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const gymId = gym.id;
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const today = format(now, "yyyy-MM-dd");
  const in7Days = new Date(now);
  in7Days.setDate(in7Days.getDate() + 7);
  const in30Days = new Date(now);
  in30Days.setDate(in30Days.getDate() + 30);

  const [
    totalMembers,
    activeMembers,
    revenueResult,
    attendanceToday,
    totalLeads,
    newLeads,
    expiringWeek,
    expiringMonth,
    revenueTodayResult,
    pendingPayments,
  ] = await Promise.all([
    prisma.member.count({ where: { gym_id: gymId } }),
    prisma.member.count({ where: { gym_id: gymId, status: "active" } }),
    prisma.payment.aggregate({
      where: {
        gym_id: gymId,
        status: "paid",
        paid_at: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),
    prisma.attendance.count({
      where: { gym_id: gymId, date: { equals: new Date(today) } },
    }),
    prisma.lead.count({ where: { gym_id: gymId } }),
    prisma.lead.count({
      where: {
        gym_id: gymId,
        created_at: { gte: weekStart, lte: weekEnd },
      },
    }),
    // Expiring within 7 days (from payments table membership_end)
    prisma.payment.count({
      where: {
        gym_id: gymId,
        status: "paid",
        membership_end: {
          gte: now,
          lte: in7Days,
        },
      },
    }),
    // Expiring within 30 days
    prisma.payment.count({
      where: {
        gym_id: gymId,
        status: "paid",
        membership_end: {
          gte: now,
          lte: in30Days,
        },
      },
    }),
    // Revenue Today
    prisma.payment.aggregate({
      where: {
        gym_id: gymId,
        status: "paid",
        paid_at: { gte: new Date(today) },
      },
      _sum: { amount: true },
    }),
    // Pending Payments
    prisma.payment.count({
      where: { gym_id: gymId, status: "pending" },
    }),
  ]);

  return {
    totalMembers,
    activeMembers,
    expiringThisWeek: expiringWeek,
    expiringThisMonth: expiringMonth,
    revenueThisMonth: Number(revenueResult._sum.amount || 0),
    attendanceToday,
    totalLeads,
    newLeadsThisWeek: newLeads,
    revenueToday: Number(revenueTodayResult._sum.amount || 0),
    pendingPayments,
  };
}

export async function getMonthlyRevenue() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, "MMM"),
    };
  });

  const results = await Promise.all(
    months.map(async ({ start, end, label }) => {
      const result = await prisma.payment.aggregate({
        where: {
          gym_id: gym.id,
          status: "paid",
          paid_at: { gte: start, lte: end },
        },
        _sum: { amount: true },
      });
      return { month: label, revenue: Number(result._sum.amount || 0) };
    })
  );

  return results;
}

export async function getNewMembersMonthly() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, "MMM"),
    };
  });

  const results = await Promise.all(
    months.map(async ({ start, end, label }) => {
      const count = await prisma.member.count({
        where: {
          gym_id: gym.id,
          join_date: { gte: start, lte: end },
        },
      });
      return { month: label, count };
    })
  );

  return results;
}

export async function getAttendanceTrend() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return { date: format(date, "yyyy-MM-dd"), label: format(date, "EEE") };
  });

  const results = await Promise.all(
    days.map(async ({ date, label }) => {
      const count = await prisma.attendance.count({
        where: { gym_id: gym.id, date: { equals: new Date(date) } },
      });
      return { date: label, count };
    })
  );

  return results;
}

export async function getRecentActivity() {
  const gym = await getCurrentGym();
  if (!gym) return { recentMembers: [], recentPayments: [], upcomingRenewals: [] };

  const gymId = gym.id;
  const now = new Date();
  const in30Days = new Date(now);
  in30Days.setDate(in30Days.getDate() + 30);

  const [recentMembers, recentPayments, upcomingRenewals] = await Promise.all([
    prisma.member.findMany({
      where: { gym_id: gymId },
      orderBy: { join_date: "desc" },
      take: 5,
      select: { id: true, name: true, join_date: true },
    }),
    prisma.payment.findMany({
      where: { gym_id: gymId, status: "paid" },
      orderBy: { paid_at: "desc" },
      take: 5,
      select: { id: true, amount: true, paid_at: true, member: { select: { name: true } } },
    }),
    prisma.payment.findMany({
      where: {
        gym_id: gymId,
        status: "paid",
        membership_end: { gte: now, lte: in30Days },
      },
      orderBy: { membership_end: "asc" },
      take: 5,
      select: { id: true, membership_end: true, member: { select: { name: true, phone: true } } },
    }),
  ]);

  return { recentMembers, recentPayments, upcomingRenewals };
}
