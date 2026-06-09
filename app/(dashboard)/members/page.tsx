import Link from "next/link";
import { getMembers } from "@/features/members/actions";
import { MembersClientPage } from "./client";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; plan?: string; page?: string }>;
}

export default async function MembersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "all";
  const plan_id = params.plan || "all";
  const page = Number(params.page) || 1;

  const { data: members, total } = await getMembers({ search, status, plan_id, page, pageSize: 20 });

  return (
    <MembersClientPage
      members={members as never}
      total={total}
      page={page}
      search={search}
      status={status}
    />
  );
}
