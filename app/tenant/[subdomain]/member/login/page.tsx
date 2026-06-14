import { TenantLoginForm } from "@/features/auth/components/tenant-login-form";
import { getTenantBySubdomain } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { Dumbbell } from "lucide-react";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function MemberLoginPage({ params }: Props) {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 mb-6">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.name} className="w-10 h-10 object-contain" />
            ) : (
              <Dumbbell className="w-8 h-8 text-[#FF5C73]" />
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Member Login
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Access your membership at {tenant.name}
          </p>
        </div>

        <div className="p-8">
          <TenantLoginForm roleType="member" />
        </div>
      </div>
    </div>
  );
}
