import { getCurrentGym } from "@/features/auth/actions";
import { getLeads } from "@/features/leads/actions";
import { WebsiteClientPage } from "./client";

export default async function WebsitePage() {
  const gym = await getCurrentGym();
  const { data: leads } = await getLeads({});
  const websiteLeads = leads.filter(l => l.source?.toLowerCase() === "website").length;

  return <WebsiteClientPage gym={gym as any} leadCount={websiteLeads} />;
}
