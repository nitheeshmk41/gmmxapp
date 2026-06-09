import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createGymSchema = z.object({
  name: z.string().min(2),
  ownerName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  subdomain: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/),
  plan: z.enum(["starter", "professional", "enterprise"]).default("starter"),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createGymSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, ownerName, phone, email, address, city, state, subdomain, plan } = parsed.data;

    // Check subdomain is still available
    const existing = await prisma.gym.findUnique({ where: { subdomain }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ error: "Subdomain is already taken" }, { status: 409 });
    }

    // Create gym + branch + website settings in a transaction
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const gym = await prisma.$transaction(async (tx) => {
      const newGym = await tx.gym.create({
        data: {
          name,
          owner_name: ownerName,
          phone,
          email,
          address,
          city,
          state,
          subdomain,
          plan,
          subscription_status: "trial",
          trial_ends_at: trialEndsAt,
        },
      });

      // Create main branch
      await tx.branch.create({
        data: {
          gym_id: newGym.id,
          name: "Main Branch",
          address,
          phone,
          is_main: true,
        },
      });

      // Create default website settings
      await tx.websiteSettings.create({
        data: {
          gym_id: newGym.id,
          template: "modern",
          is_published: false,
        },
      });

      // Create subscription record
      await tx.subscription.create({
        data: {
          gym_id: newGym.id,
          plan,
          status: "trial",
          current_period_start: new Date(),
          current_period_end: trialEndsAt,
        },
      });

      // Update user with gym_id
      await tx.user.update({
        where: { id: user.id },
        data: { gym_id: newGym.id },
      });

      return newGym;
    });

    return NextResponse.json({ success: true, gym });
  } catch (error) {
    console.error("Create gym error:", error);
    return NextResponse.json({ error: "Failed to create gym" }, { status: 500 });
  }
}
