import { getAttendanceTrend } from "@/features/dashboard/stats";
import { CalendarCheck, Activity } from "lucide-react";

export default async function AttendanceReportPage() {
  const trend = await getAttendanceTrend();
  const todayAttendance = trend.length > 0 ? trend[trend.length - 1].count : 0;
  const weeklyAverage = trend.length > 0 
    ? Math.round(trend.reduce((acc, curr) => acc + curr.count, 0) / trend.length) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Report</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor member footfall and engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Attendance</p>
            <p className="text-2xl font-bold text-slate-900">{todayAttendance}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Weekly Average</p>
            <p className="text-2xl font-bold text-slate-900">{weeklyAverage} / day</p>
          </div>
        </div>
      </div>
    </div>
  );
}
