import { getCurrentGym } from "@/features/auth/actions";
import { Building2 } from "lucide-react";

export default async function GymProfileSettings() {
  const gym = await getCurrentGym();
  
  if (!gym) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="border-b border-slate-100 p-6 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Gym Information</h2>
            <p className="text-sm text-slate-500">Your primary business details</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {[
            { label: "Gym Name", value: gym.name },
            { label: "Owner Name", value: gym.owner_name },
            { label: "Phone", value: gym.phone },
            { label: "Email", value: gym.email },
            { label: "City", value: gym.city || "" },
            { label: "State", value: gym.state || "" },
            { label: "Subdomain", value: `${gym.subdomain}.gmmx.app` },
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
              <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-900">
                {field.value || "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 rounded-xl bg-orange-50 border border-orange-100">
          <p className="text-sm text-orange-800 font-medium">
            To update gym information or your subdomain, please contact GMMX support.
          </p>
        </div>
      </div>
    </div>
  );
}
