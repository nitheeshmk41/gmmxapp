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
import { TrialBanners } from "@/components/dashboard/TrialBanners";

export default async function DashboardPage() {
  const gym = await getCurrentGym();
  if (!gym) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--color-muted-foreground)" }}>Failed to load gym context.</p>
      </div>
    );
  }

  let settingsRes = { documents: [] as any[] };
  let subRes = { documents: [] as any[] };
  
  try {
    const { databases } = await createAdminClient();
    const [sRes, sSubRes] = await Promise.all([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_SETTINGS, [Query.equal("gymId", gym.gymId || "none")]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.SUBSCRIPTIONS, [
        Query.equal("gymId", gym.gymId || "none"),
        Query.orderDesc("$createdAt"),
        Query.limit(1)
      ])
    ]);
    settingsRes = sRes;
    subRes = sSubRes;
  } catch (error) {
    console.error("[DashboardPage] Error fetching settings/subscriptions:", error);
  }

  const settingsDoc = settingsRes.documents[0] || null;
  const isDraft = !settingsDoc || settingsDoc.websiteStatus === "draft";
  
  const subscription = subRes.documents[0];
  const isTrial = subscription?.status === "trial";
  const daysLeft = subscription?.endsAt ? Math.max(0, Math.ceil((new Date(subscription.endsAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0;

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
    <div className="animate-in max-w-7xl mx-auto pb-10">
      
      {/* 1. Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 mt-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Good {getGreeting()} 👋 <br className="hidden md:block" /> 
            <span className="text-slate-600 font-medium text-xl md:text-2xl">Welcome back, {gym.user.email?.split('@')[0] || 'Owner'}.</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm">Here's what's happening in your gym today.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm hidden md:block">
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
          <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-700 shadow-sm transition-all hidden sm:block">
            Generate Report
          </button>
          <Link href="/owner/dashboard/members/new" className="px-4 py-2.5 bg-[#FF5C73] text-white rounded-xl text-sm font-bold shadow-brand hover:bg-[#E64A61] hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={16} /> Quick Add
          </Link>
        </div>
      </div>

      {/* Trial / Demo Banners */}
      {(isSample || (isTrial && daysLeft > 0)) && (
        <div className="mb-8 space-y-4">
          {isSample && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
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

          {isTrial && daysLeft > 0 && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden animate-in fade-in slide-in-from-top-4">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C73] rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-4 backdrop-blur-sm">
                    <span>🎉</span> You're on a 14-day Pro Trial
                  </div>
                  <h3 className="text-2xl font-black mb-2">{daysLeft} Days Remaining</h3>
                  <p className="text-slate-300 font-medium text-sm">Unlock unlimited members, AI features, and your custom domain.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 md:w-72 flex-shrink-0">
                  <p className="text-sm font-medium text-slate-300 mb-1">After trial:</p>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-2xl font-bold">Professional</span>
                    <span className="text-sm text-slate-400 mb-1">₹999/mo</span>
                  </div>
                  <Link href="/owner/dashboard/settings/billing/upgrade" className="block w-full py-3 bg-[#FF5C73] hover:bg-red-500 text-white text-center font-bold rounded-xl transition-all shadow-lg shadow-red-500/30">
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* 2. KPI Cards (4 cols each on large screens) */}
        {KPI_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          const mockTrend = [5, 12, 8, 15, 22]; // Mock data for sparkline
          const isPositive = idx % 2 === 0;
          return (
            <div key={stat.label} className="col-span-12 md:col-span-6 lg:col-span-3 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover-lift group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-slate-50/50 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors" style={{ background: stat.bg }}>
                  <Icon size={24} style={{ color: stat.color }} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isPositive ? <TrendingUp size={12} /> : <ArrowRight size={12} className="rotate-45" />}
                  {isPositive ? '+12%' : '-2%'}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                <span className="text-xs text-slate-400">vs last month</span>
                <div className="w-16 h-6 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                  <MiniSparkline data={mockTrend} width={64} height={24} color={stat.color} />
                </div>
              </div>
            </div>
          );
        })}

        {/* 3. Charts & Analytics */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
               📈 Revenue & Growth
             </h3>
             <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#FF5C73] focus:border-[#FF5C73] block px-3 py-1.5 font-medium">
               <option>Last 6 Months</option>
               <option>This Year</option>
             </select>
           </div>
           <div className="flex-1 -ml-2">
             <DashboardCharts
               monthlyRevenue={monthlyRevenue}
               newMembers={newMembers}
               attendanceTrend={attendanceTrend}
             />
           </div>
        </div>

        {/* Website / Demographics Widget */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-100/50"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Globe size={20} className="text-blue-500" /> Website Traffic
            </h3>
            <Link href="/owner/dashboard/analytics" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Visitors</p>
              <p className="text-2xl font-black text-slate-900"><CountUp to={isDraft ? 0 : stats.newLeads * 20} /></p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Leads</p>
              <p className="text-2xl font-black text-blue-700"><CountUp to={isDraft ? 0 : stats.newLeads} /></p>
            </div>
          </div>

          <div className="flex-1 border-t border-slate-100 pt-5 relative z-10">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              🔥 Recent Leads
            </h4>
            <div className="space-y-3">
              {recentActivity.recentLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-600">
                    {(lead.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{lead.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.intent || 'Interested'}</p>
                  </div>
                  {lead.phone && (
                    <a href={buildLeadWelcomeUrl(lead.phone, lead.name, gym.gym?.name || "Gym")} target="_blank" rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 hover:bg-green-100 transition-colors text-green-600" title="Chat on WhatsApp">
                      <MessageCircle size={14} />
                    </a>
                  )}
                </div>
              ))}
              {recentActivity.recentLeads.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-2">No new leads yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* 4. Middle Row: Quick Actions, Today's Schedule, Tasks */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl transition-all hover:scale-105 hover:shadow-md border border-slate-100 bg-slate-50/50 group`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${action.bg}`}>
                    <Icon size={20} className={action.color} />
                  </div>
                  <span className="font-semibold text-xs text-slate-700 text-center">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 flex items-center justify-between">
            📅 Today's Schedule
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">3 Classes</span>
          </h3>
          <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100">
            {/* Mock Timeline Items */}
            <div className="relative pl-10 py-3 group">
              <div className="absolute left-3 top-4 w-2.5 h-2.5 rounded-full bg-[#FF5C73] border-4 border-white shadow-sm"></div>
              <p className="text-xs font-bold text-[#FF5C73] mb-0.5">06:00 AM - 07:00 AM</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-[#FF5C73]/30 transition-colors">
                <p className="text-sm font-bold text-slate-900">Morning CrossFit</p>
                <p className="text-xs text-slate-500 mt-1">Trainer: Alex • 12/15 Booked</p>
              </div>
            </div>
            <div className="relative pl-10 py-3 group">
              <div className="absolute left-3 top-4 w-2.5 h-2.5 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
              <p className="text-xs font-bold text-blue-500 mb-0.5">09:00 AM - 10:00 AM</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-blue-200 transition-colors">
                <p className="text-sm font-bold text-slate-900">Yoga Flow</p>
                <p className="text-xs text-slate-500 mt-1">Trainer: Sarah • 8/10 Booked</p>
              </div>
            </div>
            <div className="relative pl-10 py-3 group">
              <div className="absolute left-3 top-4 w-2.5 h-2.5 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">05:00 PM - 07:00 PM</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 border-dashed">
                <p className="text-sm font-bold text-slate-900 opacity-60">Evening Zumba</p>
                <p className="text-xs text-slate-500 mt-1 opacity-60">Trainer: Mike • Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">💰 Renewals Due</h3>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <CountUp prefix="₹" to={potentialRevenue} separator="," />
            </span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-thin">
            {recentActivity.upcomingRenewals.map((renewal) => {
              const endDate = renewal.membership_end ? new Date(renewal.membership_end) : new Date();
              const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysLeft <= 3;
              const formattedDate = renewal.membership_end ? format(endDate, "MMM d") : "Soon";
              
              return (
                <div key={renewal.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Clock size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{renewal.member?.name || 'Deleted Member'}</p>
                      <p className="text-xs font-medium text-slate-500">{daysLeft > 0 ? `Expires in ${daysLeft} days` : 'Expired'}</p>
                    </div>
                  </div>
                  {renewal.member?.phone && (
                    <a href={buildExpiryReminderUrl(renewal.member?.phone || '', renewal.member?.name || '', gym.gym?.name || "Gym", formattedDate)}
                      target="_blank" rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-500 hover:text-white text-green-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Send WhatsApp Reminder">
                      <MessageCircle size={14} />
                    </a>
                  )}
                </div>
              );
            })}
            {recentActivity.upcomingRenewals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center h-full">
                <CheckCircle2 size={32} className="text-emerald-400 mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-700">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* 5. Bottom Row: Data Tables */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Members</h3>
            <Link href="/owner/dashboard/members" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">View All</Link>
          </div>
          <div className="flex-1 p-2 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Member</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Joined</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.recentMembers.map((member) => (
                  <tr key={member.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(member.name || 'Unknown')}`}
                          alt={member.name || 'Unknown'}
                          className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"
                        />
                        <p className="text-sm font-bold text-slate-900">{member.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-50 text-sm font-medium text-slate-500">
                      {member.join_date ? formatDistanceToNow(new Date(member.join_date), { addSuffix: true }) : 'Recently'}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-50">
                      <span className="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-600">Active</span>
                    </td>
                  </tr>
                ))}
                {recentActivity.recentMembers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">No recent members.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Payments</h3>
            <Link href="/owner/dashboard/payments" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">View All</Link>
          </div>
          <div className="flex-1 p-2 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Member</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Amount</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.recentPayments.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <IndianRupee size={14} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">{payment.member?.name || 'Deleted Member'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-50 text-sm font-black text-slate-900">
                      {formatCurrency(Number(payment.amount))}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-50 text-sm font-medium text-slate-500">
                      {payment.paid_at ? formatDistanceToNow(new Date(payment.paid_at), { addSuffix: true }) : 'Recently'}
                    </td>
                  </tr>
                ))}
                {recentActivity.recentPayments.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">No recent payments.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
