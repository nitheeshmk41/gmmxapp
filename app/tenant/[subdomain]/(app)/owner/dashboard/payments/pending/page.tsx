import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Clock } from "lucide-react";

export default async function PendingPaymentsPage() {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Pending Payments"
        description="Monitor outstanding dues and membership expirations needing renewal."
        breadcrumbs={[
          { label: "Dashboard", href: "/owner/dashboard" },
          { label: "Payments", href: "/owner/dashboard/payments" },
          { label: "Pending" },
        ]}
      />
      <EmptyState
        icon={Clock}
        title="No pending dues found"
        description="All member memberships are currently active and paid. Keep it up!"
      />
    </div>
  );
}
