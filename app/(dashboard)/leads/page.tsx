import { getLeads } from "@/features/leads/actions";
import { LeadsClientPage } from "./client";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "all";
  const page = Number(params.page) || 1;

  const { data: leads, total } = await getLeads({ search, status, page, pageSize: 25 });

  return <LeadsClientPage leads={leads as never} total={total} page={page} search={search} status={status} />;
}
