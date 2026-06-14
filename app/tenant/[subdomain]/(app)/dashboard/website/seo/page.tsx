import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="SEO Settings" 
        description="Optimize your website for search engines." 
      />
      <EmptyState 
        icon={Search}
        title="Coming Soon"
        description="This module is part of the future GMMX roadmap. Stay tuned!"
      />
    </div>
  );
}
