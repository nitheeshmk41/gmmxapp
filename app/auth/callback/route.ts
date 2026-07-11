import { ensureUserRecord, routeForUser } from "@/lib/auth/bootstrap";
import { env, getBaseUrl } from "@/lib/env";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { Account, Client } from "node-appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient, createOAuthSessionHelper } from "@/lib/appwrite/server";

export async function GET(request: Request) {
  const correlationId = createCorrelationId();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const origin = getBaseUrl();

  console.log("Host:", request.headers.get("host"));
  console.log("Origin:", request.headers.get("origin"));
  console.log("Callback URL:", request.url);
  console.log("Base URL:", origin);
  console.log("Has secret:", !!secret);

  if (!userId || !secret) {
    logEvent("warn", "auth.oauth.callback_missing_params", { correlationId });
    return NextResponse.redirect(`${origin}/signin?error=auth_callback_failed`);
  }

  try {
    // The secret from OAuth callback is a short-lived token that must be exchanged for a real session
    // Appwrite's node SDK strips the session secret from the response object for security reasons,
    // so we MUST use a helper that parses the Set-Cookie header directly from the API response.
    console.log(`[OAuth Callback] Exchanging token for session for user ${userId}`);
    const sessionSecret = await createOAuthSessionHelper(userId, secret);
    
    // Create a NEW client instance for session-authenticated requests
    const sessionClient = new Client()
      .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(sessionSecret);
      
    const sessionAccount = new Account(sessionClient);
    
    // Fetch the user using the properly authenticated session client
    const appwriteUser = await sessionAccount.get();
    
    const dbUser = await ensureUserRecord({
      appwriteUser,
      provider: "google",
      correlationId,
    });

    let subdomain = null;
    let userRole = dbUser.role || "owner";
    let onboardingStatus = dbUser.onboarding_status || "pending";

    const { databases } = await createAdminClient();
    const { APPWRITE_DB_ID, COLLECTIONS } = await import("@/lib/appwrite/types");
    const { Query } = await import("node-appwrite");
      
      const gymUsersRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.GYM_USERS,
        [Query.equal("userId", appwriteUser.$id)]
      );
      
      if (gymUsersRes.documents.length > 0) {
        userRole = gymUsersRes.documents[0].role;
        const gymId = gymUsersRes.documents[0].gymId;
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

    logEvent("info", "auth.oauth.completed", {
      correlationId,
      userId: dbUser.id,
    });

    const path = routeForUser({
      role: userRole,
      onboarding_status: onboardingStatus,
      gymId: null
    });
    
    if (subdomain && path.includes("dashboard")) {
      const proto = origin.startsWith("http://localhost") ? "http" : "https";
      const baseDomain = origin.replace(/^https?:\/\//, "");
      const res = NextResponse.redirect(`${proto}://${subdomain}.${baseDomain}${path}`);
      
      const host = request.headers.get("host") || "";
      const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
      const cookieDomain = isLocalhost ? "localhost" : `.${env.NEXT_PUBLIC_APP_DOMAIN}`;
      
      res.cookies.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, sessionSecret, {
        path: "/",
        domain: cookieDomain,
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
      return res;
    }

    const res = NextResponse.redirect(`${origin}${path}`);
    const host = request.headers.get("host") || "";
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    const cookieDomain = isLocalhost ? "localhost" : `.${env.NEXT_PUBLIC_APP_DOMAIN}`;
    
    res.cookies.set(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, sessionSecret, {
      path: "/",
      domain: cookieDomain,
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

