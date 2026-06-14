import { getTenantBySubdomain } from "@/lib/tenant";
import { notFound } from "next/navigation";

export async function MemberDashboard({ subdomain }: { subdomain: string }) {
  const tenant = await getTenantBySubdomain(subdomain);
  if (!tenant) notFound();

  return (
    <div className="space-y-8 animate-in max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-foreground)" }}>
            Member Dashboard
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
            Welcome back to {tenant.name}
          </p>
        </div>
      </div>
      <div className="mt-8 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-600">Your membership details and attendance will appear here.</p>
      </div>
    </div>
  );
}
