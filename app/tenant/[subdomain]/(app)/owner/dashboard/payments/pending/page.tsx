import { getPayments } from "@/features/payments/actions";
import { getMembers } from "@/features/members/actions";
import { getPlans } from "@/features/plans/actions";
import { PaymentsClientPage } from "../client";

interface PageProps {
  searchParams: Promise<{ search?: string; method?: string; page?: string }>;
}

export default async function PendingPaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const method = params.method || "all";
  const page = Number(params.page) || 1;

  // Force status="pending"
  const [{ data: payments, total }, members, plans] = await Promise.all([
    getPayments({ search, method, status: "pending", page, pageSize: 20 }),
    getMembers({ pageSize: 200 }),
    getPlans(),
  ]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pending Payments</h2>
        <p className="text-sm text-slate-500 mt-1">Review and follow up on outstanding payments.</p>
      </div>
      <PaymentsClientPage
        payments={payments as never}
        total={total}
        page={page}
        members={(members.data as never) || []}
        plans={plans as never}
      />
    </div>
  );
}
