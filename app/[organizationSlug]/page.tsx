import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ organizationSlug: string }>;
}

export default async function OrgRootPage({ params }: Props) {
  const { organizationSlug } = await params;
  redirect(`/${organizationSlug}/dashboard`);
}
