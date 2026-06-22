"use server";

import { getCurrentGym } from "@/features/auth/actions";
import { getCurrentGym as getGymContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { ID, Query } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS, MemberDocument, MembershipPlanDocument } from "@/lib/appwrite/types";
import { revalidatePath } from "next/cache";

export async function getMembers(params: { search?: string; status?: string; plan_id?: string; page?: number; pageSize?: number } = {}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0, page: 1, limit: 20 };

  const { databases } = await createAdminClient();
  const queries = [Query.equal("gymId", gym.$id)];

  if (params.search) {
    queries.push(
      Query.or([
        Query.contains("name", params.search),
        Query.contains("phone", params.search),
        Query.contains("memberCode", params.search),
        Query.contains("email", params.search)
      ])
    );
  }
  if (params.status && params.status !== "all") {
    if (params.status === "expiring") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      queries.push(
        Query.between("membershipEndDate", today.toISOString(), nextWeek.toISOString()),
        Query.equal("status", "active")
      );
    } else {
      queries.push(Query.equal("status", params.status));
    }
  }
  if (params.plan_id && params.plan_id !== "all") {
    queries.push(Query.equal("planId", params.plan_id));
  }

  queries.push(Query.orderDesc("$createdAt"));

  const page = params.page || 1;
  const limit = params.pageSize || 20;
  const offset = (page - 1) * limit;
  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  try {
    const res = await databases.listDocuments<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      queries
    );

    // Fetch plans to map in memory
    const plansRes = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERSHIP_PLANS,
      [Query.equal("gymId", gym.$id)]
    );
    const plansMap = new Map(plansRes.documents.map((p) => [p.$id, p]));

    const data = res.documents.map((m) => {
      const plan = m.planId ? plansMap.get(m.planId) : null;
      return {
        id: m.$id,
        memberCode: m.memberCode,
        name: m.name,
        phone: m.phone,
        email: m.email || null,
        status: m.status,
        join_date: m.joinedAt ? new Date(m.joinedAt) : new Date(),
        plan: plan ? { name: plan.name, price: plan.amount } : null,
        membershipEndDate: m.membershipEndDate ? new Date(m.membershipEndDate) : null,
      };
    });

    return {
      data,
      total: res.total,
      page,
      limit,
    };
  } catch (error) {
    console.error("[getMembers] Failed to fetch members:", error);
    return { data: [], total: 0, page: 1, limit };
  }
}

export async function getMemberById(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { databases } = await createAdminClient();
  try {
    const member = await databases.getDocument<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      id
    );
    if (member.gymId !== gym.$id) return null;

    // Fetch plan details
    let plan: MembershipPlanDocument | null = null;
    if (member.planId) {
      try {
        plan = await databases.getDocument<MembershipPlanDocument>(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERSHIP_PLANS,
          member.planId
        );
      } catch {}
    }

    // Fetch payments
    const paymentsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [Query.equal("memberId", id), Query.limit(100)]
    );

    const mappedPayments = paymentsRes.documents
      .map((p: any) => ({
        id: p.$id,
        amount: p.amount,
        paid_at: p.paidAt,
        status: p.status,
        plan: p.membershipPlanId ? { name: plan?.name || "Plan" } : null,
        renewalNotes: p.renewalNotes || null,
      }))
      .sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());

    // Fetch attendance
    const attendanceRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.ATTENDANCE,
      [Query.equal("memberId", id), Query.limit(100)]
    );

    const mappedAttendance = attendanceRes.documents
      .map((a: any) => ({
        id: a.$id,
        date: a.date,
        time: a.time,
        status: a.status,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);

    return {
      id: member.$id,
      memberCode: member.memberCode,
      name: member.name,
      phone: member.phone,
      email: member.email || null,
      notes: member.notes || null,
      join_date: member.joinedAt ? new Date(member.joinedAt) : new Date(),
      status: member.status,
      plan_id: member.planId || null,
      membershipStartDate: member.membershipStartDate || null,
      membershipEndDate: member.membershipEndDate || null,
      plan: plan ? { name: plan.name, price: plan.amount, duration_days: plan.durationDays } : null,
      payments: mappedPayments,
      attendance: mappedAttendance,
    };
  } catch (error) {
    console.error("[getMemberById] Failed to fetch member by ID:", error);
    return null;
  }
}

