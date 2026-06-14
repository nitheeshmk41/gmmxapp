import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { History } from "lucide-react";

export default async function AttendanceHistoryPage() {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Attendance History"
        description="View check-in logs for all members."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Attendance", href: "/dashboard/attendance" },
          { label: "History" },
        ]}
      />
      <EmptyState
        icon={History}
        title="No historical logs found"
        description="When members check in via QR or manual marking, the history will be compiled here."
      />
    </div>
  );
}
