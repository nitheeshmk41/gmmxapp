import { PageHeader } from "@/components/dashboard/page-header";

import { SectionsManagerClient } from "@/components/website-builder/SectionsManagerClient";

export default function SectionsPage() {
  return (
    <div className="space-y-5 animate-in fade-in">
      <SectionsManagerClient />
    </div>
  );
}