export async function createMember(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const context = await getGymContext();
  if (!context || !context.gym) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const notes = formData.get("notes") as string;
  const planId = formData.get("plan_id") as string;
  const joinDate = formData.get("join_date") as string;

  if (!name || !phone) return { error: "Name and phone are required" };

  try {
    const { databases } = await createAdminClient();
    
    // Generate sequential member code per gym
    const totalRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      [Query.equal("gymId", context.gym.$id), Query.limit(1)]
    );
    const nextNumber = totalRes.total + 1;
    const memberCode = `M${String(nextNumber).padStart(4, "0")}`;

    let membershipStartDate: string | undefined = undefined;
    let membershipEndDate: string | undefined = undefined;

    if (planId) {
      try {
        const plan = await databases.getDocument<MembershipPlanDocument>(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERSHIP_PLANS,
          planId
        );
        
        const start = joinDate ? new Date(joinDate) : new Date();
        membershipStartDate = start.toISOString();
        
        const end = new Date(start);
        end.setDate(end.getDate() + plan.durationDays);
        membershipEndDate = end.toISOString();

        // Create initial payment record
        await databases.createDocument(
          APPWRITE_DB_ID,
          COLLECTIONS.PAYMENTS,
          ID.unique(),
          {
            gymId: context.gym.$id,
            memberId: "temp-member", // Placeholder until member ID is generated
            membershipPlanId: planId,
            amount: plan.amount,
            planNameSnapshot: plan.name,
            planAmountSnapshot: plan.amount,
            status: "success",
            paymentMethod: "cash",
            paidAt: new Date().toISOString()
          }
        );
      } catch (err) {
        console.error("Failed to fetch plan or log payment during member creation:", err);
      }
    }

    // Derived status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const status = membershipEndDate && new Date(membershipEndDate) >= today ? "active" : "expired";

    const memberId = ID.unique();

    // Create the Member document
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      memberId,
      {
        gymId: context.gym.$id,
        memberCode,
        name,
        phone,
        email: email || undefined,
        notes: notes || undefined,
        status,
        planId: planId || undefined,
        joinedAt: joinDate ? new Date(joinDate).toISOString() : new Date().toISOString(),
        membershipStartDate,
        membershipEndDate,
        createdBy: context.user.id,
        updatedBy: context.user.id
      }
    );

    // If payment log was created with placeholder, update its memberId
    if (planId) {
      try {
        const payments = await databases.listDocuments(
          APPWRITE_DB_ID,
          COLLECTIONS.PAYMENTS,
          [Query.equal("memberId", "temp-member"), Query.equal("gymId", context.gym.$id)]
        );
        for (const payment of payments.documents) {
          await databases.updateDocument(
            APPWRITE_DB_ID,
            COLLECTIONS.PAYMENTS,
            payment.$id,
            { memberId }
          );
        }
      } catch (err) {
        console.error("Failed to update payment log memberId:", err);
      }
    }

    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error: unknown) {
    console.error("[createMember] Failed:", error);
    return { error: (error as Error).message || "Failed to create member" };
  }
}

export async function updateMember(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const context = await getGymContext();
  if (!context || !context.gym) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const notes = formData.get("notes") as string;
  const planId = formData.get("plan_id") as string;
  const joinDate = formData.get("join_date") as string;

  if (!name || !phone) return { error: "Name and phone are required" };

  try {
    const { databases } = await createAdminClient();
    
    // Verify gym ownership
    const member = await databases.getDocument<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      id
    );
    if (member.gymId !== context.gym.$id) return { error: "Unauthorized" };

    let membershipStartDate = member.membershipStartDate;
    let membershipEndDate = member.membershipEndDate;

    if (planId && planId !== member.planId) {
      try {
        const plan = await databases.getDocument<MembershipPlanDocument>(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERSHIP_PLANS,
          planId
        );
        
        const start = joinDate ? new Date(joinDate) : new Date();
        membershipStartDate = start.toISOString();
        
        const end = new Date(start);
        end.setDate(end.getDate() + plan.durationDays);
        membershipEndDate = end.toISOString();

        // Create change payment record
        await databases.createDocument(
          APPWRITE_DB_ID,
          COLLECTIONS.PAYMENTS,
          ID.unique(),
          {
            gymId: context.gym.$id,
            memberId: id,
            membershipPlanId: planId,
            amount: plan.amount,
            planNameSnapshot: plan.name,
            planAmountSnapshot: plan.amount,
            status: "success",
            paymentMethod: "cash",
            paidAt: new Date().toISOString()
          }
        );
      } catch (err) {
        console.error("Failed to fetch plan or log payment for update:", err);
      }
    } else if (!planId) {
      membershipStartDate = undefined;
      membershipEndDate = undefined;
    }

    // Derived status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const status = membershipEndDate && new Date(membershipEndDate) >= today ? "active" : "expired";

    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      id,
      {
        name,
        phone,
        email: email || null,
        notes: notes || null,
        status,
        planId: planId || null,
        joinedAt: joinDate ? new Date(joinDate).toISOString() : member.joinedAt,
        membershipStartDate: membershipStartDate || null,
        membershipEndDate: membershipEndDate || null,
        updatedBy: context.user.id
      }
    );

    revalidatePath("/dashboard/members");
    revalidatePath(`/dashboard/members/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("[updateMember] Failed:", error);
    return { error: (error as Error).message || "Failed to update member" };
  }
}

export async function deleteMember(id: string): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  try {
    const { databases } = await createAdminClient();
    
    const member = await databases.getDocument<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      id
    );

    if (member.gymId !== gym.$id) return { error: "Unauthorized" };

    // Delete the MEMBER document
    await databases.deleteDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      id
    );

    // Delete associated payments
    try {
      const payments = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.PAYMENTS,
        [Query.equal("memberId", id), Query.equal("gymId", gym.$id)]
      );
      for (const p of payments.documents) {
        await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.PAYMENTS, p.$id);
      }
    } catch {}

    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error: unknown) {
    console.error("[deleteMember] Failed:", error);
    return { error: (error as Error).message || "Failed to delete member" };
  }
}

export async function getMembersForExport() {
  const gym = await getCurrentGym();
  if (!gym) return [];

  const { databases } = await createAdminClient();
  try {
    const res = await databases.listDocuments<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      [Query.equal("gymId", gym.$id), Query.limit(1000)]
    );
    return res.documents.map((m) => ({
      Code: m.memberCode,
      Name: m.name,
      Phone: m.phone,
      Email: m.email || "",
      Status: m.status,
      "Join Date": m.joinedAt,
      Notes: m.notes || ""
    }));
  } catch {
    return [];
  }
}
