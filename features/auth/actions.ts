"use server";

import { createAdminClient, createSessionClient, createEmailPasswordSessionHelper } from "@/lib/appwrite/server";
import { ensureUserRecord, routeForUser } from "@/lib/auth/bootstrap";
import { getCurrentContext, getCurrentGym as getGymContext } from "@/lib/auth/context";
import { env, getBaseUrl } from "@/lib/env";
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


async function setSessionCookie(secret: string) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("host") || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const domain = isLocalhost ? undefined : `.${env.NEXT_PUBLIC_APP_DOMAIN}`;
  
  cookieStore.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, secret, {
    path: "/",
    ...(domain ? { domain } : {}),
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
}

async function setTenantCookie(subdomain: string, role: string) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("host") || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const domain = isLocalhost ? undefined : `.${env.NEXT_PUBLIC_APP_DOMAIN}`;
  
  cookieStore.set("gmmx_tenant", `${subdomain}:${role}`, {
    path: "/",
    ...(domain ? { domain } : {}),
    httpOnly: false, // Accessible by middleware if needed
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
}

async function deleteSessionCookie() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("host") || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const domain = isLocalhost ? undefined : `.${env.NEXT_PUBLIC_APP_DOMAIN}`;
  
  cookieStore.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, "", {
    path: "/",
    ...(domain ? { domain } : {}),
    expires: new Date(0),
  });
}

export async function signInWithGoogle() {
  const account = getAuthClient();
  let appUrl = getBaseUrl();
  try {
    const headerStore = await headers();
    const host = headerStore.get("host");
    if (host) {
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      appUrl = `${protocol}://${host}`;
    }
  } catch (err) {
    console.error("[signInWithGoogle] Error getting host header:", err);
  }

  console.log("[signInWithGoogle] Generating OAuth URLs using base URL:", appUrl);

  let redirectUrl: string;
  try {
    const successUrl = `${appUrl}/auth/callback`;
    const failureUrl = `${appUrl}/signin?error=oauth_failed`;
    console.log("[signInWithGoogle] Success URL:", successUrl);
    console.log("[signInWithGoogle] Failure URL:", failureUrl);

    redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );
  } catch (error: any) {
    console.error("[signInWithGoogle] Appwrite OAuth Error:", {
      message: error.message,
      code: error.code,
      type: error.type,
      response: error.response,
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
    const { users } = await createAdminClient();
    await users.create(ID.unique(), email, undefined, password, name);
    
    // 2. Create Session
    const sessionSecret = await createEmailPasswordSessionHelper(email, password);
    await setSessionCookie(sessionSecret);

    // 3. Sync User Record (avoid createSessionClient to bypass cookie propagation delay)
    const sessionClient = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(sessionSecret);
    
    const sessionAccount = new Account(sessionClient);
    const appwriteUser = await sessionAccount.get();
    
    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "email",
      correlationId,
    });
    
    let subdomain = null;
    let userRole = dbUser.role || "owner";
    let onboardingStatus = dbUser.onboarding_status || "pending";

    const { databases } = await createAdminClient();
    
    // Check GymUserDocument
    const gymUsersRes = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [Query.equal("userId", appwriteUser.$id)]
    );
    
    if (gymUsersRes.documents.length > 0) {
      const gymUser = gymUsersRes.documents[0];
      userRole = gymUser.role; // OWNER, TRAINER, MEMBER
      onboardingStatus = "completed";
      
      const gymId = gymUser.gymId;
      try {
        const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId);
        subdomain = gym.subdomain;
      } catch (e) {
        console.error("Failed to fetch gym for redirect", e);
      }
    } else {
      const queries = [];
      if (appwriteUser.email && !appwriteUser.email.endsWith('@phone.gmmx.app')) {
        queries.push(Query.equal("email", appwriteUser.email));
      } else if (appwriteUser.email && appwriteUser.email.endsWith('@phone.gmmx.app')) {
        queries.push(Query.equal("phone", appwriteUser.email.split('@')[0]));
      }

      if (queries.length > 0) {
        const memberRes = await databases.listDocuments(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERS,
          queries
        );

        if (memberRes.documents.length > 0) {
          userRole = "member";
          onboardingStatus = "completed"; // BYPASS ONBOARDING
          
          try {
            const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, memberRes.documents[0].gymId);
            subdomain = gym.subdomain;
          } catch (e) {
            console.error("Failed to fetch gym for member redirect", e);
          }
        }
      }
    }

    if (subdomain) {
      await setTenantCookie(subdomain, userRole);
    }

    // New path-based routing: redirect to /{slug}/dashboard or /{slug}/member/dashboard etc.
    if (subdomain && onboardingStatus === "completed") {
      const r = (userRole || "").toUpperCase();
      if (r === "TRAINER") {
        redirectTo = `/${subdomain}/trainer/dashboard`;
      } else if (r === "MEMBER") {
        redirectTo = `/${subdomain}/member/dashboard`;
      } else {
        redirectTo = `/${subdomain}/dashboard`;
      }
    } else if (onboardingStatus !== "completed") {
      redirectTo = "/onboarding";
    } else {
      redirectTo = "/dashboard";
    }
  } catch (error: any) {
    console.error("[signUpWithEmail] Error:", error.message);
    return { error: error.message || "Failed to create account" };
  }

  redirect(redirectTo);
}

