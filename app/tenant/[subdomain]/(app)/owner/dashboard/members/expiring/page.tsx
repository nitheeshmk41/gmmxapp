import { getMembers } from "@/features/members/actions";
import { MembersClientPage } from "../client";

interface PageProps {
  searchParams: Promise<{ search?: string; plan?: string; page?: string }>;
}

export default async function ExpiringMembersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const plan_id = params.plan || "all";
  const page = Number(params.page) || 1;

  // We pass 'expiring' as the status to get members expiring within 7 days
  const { data: members, total } = await getMembers({ search, status: "expiring", plan_id, page, pageSize: 20 });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Expiring Members</h2>
        <p className="text-sm text-slate-500 mt-1">Members whose plans are expiring in the next 7 days.</p>
      </div>
      <MembersClientPage
        members={members as never}
        total={total}
        page={page}
        search={search}
        status="expiring"
      />
    </div>
  );
}
