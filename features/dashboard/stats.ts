"use server";

export async function getDashboardStats() {
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
  return [];
}

export async function getNewMembersMonthly() {
  return [];
}

export async function getAttendanceTrend() {
  return [];
}

export async function getRecentActivity() {
  return { recentPayments: [] as any[], recentMembers: [] as any[], upcomingRenewals: [] as any[] };
}
