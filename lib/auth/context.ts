import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSessionClient } from "@/lib/appwrite/server";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

export type AuthContext = Awaited<ReturnType<typeof getCurrentContext>>;

export async function getCurrentContext() {
  try {
    const { account } = await createSessionClient();
    const appwriteUser = await account.get();
    console.log("[AUTH] Appwrite session valid, userId:", appwriteUser.$id);

    const user = await prisma.user.findUnique({
      where: { appwrite_user_id: appwriteUser.$id },
      include: {
        tenant: true,
        gym: {
          include: {
            branches: { where: { is_main: true }, take: 1 },
            subscriptions: {
              orderBy: { created_at: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!user) {
      console.log("[AUTH] No DB user found for appwrite_user_id:", appwriteUser.$id);
      return null;
    }

    console.log("[AUTH] DB user found:", user.id, "gym:", user.gym_id, "onboarding:", user.onboarding_status);

    return {
      appwriteUser,
      user,
      tenant: user.tenant,
      gym: user.gym,
      role: user.role,
      subscription: user.gym?.subscriptions[0] ?? null,
    };
  } catch (error) {
    console.log("[AUTH] getCurrentContext failed:", error instanceof Error ? error.message : "unknown");
    return null;
  }
}

export async function requireAuth() {
  const context = await getCurrentContext();
  if (!context) throw new AuthenticationError();
  return context;
}

function hasRole(role: UserRole, allowed: UserRole[]) {
  return allowed.includes(role);
}

export async function requireRole(allowed: UserRole[]) {
  const context = await requireAuth();
  if (!hasRole(context.role, allowed)) throw new AuthorizationError();
  return context;
}

export function requireOwner() {
  return requireRole(["gym_owner", "super_admin"]);
}

export function requireManager() {
  return requireRole(["gym_owner", "manager", "super_admin"]);
}

export function requireTrainer() {
  return requireRole(["gym_owner", "manager", "trainer", "super_admin"]);
}
