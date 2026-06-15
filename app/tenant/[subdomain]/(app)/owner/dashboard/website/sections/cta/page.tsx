import { PageHeader } from "@/components/dashboard/page-header";

export default function PlaceholderPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Under Construction" description="This page is coming soon." />
      <div className="p-5 rounded-2xl bg-white border border-slate-200">
        <p className="text-sm text-slate-500">Settings coming soon.</p>
      </div>
    </div>
  );
}