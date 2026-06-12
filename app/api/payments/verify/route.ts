import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/auth/context";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { toErrorResponse, ValidationError } from "@/lib/errors";
import { createCorrelationId, logEvent } from "@/lib/logger";

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
  const correlationId = createCorrelationId();

  try {
    const context = await requireManager();
    if (!context.gym?.id || !context.tenant?.id) throw new ValidationError("Gym not found");

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid data");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, memberId, planId, amount, receiptNumber } = parsed.data;

    // Verify signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      throw new ValidationError("Invalid payment signature");
    }

    const member = await prisma.member.findFirst({
      where: { id: memberId, tenant_id: context.tenant.id, gym_id: context.gym.id },
      select: { id: true },
    });
    if (!member) throw new ValidationError("Member not found");

    // Compute membership dates
    let membershipEnd: Date | undefined;
    const membershipStart = new Date();

    if (planId) {
      const plan = await prisma.membershipPlan.findFirst({
        where: { id: planId, tenant_id: context.tenant.id, gym_id: context.gym.id },
      });
      if (plan) {
        membershipEnd = new Date(membershipStart);
        membershipEnd.setDate(membershipEnd.getDate() + plan.duration_days);
      }
    }

    // Create payment record
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          tenant_id: context.tenant!.id,
          gym_id: context.gym!.id,
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
        where: { id: memberId, tenant_id: context.tenant!.id, gym_id: context.gym!.id },
        data: { status: "active" },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const response = toErrorResponse(error);
    logEvent(response.status >= 500 ? "error" : "warn", "payment.verify.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
      status: response.status,
    });
    return NextResponse.json(response.body, { status: response.status });
  }
}
