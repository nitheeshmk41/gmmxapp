import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { getMemberById } from "@/features/members/actions";
import { CheckCircle2, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function MemberDashboardPage() {
  const user = await getCurrentUser();
  const gym = await getCurrentGym();
  
  let memberDetails: any = null;
  if (user) {
    memberDetails = await getMemberById(user.id);
  }

  const latestPayment = memberDetails?.payments?.[0];
  const membershipEnd = latestPayment?.membership_end;

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">Welcome, {user?.name || "Member"}!</h1>
        <p className="text-slate-500 text-sm mt-1">Check your membership plans, profile details, and attendance logs below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Membership Status</p>
            <p className="text-lg font-bold text-slate-900 mt-1 capitalize">{memberDetails?.status || "Active"}</p>
          </div>
        </div>

        {/* Plan Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Current Plan</p>
            <p className="text-base font-bold text-slate-900 mt-1 truncate">{memberDetails?.plan?.name || "No Plan"}</p>
          </div>
        </div>

        {/* Expiration Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Valid Until</p>
            <p className="text-sm font-bold text-slate-900 mt-1.5">
              {membershipEnd ? formatDate(membershipEnd) : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-2">Trainer & Support</h3>
        <p className="text-sm text-slate-500">
          Need a diet plan or customized workout? Speak to your assigned trainer at the gym reception.
        </p>
      </div>
    </div>
  );
}