export async function signInWithEmail(formData: FormData) {
  console.log("[signInWithEmail] Step 1: Starting action");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = emailSignInSchema.safeParse({ email, password });
  if (!parsed.success) {
    console.log("[signInWithEmail] Step 1b: Validation failed");
    return { error: parsed.error.issues[0].message };
  }

  const account = getAuthClient();
  const correlationId = createCorrelationId();
  let redirectTo = "/owner/dashboard";

  try {
    console.log("[signInWithEmail] Step 2: Creating Appwrite session");
    const sessionSecret = await createEmailPasswordSessionHelper(email, password);
    
    console.log("[signInWithEmail] Step 3: Setting session cookie");
    await setSessionCookie(sessionSecret);

    console.log("[signInWithEmail] Step 4: Syncing user record");
    const sessionClient = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(sessionSecret);
    
    const sessionAccount = new Account(sessionClient);
    const appwriteUser = await sessionAccount.get();
    
    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "email",
      correlationId,
    });

    console.log("[signInWithEmail] Step 5: Checking gym and role linked to user");
    let subdomain = null;
    let userRole = dbUser.role || "owner";
    let onboardingStatus = dbUser.onboarding_status || "pending";

    const { databases } = await createAdminClient();
    const gymUsersRes = await databases.listDocuments<GymUserDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [Query.equal("userId", appwriteUser.$id)]
    );
    
    if (gymUsersRes.documents.length > 0) {
      const gymUser = gymUsersRes.documents[0];
      userRole = gymUser.role; // OWNER, TRAINER, MEMBER
      onboardingStatus = "completed";
      
      const gymId = gymUser.gymId;
      try {
        const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId);
        subdomain = gym.subdomain;
      } catch (e) {
        console.error("Failed to fetch gym for redirect", e);
      }
    } else {
      const queries = [];
      if (appwriteUser.email && !appwriteUser.email.endsWith('@phone.gmmx.app')) {
        queries.push(Query.equal("email", appwriteUser.email));
      } else if (appwriteUser.email && appwriteUser.email.endsWith('@phone.gmmx.app')) {
        queries.push(Query.equal("phone", appwriteUser.email.split('@')[0]));
      }

      if (queries.length > 0) {
        const memberRes = await databases.listDocuments(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERS,
          queries
        );

        if (memberRes.documents.length > 0) {
          userRole = "member";
          onboardingStatus = "completed"; // BYPASS ONBOARDING
          
          try {
            const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, memberRes.documents[0].gymId);
            subdomain = gym.subdomain;
          } catch (e) {
            console.error("Failed to fetch gym for member redirect", e);
          }
        }
      }
    }

    console.log("[signInWithEmail] Step 6: Resolving post-login redirect");
    
    if (subdomain) {
      await setTenantCookie(subdomain, userRole);
    }

    // New path-based routing: redirect to /{slug}/dashboard or /{slug}/member/dashboard etc.
    if (subdomain && onboardingStatus === "completed") {
      console.log("[signInWithEmail] Step 7a: Path-based redirect to org dashboard");
      const r = (userRole || "").toUpperCase();
      if (r === "TRAINER") {
        redirectTo = `/${subdomain}/trainer/dashboard`;
      } else if (r === "MEMBER") {
        redirectTo = `/${subdomain}/member/dashboard`;
      } else {
        redirectTo = `/${subdomain}/dashboard`;
      }
    } else if (onboardingStatus !== "completed") {
      console.log("[signInWithEmail] Step 7b: Redirecting to onboarding");
      redirectTo = "/onboarding";
    } else {
      console.log("[signInWithEmail] Step 7c: Fallback redirect");
      redirectTo = "/dashboard";
    }
  } catch (error: any) {
    console.error("[signInWithEmail] Catch Block Error:", {
      message: error?.message,
      code: error?.code,
      type: error?.type,
      stack: error?.stack,
      raw: error
    });
    return { error: "Invalid email or password." };
  }

  console.log(`[signInWithEmail] Step 8: Triggering redirect to ${redirectTo}`);
  redirect(redirectTo);
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

  let redirectTo = "/owner/dashboard";
  
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

    if (gymUser) {
      try {
        const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymUser.gymId);
        if (gym.subdomain) {
          await setTenantCookie(gym.subdomain, gymUser.role);
        }
      } catch (e) {
        console.error("Failed to fetch gym in verifyOtp", e);
      }
    }

    // Resolve gym subdomain for path-based redirect
    let otpGymSubdomain: string | null = null;
    if (gymUser) {
      try {
        const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymUser.gymId);
        otpGymSubdomain = gym.subdomain || null;
        if (gym.subdomain) {
          await setTenantCookie(gym.subdomain, gymUser.role);
        }
      } catch (e) {
        console.error("[verifyOtp] Failed to fetch gym", e);
      }
    }

    if (otpGymSubdomain && dbUser.onboarding_status === "completed") {
      const r = (gymUser?.role || "MEMBER").toUpperCase();
      if (r === "TRAINER") {
        redirectTo = `/${otpGymSubdomain}/trainer/dashboard`;
      } else if (r === "MEMBER") {
        redirectTo = `/${otpGymSubdomain}/member/dashboard`;
      } else {
        redirectTo = `/${otpGymSubdomain}/dashboard`;
      }
    } else if (dbUser.onboarding_status !== "completed") {
      redirectTo = "/onboarding";
    }
  } catch (error: unknown) {
    console.error("OTP verification failed", error);
    return { error: "Invalid OTP or OTP expired." };
  }
  
  redirect(redirectTo);
}

