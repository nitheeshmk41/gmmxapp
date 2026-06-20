import { getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import WelcomeDashboard from "../../WelcomeDashboard";

export default async function WebsiteSetupPage() {
  const gym = await getCurrentGym();
  if (!gym) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-muted-foreground)" }}>Failed to load gym context.</p>
      </div>
    );
  }

  const { databases } = await createAdminClient();
  
  const [settingsRes, profileRes, sectionsRes] = await Promise.all([
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, [Query.equal("gymId", gym.$id)]),
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_PROFILE, [Query.equal("gymId", gym.$id)]),
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.WEBSITE_SECTIONS, [
      Query.equal("gymId", gym.$id),
      Query.equal("sectionKey", "hero")
    ]),
  ]);

  const settingsDoc = settingsRes.documents[0] || null;
  const profileDoc = profileRes.documents[0] || null;
  const heroSectionDoc = sectionsRes.documents[0] || null;

  let heroTitle = "";
  let heroSubtitle = "";
  if (heroSectionDoc?.contentJson) {
    try {
      const parsed = JSON.parse(heroSectionDoc.contentJson);
      heroTitle = parsed.title || "";
      heroSubtitle = parsed.subtitle || "";
    } catch (e) {}
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <WelcomeDashboard
        gymName={gym.name}
        subdomain={gym.subdomain}
        initialPhone={profileDoc?.phone || ""}
        initialAddress={profileDoc?.address || ""}
        initialHeroTitle={heroTitle}
        initialHeroSubtitle={heroSubtitle}
        initialLogoFileId={settingsDoc?.logoFileId || ""}
      />
    </div>
  );
}
