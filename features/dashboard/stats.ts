"use server";

import { cookies } from "next/headers";

export async function clearSampleData() {
  const cookieStore = await cookies();
  cookieStore.delete("gmmx_sample_data");
}

export async function isSampleDataEnabled() {
  const cookieStore = await cookies();
  return cookieStore.has("gmmx_sample_data");
}

export async function getDashboardStats() {
  if (await isSampleDataEnabled()) {
    return {
      totalMembers: 12,
      activeMembers: 10,
      newLeads: 5,
      activePlans: 3,
      revenueToday: 24000,
      attendanceToday: 8,
      expiringThisMonth: 2,
      newLeadsThisWeek: 5,
    };
  }
  
  return {
    totalMembers: 0,
    activeMembers: 0,
    newLeads: 0,
    activePlans: 0,
    revenueToday: 0,
    attendanceToday: 0,
    expiringThisMonth: 0,
    newLeadsThisWeek: 0,
  };
}

export async function getMonthlyRevenue() {
  if (await isSampleDataEnabled()) {
    return [
      { month: "Jan", revenue: Math.floor(Math.random() * 50000) + 20000 },
      { month: "Feb", revenue: Math.floor(Math.random() * 50000) + 20000 },
      { month: "Mar", revenue: Math.floor(Math.random() * 50000) + 20000 },
      { month: "Apr", revenue: Math.floor(Math.random() * 50000) + 20000 },
      { month: "May", revenue: Math.floor(Math.random() * 50000) + 20000 },
      { month: "Jun", revenue: Math.floor(Math.random() * 50000) + 20000 },
    ];
  }
  return [];
}

export async function getNewMembersMonthly() {
  if (await isSampleDataEnabled()) {
    return [
      { month: "Jan", count: Math.floor(Math.random() * 10) + 5 },
      { month: "Feb", count: Math.floor(Math.random() * 10) + 5 },
      { month: "Mar", count: Math.floor(Math.random() * 10) + 5 },
      { month: "Apr", count: Math.floor(Math.random() * 10) + 5 },
      { month: "May", count: Math.floor(Math.random() * 10) + 5 },
      { month: "Jun", count: Math.floor(Math.random() * 10) + 5 },
    ];
  }
  return [];
}

export async function getAttendanceTrend() {
  if (await isSampleDataEnabled()) {
    return [
      { date: "Mon", count: Math.floor(Math.random() * 20) + 10 },
      { date: "Tue", count: Math.floor(Math.random() * 20) + 10 },
      { date: "Wed", count: Math.floor(Math.random() * 20) + 10 },
      { date: "Thu", count: Math.floor(Math.random() * 20) + 10 },
      { date: "Fri", count: Math.floor(Math.random() * 20) + 10 },
      { date: "Sat", count: Math.floor(Math.random() * 20) + 10 },
      { date: "Sun", count: Math.floor(Math.random() * 20) + 10 },
    ];
  }
  return [];
}

export async function getRecentActivity() {
  if (await isSampleDataEnabled()) {
    return {
      recentPayments: [
        { id: "1", amount: 15000, paid_at: new Date().toISOString(), member: { name: "Rahul Sharma" } },
        { id: "2", amount: 9000, paid_at: new Date(Date.now() - 86400000).toISOString(), member: { name: "Priya Patel" } }
      ],
      recentMembers: [
        { id: "3", name: "Amit Kumar", join_date: new Date().toISOString() },
        { id: "4", name: "Neha Singh", join_date: new Date(Date.now() - 172800000).toISOString() }
      ],
      upcomingRenewals: [
        { id: "5", membership_end: new Date(Date.now() + 86400000 * 2).toISOString(), member: { name: "Vikram Reddy", phone: "9876543210" } }
      ]
    };
  }
  return { recentPayments: [] as any[], recentMembers: [] as any[], upcomingRenewals: [] as any[] };
}
