import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { Users, Award, ShieldCheck } from "lucide-react";

export default async function TrainerDashboardPage() {
  const user = await getCurrentUser();
  const gym = await getCurrentGym();
  
  let trainerDoc: any = null;
  let membersCount = 0;

  if (user && gym) {
    try {
      const { databases } = await createAdminClient();
      const trainersRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.TRAINERS,
        [Query.equal("gymId", gym.$id), Query.equal("userId", user.id)]
      );
      if (trainersRes.documents.length > 0) {
        trainerDoc = trainersRes.documents[0];
        const membersRes = await databases.listDocuments(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERS,
          [Query.equal("gymId", gym.$id), Query.equal("trainerId", trainerDoc.$id)]
        );
        membersCount = membersRes.total;
      }
    } catch (error) {
      console.error("Failed to fetch trainer stats", error);
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">Welcome, Coach {user?.name || "Trainer"}!</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your training rosters and bio details from your portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Members Count Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF5C73]/10 flex items-center justify-center border border-[#FF5C73]/20 shrink-0">
            <Users className="w-5 h-5 text-[#FF5C73]" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Assigned Clients</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{membersCount} Member{membersCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Specialization Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Specialization</p>
            <p className="text-base font-bold text-slate-900 mt-1 truncate">{trainerDoc?.specialization || "General Trainer"}</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-2">Roster Management</h3>
        <p className="text-sm text-slate-500">
          Check the "My Members" tab at the top of the page to review client metrics, body goals, contact info, and attendance schedules.
        </p>
      </div>
    </div>
  );
}
