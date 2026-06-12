"use server";

import { createAdminClient, createSessionClient, createEmailPasswordSessionHelper } from "@/lib/appwrite/server";
import { ensureUserRecord, routeForUser } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { env } from "@/lib/env";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Account, Client, ID, OAuthProvider } from "node-appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function getAuthClient() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  return new Account(client);
}

async function getAppUrl() {
  if (env.NODE_ENV !== "production") {
    return env.NEXT_PUBLIC_APP_URL;
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto =
    headerStore.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");

  return host ? `${proto}://${host}` : env.NEXT_PUBLIC_APP_URL;
}

async function setSessionCookie(secret: string) {
  const cookieStore = await cookies();
  cookieStore.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
}

async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);
}

export async function signInWithGoogle() {
  const account = getAuthClient();
  const appUrl = await getAppUrl();

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${appUrl}/auth/callback`,
    `${appUrl}/login?error=oauth_failed`
  );

  redirect(redirectUrl);
}

export async function signUp(formData: FormData) {
  const correlationId = createCorrelationId();
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const account = getAuthClient();

  try {
    const appwriteUser = await account.create(
      ID.unique(),
      parsed.data.email,
      parsed.data.password,
      parsed.data.name
    );

    const sessionSecret = await createEmailPasswordSessionHelper(
      parsed.data.email,
      parsed.data.password
    );

    await setSessionCookie(sessionSecret);
    
    // Create the Prisma User record only.
    const user = await ensureUserRecord({
      appwriteUser,
      provider: "email",
      correlationId,
    });
    
    // phone and gymName will be collected later in the onboarding wizard

    logEvent("info", "auth.signup.completed", {
      correlationId,
      appwriteUserId: appwriteUser.$id,
    });
  } catch (error: unknown) {
    logEvent("warn", "auth.signup.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
    });

    return {
      error: error instanceof Error ? error.message : "Failed to create account",
    };
  }

  // Proceed to onboarding wizard
  const redirectUrl = new URL("/onboarding", await getAppUrl());
  
  redirect(redirectUrl.toString());
}

export async function signIn(formData: FormData) {
  const correlationId = createCorrelationId();
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const account = getAuthClient();

  try {
    const sessionSecret = await createEmailPasswordSessionHelper(
      parsed.data.email,
      parsed.data.password
    );
    await setSessionCookie(sessionSecret);
  } catch (error: unknown) {
    logEvent("warn", "auth.login.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
    });

    return {
      error: error instanceof Error ? error.message : "Invalid email or password",
    };
  }

  let redirectTo = "/dashboard";

  try {
    const { account: sessionAccount } = await createSessionClient();
    const appwriteUser = await sessionAccount.get();

    const dbUser =
      (await prisma.user.findUnique({
        where: { appwrite_user_id: appwriteUser.$id },
        include: { gym: true },
      })) ??
      (await ensureUserRecord({
        appwriteUser,
        provider: "email",
        correlationId,
      }));

    redirectTo = routeForUser(dbUser);
    logEvent("info", "auth.login.completed", {
      correlationId,
      userId: dbUser.id,
      tenantId: dbUser.tenant_id,
      gymId: dbUser.gym_id,
    });
  } catch (error) {
    logEvent("warn", "auth.login.route_resolution_failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
    });
  }

  redirect(redirectTo);
}

export async function signOut() {
  const correlationId = createCorrelationId();

  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
  } catch {
    // Session may already be invalid.
  }

  try {
    await deleteSessionCookie();
    logEvent("info", "auth.logout.completed", { correlationId });
  } catch {
    // Cookie may already be gone.
  }

  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !z.string().email().safeParse(email).success) {
    return { error: "Please enter a valid email address" };
  }

  try {
    const { account } = await createAdminClient();
    await account.createRecovery(email, `${env.NEXT_PUBLIC_APP_URL}/auth/reset-password`);
  } catch {
    // Avoid account enumeration.
  }

  return {
    success: "If an account exists with that email, you'll receive a password reset link.",
  };
}

export async function getCurrentUser() {
  const context = await getCurrentContext();
  return context?.user ?? null;
}

export async function getCurrentGym() {
  const context = await getCurrentContext();
  return context?.gym ?? null;
}
