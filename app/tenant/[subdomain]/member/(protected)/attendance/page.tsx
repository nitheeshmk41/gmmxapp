import { getCurrentUser } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, AttendanceDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { Calendar, UserCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function MemberAttendancePage() {
  const user = await getCurrentUser();
  
  let attendance: AttendanceDocument[] = [];

  if (user) {
    try {
      const { databases } = await createAdminClient();
      const res = await databases.listDocuments<AttendanceDocument>(
        APPWRITE_DB_ID,
        COLLECTIONS.ATTENDANCE,
        [Query.equal("memberId", user.id), Query.orderDesc("date"), Query.limit(30)]
      );
      attendance = res.documents;
    } catch (error) {
      console.error("Failed to fetch attendance logs", error);
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">My Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Review your recent check-in logs and training attendance.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {attendance.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-semibold">No attendance check-ins found</p>
            <p className="text-xs text-slate-400 mt-1">Scan the QR code at the reception when arriving at the gym.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {attendance.map((log) => (
                <tr key={log.$id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-700">{formatDate(log.date)}</td>
                  <td className="p-4 text-slate-600">
                    {log.markedAt ? new Date(log.markedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                      <UserCheck size={12} /> {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
