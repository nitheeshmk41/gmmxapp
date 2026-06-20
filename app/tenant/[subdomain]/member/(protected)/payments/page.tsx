import { getCurrentUser } from "@/features/auth/actions";
import { getMemberById } from "@/features/members/actions";
import { CreditCard, ShieldCheck } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function MemberPaymentsPage() {
  const user = await getCurrentUser();
  
  let memberDetails: any = null;
  if (user) {
    memberDetails = await getMemberById(user.id);
  }

  const payments = memberDetails?.payments || [];

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">My Payments</h1>
        <p className="text-slate-500 text-sm mt-1">Review your payment history and subscription records.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-semibold">No payment records found</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payments.map((payment: any, i: number) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{formatDate(payment.paid_at)}</td>
                  <td className="p-4 font-bold text-slate-900">{formatCurrency(Number(payment.amount))}</td>
                  <td className="p-4 text-slate-600">{payment.plan?.name || "Membership Plan"}</td>
                  <td className="p-4">
                    <span className="badge-success text-xs font-medium bg-green-50 border border-green-100 text-green-700 px-2.5 py-1 rounded-full capitalize">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Need a receipt copy? Please get in touch with the front desk.</span>
      </div>
    </div>
  );
}
