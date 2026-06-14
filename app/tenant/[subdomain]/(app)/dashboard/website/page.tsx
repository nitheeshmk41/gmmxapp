import { getWebsiteSettings } from "@/features/website/actions";
import { getCurrentGym } from "@/features/auth/actions";
import { WebsiteClientPage } from "./client";

export default async function WebsitePage() {
  const [settings, gym] = await Promise.all([getWebsiteSettings(), getCurrentGym()]);
  return <WebsiteClientPage settings={settings as never} gym={gym as never} />;
}
