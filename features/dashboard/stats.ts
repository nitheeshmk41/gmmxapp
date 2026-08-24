"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentGym } from "@/features/auth/actions";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

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
      expiredMembers: 2,
      expiringThisWeek: 3,
      newLeads: 5,
      activePlans: 3,
      revenueToday: 24000,
      monthlyRevenue: 150000,
      attendanceToday: 8,
      newLeadsThisWeek: 5,
      totalTrainers: 3,
      pendingPayments: 4,
    };
  }
  
  const gym = await getCurrentGym();
  if (!gym) {
    return {
      totalMembers: 0,
      activeMembers: 0,
      expiredMembers: 0,
      expiringThisWeek: 0,
      newLeads: 0,
      activePlans: 0,
      revenueToday: 0,
      monthlyRevenue: 0,
      attendanceToday: 0,
      newLeadsThisWeek: 0,
      totalTrainers: 0,
      pendingPayments: 0,
    };
  }

  try {
    const { databases } = await createAdminClient();

    // 1. Total Members
    const totalMembersRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      [Query.equal("gymId", gym.$id), Query.limit(1)]
    );
    const totalMembers = totalMembersRes.total;

    // 2. Active Members
    const activeMembersRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      [Query.equal("gymId", gym.$id), Query.equal("status", "active"), Query.limit(1)]
    );
    const activeMembers = activeMembersRes.total;

    // 3. Expired Members
    const expiredMembersRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      [Query.equal("gymId", gym.$id), Query.equal("status", "expired"), Query.limit(1)]
    );
    const expiredMembers = expiredMembersRes.total;

    // 4. Expiring This Week
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999).toISOString();
    const expiringThisWeekRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      [
        Query.equal("gymId", gym.$id),
        Query.between("membershipEndDate", startOfToday, endOfWeek),
        Query.limit(1)
      ]
    );
    const expiringThisWeek = expiringThisWeekRes.total;

    // 5. Leads Count
    const leadsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.LEADS,
      [Query.equal("gymId", gym.$id), Query.limit(1)]
    );
    const newLeads = leadsRes.total;

    // 6. Plans Count
    const plansRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      [Query.equal("gymId", gym.$id), Query.equal("isActive", true), Query.limit(1)]
    );
    const activePlans = plansRes.total;

    // 7. Today's Attendance
    const todayStr = startOfToday.split("T")[0];
    const attendanceRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.ATTENDANCE,
      [Query.equal("gymId", gym.$id), Query.equal("attendanceDate", todayStr)]
    );
    // Since attendance record is per member per date, total represents today's attendance count
    const attendanceToday = attendanceRes.total;

    // 8. Monthly Revenue
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const paymentsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [
        Query.equal("gymId", gym.$id), 
        Query.equal("status", "success"),
        Query.greaterThanEqual("paidAt", startOfMonth)
      ]
    );
    const monthlyRevenue = paymentsRes.documents.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // 9. Pending Payments
    const pendingRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [
        Query.equal("gymId", gym.$id), 
        Query.equal("status", "pending")
      ]
    );
    const pendingPayments = pendingRes.total;

    // 10. Trainers Count
    const trainersRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.TRAINERS,
      [Query.equal("gymId", gym.$id), Query.limit(1)]
    );
    const totalTrainers = trainersRes.total;

    return {
      totalMembers,
      activeMembers,
      expiredMembers,
      expiringThisWeek,
      newLeads,
      activePlans,
      revenueToday: 0,
      monthlyRevenue,
      attendanceToday,
      newLeadsThisWeek: newLeads,
      totalTrainers,
      pendingPayments,
    };
  } catch (error) {
    console.error("[getDashboardStats] Failed to load statistics:", error);
    return {
      totalMembers: 0,
      activeMembers: 0,
      expiredMembers: 0,
      expiringThisWeek: 0,
      newLeads: 0,
      activePlans: 0,
      revenueToday: 0,
      monthlyRevenue: 0,
      attendanceToday: 0,
      newLeadsThisWeek: 0,
      totalTrainers: 0,
      pendingPayments: 0,
    };
  }
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
        { id: "1", amount: 15000, paid_at: new Date().toISOString(), member: { name: "Rahul Sharma", phone: "9876543210" } },
        { id: "2", amount: 9000, paid_at: new Date(Date.now() - 86400000).toISOString(), member: { name: "Priya Patel", phone: "9876543211" } }
      ],
      recentMembers: [
        { id: "3", name: "Amit Kumar", join_date: new Date().toISOString() },
        { id: "4", name: "Neha Singh", join_date: new Date(Date.now() - 172800000).toISOString() }
      ],
      upcomingRenewals: [
        { id: "5", membership_end: new Date(Date.now() + 86400000 * 2).toISOString(), planPrice: 5000, member: { name: "Vikram Reddy", phone: "9876543210" } }
      ],
      recentLeads: [
        { id: "6", name: "Anjali", phone: "9876543211", status: "New", intent: "Weight Loss", created_at: new Date().toISOString() }
      ]
    };
  }
  
  const gym = await getCurrentGym();
  if (!gym) return { recentPayments: [], recentMembers: [], upcomingRenewals: [], recentLeads: [] };

  try {
    const { databases } = await createAdminClient();

    const [paymentsRes, membersRes, leadsRes, plansRes] = await Promise.allSettled([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, [
        Query.equal("gymId", gym.$id),
        Query.equal("status", "success"),
        Query.orderDesc("paidAt"),
        Query.limit(5)
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
        Query.equal("gymId", gym.$id),
        Query.orderDesc("joinedAt"),
        Query.limit(5)
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.LEADS, [
        Query.equal("gymId", gym.$id),
        Query.orderDesc("$createdAt"),
        Query.limit(5)
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERSHIP_PLANS, [
        Query.equal("gymId", gym.$id)
      ])
    ]);

    const plans = plansRes.status === "fulfilled" ? plansRes.value.documents : [];
    const planPriceMap: Record<string, number> = {};
    plans.forEach((p: any) => { planPriceMap[p.$id] = p.price || 0; });

    const recentPayments = paymentsRes.status === "fulfilled" ? paymentsRes.value.documents.map((p: any) => ({
      id: p.$id,
      amount: p.amount,
      paid_at: p.paidAt,
      member: { name: p.memberNameSnapshot || "Member", phone: p.memberPhoneSnapshot || null }
    })) : [];

    const recentMembers = membersRes.status === "fulfilled" ? membersRes.value.documents.map((m: any) => ({
      id: m.$id,
      name: m.name,
      join_date: m.joinedAt
    })) : [];

    const recentLeads = leadsRes.status === "fulfilled" ? leadsRes.value.documents.map((l: any) => ({
      id: l.$id,
      name: l.name,
      phone: l.phone,
      status: l.status,
      intent: l.notes || "Interested",
      created_at: l.$createdAt
    })) : [];

    // Expiring soon (Next 7 days + Expired in last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const nextSevenDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999).toISOString();
    
    const renewalsRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
      Query.equal("gymId", gym.$id),
      Query.between("membershipEndDate", sevenDaysAgo, nextSevenDays),
      Query.limit(10)
    ]);

    const upcomingRenewals = renewalsRes.documents.map((m: any) => ({
      id: m.$id,
      membership_end: m.membershipEndDate,
      planPrice: planPriceMap[m.planId] || 0,
      member: { name: m.name, phone: m.phone }
    }));

    // Sort renewals by end date
    upcomingRenewals.sort((a, b) => new Date(a.membership_end).getTime() - new Date(b.membership_end).getTime());

    return { recentPayments, recentMembers, upcomingRenewals, recentLeads };
  } catch (error) {
    console.error("[getRecentActivity] Failed to load:", error);
    return { recentPayments: [], recentMembers: [], upcomingRenewals: [], recentLeads: [] };
  }
}
