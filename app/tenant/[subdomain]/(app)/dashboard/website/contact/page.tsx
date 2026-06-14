import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Phone } from "lucide-react";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="Contact Info" 
        description="Update your phone, email, and location details." 
      />
      <EmptyState 
        icon={Phone}
        title="Coming Soon"
        description="This module is part of the future GMMX roadmap. Stay tuned!"
      />
    </div>
  );
}
