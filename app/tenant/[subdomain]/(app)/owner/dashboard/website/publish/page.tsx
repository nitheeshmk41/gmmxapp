import { getCurrentGym } from "@/features/auth/actions";
import { getWebsiteSettings } from "@/features/website/actions";
import { PublishClient } from "./client";

export default async function PublishPage() {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { settings, profile, heroSection } = await getWebsiteSettings();

  return (
    <PublishClient 
      gymName={gym.name}
      hasLogo={!!settings?.logoFileId}
      hasPhone={!!profile?.phone}
      hasHeroTitle={!!heroSection?.title}
      hasHeroSubtitle={!!heroSection?.subtitle}
    />
  );
}
