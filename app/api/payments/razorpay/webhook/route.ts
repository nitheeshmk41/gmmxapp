import { NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query, ID } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
    }

    const isValid = verifyRazorpayWebhook({ body: rawBody, signature });
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle specific Razorpay webhook events here
    console.log("[Razorpay Webhook Event]", event.event);
    
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const entity = event.payload.payment?.entity || event.payload.order?.entity;
      const gymId = entity?.notes?.gymId;
      const plan = entity?.notes?.plan;
      const period = entity?.notes?.period || "monthly";
      
      if (gymId && plan) {
        const { databases } = await createAdminClient();
        
        // 1. Update Gym Document
        await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId, {
          plan,
          subscription_status: "active"
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
            current_period_end: nextMonth.toISOString(),
          });
        } else {
          // Create new subscription record
          await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, ID.unique(), {
            gymId,
            status: "active",
            planId: plan,
            endsAt: nextMonth.toISOString(),
            current_period_end: nextMonth.toISOString(),
          });
        }
        
        console.log(`[Razorpay Webhook] Successfully upgraded gym ${gymId} to ${plan}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Razorpay Webhook Error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
