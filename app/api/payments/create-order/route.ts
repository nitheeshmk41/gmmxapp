import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/auth/context";
import { createRazorpayOrder } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { toErrorResponse, ValidationError } from "@/lib/errors";
import { createCorrelationId, logEvent } from "@/lib/logger";

const schema = z.object({
  memberId: z.string(),
  planId: z.string().optional(),
  amount: z.number().min(1),
  notes: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: NextRequest) {
  const correlationId = createCorrelationId();

  try {
    const context = await requireManager();
    if (!context.gym?.id || !context.tenant?.id) throw new ValidationError("Gym not found");

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message);

    const { memberId, amount, notes } = parsed.data;

    const member = await prisma.member.findFirst({
      where: { id: memberId, tenant_id: context.tenant.id, gym_id: context.gym.id },
      select: { id: true },
    });
    if (!member) throw new ValidationError("Member not found");

    // Generate receipt number
    const count = await prisma.payment.count({ where: { tenant_id: context.tenant.id, gym_id: context.gym.id } });
    const receipt = `GMMX-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    const order = await createRazorpayOrder({
      amount,
      receipt,
      notes: { memberId, gymId: context.gym.id, tenantId: context.tenant.id, ...notes },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, receipt });
  } catch (error) {
    const response = toErrorResponse(error);
    logEvent(response.status >= 500 ? "error" : "warn", "payment.order_create.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
      status: response.status,
    });
    return NextResponse.json(response.body, { status: response.status });
  }
}
