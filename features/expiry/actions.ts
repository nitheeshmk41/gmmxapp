"use server";

import { getCurrentGym } from "@/features/auth/actions";
import { getCurrentGym as getGymContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { ID, Query } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS, MemberDocument, MembershipPlanDocument } from "@/lib/appwrite/types";
import { revalidatePath } from "next/cache";

export async function getExpiringMembers(filter: string = "week") {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const { databases } = await createAdminClient();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999).toISOString();

  const queries = [
    Query.equal("gymId", gym.$id),
    Query.limit(100)
  ];

  if (filter === "today") {
    queries.push(Query.between("membershipEndDate", startOfToday, endOfToday));
  } else if (filter === "week") {
    queries.push(Query.between("membershipEndDate", startOfToday, endOfWeek));
  } else if (filter === "expired") {
    queries.push(Query.lessThan("membershipEndDate", startOfToday));
  } else {
    // Default fallback to week
    queries.push(Query.between("membershipEndDate", startOfToday, endOfWeek));
  }

  try {
    const res = await databases.listDocuments<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      queries
    );

    // Fetch plans to map plan name
    const plansRes = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      [Query.equal("gymId", gym.$id)]
    );
    const plansMap = new Map(plansRes.documents.map((p) => [p.$id, p]));

    return res.documents.map((m) => {
      const plan = m.planId ? plansMap.get(m.planId) : null;
      return {
        id: m.$id,
        member_id: m.$id,
        membership_end: m.membershipEndDate ? new Date(m.membershipEndDate) : null,
        member: {
          id: m.$id,
          name: m.name,
          phone: m.phone,
          status: m.status,
        },
        plan: plan ? { name: plan.name } : null,
      };
    });
  } catch (error) {
    console.error("[getExpiringMembers] Failed to fetch expiring members:", error);
    return [];
  }
}

export async function renewMembership(memberId: string, planId: string, renewalNotes?: string): Promise<{ success?: boolean; error?: string }> {
  const context = await getGymContext();
  if (!context || !context.gym) {
    return { error: "Unauthorized" };
  }

  const { databases } = await createAdminClient();

  try {
    // 1. Fetch Plan details
    const plan = await databases.getDocument<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      planId
    );

    // 2. Fetch Member details
    const member = await databases.getDocument<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      memberId
    );

    if (member.gymId !== context.gym.$id) {
      return { error: "Unauthorized" };
    }

    const now = new Date();
    let start = now;
    // If the membership is still active, extend it starting from its end date
    if (member.membershipEndDate && new Date(member.membershipEndDate) > now) {
      start = new Date(member.membershipEndDate);
    }

    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);

    const membershipStartDate = start.toISOString();
    const membershipEndDate = end.toISOString();

    // Derived status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const status = new Date(membershipEndDate) >= today ? "active" : "expired";

    // 3. Update Member Start/End dates and status
    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      memberId,
      {
        planId: planId,
        status,
        membershipStartDate,
        membershipEndDate,
        updatedBy: context.user.id
      }
    );

    // 4. Log the Payment record
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      ID.unique(),
      {
        gymId: context.gym.$id,
        memberId,
        membershipPlanId: planId,
        amount: plan.amount,
        planNameSnapshot: plan.name,
        planAmountSnapshot: plan.amount,
        status: "success",
        paymentMethod: "cash",
        paidAt: new Date().toISOString(),
        renewalNotes: renewalNotes || undefined
      }
    );

    revalidatePath("/dashboard/expiry");
    revalidatePath("/dashboard/members");
    revalidatePath(`/dashboard/members/${memberId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("[renewMembership] Failed:", error);
    return { error: (error as Error).message || "Failed to renew membership" };
  }
}
