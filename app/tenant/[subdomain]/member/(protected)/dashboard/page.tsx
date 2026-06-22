import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { getMemberById } from "@/features/members/actions";
import { CheckCircle2, Dumbbell, Activity, Calendar, Phone, MessageCircle, AlertTriangle, CreditCard, Flame, ArrowRight, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

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

  return (
    <div className="space-y-5 animate-in max-w-md mx-auto">
      
      {/* 1. Compact Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-tight">
            Hi, {user?.name?.split(' ')[0] || "Member"} 👋
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            {memberDetails?.plan?.name || "No Active Plan"} • <span className={daysRemaining <= 7 ? "text-red-500 font-bold" : "text-emerald-600 font-bold"}>{daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Expired'}</span>
          </p>
        </div>
        <Link href="/member/payments" className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0">
          Renew
        </Link>
      </div>

      {/* 2. Action Center */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 px-1">Today's Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/member/attendance" className="bg-[#FF5C73] hover:bg-red-500 text-white rounded-2xl p-4 flex flex-col justify-between h-28 shadow-sm transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
               <CheckCircle2 size={18} className="text-white" />
             </div>
             <span className="font-bold text-sm">Mark<br/>Attendance</span>
          </Link>
          
          <a href={`https://wa.me/${gym?.phone || ""}`} target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-4 flex flex-col justify-between h-28 shadow-sm transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
               <MessageCircle size={18} className="text-white" />
             </div>
             <span className="font-bold text-sm">Contact<br/>Trainer</span>
          </a>

          <Link href="/member/payments" className="bg-white border border-slate-100 hover:border-slate-300 text-slate-900 rounded-2xl p-4 flex flex-col justify-between h-28 shadow-sm transition-all group relative overflow-hidden">
             {daysRemaining <= 7 && daysRemaining >= 0 && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             )}
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
               <CreditCard size={18} className="text-slate-600" />
             </div>
             <span className="font-bold text-sm">Renew<br/>Membership</span>
          </Link>

          <button className="bg-white border border-slate-100 hover:border-slate-300 text-slate-900 rounded-2xl p-4 flex flex-col justify-between h-28 shadow-sm transition-all group text-left opacity-60 cursor-not-allowed">
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
               <Dumbbell size={18} className="text-slate-600" />
             </div>
             <span className="font-bold text-sm leading-tight">View<br/>Workout <span className="text-[10px] font-normal text-slate-400 block mt-0.5">Coming Soon</span></span>
          </button>
        </div>
      </div>

      {/* 3. Gamified Progress */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
         <div className="flex items-center justify-between">
           <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF5C73]" />
              Monthly Progress
           </h2>
           <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{attendanceThisMonth} / 20 Days</span>
         </div>
         
         <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
               <div className="bg-[#FF5C73] h-2.5 rounded-full" style={{ width: `${Math.min((attendanceThisMonth / 20) * 100, 100)}%` }}></div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 text-right">Target: 20 visits</p>
         </div>

         <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                 <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                 <p className="text-xs font-medium text-slate-400">Current Streak</p>
                 <p className="text-lg font-black text-slate-900 leading-tight">{currentStreak} <span className="text-xs font-bold text-slate-500">Days</span></p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                 <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                 <p className="text-xs font-medium text-slate-400">Last Visit</p>
                 <p className="text-base font-bold text-slate-900 leading-tight truncate">{lastVisitText}</p>
              </div>
           </div>
         </div>
      </div>

      {/* 4. Visual Attendance Timeline */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
         <div className="flex items-center justify-between">
           <h2 className="text-sm font-bold text-slate-900">Recent Attendance</h2>
           <Link href="/member/attendance" className="text-xs font-bold text-slate-400 hover:text-[#FF5C73] transition-colors flex items-center gap-1">
             History <ArrowRight size={12} />
           </Link>
         </div>
         
         <div className="flex items-center justify-between px-1">
           {last7Days.map((d, i) => {
              const dateStr = d.toISOString().split('T')[0];
              const isAttended = attendanceDates.has(dateStr);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
              
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">{dayName}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAttended ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-slate-50 border border-slate-100'}`}>
                    {isAttended ? <CheckCircle2 size={14} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>}
                  </div>
                </div>
              );
           })}
         </div>
      </div>

      {/* 5. Trainer Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
             <User size={18} className="text-slate-400" />
           </div>
           <div>
             <p className="text-sm font-bold text-slate-900">Arun Kumar</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Assigned Trainer</p>
           </div>
         </div>
         <div className="flex items-center gap-2">
           <a href={`tel:${gym?.phone || ""}`} className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors">
             <Phone size={14} className="text-slate-600" />
           </a>
           <a href={`https://wa.me/${gym?.phone || ""}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-colors">
             <MessageCircle size={14} />
           </a>
         </div>
      </div>

    </div>
  );
}
