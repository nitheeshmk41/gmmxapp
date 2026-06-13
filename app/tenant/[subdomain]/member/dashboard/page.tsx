import { getTenantBySubdomain } from "@/lib/tenant";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function MemberDashboardPage({ params }: Props) {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Member Dashboard</h1>
        <p className="text-slate-500">Welcome back to {tenant.name}</p>
        
        <div className="mt-8 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-600">Your membership details and attendance will appear here.</p>
        </div>
      </div>
    </div>
  );
}
