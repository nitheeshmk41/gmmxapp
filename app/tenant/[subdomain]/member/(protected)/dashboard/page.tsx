import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { getMemberById } from "@/features/members/actions";
import { CheckCircle2, Dumbbell, Activity, Calendar, Phone, MessageCircle, AlertTriangle, CreditCard, Flame, ArrowRight, User, Megaphone } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 17) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
}

export default async function MemberDashboardPage() {
  const user = await getCurrentUser();
  const gym = await getCurrentGym();
  
  let memberDetails: any = null;
  if (user) {
    memberDetails = await getMemberById(user.id);
  }

  // Payments & Membership
  const latestPayment = memberDetails?.payments?.[0];
  const membershipEnd = memberDetails?.membershipEndDate || latestPayment?.membership_end;
  
  let daysRemaining = 0;
  if (membershipEnd) {
    const end = new Date(membershipEnd);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Attendance Stats
  const attendance = memberDetails?.attendance || [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let attendanceThisMonth = 0;
  let currentStreak = 0;
  let lastVisit = attendance.length > 0 ? new Date(attendance[0].date) : null;

  // Calculate monthly attendance
  attendance.forEach((a: any) => {
    const d = new Date(a.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      attendanceThisMonth++;
    }
  });

  // Calculate streak
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  
  let tempStreak = 0;
  let foundTodayOrYesterday = false;
  
  const attendanceDates = new Set(attendance.map((a: any) => new Date(a.date).toISOString().split('T')[0]));
  
  const todayStr = checkDate.toISOString().split('T')[0];
  const yesterday = new Date(checkDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (attendanceDates.has(todayStr)) {
    foundTodayOrYesterday = true;
  } else if (attendanceDates.has(yesterdayStr)) {
    foundTodayOrYesterday = true;
    checkDate = yesterday;
  }

  if (foundTodayOrYesterday) {
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (attendanceDates.has(dateStr)) {
        tempStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = tempStreak;
  }

  let lastVisitText = "Never";
  if (lastVisit) {
    const visitStr = lastVisit.toISOString().split('T')[0];
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    const yestStr = yest.toISOString().split('T')[0];
    
    if (visitStr === todayStr) lastVisitText = "Today";
    else if (visitStr === yestStr) lastVisitText = "Yesterday";
    else lastVisitText = formatDate(lastVisit.toISOString());
  }

  // Generate last 7 days for visual timeline
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const greeting = getGreeting();

  return (
    <div className="animate-in max-w-6xl mx-auto">
      {/* 1. Compact Top Bar (Full Width) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            {greeting}, {user?.name?.split(' ')[0] || "Member"}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Member ID: {memberDetails?.memberCode || "—"} • {gym?.name || "Gym"}
          </p>
        </div>
        
        {/* Only show top-right Renew if NOT expired. If expired, we show the big banner below. */}
        {daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Expiring Soon</p>
                <p className="text-sm font-bold text-slate-900">{daysRemaining} Days Left</p>
             </div>
             <Link href="/member/payments" className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm shrink-0 w-full sm:w-auto text-center">
               Renew Now
             </Link>
          </div>
        )}
      </div>

      {/* Main Grid Split: 70% / 30% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Main Content - span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Deduplication logic for Expired State */}
          {daysRemaining <= 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div>
                  <h2 className="text-lg font-black text-red-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Membership Expired
                  </h2>
                  <p className="text-sm font-medium text-red-700 mt-1">Your access has been paused. Renew now to continue your fitness journey.</p>
               </div>
               <Link href="/member/payments" className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl transition-all shadow-sm shadow-red-500/20 shrink-0 w-full sm:w-auto text-center">
                  Renew Membership
               </Link>
            </div>
          ) : null}

          {/* Action Center */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 px-1">Today's Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/member/attendance" className="bg-[#FF5C73] hover:bg-red-500 text-white rounded-2xl p-4 flex flex-col justify-between h-32 shadow-sm transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                   <CheckCircle2 size={18} className="text-white" />
                 </div>
                 <span className="font-bold text-sm">Mark<br/>Attendance</span>
              </Link>
              
              <a href={`https://wa.me/${gym?.phone || ""}`} target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#20B858] text-white rounded-2xl p-4 flex flex-col justify-between h-32 shadow-sm transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                   <MessageCircle size={18} className="text-white" />
                 </div>
                 <span className="font-bold text-sm">Contact<br/>Trainer</span>
              </a>

              {/* Only show Renew card if active and not already pushed via the big banner */}
              {daysRemaining > 0 && (
                <Link href="/member/payments" className="bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-2xl p-4 flex flex-col justify-between h-32 shadow-sm transition-all group relative overflow-hidden">
                   {daysRemaining <= 7 && (
                      <div className="absolute top-3 right-3 flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                   )}
                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                     <CreditCard size={18} className="text-slate-600" />
                   </div>
                   <span className="font-bold text-sm">Renew<br/>Membership</span>
                </Link>
              )}

              <button className="bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-2xl p-4 flex flex-col justify-between h-32 shadow-sm transition-all group text-left opacity-60 cursor-not-allowed">
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                   <Dumbbell size={18} className="text-slate-600" />
                 </div>
                 <span className="font-bold text-sm leading-tight">Workout Plans <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">Available Soon</span></span>
              </button>
            </div>
          </div>

          {/* Gamified Progress & Timeline wrapper (2 columns on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gamified Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#FF5C73]" />
                      Monthly Progress
                   </h2>
                   <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{attendanceThisMonth} / 20 Days</span>
                 </div>
                 
                 <div className="space-y-2">
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                       <div className="bg-[#FF5C73] h-3 rounded-full" style={{ width: `${Math.min((attendanceThisMonth / 20) * 100, 100)}%` }}></div>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 text-right">Target: 20 visits</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                 <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500"/> Current Streak</p>
                    <p className="text-xl font-black text-slate-900 leading-tight">{currentStreak} <span className="text-xs font-bold text-slate-500">Days</span></p>
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-500"/> Last Visit</p>
                    <p className="text-lg font-black text-slate-900 leading-tight truncate">{lastVisitText}</p>
                 </div>
               </div>
            </div>

            {/* Visual Attendance Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4">
               <div className="flex items-center justify-between">
                 <h2 className="text-sm font-bold text-slate-900">Attendance Tracker</h2>
                 <Link href="/member/attendance" className="text-xs font-bold text-slate-400 hover:text-[#FF5C73] transition-colors flex items-center gap-1">
                   History <ArrowRight size={12} />
                 </Link>
               </div>
               
               <div className="flex-1 flex items-center justify-center">
                 <div className="flex items-center justify-between w-full px-2">
                   {last7Days.map((d, i) => {
                      const dateStr = d.toISOString().split('T')[0];
                      const isAttended = attendanceDates.has(dateStr);
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
                      
                      return (
                        <div key={i} className="flex flex-col items-center gap-3">
                          <span className="text-xs font-bold text-slate-400">{dayName}</span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAttended ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-slate-50 border border-slate-200'}`}>
                            {isAttended ? <CheckCircle2 size={14} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>}
                          </div>
                        </div>
                      );
                   })}
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDEBAR (span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Trainer Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Assigned Trainer
             </h3>
             <div className="flex items-center gap-4 mb-5">
               <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                 <span className="text-lg font-black text-slate-400">AK</span>
               </div>
               <div>
                 <p className="text-base font-bold text-slate-900">Arun Kumar</p>
                 <p className="text-xs font-medium text-slate-500 mt-0.5">Strength Coach • 8 Yrs Exp</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <a href={`tel:${gym?.phone || ""}`} className="flex-1 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-sm font-bold text-slate-700">
                 <Phone size={16} className="text-slate-500" /> Call
               </a>
               <a href={`https://wa.me/${gym?.phone || ""}`} target="_blank" rel="noreferrer" className="flex-1 py-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-colors text-sm font-bold">
                 <MessageCircle size={16} /> WhatsApp
               </a>
             </div>
          </div>

          {/* Membership Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" /> Membership Details
             </h3>
             <div className="space-y-4">
                <div>
                   <p className="text-xs font-medium text-slate-500">Current Plan</p>
                   <p className="text-base font-bold text-slate-900 mt-0.5">{memberDetails?.plan?.name || "No Plan"}</p>
                </div>
                <div>
                   <p className="text-xs font-medium text-slate-500">Status</p>
                   <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${daysRemaining > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-bold text-slate-900 capitalize">{daysRemaining > 0 ? 'Active' : 'Expired'}</span>
                   </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                   <p className="text-xs font-medium text-slate-500">Valid Until</p>
                   <p className="text-sm font-bold text-slate-900">{membershipEnd ? formatDate(membershipEnd) : "—"}</p>
                </div>
             </div>
          </div>

          {/* Gym Announcement Placeholder */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 border-dashed">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                <Megaphone className="w-5 h-5 text-slate-400" />
             </div>
             <p className="text-sm font-bold text-slate-900">Gym Announcements</p>
             <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Important updates and offers from your gym will appear here.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
