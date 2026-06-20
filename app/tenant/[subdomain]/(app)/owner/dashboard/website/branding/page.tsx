import { getCurrentGym } from "@/features/auth/actions";
import { getWebsiteSettings } from "@/features/website/actions";
import { BrandingClient } from "./client";

export default async function BrandingPage() {
  const gym = await getCurrentGym();
  if (!gym) return null;

  const { settings } = await getWebsiteSettings();

  return (
    <BrandingClient 
      gymName={gym.name}
      initialLogoFileId={settings?.logoFileId || ""}
    />
  );
}
