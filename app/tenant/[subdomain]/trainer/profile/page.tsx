import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { User, Award, BookOpen, Calendar } from "lucide-react";

export default async function TrainerProfilePage() {
  const user = await getCurrentUser();
  const gym = await getCurrentGym();
  
  let trainerDoc: any = null;

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
      }
    } catch (error) {
      console.error("Failed to fetch trainer profile", error);
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Review your contact information and public trainer bio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF5C73] flex items-center justify-center text-white text-2xl font-bold mb-4">
            {user?.name ? user.name[0].toUpperCase() : "T"}
          </div>
          <h2 className="font-bold text-slate-900 text-base">{user?.name}</h2>
          <p className="text-xs text-slate-400 mt-1">{user?.email || "No Email linked"}</p>
          <p className="text-xs font-semibold text-slate-500 mt-3 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">{trainerDoc?.phone}</p>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Award size={13} /> Specialization
              </p>
              <p className="text-sm text-slate-700 font-bold">{trainerDoc?.specialization || "General Fitness Coach"}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Calendar size={13} /> Experience
              </p>
              <p className="text-sm text-slate-700 font-bold">{trainerDoc?.experienceYears ? `${trainerDoc.experienceYears} Years` : "—"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <BookOpen size={13} /> Public Bio
            </p>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{trainerDoc?.bio || "No biography added yet."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
