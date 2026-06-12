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

export async function ensureOwnerWorkspace({
  appwriteUser,
  provider,
  correlationId,
}: {
  appwriteUser: Models.User<Models.Preferences>;
  provider: "email" | "google";
  correlationId?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { appwrite_user_id: appwriteUser.$id },
    include: { tenant: true, gym: true },
  });

  if (existing?.tenant_id && existing.gym_id) {
    return existing;
  }

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const displayName = appwriteUser.name || appwriteUser.email.split("@")[0] || "Owner";
  const baseSlug = toTenantSlug(displayName) || "gym";
  const tenantSlug = `${baseSlug}-${appwriteUser.$id.toLowerCase().slice(0, 8)}`;
  const tempSubdomain = `temp-${appwriteUser.$id.toLowerCase()}`;

  const user = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.upsert({
      where: { slug: tenantSlug },
      update: {},
      create: {
        name: `${displayName}'s Tenant`,
        slug: tenantSlug,
      },
    });

    const gym = await tx.gym.upsert({
      where: { subdomain: tempSubdomain },
      update: {
        tenant_id: tenant.id,
        email: appwriteUser.email,
        owner_name: displayName,
      },
      create: {
        tenant_id: tenant.id,
        name: `${displayName}'s Gym`,
        owner_name: displayName,
        phone: "",
        email: appwriteUser.email,
        subdomain: tempSubdomain,
        plan: "starter",
        subscription_status: "trial",
        trial_ends_at: trialEndsAt,
      },
    });

    await tx.branch.upsert({
      where: { id: `main-${gym.id}` },
      update: {
        tenant_id: tenant.id,
        gym_id: gym.id,
        is_main: true,
      },
      create: {
        id: `main-${gym.id}`,
        tenant_id: tenant.id,
        gym_id: gym.id,
        name: "Main Branch",
        is_main: true,
      },
    });

    await tx.websiteSettings.upsert({
      where: { gym_id: gym.id },
      update: {
        tenant_id: tenant.id,
      },
      create: {
        tenant_id: tenant.id,
        gym_id: gym.id,
        template: "modern",
        is_published: false,
      },
    });

    await tx.subscription.upsert({
      where: { id: `trial-${gym.id}` },
      update: {
        tenant_id: tenant.id,
        gym_id: gym.id,
        status: "trial",
      },
      create: {
        id: `trial-${gym.id}`,
        tenant_id: tenant.id,
        gym_id: gym.id,
        plan: "starter",
        status: "trial",
        current_period_start: new Date(),
        current_period_end: trialEndsAt,
      },
    });

    return tx.user.upsert({
      where: { appwrite_user_id: appwriteUser.$id },
      update: {
        tenant_id: tenant.id,
        gym_id: gym.id,
        email: appwriteUser.email,
        name: displayName,
        provider,
      },
      create: {
        tenant_id: tenant.id,
        appwrite_user_id: appwriteUser.$id,
        email: appwriteUser.email,
        name: displayName,
        provider,
        role: "gym_owner",
        gym_id: gym.id,
        onboarding_status: "pending",
      },
      include: { tenant: true, gym: true },
    });
  });

  logEvent("info", "tenant.bootstrap.completed", {
    correlationId,
    userId: user.id,
    tenantId: user.tenant_id,
    gymId: user.gym_id,
    provider,
  });

  return user;
}

export function routeForUser(user: {
  role: string;
  onboarding_status: string;
  gym?: { subscription_status?: string; trial_ends_at?: Date | null } | null;
}) {
  if (user.role === "super_admin") return "/admin";
  if (user.onboarding_status !== "completed") return "/onboarding";
  if (user.gym?.subscription_status === "expired") return "/billing";
  return "/dashboard";
}

