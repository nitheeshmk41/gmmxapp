import { redirect } from "next/navigation";

export default async function WebsitePlansPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  redirect(`/tenant/${subdomain}/dashboard/plans`);
}
