import { getCurrentGym } from "@/features/auth/actions";
import { ContentClientPage } from "./client";

export default async function WebsiteContentPage() {
  const gym = await getCurrentGym();
  return <ContentClientPage gym={gym as any} />;
}
