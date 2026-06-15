import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Scan } from "lucide-react";

export default async function AttendanceScanPage() {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Scan QR Code"
        description="Point a camera at a member's QR code to check them in."
        breadcrumbs={[
          { label: "Dashboard", href: "/owner/dashboard" },
          { label: "Attendance", href: "/owner/dashboard/attendance" },
          { label: "Scan QR" },
        ]}
      />
      <EmptyState
        icon={Scan}
        title="Camera scan placeholder"
        description="The front-desk camera stream will initialize here to automatically process member arrivals."
      />
    </div>
  );
}
