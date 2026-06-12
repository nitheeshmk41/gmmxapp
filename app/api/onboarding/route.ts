import { requireOwner } from "@/lib/auth/context";
import { toErrorResponse, ValidationError } from "@/lib/errors";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { validateSubdomain } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const onboardingSchema = z.object({
  step: z.number().min(1).max(4),
  gymDetails: z
    .object({
      name: z.string().min(2).optional(),
      gymType: z.string().optional(),
      address: z.string().optional(),
      city: z.string().min(2).optional(),
      state: z.string().min(2).optional(),
      country: z.string().min(2).optional(),
    })
    .optional(),
  ownerDetails: z
    .object({
      name: z.string().min(2).optional(),
      phone: z.string().min(8).optional(),
      whatsapp: z.string().optional(),
    })
    .optional(),
  businessSetup: z
    .object({
      subdomain: z.string().optional(),
    })
    .optional(),
});

const defaultPlans = [
  { name: "Monthly", duration_days: 30, price: 1500, description: "Standard monthly membership" },
  { name: "Quarterly", duration_days: 90, price: 4000, description: "Three-month membership" },
  { name: "Annual", duration_days: 365, price: 15000, description: "One-year membership" },
];

export async function POST(request: NextRequest) {
  const correlationId = createCorrelationId();

  try {
    const context = await requireOwner();
    if (!context.tenant?.id || !context.gym?.id) {
      throw new ValidationError("User workspace is incomplete");
    }

    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message);

    const { step, gymDetails, ownerDetails, businessSetup } = parsed.data;
    const tenantId = context.tenant.id;
    const gymId = context.gym.id;
    const userId = context.user.id;

    if (step === 1 && gymDetails) {
      await prisma.$transaction([
        prisma.tenant.update({
          where: { id: tenantId },
          data: { name: gymDetails.name ?? context.tenant.name },
        }),
        prisma.gym.update({
          where: { id: gymId, tenant_id: tenantId },
          data: {
            name: gymDetails.name,
            gym_type: gymDetails.gymType,
            address: gymDetails.address,
            city: gymDetails.city,
            state: gymDetails.state,
            country: gymDetails.country,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { onboarding_status: "gym_created" },
        }),
      ]);

      logEvent("info", "onboarding.gym_details.completed", {
        correlationId,
        userId,
        tenantId,
        gymId,
      });

      return NextResponse.json({ success: true });
    }

    if (step === 2 && ownerDetails) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            name: ownerDetails.name,
            phone: ownerDetails.phone,
            whatsapp: ownerDetails.whatsapp,
            onboarding_status: "owner_profile_completed",
          },
        }),
        prisma.gym.update({
          where: { id: gymId, tenant_id: tenantId },
          data: {
            owner_name: ownerDetails.name,
            phone: ownerDetails.phone,
          },
        }),
      ]);

      logEvent("info", "onboarding.owner_details.completed", {
        correlationId,
        userId,
        tenantId,
        gymId,
      });

      return NextResponse.json({ success: true });
    }

    if (step === 3 && businessSetup) {
      const subdomain = businessSetup.subdomain?.toLowerCase().trim();
      const validation = validateSubdomain(subdomain ?? "");
      if (!subdomain || !validation.valid) {
        throw new ValidationError(validation.error ?? "Choose a valid subdomain");
      }

      const existing = await prisma.gym.findFirst({
        where: {
          subdomain,
          id: { not: gymId },
        },
        select: { id: true },
      });
      if (existing) return NextResponse.json({ error: "Subdomain taken" }, { status: 409 });

      await prisma.$transaction(async (tx) => {
        await tx.gym.update({
          where: { id: gymId, tenant_id: tenantId },
          data: { subdomain },
        });

        for (const plan of defaultPlans) {
          await tx.membershipPlan.upsert({
            where: { id: `${gymId}-${plan.duration_days}` },
            update: {
              tenant_id: tenantId,
              gym_id: gymId,
              ...plan,
            },
            create: {
              id: `${gymId}-${plan.duration_days}`,
              tenant_id: tenantId,
              gym_id: gymId,
              ...plan,
            },
          });
        }

        await tx.user.update({
          where: { id: userId },
          data: { onboarding_status: "business_setup_completed" },
        });
      });

      logEvent("info", "onboarding.business_setup.completed", {
        correlationId,
        userId,
        tenantId,
        gymId,
      });

      return NextResponse.json({ success: true });
    }

    if (step === 4) {
      await prisma.user.update({
        where: { id: userId },
        data: { onboarding_status: "completed" },
      });

      logEvent("info", "onboarding.completed", {
        correlationId,
        userId,
        tenantId,
        gymId,
      });

      return NextResponse.json({ success: true });
    }

    throw new ValidationError("Invalid onboarding step");
  } catch (error) {
    const response = toErrorResponse(error);
    logEvent(response.status >= 500 ? "error" : "warn", "onboarding.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
      status: response.status,
    });

    return NextResponse.json(response.body, { status: response.status });
  }
}

