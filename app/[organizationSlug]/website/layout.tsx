import { getCurrentGym } from "@/features/auth/actions";
import { OrgWebsiteBuilderTabs } from "./org-website-tabs";

export default async function OrgWebsiteBuilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const gym = await getCurrentGym();

  if (!gym) {
    return <div>Gym not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-6 animate-in">
      <OrgWebsiteBuilderTabs organizationSlug={organizationSlug} gymSubdomain={gym.subdomain} />
      <div className="pt-2">{children}</div>
    </div>
  );
}
