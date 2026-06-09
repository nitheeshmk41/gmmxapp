import { getExpiringMembers } from "@/features/expiry/actions";
import { getPlans } from "@/features/plans/actions";
import { ExpiryClientPage } from "./client";

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function ExpiryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = (params.filter as "today" | "week" | "month" | "expired") || "week";

  const [members, plans] = await Promise.all([
    getExpiringMembers(filter),
    getPlans(),
  ]);

  return <ExpiryClientPage members={members as never} plans={plans as never} filter={filter} />;
}
