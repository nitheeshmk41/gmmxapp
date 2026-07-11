import { NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/razorpay";

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
    // e.g. payment.captured, order.paid, subscription.charged

    console.log("[Razorpay Webhook Event]", event.event);
    
    // Example: if (event.event === "payment.captured") {
    //   const paymentEntity = event.payload.payment.entity;
    //   // Update Appwrite databases with successful payment
    // }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Razorpay Webhook Error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
