import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Palette } from "lucide-react";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="Theme Settings" 
        description="Customize the primary colors and fonts of your site." 
      />
      <EmptyState 
        icon={Palette}
        title="Coming Soon"
        description="This module is part of the future GMMX roadmap. Stay tuned!"
      />
    </div>
  );
}
