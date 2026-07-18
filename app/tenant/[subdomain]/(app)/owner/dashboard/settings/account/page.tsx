import { UserCircle } from "lucide-react";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-6 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Account Settings</h2>
              <p className="text-sm text-slate-500">Manage your personal profile and preferences</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-500">Account settings coming soon...</p>
        </div>
      </div>
    </div>
  );
}
