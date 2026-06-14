import Link from "next/link";
import {
  Users,
  UserPlus,
  AlertTriangle,
  IndianRupee,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  QrCode,
  Image as ImageIcon,
  Globe,
  Dumbbell
} from "lucide-react";
import {
  getDashboardStats,
  getMonthlyRevenue,
  getNewMembersMonthly,
  getAttendanceTrend,
  getRecentActivity,
  isSampleDataEnabled,
  clearSampleData
} from "@/features/dashboard/stats";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "./charts";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const [stats, monthlyRevenue, newMembers, attendanceTrend, recentActivity, isSample] = await Promise.all([
    getDashboardStats(),
    getMonthlyRevenue(),
    getNewMembersMonthly(),
    getAttendanceTrend(),
    getRecentActivity(),
    isSampleDataEnabled()
  ]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-muted-foreground)" }}>Failed to load dashboard data.</p>
      </div>
    );
  }

  // Define Quick Actions
  const QUICK_ACTIONS = [
    { href: "/dashboard/members/new", label: "Add Member", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50" },
    { href: "/dashboard/leads", label: "Add Lead", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { href: "/dashboard/payments", label: "Payment", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-50" },
    { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  // Define Today's Overview Cards
  const TODAY_STATS = [
    { label: "Revenue Today", value: formatCurrency(stats.revenueToday), icon: IndianRupee, color: "var(--color-success)", bg: "var(--color-success-light)" },
    { label: "Attendance Today", value: stats.attendanceToday, icon: CalendarCheck, color: "var(--color-info)", bg: "var(--color-info-light)" },
    { label: "Expiring Soon", value: stats.expiringThisMonth, icon: AlertTriangle, color: "var(--color-warning)", bg: "var(--color-warning-light)" },
    { label: "New Leads", value: stats.newLeadsThisWeek, icon: TrendingUp, color: "var(--color-brand-primary)", bg: "var(--color-brand-light)" },
  ];

  return (
    <div className="space-y-8 animate-in max-w-6xl mx-auto pb-10">
      {/* Sample Data Banner */}
      {isSample && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📊</span>
              <h3 className="font-bold text-blue-900 text-lg">Demo Dashboard</h3>
            </div>
            <p className="text-blue-700 text-sm max-w-xl">
              You&apos;re currently viewing sample business data to explore GMMX. When you&apos;re ready to set up your actual gym, you can clear this demo data.
            </p>
          </div>
          <form action={clearSampleData}>
            <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 whitespace-nowrap">
              Start Using Real Data
            </button>
          </form>
        </div>
      )}

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-foreground)" }}>
              Good {getGreeting()} 👋
            </h2>
            {isSample && (
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                Demo
              </span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
            Here&apos;s what&apos;s happening with your gym today.
          </p>
        </div>
      </div>

      {/* Welcome Checklist */}
      {!isSample && stats.totalMembers === 0 && (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Getting Started</h3>
              <p className="text-sm text-slate-500 mt-1">Complete setup in ~5 minutes</p>
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right bg-slate-50 p-3 sm:p-0 sm:bg-transparent rounded-lg">
              <div className="flex items-center justify-between sm:justify-end gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">0/5 completed</span>
                <span className="text-xs font-bold text-[#FF5C73]">0%</span>
              </div>
              <div className="w-full sm:w-40 h-2 rounded-full bg-slate-100 overflow-hidden">
                 <div className="h-full bg-[#FF5C73] w-0 transition-all duration-1000" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Add your first member", desc: "Start tracking payments", icon: UserPlus, href: "/dashboard/members/new" },
              { label: "Add your first trainer", desc: "Invite your staff", icon: Dumbbell, href: "/dashboard/trainers/new" },
              { label: "Generate attendance QR", desc: "Automate check-ins", icon: QrCode, href: "/dashboard/settings/attendance" },
              { label: "Share your gym website", desc: "Start generating leads", icon: Globe, href: "/dashboard/website" },
              { label: "Record first attendance", desc: "Log a member visit", icon: CalendarCheck, href: "/dashboard/attendance" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#FF5C73]/50 hover:bg-[#FF5C73]/5 transition-all group"
              >
                <div className="mt-0.5 text-slate-300 group-hover:text-[#FF5C73] transition-colors">
                  <Circle size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{item.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h3 className="text-xs font-semibold tracking-wider uppercase mb-3 text-slate-500">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.bg}`}>
                  <Icon size={18} className={action.color} />
                </div>
                <span className="font-semibold text-sm text-slate-700">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Today's Overview */}
      <section>
        <h3 className="text-xs font-semibold tracking-wider uppercase mb-3 text-slate-500">
          Today&apos;s Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TODAY_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                    <Icon size={16} style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity & Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</h3>
            <Link href="/dashboard/payments" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-5">
            {recentActivity.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <IndianRupee size={16} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    Payment from {payment.member.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(payment.paid_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-sm font-bold text-emerald-600">
                  +{formatCurrency(Number(payment.amount))}
                </div>
              </div>
            ))}
            {recentActivity.recentMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <UserPlus size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {member.name} joined
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(member.join_date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.recentPayments.length === 0 && recentActivity.recentMembers.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
            )}
          </div>
        </section>

        {/* Upcoming Renewals */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Renewals</h3>
            <Link href="/dashboard/expiry" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-5">
            {recentActivity.upcomingRenewals.map((renewal) => {
              const daysLeft = Math.ceil((new Date(renewal.membership_end!).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysLeft <= 3;
              
              return (
                <div key={renewal.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Clock size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{renewal.member.name}</p>
                      <p className="text-xs text-slate-500">{renewal.member.phone}</p>
                    </div>
                  </div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full ${isUrgent ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
                    {daysLeft > 0 ? `In ${daysLeft} days` : 'Expired'}
                  </div>
                </div>
              );
            })}
            {recentActivity.upcomingRenewals.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming renewals in the next 30 days.</p>
            )}
          </div>
        </section>
      </div>

      {/* Charts */}
      <section>
         <h3 className="text-xs font-semibold tracking-wider uppercase mb-3 text-slate-500">
          Performance
        </h3>
        <DashboardCharts
          monthlyRevenue={monthlyRevenue}
          newMembers={newMembers}
          attendanceTrend={attendanceTrend}
        />
      </section>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}
