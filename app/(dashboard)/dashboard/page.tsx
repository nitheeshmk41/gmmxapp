import {
  Users,
  UserCheck,
  AlertTriangle,
  CalendarX,
  IndianRupee,
  CalendarCheck,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import {
  getDashboardStats,
  getMonthlyRevenue,
  getNewMembersMonthly,
  getAttendanceTrend,
} from "@/features/dashboard/stats";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "./charts";

const STAT_CARDS = [
  {
    key: "totalMembers" as const,
    label: "Total Members",
    icon: Users,
    color: "var(--color-info)",
    bg: "var(--color-info-light)",
    borderColor: "var(--color-info)",
  },
  {
    key: "activeMembers" as const,
    label: "Active Members",
    icon: UserCheck,
    color: "var(--color-success)",
    bg: "var(--color-success-light)",
    borderColor: "var(--color-success)",
  },
  {
    key: "expiringThisWeek" as const,
    label: "Expiring This Week",
    icon: AlertTriangle,
    color: "var(--color-warning)",
    bg: "var(--color-warning-light)",
    borderColor: "var(--color-warning)",
  },
  {
    key: "expiringThisMonth" as const,
    label: "Expiring This Month",
    icon: CalendarX,
    color: "var(--color-danger)",
    bg: "var(--color-danger-light)",
    borderColor: "var(--color-danger)",
  },
  {
    key: "revenueThisMonth" as const,
    label: "Revenue This Month",
    icon: IndianRupee,
    color: "var(--color-brand-primary)",
    bg: "var(--color-brand-light)",
    borderColor: "var(--color-brand-primary)",
    isCurrency: true,
  },
  {
    key: "attendanceToday" as const,
    label: "Attendance Today",
    icon: CalendarCheck,
    color: "var(--color-success)",
    bg: "var(--color-success-light)",
    borderColor: "var(--color-success)",
  },
  {
    key: "totalLeads" as const,
    label: "Total Leads",
    icon: TrendingUp,
    color: "var(--color-info)",
    bg: "var(--color-info-light)",
    borderColor: "var(--color-info)",
  },
  {
    key: "newLeadsThisWeek" as const,
    label: "New Leads This Week",
    icon: UserPlus,
    color: "var(--color-brand-primary)",
    bg: "var(--color-brand-light)",
    borderColor: "var(--color-brand-primary)",
  },
];

export default async function DashboardPage() {
  const [stats, monthlyRevenue, newMembers, attendanceTrend] = await Promise.all([
    getDashboardStats(),
    getMonthlyRevenue(),
    getNewMembersMonthly(),
    getAttendanceTrend(),
  ]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-muted-foreground)" }}>Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome banner */}
      <div
        className="p-5 rounded-2xl flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, var(--color-sidebar) 0%, #1E293B 100%)",
        }}
      >
        <div>
          <h2 className="text-white font-bold text-lg">Good {getGreeting()}! 👋</h2>
          <p className="text-sm mt-0.5" style={{ color: "#94A3B8" }}>
            Here&apos;s what&apos;s happening with your gym today.
          </p>
        </div>
        <div
          className="hidden sm:flex w-12 h-12 rounded-xl items-center justify-center"
          style={{ background: "rgba(255,92,115,0.15)" }}
        >
          <TrendingUp size={20} style={{ color: "var(--color-brand-primary)" }} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const rawValue = stats[card.key];
          const displayValue = card.isCurrency
            ? formatCurrency(rawValue as number)
            : String(rawValue);

          return (
            <div
              key={card.key}
              className="p-5 rounded-xl hover-lift"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
                borderTop: `3px solid ${card.borderColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                  {card.label}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: card.bg }}
                >
                  <Icon size={15} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--color-foreground)" }}>
                {displayValue}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <DashboardCharts
        monthlyRevenue={monthlyRevenue}
        newMembers={newMembers}
        attendanceTrend={attendanceTrend}
      />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}
