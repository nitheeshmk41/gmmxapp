import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    // Verify webhook signature
    const isValid = verifyRazorpayWebhook({ body, signature });
    if (!isValid) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    console.log(`[Razorpay Webhook] Event: ${event}`);

    switch (event) {
      case "payment.captured": {
        const payment = payload.payload?.payment?.entity;
        if (payment?.order_id) {
          await prisma.payment.updateMany({
            where: { razorpay_order_id: payment.order_id },
            data: { status: "paid", razorpay_payment_id: payment.id },
          });
        }
        break;
      }
      case "payment.failed": {
        const payment = payload.payload?.payment?.entity;
        if (payment?.order_id) {
          await prisma.payment.updateMany({
            where: { razorpay_order_id: payment.order_id },
            data: { status: "failed" },
          });
        }
        break;
      }
      case "refund.created": {
        const refund = payload.payload?.refund?.entity;
        if (refund?.payment_id) {
          await prisma.payment.updateMany({
            where: { razorpay_payment_id: refund.payment_id },
            data: { status: "refunded" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
