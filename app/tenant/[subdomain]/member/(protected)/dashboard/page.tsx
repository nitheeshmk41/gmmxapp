import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { getMemberById } from "@/features/members/actions";
import { CheckCircle2, Clock, Calendar, Activity, User, CreditCard, Phone, MessageCircle, AlertTriangle } from "lucide-react";
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

  return (
    <div className="space-y-6 animate-in">
      {/* Hero */}
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
          Welcome Back, {user?.name?.split(' ')[0] || "Member"} 👋
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Member ID: {memberDetails?.memberCode || "—"} • {gym?.name || "Gym"}
        </p>
      </div>

      {/* Renewal Warning */}
      {daysRemaining <= 7 && daysRemaining >= 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-900">
              Membership expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
            </p>
          </div>
          <Link href="/member/payments" className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors text-center w-full sm:w-auto">
            Renew Membership
          </Link>
        </div>
      )}
      
      {daysRemaining < 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-900">
              Membership expired {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'day' : 'days'} ago
            </p>
          </div>
          <Link href="/member/payments" className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors text-center w-full sm:w-auto">
            Renew Membership
          </Link>
        </div>
      )}

      {/* Membership Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${memberDetails?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-bold text-slate-900 capitalize">{memberDetails?.status || "Active"}</span>
          </div>
          {daysRemaining > 0 && (
             <span className="badge-brand font-bold">{daysRemaining} Days Left</span>
          )}
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">Current Plan</p>
            <p className="text-base font-bold text-slate-900 mt-0.5 truncate">{memberDetails?.plan?.name || "No Plan"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Valid Until</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {membershipEnd ? formatDate(membershipEnd) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium mb-1">Visits This Month</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{attendanceThisMonth}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium mb-1">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{currentStreak}</span>
            <span className="text-xs font-bold text-[#FF5C73]">Days</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
          <p className="text-xs text-slate-400 font-medium mb-1">Last Visit</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{lastVisitText}</span>
          </div>
        </div>
      </div>

      {/* Two columns for Trainer and Recent Attendance on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Check-ins</h3>
          </div>
          <div className="p-0 flex-1">
            {attendance.length > 0 ? (
              <ul className="divide-y divide-slate-50">
                {attendance.slice(0, 3).map((a: any) => (
                  <li key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-bold text-slate-700">{formatDate(a.date)}</span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{a.time || "—"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-400">No recent check-ins.</p>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
             <Link href="/member/attendance" className="text-xs font-bold text-slate-500 hover:text-[#FF5C73] transition-colors">View All History →</Link>
          </div>
        </div>

        {/* Assigned Trainer & Payment Summary */}
        <div className="space-y-6">
          {/* Trainer */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
             <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF5C73]" />
                Assigned Trainer
             </h3>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-lg font-black text-slate-400">AK</span>
                </div>
                <div>
                   <p className="text-base font-bold text-slate-900">Arun Kumar</p>
                   <p className="text-xs font-medium text-slate-500">Strength Coach • 8 Yrs Exp</p>
                </div>
             </div>
             <button className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-lg transition-colors border border-slate-200">
                Contact Trainer
             </button>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
             <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Recent Payment
             </h3>
             {latestPayment ? (
               <div>
                 <div className="flex justify-between items-baseline mb-1">
                   <p className="text-2xl font-black text-slate-900">₹{latestPayment.amount}</p>
                   <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md capitalize">{latestPayment.status || "Paid"}</p>
                 </div>
                 <p className="text-xs text-slate-500 font-medium mb-3">
                   Paid on {formatDate(latestPayment.paid_at)}
                 </p>
                 <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">Next Renewal</span>
                    <span className="text-sm font-bold text-slate-900">{membershipEnd ? formatDate(membershipEnd) : "—"}</span>
                 </div>
               </div>
             ) : (
               <p className="text-sm text-slate-500">No payment history.</p>
             )}
          </div>
        </div>
      </div>

      {/* Quick Help */}
      <div className="grid grid-cols-2 gap-4">
         <a href={`tel:${gym?.phone || ""}`} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-[#FF5C73] transition-colors group">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
               <Phone className="w-4 h-4 text-slate-600 group-hover:text-[#FF5C73]" />
            </div>
            <span className="text-xs font-bold text-slate-700">Call Gym</span>
         </a>
         <a href={`https://wa.me/${gym?.phone || ""}`} target="_blank" rel="noreferrer" className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-[#FF5C73] transition-colors group">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
               <MessageCircle className="w-4 h-4 text-slate-600 group-hover:text-[#FF5C73]" />
            </div>
            <span className="text-xs font-bold text-slate-700">WhatsApp</span>
         </a>
      </div>

    </div>
  );
}
