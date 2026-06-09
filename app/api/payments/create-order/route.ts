import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  memberId: z.string(),
  planId: z.string().optional(),
  amount: z.number().min(1),
  notes: z.record(z.string(), z.any()).optional(),
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
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const { memberId, amount, notes } = parsed.data;

    // Generate receipt number
    const count = await prisma.payment.count({ where: { gym_id: dbUser.gym_id } });
    const receipt = `GMMX-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    const order = await createRazorpayOrder({
      amount,
      receipt,
      notes: { memberId, gymId: dbUser.gym_id, ...notes },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, receipt });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
