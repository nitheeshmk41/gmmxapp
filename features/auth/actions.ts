"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite/server";
import { ensureUserRecord, routeForUser } from "@/lib/auth/bootstrap";
import { getCurrentContext } from "@/lib/auth/context";
import { env } from "@/lib/env";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { Account, Client, ID, OAuthProvider, Query } from "node-appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { APPWRITE_DB_ID, COLLECTIONS, GymUserDocument } from "@/lib/appwrite/types";

const sendOtpSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters (include country code)"),
});

const verifyOtpSchema = z.object({
  userId: z.string().min(1, "User ID is missing"),
  secret: z.string().min(6, "OTP must be 6 digits"),
});

const emailSignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const emailSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

  let redirectUrl: string;
  try {
    redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Google,
      `${appUrl}/auth/callback`,
      `${appUrl}/signin?error=oauth_failed`
    );
  } catch (error: any) {
    console.error("[signInWithGoogle] Appwrite OAuth Error:", {
      message: error.message,
      code: error.code,
      type: error.type,
      response: error.response,
      raw: error,
    });
    redirect(`${appUrl}/signin?error=oauth_configuration_error`);
  }

  redirect(redirectUrl);
}

export async function signUpWithEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = emailSignUpSchema.safeParse({ name, email, password });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const account = getAuthClient();
  const correlationId = createCorrelationId();
  let redirectTo = "/onboarding";

  try {
    // 1. Create Appwrite User
    await account.create(ID.unique(), email, password, name);
    
    // 2. Create Session
    const session = await account.createEmailPasswordSession(email, password);
    await setSessionCookie(session.secret);

    // 3. Sync User Record
    const { account: sessionAccount } = await createSessionClient();
    const appwriteUser = await sessionAccount.get();
    
    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "email",
      correlationId,
    });
    
    redirectTo = routeForUser({
      role: dbUser.role || "owner",
      onboarding_status: dbUser.onboarding_status || "pending",
    });
  } catch (error: any) {
    console.error("[signUpWithEmail] Error:", error.message);
    return { error: error.message || "Failed to create account" };
  }

  redirect(redirectTo);
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = emailSignInSchema.safeParse({ email, password });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const account = getAuthClient();
  const correlationId = createCorrelationId();
  let redirectTo = "/dashboard";

  try {
    const session = await account.createEmailPasswordSession(email, password);
    await setSessionCookie(session.secret);

    const { account: sessionAccount } = await createSessionClient();
    const appwriteUser = await sessionAccount.get();
    
    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "email",
      correlationId,
    });

    // Check if user is linked to a gym for domain redirection
    let subdomain = null;
    if (dbUser.role === "owner" && dbUser.onboarding_status === "completed") {
      const { databases } = await createAdminClient();
      const gymUsersRes = await databases.listDocuments<GymUserDocument>(
        APPWRITE_DB_ID,
        COLLECTIONS.GYM_USERS,
        [Query.equal("userId", appwriteUser.$id)]
      );
      
      if (gymUsersRes.documents.length > 0) {
        const gymId = gymUsersRes.documents[0].gymId;
        const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId);
        subdomain = gym.subdomain;
      }
    }

    const path = routeForUser({
      role: dbUser.role || "owner",
      onboarding_status: dbUser.onboarding_status || "pending",
      gymId: null
    });
    
    if (subdomain && path === "/dashboard") {
      const appUrl = await getAppUrl();
      const baseDomain = appUrl.replace(/^https?:\/\//, "");
      const proto = appUrl.startsWith("https") ? "https" : "http";
      redirectTo = `${proto}://${subdomain}.${baseDomain}${path}`;
    } else {
      redirectTo = path;
    }
  } catch (error: any) {
    console.error("[signInWithEmail] Error:", error.message);
    return { error: "Invalid email or password." };
  }

  // Next.js redirect needs absolute URLs for cross-domain tenant routing
  // But relative URLs for same-domain
  if (redirectTo.startsWith("http")) {
    // If we're changing subdomain, we must redirect
    redirect(redirectTo);
  } else {
    redirect(redirectTo);
  }
}

export async function sendOtp(formData: FormData) {
  const phone = formData.get("phone") as string;
  const parsed = sendOtpSchema.safeParse({ phone });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const account = getAuthClient();

  try {
    const token = await account.createPhoneToken(ID.unique(), phone);
    return { success: true, userId: token.userId };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to send OTP" };
  }
}

export async function verifyOtp(formData: FormData) {
  const correlationId = createCorrelationId();
  const userId = formData.get("userId") as string;
  const secret = formData.get("secret") as string;
  
  const parsed = verifyOtpSchema.safeParse({ userId, secret });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const account = getAuthClient();

  let redirectTo = "/dashboard";
  
  try {
    const session = await account.createSession(userId, secret);
    await setSessionCookie(session.secret);
    
    const { account: sessionAccount } = await createSessionClient();
    const appwriteUser = await sessionAccount.get();

    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "phone",
      correlationId,
    });

    const { databases } = await createAdminClient();
    const gymUsersRes = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [Query.equal("userId", appwriteUser.$id)]
    );

    const gymUser = gymUsersRes.documents.length > 0 ? gymUsersRes.documents[0] : null;

    redirectTo = routeForUser({
      role: gymUser?.role || "OWNER",
      onboarding_status: dbUser.onboarding_status || "completed",
      gymId: gymUser?.gymId
    });
  } catch (error: unknown) {
    console.error("OTP verification failed", error);
    return { error: "Invalid OTP or OTP expired." };
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
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const isRoot = host.includes("gmmx.app") && !host.match(/^[a-zA-Z0-9-]+\.gmmx\.app/);
  
  redirect(isRoot || host.includes("localhost") ? "/signin" : "/login");
}

export async function getCurrentUser() {
  const context = await getCurrentContext();
  return context?.user ?? null;
}

export async function getCurrentGym() {
  const context = await getCurrentContext();
  return context?.gym ?? null;
}
