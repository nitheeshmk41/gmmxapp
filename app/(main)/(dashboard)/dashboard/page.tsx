import { redirect } from "next/navigation";
import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { routeForUser } from "@/lib/auth/bootstrap";

export default async function DashboardRedirectPage() {
  const context = await getCurrentContext();
  if (!context) {
    redirect("/signin");
  }

  const user = context.user;

  if (user.role === "super_admin") {
    redirect("/admin/dashboard");
  }

  if (user.onboarding_status !== "completed") {
    redirect("/onboarding");
  }

  // Find user's gym subdomain to redirect them
  try {
    const { databases } = await createAdminClient();
    const gymUsersRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      [Query.equal("userId", user.id), Query.limit(1)]
    );

    if (gymUsersRes.documents.length > 0) {
      const gymId = gymUsersRes.documents[0].gymId;
      const gym = await databases.getDocument(
        APPWRITE_DB_ID,
        COLLECTIONS.GYMS,
        gymId
      );
      if (gym && gym.subdomain) {
        const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";
        const proto = process.env.NODE_ENV === "production" ? "https" : "http";
        
        let host = `${gym.subdomain}.${appDomain}`;
        if (process.env.NODE_ENV !== "production") {
          // Detect port or use default 3000
          host = `${gym.subdomain}.localhost:3000`;
        }
        
        const path = routeForUser(user);
        redirect(`${proto}://${host}${path}`);
      }
    }
  } catch (error) {
    console.error("[DashboardRedirectPage] Redirect resolution error:", error);
  }

  // Fallback to onboarding if no gym found
  redirect("/onboarding");
}
