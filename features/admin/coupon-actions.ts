"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CouponSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  type: z.enum(["percent", "flat"]),
  value: z.coerce.number().min(0),
  maxUses: z.coerce.number().min(0).default(0),
  expiresAt: z.string().optional(),
  description: z.string().max(500).optional(),
});

export async function createCoupon(formData: FormData) {
  try {
    const parsed = CouponSchema.parse({
      code: formData.get("code"),
      type: formData.get("type"),
      value: formData.get("value"),
      maxUses: formData.get("maxUses") || 0,
      expiresAt: formData.get("expiresAt") || undefined,
      description: formData.get("description") || undefined,
    });

    const { databases } = await createAdminClient();

    // Check uniqueness
    const existing = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.COUPONS, [
      Query.equal("code", parsed.code),
    ]);
    if (existing.total > 0) {
      return { success: false, error: `Coupon code "${parsed.code}" already exists` };
    }

    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.COUPONS, ID.unique(), {
      ...parsed,
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function toggleCoupon(couponId: string, isActive: boolean) {
  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.COUPONS, couponId, { isActive });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteCoupon(couponId: string) {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.COUPONS, couponId);
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
