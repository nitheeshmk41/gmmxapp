"use server";

import { getCurrentGym } from "@/features/auth/actions";
import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { ID, Query } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS, MemberDocument, MembershipPlanDocument, PaymentDocument } from "@/lib/appwrite/types";
import { revalidatePath } from "next/cache";

export async function getMembers(params: { search?: string; status?: string; plan_id?: string; page?: number; pageSize?: number } = {}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0, page: 1, limit: 20 };

  const { databases } = await createAdminClient();
  const queries = [Query.equal("gymId", gym.$id)];

  if (params.search) {
    // Search is case-sensitive or standard depending on Appwrite attribute setup
    queries.push(Query.contains("name", params.search));
  }
  if (params.status && params.status !== "all") {
    queries.push(Query.equal("status", params.status));
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

    // Fetch plans and payments to build the joined view in memory
    const plansRes = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PLANS,
      [Query.equal("gymId", gym.$id)]
    );
    const plansMap = new Map(plansRes.documents.map((p) => [p.$id, p]));

    const paymentsRes = await databases.listDocuments<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [Query.equal("gymId", gym.$id), Query.orderDesc("paidAt")]
    );
    
    const paymentsByMember = new Map<string, Array<{ membership_end: Date | null; status: string }>>();
    paymentsRes.documents.forEach((p) => {
      const list = paymentsByMember.get(p.memberId) || [];
      list.push({
        membership_end: p.membershipEnd ? new Date(p.membershipEnd) : null,
        status: p.status,
      });
      paymentsByMember.set(p.memberId, list);
    });

    const data = res.documents.map((m) => {
      const plan = m.planId ? plansMap.get(m.planId) : null;
      return {
        id: m.$id,
        name: m.name,
        phone: m.phone,
        email: m.email || null,
        status: m.status,
        join_date: m.joinDate ? new Date(m.joinDate) : new Date(),
        plan: plan ? { name: plan.name, price: plan.price } : null,
        payments: paymentsByMember.get(m.$id) || [],
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

    // Fetch payments and plan details
    const paymentsRes = await databases.listDocuments<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [Query.equal("memberId", id), Query.orderDesc("paidAt")]
    );

    let plan = null;
    if (member.planId) {
      try {
        plan = await databases.getDocument<MembershipPlanDocument>(
          APPWRITE_DB_ID,
          COLLECTIONS.PLANS,
          member.planId
        );
      } catch {}
    }

    const mappedPayments = paymentsRes.documents.map((p) => ({
      id: p.$id,
      amount: p.amount,
      paid_at: p.paidAt,
      status: p.status,
      membership_end: p.membershipEnd ? new Date(p.membershipEnd) : null,
      plan: p.planId ? { name: plan?.name || "Plan" } : null,
    }));

    return {
      id: member.$id,
      name: member.name,
      phone: member.phone,
      email: member.email || null,
      gender: member.gender || null,
      age: member.age || null,
      height: member.height || null,
      weight: member.weight || null,
      goal: member.goal || null,
      join_date: member.joinDate ? new Date(member.joinDate) : new Date(),
      status: member.status,
      plan_id: member.planId || null,
      trainer_id: member.trainerId || null,
      notes: member.notes || null,
      plan: plan ? { name: plan.name, price: plan.price, duration_days: plan.durationDays } : null,
      payments: mappedPayments,
    };
  } catch (error) {
    console.error("[getMemberById] Failed to fetch member by ID:", error);
    return null;
  }
}

export async function createMember(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const context = await getCurrentContext();
  if (!context || !context.gym || context.role !== "OWNER") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const status = (formData.get("status") as "active" | "expired" | "paused") || "active";
  const planId = formData.get("plan_id") as string;
  const trainerId = formData.get("trainer_id") as string;
  const gender = formData.get("gender") as string;
  const age = formData.get("age") ? Number(formData.get("age")) : undefined;
  const height = formData.get("height") ? Number(formData.get("height")) : undefined;
  const weight = formData.get("weight") ? Number(formData.get("weight")) : undefined;
  const goal = formData.get("goal") as string;
  const notes = formData.get("notes") as string;
  const joinDate = formData.get("join_date") as string;

  if (!name || !phone) return { error: "Name and phone are required" };

  try {
    const { users, databases } = await createAdminClient();
    
    // Create Appwrite Auth User for the Member to allow phone login
    const password = ID.unique() + ID.unique();
    const appwriteUser = await users.create(
      ID.unique(),
      email || undefined,
      phone,
      password,
      name
    );

    // Link user to the current gym as MEMBER
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      ID.unique(),
      {
        gymId: context.gym.$id,
        userId: appwriteUser.$id,
        role: "MEMBER"
      }
    );

    // Create the Member document using the Auth userId as documentId
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      appwriteUser.$id,
      {
        gymId: context.gym.$id,
        name,
        phone,
        email: email || undefined,
        gender: gender || undefined,
        age: age || undefined,
        height: height || undefined,
        weight: weight || undefined,
        goal: goal || undefined,
        status,
        planId: planId || undefined,
        trainerId: trainerId || undefined,
        joinDate: joinDate || new Date().toISOString().split("T")[0],
        notes: notes || undefined
      }
    );

    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error: unknown) {
    console.error("[createMember] Failed:", error);
    return { error: (error as Error).message || "Failed to create member" };
  }
}

export async function updateMember(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as "active" | "expired" | "paused";
  const planId = formData.get("plan_id") as string;
  const trainerId = formData.get("trainer_id") as string;
  const gender = formData.get("gender") as string;
  const age = formData.get("age") ? Number(formData.get("age")) : null;
  const height = formData.get("height") ? Number(formData.get("height")) : null;
  const weight = formData.get("weight") ? Number(formData.get("weight")) : null;
  const goal = formData.get("goal") as string;
  const notes = formData.get("notes") as string;
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
    if (member.gymId !== gym.$id) return { error: "Unauthorized" };

    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      id,
      {
        name,
        email: email || null,
        phone,
        status,
        planId: planId || null,
        trainerId: trainerId || null,
        gender: gender || null,
        age: age || null,
        height: height || null,
        weight: weight || null,
        goal: goal || null,
        joinDate: joinDate || new Date().toISOString().split("T")[0],
        notes: notes || null
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
    const { databases, users } = await createAdminClient();
    
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

    // Delete link in gym_users
    try {
      const gymUsersRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.GYM_USERS,
        [Query.equal("gymId", gym.$id), Query.equal("userId", id)]
      );
      if (gymUsersRes.documents.length > 0) {
        await databases.deleteDocument(
          APPWRITE_DB_ID,
          COLLECTIONS.GYM_USERS,
          gymUsersRes.documents[0].$id
        );
      }
    } catch {}

    // Delete Appwrite auth user account if exists
    try {
      await users.delete(id);
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
      Name: m.name,
      Phone: m.phone,
      Email: m.email || "",
      Status: m.status,
      "Join Date": m.joinDate,
    }));
  } catch {
    return [];
  }
}
