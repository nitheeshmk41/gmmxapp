import { redirect } from "next/navigation";
import { getCurrentContext } from "@/lib/auth/context";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

/**
 * Generic /dashboard page — resolves the authenticated user's org slug
 * and redirects to the new path-based URL: /{slug}/dashboard
 */
export default async function DashboardRedirectPage() {
  const context = await getCurrentContext();
  if (!context) {
    redirect("/signin?redirectTo=/dashboard");
  }

  const user = context.user;

  if (user.role === "super_admin") {
    redirect("/admin/dashboard");
  }

  if (user.onboarding_status !== "completed") {
    redirect("/onboarding");
  }

  // Find user's gym slug to redirect them to the path-based dashboard
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
      if (gym?.subdomain) {
        // New path-based redirect: gmmx.app/{slug}/dashboard
        redirect(`/${gym.subdomain}/dashboard`);
      }
    }
  } catch (error) {
    console.error("[DashboardRedirectPage] Redirect resolution error:", error);
  }

  // Fallback to onboarding if no gym found
  redirect("/onboarding");
}
