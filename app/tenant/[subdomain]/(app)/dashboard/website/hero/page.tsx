import { getCurrentGym } from "@/features/auth/actions";
import { HeroClientPage } from "./client";

export default async function WebsiteHeroPage() {
  const gym = await getCurrentGym();
  return <HeroClientPage gym={gym as any} />;
}
