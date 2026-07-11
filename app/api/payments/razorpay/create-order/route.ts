import { NextResponse } from "next/server";
import { createRazorpayOrder, generateReceiptNumber } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { plan, amount, period, gymId } = await req.json();

    if (!amount) {
      return NextResponse.json({ success: false, error: "Amount is required" }, { status: 400 });
    }

    // Convert amount string/number to a clean number (e.g., "₹999" -> 999)
    const numericAmount = typeof amount === "string" ? parseInt(amount.replace(/\D/g, "")) : amount;

    const receipt = generateReceiptNumber();
    const order = await createRazorpayOrder({
      amount: numericAmount,
      receipt,
      notes: {
        plan,
        period,
        gymId,
      },
    });

    return NextResponse.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error("[Razorpay Create Order Error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
