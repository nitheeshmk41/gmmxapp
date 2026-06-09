"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  source: z.enum(["walk_in", "website", "referral", "instagram", "other"]).default("walk_in"),
  status: z.enum(["new", "contacted", "interested", "trial", "converted", "lost"]).default("new"),
  notes: z.string().optional(),
});

export async function getLeads({
  search,
  status,
  page = 1,
  pageSize = 25,
}: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0 };

  const where: Record<string, unknown> = { gym_id: gym.id };
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  return { data, total };
}

export async function createLead(formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { email, ...rest } = parsed.data;

  await prisma.lead.create({
    data: {
      ...rest,
      gym_id: gym.id,
      email: email || undefined,
    },
  });

  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function updateLead(id: string, formData: FormData) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.partial().safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.lead.updateMany({
    where: { id, gym_id: gym.id },
    data: {
      ...parsed.data,
      last_contacted_at: new Date(),
    },
  });

  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.lead.updateMany({
    where: { id, gym_id: gym.id },
    data: { status: status as never, last_contacted_at: new Date() },
  });

  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function deleteLead(id: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  await prisma.lead.deleteMany({ where: { id, gym_id: gym.id } });
  revalidatePath("/dashboard/leads");
  return { success: true };
}

// Convert lead → member
export async function convertLeadToMember(leadId: string) {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const lead = await prisma.lead.findFirst({ where: { id: leadId, gym_id: gym.id } });
  if (!lead) return { error: "Lead not found" };

  const member = await prisma.$transaction(async (tx) => {
    const newMember = await tx.member.create({
      data: {
        gym_id: gym.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email || undefined,
        join_date: new Date(),
        status: "active",
      },
    });

    await tx.lead.updateMany({
      where: { id: leadId, gym_id: gym.id },
      data: { status: "converted" },
    });

    return newMember;
  });

  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/members");
  return { success: true, memberId: member.id };
}

// Public lead capture (from gym website join form)
export async function createPublicLead(data: {
  gymId: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
}) {
  await prisma.lead.create({
    data: {
      gym_id: data.gymId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      source: (data.source as never) || "website",
      status: "new",
    },
  });
  return { success: true };
}
