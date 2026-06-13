"use server";

import { createAdminClient, createSessionClient, createEmailPasswordSessionHelper } from "@/lib/appwrite/server";
import { ensureUserRecord, routeForUser } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { env } from "@/lib/env";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { Account, Client, ID, OAuthProvider, Query } from "node-appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { APPWRITE_DB_ID, COLLECTIONS, GymUserDocument } from "@/lib/appwrite/types";

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
    
    // Create the DB User record
    await ensureUserRecord({
      appwriteUser,
      provider: "email",
      correlationId,
    });
    
    logEvent("info", "auth.signup.completed", {
      correlationId,
      appwriteUserId: appwriteUser.$id,
    });
  } catch (error: unknown) {
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

  try {
    const sessionSecret = await createEmailPasswordSessionHelper(
      parsed.data.email,
      parsed.data.password
    );
    await setSessionCookie(sessionSecret);
  } catch (error: unknown) {
    return { error: "Invalid email or password" };
  }

  let redirectTo = "/dashboard";

  try {
    const { account: sessionAccount } = await createSessionClient();
    const appwriteUser = await sessionAccount.get();

    const { databases } = await createAdminClient();
    const gymUsersRes = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [Query.equal("userId", appwriteUser.$id)]
    );

    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "email",
      correlationId,
    });

    const gymUser = gymUsersRes.documents.length > 0 ? gymUsersRes.documents[0] : null;

    redirectTo = routeForUser({
      role: gymUser?.role || "OWNER",
      onboarding_status: dbUser.onboarding_status || "completed", // Fallback to completed for now
      gymId: gymUser?.gymId
    });
    
  } catch (error) {
    console.error("Route resolution failed", error);
  }

  redirect(redirectTo);
}

export async function signOut() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
  } catch {}
  try {
    await deleteSessionCookie();
  } catch {}
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
  } catch {}
  return { success: "If an account exists with that email, you'll receive a password reset link." };
}

export async function getCurrentUser() {
  const context = await getCurrentContext();
  return context?.user ?? null;
}

export async function getCurrentGym() {
  const context = await getCurrentContext();
  return context?.gym ?? null;
}
