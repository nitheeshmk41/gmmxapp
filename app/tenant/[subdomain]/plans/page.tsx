import { notFound } from "next/navigation";
import { getTenantBySubdomain } from "@/lib/tenant";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, MembershipPlanDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function GymPlansPage({ params }: Props) {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  const { databases } = await createAdminClient();
  let plans: MembershipPlanDocument[] = [];

  try {
    const plansRes = await databases.listDocuments<MembershipPlanDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.PLANS,
      [Query.equal("gymId", tenant.id), Query.equal("isActive", true)]
    );
    plans = plansRes.documents;
  } catch (error) {
    console.error("Failed to fetch plans", error);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: "#0A0F1E", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0F1E]/90 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="w-9 h-9 rounded-xl object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "#FF5C73" }}>{tenant.name[0]}</div>
          )}
          <span className="font-bold text-white text-lg">{tenant.name}</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-[#FF5C73] hover:underline">
          ← Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">Membership Plans</h1>
          <p className="text-[#94A3B8] max-w-md mx-auto">Choose a plan that fits your schedule and fitness goals.</p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-16 text-[#94A3B8]">
            <Dumbbell className="mx-auto mb-4 w-12 h-12 text-slate-700" />
            <p>No active membership plans found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {plans.map((plan, i) => (
              <div
                key={plan.$id}
                className="p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between"
                style={{
                  background: i === 1 ? "linear-gradient(135deg, #FF5C73, #E64A61)" : "rgba(255,255,255,0.04)",
                  border: i === 1 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: i === 1 ? "0 20px 40px rgba(255,92,115,0.3)" : "none",
                }}
              >
                {i === 1 && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
                    Popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black text-white">₹{Number(plan.price).toLocaleString("en-IN")}</span>
                    <span className="text-sm text-slate-400">/ {plan.durationDays} days</span>
                  </div>
                  {plan.description && (
                    <p className="text-sm mb-6 text-slate-300 leading-relaxed">{plan.description}</p>
                  )}
                </div>
                <Link href="/#join" className="block text-center py-3 rounded-xl text-sm font-bold text-white transition-all bg-[#FF5C73] hover:bg-[#FF5C73]/90">
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} {tenant.name}. Powered by <a href="https://gmmx.app" className="text-[#FF5C73]">GMMX</a>
        </p>
      </footer>
    </div>
  );
}
