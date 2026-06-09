import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  memberId: z.string(),
  planId: z.string().optional(),
  amount: z.number(),
  receiptNumber: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser?.gym_id) return NextResponse.json({ error: "Gym not found" }, { status: 404 });

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, memberId, planId, amount, receiptNumber } = parsed.data;

    // Verify signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Compute membership dates
    let membershipEnd: Date | undefined;
    const membershipStart = new Date();

    if (planId) {
      const plan = await prisma.membershipPlan.findFirst({ where: { id: planId, gym_id: dbUser.gym_id } });
      if (plan) {
        membershipEnd = new Date(membershipStart);
        membershipEnd.setDate(membershipEnd.getDate() + plan.duration_days);
      }
    }

    // Create payment record
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          gym_id: dbUser.gym_id!,
          member_id: memberId,
          plan_id: planId,
          amount,
          method: "razorpay",
          status: "paid",
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          receipt_number: receiptNumber,
          membership_start: membershipStart,
          membership_end: membershipEnd,
        },
      });

      await tx.member.updateMany({
        where: { id: memberId, gym_id: dbUser.gym_id! },
        data: { status: "active" },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
