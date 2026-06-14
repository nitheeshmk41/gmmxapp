import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CreditCard } from "lucide-react";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="Website Plans" 
        description="Manage membership plans displayed on your site." 
      />
      <EmptyState 
        icon={CreditCard}
        title="Coming Soon"
        description="This module is part of the future GMMX roadmap. Stay tuned!"
      />
    </div>
  );
}
