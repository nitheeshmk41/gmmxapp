import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users } from "lucide-react";

export default async function SettingsStaffPage() {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Staff Management"
        description="Invite and manage staff roles (trainers, managers) for your gym."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Staff" },
        ]}
      />
      <EmptyState
        icon={Users}
        title="Invite your first staff member"
        description="Delegate admin panel accesses, client training assignments, and manager capabilities."
      />
    </div>
  );
}
