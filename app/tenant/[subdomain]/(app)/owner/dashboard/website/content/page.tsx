import { getCurrentGym } from "@/features/auth/actions";
import { getWebsiteSettings } from "@/features/website/actions";
import { ContentClient } from "./client";

export default async function ContentPage() {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { profile, heroSection } = await getWebsiteSettings();

  return (
    <ContentClient 
      initialPhone={profile?.phone || ""}
      initialAddress={profile?.address || ""}
      initialHeroTitle={heroSection?.title || ""}
      initialHeroSubtitle={heroSection?.subtitle || ""}
    />
  );
}
