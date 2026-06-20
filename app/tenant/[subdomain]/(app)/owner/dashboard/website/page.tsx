import { redirect } from "next/navigation";

export default async function WebsitePage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  redirect(`/tenant/${subdomain}/owner/dashboard/website/publish`);
}
