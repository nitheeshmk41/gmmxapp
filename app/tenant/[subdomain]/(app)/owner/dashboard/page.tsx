import Link from "next/link";
import {
  Users, UserPlus, AlertTriangle, IndianRupee, CalendarCheck, TrendingUp, CreditCard,
  Plus, ArrowRight, Clock, CheckCircle2, QrCode, Globe, Dumbbell, MessageCircle, BarChart, FileText
} from "lucide-react";
import {
  getDashboardStats, getMonthlyRevenue, getNewMembersMonthly,
  getAttendanceTrend, getRecentActivity, isSampleDataEnabled, clearSampleData
} from "@/features/dashboard/stats";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "./charts";
import { formatDistanceToNow, format } from "date-fns";

import { getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { buildExpiryReminderUrl, buildPaymentConfirmationUrl, buildLeadWelcomeUrl } from "@/lib/whatsapp";
import SpotlightCard from "@/components/SpotlightCard";
import { CountUp } from "@/components/animations/CountUp";
import { MiniSparkline } from "@/components/animations/MiniSparkline";

export default async function DashboardPage() {
  const gym = await getCurrentGym();
  if (!gym) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-muted-foreground)" }}>Failed to load gym context.</p>
      </div>
    );
  }

  const { databases } = await createAdminClient();
  const [settingsRes, subRes] = await Promise.all([
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, [Query.equal("gymId", gym.$id)]),
    databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
      Query.equal("gymId", gym.$id),
      Query.orderDesc("$createdAt"),
      Query.limit(1)
    ])
  ]);
  const settingsDoc = settingsRes.documents[0] || null;
  const isDraft = !settingsDoc || settingsDoc.websiteStatus === "draft";
  
  const subscription = subRes.documents[0];
  const isTrial = subscription?.status === "trial";
  const daysLeft = subscription ? Math.max(0, Math.ceil((new Date(subscription.endsAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0;

  const [stats, monthlyRevenue, newMembers, attendanceTrend, recentActivity, isSample] = await Promise.all([
    getDashboardStats(), getMonthlyRevenue(), getNewMembersMonthly(), getAttendanceTrend(), getRecentActivity(), isSampleDataEnabled()
  ]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-muted-foreground)" }}>Failed to load dashboard data.</p>
      </div>
    );
  }

  // --- Setup Checklist Calculation ---
  const setupProgress = [
    { label: "Create Membership Plan", completed: stats.activePlans > 0, href: "/owner/dashboard/plans" },
    { label: "Add First Member", completed: stats.totalMembers > 0, href: "/owner/dashboard/members/new" },
    { label: "Add Trainer", completed: stats.totalTrainers > 0, href: "/owner/dashboard/trainers/new" },
    { label: "Mark Attendance", completed: stats.attendanceToday > 0, href: "/owner/dashboard/attendance/scan" },
    { label: "Publish Website", completed: !isDraft, href: "/owner/dashboard/website/setup" },
  ];
  const completedCount = setupProgress.filter(s => s.completed).length;
  const progressPct = Math.round((completedCount / setupProgress.length) * 100);
  const showChecklist = completedCount < 5;

  // --- GMMX Assistant Suggestions ---
  const suggestions = [];
  if (stats.newLeads > 0) suggestions.push(`Follow up with ${stats.newLeads} new leads`);
  if (stats.expiringThisWeek > 0) suggestions.push(`Renew ${stats.expiringThisWeek} expiring memberships`);
  if (isDraft) suggestions.push("Publish your gym website");
  if (suggestions.length === 0) suggestions.push("Share your gym website on WhatsApp");

  const QUICK_ACTIONS = [
    { href: "/owner/dashboard/members/new", label: "Add Member", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50" },
    { href: "/owner/dashboard/leads", label: "Add Lead", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { href: "/owner/dashboard/payments", label: "Payment", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-50" },
    { href: "/owner/dashboard/attendance", label: "Attendance", icon: CalendarCheck, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const KPI_STATS = [
    { label: "Active Members", value: stats.activeMembers, icon: Users, color: "var(--color-brand-primary)", bg: "var(--color-brand-light)" },
    { label: "Today's Attendance", value: stats.attendanceToday, icon: CalendarCheck, color: "var(--color-success)", bg: "var(--color-success-light)" },
    { label: "Monthly Revenue", value: formatCurrency(stats.monthlyRevenue), icon: IndianRupee, color: "var(--color-success)", bg: "var(--color-success-light)" },
    { label: "Expiring soon", value: stats.expiringThisWeek, icon: Clock, color: "var(--color-warning)", bg: "var(--color-warning-light)" },
  ];

  const potentialRevenue = recentActivity.upcomingRenewals.reduce((sum, r) => sum + (r.planPrice || 0), 0);

  return (
    <div className="space-y-8 animate-in max-w-6xl mx-auto pb-10">
      {isSample && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📊</span>
              <h3 className="font-bold text-blue-900 text-lg">Demo Dashboard</h3>
            </div>
            <p className="text-blue-700 text-sm max-w-xl">
              You're currently viewing sample business data. When you're ready, you can clear this demo data.
            </p>
          </div>
          <form action={clearSampleData}>
            <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 whitespace-nowrap">
              Start Using Real Data
            </button>
          </form>
        </div>
      )}

      {/* Greeting & Assistant */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Welcome to GMMX 👋</h2>
            {isSample && (
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">Demo</span>
            )}
          </div>
          {isTrial && (
            <p className="text-slate-600 mt-1 font-medium">Your trial ends in: <span className="font-bold text-red-500">{daysLeft} Days</span></p>
          )}
          
          {/* GMMX Assistant Block */}
          <SpotlightCard className="mt-4 bg-[#FF5C73]/5 border border-[#FF5C73]/20 rounded-2xl p-4 md:p-5 max-w-2xl" spotlightColor="rgba(255, 92, 115, 0.15)">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF5C73] animate-pulse"></span>
              GMMX Assistant
            </h3>
            <p className="text-sm text-slate-600 mb-2 font-medium">Today's Suggestions:</p>
            <ul className="space-y-1.5">
              {suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </div>

        {/* Setup Checklist Widget */}
        {showChecklist && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm w-full md:w-80 flex-shrink-0 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                🎯 Today's Goal
              </h3>
              <span className="text-xs font-bold text-[#FF5C73] bg-[#FF5C73]/10 px-2 py-0.5 rounded-full">{progressPct}% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#FF5C73] transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="space-y-2.5">
              {setupProgress.map((step, idx) => (
                <Link key={idx} href={step.href} className="flex items-center gap-3 text-sm group">
                  {step.completed ? (
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0 group-hover:border-[#FF5C73] transition-colors" />
                  )}
                  <span className={`${step.completed ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900 font-medium'} transition-colors`}>
                    {step.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top KPIs */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {KPI_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs md:text-sm font-medium text-slate-500">{stat.label}</span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                    <Icon size={14} className="md:w-4 md:h-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions (Prominent) */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm border border-slate-100 ${action.bg}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm`}>
                  <Icon size={22} className={action.color} />
                </div>
                <span className="font-bold text-sm text-slate-800">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SaaS Focused Widgets Row 1: Revenue & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Opportunities */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">💰 Revenue Opportunities</h3>
            <Link href="/owner/dashboard/expiry" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mb-6 flex items-center justify-between bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">{recentActivity.upcomingRenewals.length} Renewals Due</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">
                <CountUp prefix="₹" to={potentialRevenue} separator="," />
              </p>
            </div>
            <TrendingUp size={24} className="text-emerald-500 opacity-50" />
          </div>

          <div className="space-y-4 flex-1">
            {recentActivity.upcomingRenewals.map((renewal) => {
              const daysLeft = Math.ceil((new Date(renewal.membership_end).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysLeft <= 3;
              const formattedDate = format(new Date(renewal.membership_end), "MMM d");
              
              return (
                <div key={renewal.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Clock size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{renewal.member.name}</p>
                      <p className="text-xs text-slate-500">{daysLeft > 0 ? `Expires ${formattedDate} (${daysLeft}d left)` : 'Expired'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{formatCurrency(renewal.planPrice || 0)}</span>
                    {renewal.member.phone && (
                      <a href={buildExpiryReminderUrl(renewal.member.phone, renewal.member.name, gym.name, formattedDate)}
                        target="_blank" rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors"
                        title="Send WhatsApp Reminder">
                        <MessageCircle size={14} className="text-green-600" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {recentActivity.upcomingRenewals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center h-full">
                <CheckCircle2 size={32} className="text-emerald-400 mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-700">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No upcoming renewals.</p>
              </div>
            )}
          </div>
        </section>

        {/* Website Analytics */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Globe size={18} className="text-blue-500" /> Website Performance
            </h3>
            {isDraft ? (
              <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded uppercase tracking-wider">Unpublished</span>
            ) : (
              <Link href="/owner/dashboard/website" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                View Website <ArrowRight size={14} />
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">Visitors <MiniSparkline data={[10, 25, 15, 30, 50]} width={30} height={10} color="#3b82f6" /></p>
              <p className="text-2xl font-black text-slate-900"><CountUp to={isDraft ? 0 : stats.newLeads * 20} /></p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">Leads <MiniSparkline data={[2, 4, 3, 5, 8]} width={30} height={10} color="#22c55e" /></p>
              <p className="text-2xl font-black text-blue-600"><CountUp to={isDraft ? 0 : stats.newLeads} /></p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Conversion</p>
              <p className="text-2xl font-black text-emerald-600"><CountUp to={isDraft || stats.newLeads === 0 ? 0 : 5.0} decimals={1} suffix="%" /></p>
            </div>
          </div>

          <div className="flex-1 border-t border-slate-100 pt-5">
             <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
               🔥 New Leads
             </h4>
             <div className="space-y-3">
               {recentActivity.recentLeads.slice(0, 3).map((lead) => (
                 <div key={lead.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                   <div className="min-w-0">
                     <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                     <p className="text-xs text-slate-500 truncate">{lead.intent}</p>
                   </div>
                   {lead.phone && (
                     <a href={buildLeadWelcomeUrl(lead.phone, lead.name, gym.name)} target="_blank" rel="noreferrer"
                       className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 hover:bg-green-200 transition-colors" title="Chat on WhatsApp">
                       <MessageCircle size={14} className="text-green-700" />
                     </a>
                   )}
                 </div>
               ))}
               {recentActivity.recentLeads.length === 0 && (
                 <p className="text-sm text-slate-500 text-center py-4">No new leads yet.</p>
               )}
             </div>
          </div>
        </section>
      </div>

      {/* Row 2: Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <IndianRupee size={16} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    Payment from <span className="font-bold">{payment.member.name}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(payment.paid_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-bold text-emerald-600">+{formatCurrency(Number(payment.amount))}</p>
                  {/* Payment Receipt WhatsApp */}
                  {payment.member.phone && (
                    <a href={buildPaymentConfirmationUrl(payment.member.phone, payment.member.name, gym.name, "Membership", Number(payment.amount))}
                      target="_blank" rel="noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100" title="Send Receipt">
                      <MessageCircle size={12} className="text-green-600" />
                    </a>
                  )}
                </div>
              </div>
            ))}
            {recentActivity.recentMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <UserPlus size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    <span className="font-bold">{member.name}</span> joined
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(member.join_date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.recentPayments.length === 0 && recentActivity.recentMembers.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No recent activity.</p>
            )}
          </div>
        </section>

        {/* Charts */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
               <BarChart size={18} className="text-purple-500" /> Business Trends
             </h3>
           </div>
          <DashboardCharts
            monthlyRevenue={monthlyRevenue}
            newMembers={newMembers}
            attendanceTrend={attendanceTrend}
          />
        </section>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}
