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
  Clock
} from "lucide-react";
import {
  getDashboardStats,
  getMonthlyRevenue,
  getNewMembersMonthly,
  getAttendanceTrend,
  getRecentActivity
} from "@/features/dashboard/stats";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "./charts";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const [stats, monthlyRevenue, newMembers, attendanceTrend, recentActivity] = await Promise.all([
    getDashboardStats(),
    getMonthlyRevenue(),
    getNewMembersMonthly(),
    getAttendanceTrend(),
    getRecentActivity()
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
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-foreground)" }}>
            Good {getGreeting()} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
            Here&apos;s what&apos;s happening with your gym today.
          </p>
        </div>
      </div>

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
