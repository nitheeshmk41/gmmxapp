import { getMonthlyRevenue } from "@/features/dashboard/stats";
import { IndianRupee, TrendingUp, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function RevenueReportPage() {
  const chartData = await getMonthlyRevenue();
  const currentMonthRevenue = chartData.length > 0 ? chartData[chartData.length - 1].revenue : 0;
  
  // For MVP, we use basic approximations.
  const revenueToday = Math.round(currentMonthRevenue / 30);
  const revenueThisWeek = revenueToday * 7;

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Revenue Report</h2>
        <p className="text-sm text-slate-500 mt-1">Financial overview of your gym.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Revenue Today</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(revenueToday)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Revenue This Week</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(revenueThisWeek)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Revenue This Month</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(currentMonthRevenue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
