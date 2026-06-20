import { getCurrentGym } from "@/features/auth/actions";
import { WebsiteBuilderTabs } from "./WebsiteBuilderTabs";

export default async function WebsiteBuilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const gym = await getCurrentGym();

  if (!gym) {
    return <div>Gym not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-6 animate-in">
      <WebsiteBuilderTabs subdomain={subdomain} />
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
