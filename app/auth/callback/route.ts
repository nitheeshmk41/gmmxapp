import { ensureUserRecord, routeForUser } from "@/lib/auth/bootstrap";
import { env, getBaseUrl } from "@/lib/env";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { Account, Client } from "node-appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";

export async function GET(request: Request) {
  const correlationId = createCorrelationId();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const origin = getBaseUrl();

  if (!userId || !secret) {
    logEvent("warn", "auth.oauth.callback_missing_params", { correlationId });
    return NextResponse.redirect(`${origin}/signin?error=auth_callback_failed`);
  }

  try {
    // The secret from OAuth callback is a short-lived token that must be exchanged for a real session
    const client = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
      
    const account = new Account(client);
    
    console.log(`[OAuth Callback] Exchanging token for session for user ${userId}`);
    const session = await account.createSession(userId, secret);
    
    // Now we have the real session secret
    const sessionSecret = session.secret;
    
    // Set the session explicitly on the server client
    client.setSession(sessionSecret);
    
    // Fetch the user using the Admin API to avoid scope issues
    const { users } = await createAdminClient();
    const appwriteUser = await users.get(userId);
    
    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "google",
      correlationId,
    });

    let subdomain = null;
    if (dbUser.role === "owner" && dbUser.onboarding_status === "completed") {
      const { databases } = await createAdminClient();
      const { APPWRITE_DB_ID, COLLECTIONS } = await import("@/lib/appwrite/types");
      const { Query } = await import("node-appwrite");
      
      const gymUsersRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.GYM_USERS,
        [Query.equal("userId", appwriteUser.$id)]
      );
      
      if (gymUsersRes.documents.length > 0) {
        const gymId = gymUsersRes.documents[0].gymId;
        try {
          const gym = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.GYMS, gymId);
          subdomain = gym.subdomain;
        } catch (e) {
          console.error("Failed to fetch gym for redirect", e);
        }
      }
    }

    logEvent("info", "auth.oauth.completed", {
      correlationId,
      userId: dbUser.id,
    });

    const path = routeForUser(dbUser);
    
    if (subdomain && path.includes("dashboard")) {
      const proto = origin.startsWith("http://localhost") ? "http" : "https";
      const baseDomain = origin.replace(/^https?:\/\//, "");
      const res = NextResponse.redirect(`${proto}://${subdomain}.${baseDomain}${path}`);
      res.cookies.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, sessionSecret, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
      return res;
    }

    const res = NextResponse.redirect(`${origin}${path}`);
    res.cookies.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, sessionSecret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    console.log(`[OAuth Callback] Session created for user ${userId}. Status: PRESENT`);
    return res;
  } catch (error) {
    logEvent("error", "auth.oauth.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
    });

    const errorMessage = error instanceof Error ? error.message : "unknown";
    return NextResponse.redirect(`${origin}/signin?error=auth_callback_failed&details=${encodeURIComponent(errorMessage)}`);
  }
}

