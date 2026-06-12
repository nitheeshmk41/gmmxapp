import { ensureOwnerWorkspace, routeForUser } from "@/lib/auth/bootstrap";
import { env } from "@/lib/env";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { Account, Client } from "node-appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
    const client = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const account = new Account(client);
    const session = await account.createSession(userId, secret);

    const cookieStore = await cookies();
    cookieStore.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    const sessionClient = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(session.secret);

    const sessionAccount = new Account(sessionClient);
    const appwriteUser = await sessionAccount.get();
    const dbUser = await ensureOwnerWorkspace({
      appwriteUser,
      provider: "google",
      correlationId,
    });

    logEvent("info", "auth.oauth.completed", {
      correlationId,
      userId: dbUser.id,
      tenantId: dbUser.tenant_id,
      gymId: dbUser.gym_id,
    });

    return NextResponse.redirect(`${origin}${routeForUser(dbUser)}`);
  } catch (error) {
    logEvent("error", "auth.oauth.failed", {
      correlationId,
      reason: error instanceof Error ? error.message : "unknown",
    });

    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }
}

