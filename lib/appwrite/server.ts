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
