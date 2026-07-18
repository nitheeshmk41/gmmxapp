import { getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { CreditCard, Download, HardDrive, Users, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

const PLAN_PRICES: Record<string, string> = {
  starter: "₹499",
  professional: "₹999",
  enterprise: "Custom",
};

export default async function BillingSettingsPage() {
  try {
    const gym = await getCurrentGym();
    if (!gym) return null;

    const { databases } = await createAdminClient();
  const subRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
    Query.equal("gymId", gym.$id),
    Query.orderDesc("$createdAt"),
    Query.limit(1)
  ]);
  
  const subscription = subRes.documents[0];
  const isTrial = subscription?.status === "trial";
  const plan = subscription?.planId || "starter";
  
  const membersRes = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
    Query.equal("gymId", gym.$id),
    Query.limit(1) // Just to get total count
  ]);
  const membersCount = membersRes.total;
  const maxMembers = plan === "starter" ? 200 : "Unlimited";
  const membersPercentage = plan === "starter" ? Math.min((membersCount / 200) * 100, 100) : 5;
  const progressColor = membersPercentage > 90 ? "bg-red-500" : membersPercentage > 75 ? "bg-orange-500" : "bg-blue-500";

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Current Plan Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-6 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF5C73]/10 flex items-center justify-center">
              <CreditCard size={20} className="text-[#FF5C73]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
              <p className="text-sm text-slate-500">Manage your subscription</p>
            </div>
          </div>
          {isTrial && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Trial Active
            </span>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2">
                {PLAN_LABELS[plan]} {plan === "professional" && "⭐"}
              </h3>
              <p className="text-lg font-bold text-slate-600">
                {PLAN_PRICES[plan]}<span className="text-sm font-medium text-slate-400">/month</span>
              </p>
            </div>
            
            <div className="flex gap-3">
              {plan === "starter" && (
                <Link
                  href="/owner/dashboard/upgrade"
                  className="px-6 py-2.5 bg-[#FF5C73] hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center gap-2"
                >
                  Upgrade
                </Link>
              )}
              <Link href="/owner/dashboard/upgrade" className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all border border-slate-200">
                {plan === "starter" ? "Compare Plans" : "Manage Subscription"}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Next Billing</p>
              <p className="text-sm font-medium text-slate-900">
                {subscription?.current_period_end ? formatDate(subscription.current_period_end) : "Pending Activation"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Method</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[10px] font-bold text-white">VISA</div>
                <p className="text-sm font-medium text-slate-900">**** 4242</p>
              </div>
            </div>
          </div>
          
          {plan === "starter" && (
            <div className="mt-8 p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                Unlock with Professional
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Unlimited Members", "Unlimited Trainers", "AI Assistant", "Advanced Reports"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={16} className="text-[#FF5C73]" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage & Invoices Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-6">Usage</h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><Users size={16} /> Members</p>
                <p className="text-sm font-bold text-slate-900">{membersCount} / {maxMembers}</p>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${progressColor}`} style={{ width: `${membersPercentage}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><HardDrive size={16} /> Storage</p>
                <p className="text-sm font-bold text-slate-900">3.4GB / 20GB</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Recent Invoices</h3>
          
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-900">INV-2026-00{i+1}</p>
                  <p className="text-xs text-slate-500">Aug 12, 2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-slate-700">₹999</p>
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#FF5C73] transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  } catch (error: any) {
    console.error(error);
    return (
      <div className="bg-red-50 border border-red-200 text-red-900 p-8 rounded-2xl m-8">
        <h2 className="text-2xl font-bold mb-4">Server Error</h2>
        <pre className="whitespace-pre-wrap text-sm">{error.message}</pre>
        <pre className="whitespace-pre-wrap text-xs mt-4 text-red-700/80">{error.stack}</pre>
      </div>
    );
  }
}
