import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query, ID } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      gymId, 
      plan, 
      period 
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !gymId || !plan) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    const { databases } = await createAdminClient();
    
    // 1. Update Gym Document to active
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId, {
      status: "active"
    });

    // 2. Find and update the latest trial subscription, or create a new active subscription record
    const subRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
      Query.equal("gymId", gymId),
      Query.orderDesc("$createdAt"),
      Query.limit(1)
    ]);
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + (period === "yearly" ? 12 : 1));

    if (subRes.total > 0 && subRes.documents[0].status === "trial") {
      // Upgrade trial to active
      await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, subRes.documents[0].$id, {
        status: "active",
        planId: plan,
        endsAt: nextMonth.toISOString(),
      });
    } else {
      // Create new subscription record
      await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, ID.unique(), {
        gymId,
        status: "active",
        planId: plan,
        startsAt: new Date().toISOString(),
        endsAt: nextMonth.toISOString(),
        paymentProvider: "razorpay"
      });
    }
    
    console.log(`[Razorpay Verify] Successfully upgraded gym ${gymId} to ${plan} via synchronous verification`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Razorpay Verify Error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Verification processing failed" },
      { status: 500 }
    );
  }
}
