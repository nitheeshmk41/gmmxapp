import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Link } from "lucide-react";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="Integrations" 
        description="Connect WhatsApp, Razorpay, and SMS providers." 
      />
      <EmptyState 
        icon={Link}
        title="Coming Soon"
        description="This module is part of the future GMMX roadmap. Stay tuned!"
      />
    </div>
  );
}
