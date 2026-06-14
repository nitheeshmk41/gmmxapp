import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, MemberDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { Users, Phone, Shield } from "lucide-react";

export default async function TrainerMembersPage() {
  const user = await getCurrentUser();
  const gym = await getCurrentGym();
  
  let assignedMembers: MemberDocument[] = [];

  if (user && gym) {
    try {
      const { databases } = await createAdminClient();
      
      const trainersRes = await databases.listDocuments(
        APPWRITE_DB_ID,
        COLLECTIONS.TRAINERS,
        [Query.equal("gymId", gym.$id), Query.equal("userId", user.id)]
      );
      if (trainersRes.documents.length > 0) {
        const trainerDoc = trainersRes.documents[0];
        const membersRes = await databases.listDocuments<MemberDocument>(
          APPWRITE_DB_ID,
          COLLECTIONS.MEMBERS,
          [Query.equal("gymId", gym.$id), Query.equal("trainerId", trainerDoc.$id)]
        );
        assignedMembers = membersRes.documents;
      }
    } catch (error) {
      console.error("Failed to fetch trainer members", error);
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">My Members</h1>
        <p className="text-slate-500 text-sm mt-1">Review contact details and metrics for all members assigned to you.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {assignedMembers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-semibold">No assigned members found</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Member</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Goal</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Metrics</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {assignedMembers.map((member) => (
                <tr key={member.$id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-950">{member.name}</td>
                  <td className="p-4">
                    <a href={`tel:${member.phone}`} className="flex items-center gap-1 text-slate-600 hover:text-[#FF5C73]">
                      <Phone size={13} /> {member.phone}
                    </a>
                  </td>
                  <td className="p-4 text-slate-600">{member.goal || "—"}</td>
                  <td className="p-4 text-slate-600">
                    {member.height ? `${member.height}cm` : "—"} / {member.weight ? `${member.weight}kg` : "—"}
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
