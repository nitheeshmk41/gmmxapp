import { getCurrentGym } from "@/features/auth/actions";
import { ThemeClientPage } from "./client";

export default async function WebsiteThemePage() {
  const gym = await getCurrentGym();
  return <ThemeClientPage gym={gym as any} />;
}
