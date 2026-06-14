import { getCurrentUser } from "@/features/auth/actions";
import { getMemberById } from "@/features/members/actions";
import { User, Activity, Goal, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function MemberProfilePage() {
  const user = await getCurrentUser();
  
  let memberDetails: any = null;
  if (user) {
    memberDetails = await getMemberById(user.id);
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Review your contact and body metrics registered in GMMX.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF5C73] flex items-center justify-center text-white text-2xl font-bold mb-4">
            {user?.name ? user.name[0].toUpperCase() : "M"}
          </div>
          <h2 className="font-bold text-slate-900 text-base">{user?.name}</h2>
          <p className="text-xs text-slate-400 mt-1">{user?.email || "No Email linked"}</p>
          <p className="text-xs font-semibold text-slate-500 mt-3 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">{memberDetails?.phone}</p>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <User size={13} /> Personal Specs
              </p>
              <div className="space-y-1">
                <p className="text-sm text-slate-700">Age: <span className="font-bold">{memberDetails?.age || "—"}</span></p>
                <p className="text-sm text-slate-700 capitalize">Gender: <span className="font-bold">{memberDetails?.gender || "—"}</span></p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Activity size={13} /> Body Metrics
              </p>
              <div className="space-y-1">
                <p className="text-sm text-slate-700">Height: <span className="font-bold">{memberDetails?.height ? `${memberDetails.height} cm` : "—"}</span></p>
                <p className="text-sm text-slate-700">Weight: <span className="font-bold">{memberDetails?.weight ? `${memberDetails.weight} kg` : "—"}</span></p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Goal size={13} /> Fitness Goal
            </p>
            <p className="text-sm text-slate-700 font-medium">{memberDetails?.goal || "None specified yet."}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={13} />
            <span>Joined on {memberDetails?.join_date ? formatDate(new Date(memberDetails.join_date)) : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
