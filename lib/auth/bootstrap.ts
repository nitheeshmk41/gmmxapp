import type { Models } from "node-appwrite";
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/logger";

function toTenantSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function ensureUserRecord({
  appwriteUser,
  provider,
  correlationId,
}: {
  appwriteUser: Models.User<Models.Preferences>;
  provider: "email" | "google";
  correlationId?: string;
}) {
  const displayName = appwriteUser.name || appwriteUser.email.split("@")[0] || "Owner";

  const user = await prisma.user.upsert({
    where: { appwrite_user_id: appwriteUser.$id },
    update: {
      email: appwriteUser.email,
      name: displayName,
    },
    create: {
      appwrite_user_id: appwriteUser.$id,
      email: appwriteUser.email,
      name: displayName,
      provider,
      role: "gym_owner",
      onboarding_status: "pending",
    },
    include: { tenant: true, gym: true },
  });

  logEvent("info", "user.bootstrap.completed", {
    correlationId,
    userId: user.id,
    provider,
  });

  return user;
}

export async function createGymTenant({
  userId,
  gymName,
  ownerName,
  email,
  phone,
  subdomain,
  plan = "starter",
}: {
  userId: string;
  gymName: string;
  ownerName: string;
  email: string;
  phone: string;
  subdomain: string;
  plan?: string;
}) {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const baseSlug = toTenantSlug(gymName) || "gym";
  const tenantSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;

  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: gymName,
        slug: tenantSlug,
      },
    });

    const gym = await tx.gym.create({
      data: {
        tenant_id: tenant.id,
        name: gymName,
        owner_name: ownerName,
        phone,
        email,
        subdomain,
        plan: plan as any,
        subscription_status: "trial",
        trial_ends_at: trialEndsAt,
      },
    });

    await tx.branch.create({
      data: {
        id: `main-${gym.id}`,
        tenant_id: tenant.id,
        gym_id: gym.id,
        name: "Main Branch",
        is_main: true,
      },
    });

    await tx.websiteSettings.create({
      data: {
        tenant_id: tenant.id,
        gym_id: gym.id,
        template: "modern",
        is_published: true,
      },
    });

    await tx.subscription.create({
      data: {
        id: `trial-${gym.id}`,
        tenant_id: tenant.id,
        gym_id: gym.id,
        plan: plan as any,
        status: "trial",
        current_period_start: new Date(),
        current_period_end: trialEndsAt,
      },
    });

    return tx.user.update({
      where: { id: userId },
      data: {
        tenant_id: tenant.id,
        gym_id: gym.id,
        onboarding_status: "completed",
      },
      include: { tenant: true, gym: true },
    });
  });
}

export function routeForUser(user: {
  role: string;
  onboarding_status: string;
  gym?: { subscription_status?: string; trial_ends_at?: Date | null; subdomain?: string } | null;
}) {
  if (user.role === "super_admin") return "/admin";
  if (user.onboarding_status !== "completed") return "/onboarding";
  if (user.gym?.subscription_status === "expired") return "/billing";
  
  const path = user.role === "trainer" ? "/trainer/dashboard" : user.role === "member" ? "/member/dashboard" : "/dashboard";
  const subdomain = user.gym?.subdomain;

  if (subdomain) {
    const isProd = process.env.NODE_ENV === "production";
    if (isProd) {
      const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
      return `https://${subdomain}.${baseDomain}${path}`;
    }
    // Locally, middleware uses the ?gym= query parameter instead of subdomains
    return `${path}?gym=${subdomain}`;
  }

  return path;
}

