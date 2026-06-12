import { Client, Account, Databases, Storage, Users } from "node-appwrite";
import { cookies } from "next/headers";
import { env, getAppwriteAdminKey } from "@/lib/env";

/**
 * Create an Appwrite client authenticated with the current user's session cookie.
 * Used in server components and server actions for user-scoped operations.
 *
 * @throws Error if no session cookie is found.
 */
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const cookieStore = await cookies();
  const session = cookieStore.get(
    `a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  );

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

/**
 * Create an Appwrite client authenticated with the project API key.
 * Used for admin operations like password recovery, user management.
 *
 * Requires NEXT_APPWRITE_KEY to be set in environment variables.
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(getAppwriteAdminKey());

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get users() {
      return new Users(client);
    },
  };
}

/**
 * Helper to bypass node-appwrite SDK stripping headers.
 * Extracts the real session secret from the Appwrite Set-Cookie header.
 */
function extractSessionSecret(res: Response): string {
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  console.log("[Appwrite Auth] Raw getSetCookie array:", setCookies);

  const cookieStr = Array.isArray(setCookies) ? setCookies.find((c) => c.startsWith(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}=`)) : setCookies;
  
  if (!cookieStr) {
    const fallback = res.headers.get("set-cookie");
    console.log("[Appwrite Auth] Fallback set-cookie header:", fallback);
    if (fallback) {
       const match = fallback.match(new RegExp(`a_session_${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}=([^;]+)`));
       if (match) {
         console.log("[Appwrite Auth] Extracted secret via fallback regex");
         return match[1];
       }
    }
    throw new Error("No session cookie returned from Appwrite");
  }
  
  let secret = "";
  if (typeof cookieStr === "string") {
    const rawValue = cookieStr.split(";")[0]; // "a_session_...=eyJ..."
    const equalIndex = rawValue.indexOf("=");
    if (equalIndex !== -1) {
      secret = rawValue.substring(equalIndex + 1);
    }
  }
  console.log("[Appwrite Auth] Extracted secret via primary split");
  
  if (!secret) throw new Error("Could not parse session cookie from Appwrite");
  return secret;
}

export async function exchangeOAuthTokenForSession(userId: string, secret: string) {
  const res = await fetch(`${env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account/sessions/token`, {
    method: "POST",
    headers: {
      "X-Appwrite-Project": env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, secret }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to exchange OAuth token");
  }

  return extractSessionSecret(res);
}

export async function createEmailPasswordSessionHelper(email: string, password: string) {
  const res = await fetch(`${env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account/sessions/email`, {
    method: "POST",
    headers: {
      "X-Appwrite-Project": env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create email session");
  }

  return extractSessionSecret(res);
}