export async function signOut() {
  // Always redirect to /signin after logout (single domain, no more subdomain-specific login pages)
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
  } catch {}
  try {
    await deleteSessionCookie();
  } catch {}
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();
    const host = headerStore.get("host") || "";
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    const domain = isLocalhost ? undefined : `.${env.NEXT_PUBLIC_APP_DOMAIN}`;
    cookieStore.set("gmmx_tenant", "", {
      path: "/",
      ...(domain ? { domain } : {}),
      expires: new Date(0),
    });
  } catch {}
  
  redirect("/signin");
}

export async function getCurrentUser() {
  const context = await getCurrentContext();
  return context?.user ?? null;
}

export async function getCurrentGym() {
  const context = await getGymContext();
  return context?.gym ?? null;
}

export async function changeInitialPassword(formData: FormData) {
  const password = formData.get("password") as string;
  if (!password || password.length < 8) return { error: "Password must be at least 8 characters" };
  
  const context = await getCurrentContext();
  if (!context) return { error: "Not authenticated" };
  
  try {
    const { users } = await createAdminClient();
    await users.updatePassword(context.user.id, password);
    
    const prefs = await users.getPrefs(context.user.id);
    await users.updatePrefs(context.user.id, {
      ...prefs,
      requiresPasswordChange: false
    });
  } catch (error: any) {
    return { error: error.message || "Failed to change password" };
  }
  
  // Appwrite invalidates sessions on password change.
  // We need to clear the cookie and redirect to login.
  await deleteSessionCookie();
  redirect("/owner/login");
}

export async function checkAuthMethod(email: string) {
  try {
    const { users } = await createAdminClient();
    const res = await users.list([Query.equal("email", email)]);
    if (res.total === 0) {
      return { error: "User not found" };
    }
    const user = res.users[0];
    
    const hasPassword = !!user.passwordUpdate;
    if (!hasPassword) {
      return { method: "google" };
    }
    return { method: "password" };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function sendPasswordCreationEmail(email: string, currentUrl?: string) {
  try {
    const client = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    const account = new Account(client);
    
    // We try to use the current URL to retain tenant context if provided, otherwise fallback to base
    let redirectUrl = currentUrl ? `${currentUrl}/owner/set-password` : `${getBaseUrl()}/owner/set-password`;
    
    // Ensure the redirect URL is valid (this might need to be added to Appwrite OAuth/Platform settings)
    await account.createRecovery(email, redirectUrl);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function completePasswordSetup(formData: FormData) {
  const userId = formData.get("userId") as string;
  const secret = formData.get("secret") as string;
  const password = formData.get("password") as string;
  const passwordAgain = formData.get("passwordAgain") as string;
  
  if (!userId || !secret || !password || !passwordAgain) {
    return { error: "Missing required fields" };
  }
  if (password !== passwordAgain) {
    return { error: "Passwords do not match" };
  }
  
  try {
    const client = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    const account = new Account(client);
    
    await account.updateRecovery(userId, secret, password);
    
    // Check if we need to remove the requiresPasswordChange flag
    const { users } = await createAdminClient();
    const prefs = await users.getPrefs(userId);
    if (prefs.requiresPasswordChange) {
      await users.updatePrefs(userId, { ...prefs, requiresPasswordChange: false });
    }
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to set password" };
  }
}
