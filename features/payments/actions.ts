"use server";

import { getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { ID, Query } from "node-appwrite";
import { APPWRITE_DB_ID, COLLECTIONS, PaymentDocument, MemberDocument, MembershipPlanDocument } from "@/lib/appwrite/types";
import { revalidatePath } from "next/cache";

// ── List Payments ────────────────────────────────────────────────

export async function getPayments(params: {
  search?: string;
  status?: string;
  method?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0, page: 1, limit: 20 };

  const { databases } = await createAdminClient();
  const queries = [Query.equal("gymId", gym.$id)];

  if (params.search) {
    // Search by member name requires a join — we search by transaction ID instead
    queries.push(
      Query.or([
        Query.contains("transactionId", params.search),
        Query.contains("memberId", params.search),
      ])
    );
  }

  if (params.status && params.status !== "all") {
    queries.push(Query.equal("status", params.status));
  }

  if (params.method && params.method !== "all") {
    queries.push(Query.equal("paymentMethod", params.method));
  }

  queries.push(Query.orderDesc("paidAt"));

  const page = params.page || 1;
  const limit = params.pageSize || 20;
  const offset = (page - 1) * limit;
  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  try {
    const res = await databases.listDocuments<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      queries
    );

    return {
      data: res.documents,
      total: res.total,
      page,
      limit,
    };
  } catch (error) {
    console.error("[getPayments] Failed:", error);
    return { data: [], total: 0, page: 1, limit: 20 };
  }
}

// ── Get Single Payment ───────────────────────────────────────────

export async function getPaymentById(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { databases } = await createAdminClient();

  try {
    const payment = await databases.getDocument<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      id
    );

    // Tenant isolation check
    if (payment.gymId !== gym.$id) {
      console.error("[getPaymentById] Tenant mismatch");
      return null;
    }

    return payment;
  } catch (error) {
    console.error("[getPaymentById] Failed:", error);
    return null;
  }
}

// ── Create Payment ───────────────────────────────────────────────

export async function createPayment(formData: FormData): Promise<{ success?: boolean; error?: string; paymentId?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Not authenticated" };

  const memberId = formData.get("memberId")?.toString();
  const amount = parseFloat(formData.get("amount")?.toString() || "0");
  const method = formData.get("paymentMethod")?.toString() || "cash";
  const planId = formData.get("planId")?.toString();
  const transactionId = formData.get("transactionId")?.toString();
  const renewalNotes = formData.get("renewalNotes")?.toString();

  // Validation
  if (!memberId) return { error: "Member is required" };
  if (!amount || amount <= 0) return { error: "Amount must be greater than 0" };
  if (!["cash", "card", "upi"].includes(method)) return { error: "Invalid payment method" };

  const { databases } = await createAdminClient();

  try {
    // Verify member belongs to this gym
    const member = await databases.getDocument<MemberDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      memberId
    );

    if (member.gymId !== gym.$id) {
      return { error: "Member not found" };
    }

    // Build payment data
    const paymentData: Record<string, unknown> = {
      gymId: gym.$id,
      memberId,
      amount,
      paymentMethod: method,
      status: "success",
      paidAt: new Date().toISOString(),
    };

    if (planId) {
      paymentData.membershipPlanId = planId;

      // Snapshot plan details for historical accuracy
      try {
        const plan = await databases.getDocument<MembershipPlanDocument>(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERSHIP_PLANS,
          planId
        );
        paymentData.planNameSnapshot = plan.name;
        paymentData.planAmountSnapshot = plan.amount;

        // Auto-extend membership dates
        const now = new Date();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + plan.durationDays);

        await databases.updateDocument(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERS,
          memberId,
          {
            status: "active",
            planId: planId,
            membershipStartDate: now.toISOString(),
            membershipEndDate: endDate.toISOString(),
          }
        );
      } catch {
        // Plan lookup is non-critical — proceed with payment
      }
    }

    if (transactionId) paymentData.transactionId = transactionId;
    if (renewalNotes) paymentData.renewalNotes = renewalNotes;

    const payment = await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      ID.unique(),
      paymentData
    );

    revalidatePath("/owner/dashboard/payments");
    revalidatePath("/owner/dashboard/members");
    revalidatePath("/owner/dashboard");

    return { success: true, paymentId: payment.$id };
  } catch (error) {
    console.error("[createPayment] Failed:", error);
    return { error: "Failed to record payment. Please try again." };
  }
}

// ── Update Payment Status ────────────────────────────────────────

export async function updatePaymentStatus(
  paymentId: string,
  status: "success" | "pending" | "failed"
): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Not authenticated" };

  const { databases } = await createAdminClient();

  try {
    const payment = await databases.getDocument<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      paymentId
    );

    if (payment.gymId !== gym.$id) {
      return { error: "Payment not found" };
    }

    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      paymentId,
      { status }
    );

    revalidatePath("/owner/dashboard/payments");
    return { success: true };
  } catch (error) {
    console.error("[updatePaymentStatus] Failed:", error);
    return { error: "Failed to update payment status." };
  }
}

// ── Payment Stats ────────────────────────────────────────────────

export async function getPaymentStats() {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { databases } = await createAdminClient();

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // This month's payments
    const thisMonth = await databases.listDocuments<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [
        Query.equal("gymId", gym.$id),
        Query.equal("status", "success"),
        Query.greaterThanEqual("paidAt", startOfMonth.toISOString()),
        Query.limit(500),
      ]
    );

    // Last month's payments
    const lastMonth = await databases.listDocuments<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [
        Query.equal("gymId", gym.$id),
        Query.equal("status", "success"),
        Query.greaterThanEqual("paidAt", startOfLastMonth.toISOString()),
        Query.lessThanEqual("paidAt", endOfLastMonth.toISOString()),
        Query.limit(500),
      ]
    );

    // Pending payments
    const pending = await databases.listDocuments<PaymentDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PAYMENTS,
      [
        Query.equal("gymId", gym.$id),
        Query.equal("status", "pending"),
        Query.limit(500),
      ]
    );

    const thisMonthRevenue = thisMonth.documents.reduce((sum, p) => sum + (p.amount || 0), 0);
    const lastMonthRevenue = lastMonth.documents.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      thisMonthRevenue,
      lastMonthRevenue,
      thisMonthCount: thisMonth.total,
      lastMonthCount: lastMonth.total,
      pendingCount: pending.total,
      pendingAmount: pending.documents.reduce((sum, p) => sum + (p.amount || 0), 0),
      growthPercent: lastMonthRevenue > 0
        ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 0,
    };
  } catch (error) {
    console.error("[getPaymentStats] Failed:", error);
    return null;
  }
}
