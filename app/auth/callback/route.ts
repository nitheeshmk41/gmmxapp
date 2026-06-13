import { ensureUserRecord, routeForUser } from "@/lib/auth/bootstrap";
import { env } from "@/lib/env";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { Account, Client } from "node-appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exchangeOAuthTokenForSession } from "@/lib/appwrite/server";

export async function GET(request: Request) {
  const correlationId = createCorrelationId();
  const { searchParams, origin } = new URL(request.url);
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  if (!userId || !secret) {
    logEvent("warn", "auth.oauth.callback_missing_params", { correlationId });
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  try {
    console.log(`[OAuth Callback] Attempting to exchange token for user ${userId}`);

    const sessionSecret = await exchangeOAuthTokenForSession(userId, secret);
    
    console.log(`[OAuth Callback] Session created successfully for user ${userId}`);

    const cookieStore = await cookies();
    cookieStore.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, sessionSecret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    const sessionClient = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(sessionSecret);

    const sessionAccount = new Account(sessionClient);
    const appwriteUser = await sessionAccount.get();
    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "google",
      correlationId,
    });

    logEvent("info", "auth.oauth.completed", {
      correlationId,
      userId: dbUser.id,
    });

    return NextResponse.redirect(`${origin}${routeForUser(dbUser)}`);
  } catch (error) {
    logEvent("error", "auth.oauth.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
    });

    const errorMessage = error instanceof Error ? error.message : "unknown";
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed&details=${encodeURIComponent(errorMessage)}`);
  }
}

