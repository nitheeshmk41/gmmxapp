"use client";

import { useState } from "react";
import { changeInitialPassword } from "@/features/auth/actions";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function ChangePasswordClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("password", password);
    const res = await changeInitialPassword(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl border border-slate-100 w-full max-w-md space-y-6">
         <div className="text-center">
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Change Default Password</h1>
           <p className="text-slate-500 text-sm font-medium mt-2">Please set a new secure password for your gym account before accessing the dashboard.</p>
         </div>
         
         {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">{error}</div>}

         <div>
           <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
           <div className="relative">
             <input 
               type={showPassword ? "text" : "password"} 
               value={password}
               onChange={e => setPassword(e.target.value)}
               className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#FF5C73] focus:border-[#FF5C73] outline-none transition-all text-sm"
               required minLength={8}
               placeholder="••••••••"
             />
             <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
             >
               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
           </div>
         </div>

         <div>
           <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
           <div className="relative">
             <input 
               type={showConfirmPassword ? "text" : "password"} 
               value={confirmPassword}
               onChange={e => setConfirmPassword(e.target.value)}
               className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#FF5C73] focus:border-[#FF5C73] outline-none transition-all text-sm"
               required minLength={8}
               placeholder="••••••••"
             />
             <button
               type="button"
               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
               className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
             >
               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
           </div>
         </div>

         <button type="submit" disabled={loading} className="w-full bg-[#FF5C73] hover:bg-rose-600 transition-all text-white font-bold p-3.5 rounded-xl flex items-center justify-center">
           {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
           Save & Continue
         </button>
       </form>
    </div>
  );
}
