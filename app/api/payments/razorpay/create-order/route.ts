import { NextResponse } from "next/server";
import { createRazorpayOrder, generateReceiptNumber } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming Request:", body);

    const { plan, amount, period, gymId } = body;

    if (!amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount is required",
        },
        {
          status: 400,
        }
      );
    }

    const numericAmount =
      typeof amount === "string"
        ? parseInt(amount.replace(/\D/g, ""))
        : amount;

    console.log("Parsed Amount:", numericAmount);

    const receipt = generateReceiptNumber();
    console.log("Receipt:", receipt);

    const order = await createRazorpayOrder({
      amount: numericAmount,
      receipt,
      notes: {
        plan,
        period,
        gymId,
      },
    });

    console.log("Order:", order);

    return NextResponse.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Razorpay Create Order Error: ", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      {
        status: 500,
      }
    );
  }
}
