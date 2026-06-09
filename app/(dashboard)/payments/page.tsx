import { getPayments } from "@/features/payments/actions";
import { getMembers } from "@/features/members/actions";
import { getPlans } from "@/features/plans/actions";
import { PaymentsClientPage } from "./client";

interface PageProps {
  searchParams: Promise<{ search?: string; method?: string; status?: string; page?: string }>;
}

export default async function PaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const method = params.method || "all";
  const status = params.status || "all";
  const page = Number(params.page) || 1;

  const [{ data: payments, total }, members, plans] = await Promise.all([
    getPayments({ search, method, status, page, pageSize: 20 }),
    getMembers({ pageSize: 200 }),
    getPlans(),
  ]);

  return (
    <PaymentsClientPage
      payments={payments as never}
      total={total}
      page={page}
      members={(members.data as never) || []}
      plans={plans as never}
    />
  );
}
