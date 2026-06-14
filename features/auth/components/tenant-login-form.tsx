"use client";

import { useState } from "react";
import { signInWithEmail } from "@/features/auth/actions";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface Props {
  roleType?: "admin" | "trainer" | "member";
}

export function TenantLoginForm({ roleType = "member" }: Props) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    
    // If it's a 10 digit phone number without email, we can convert it to a dummy email used internally
    let finalEmail = emailOrPhone;
    if (/^\d{10}$/.test(emailOrPhone)) {
      finalEmail = `${emailOrPhone}@phone.gmmx.app`;
    }
    
    formData.append("email", finalEmail);
    formData.append("password", password);

    const res = await signInWithEmail(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
    // Success will redirect
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {roleType === "member" ? "Phone Number or Email" : "Email or Phone"}
        </label>
        <input
          type="text"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          placeholder={roleType === "member" ? "Enter your phone number" : "Enter your email or phone"}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] outline-none transition-all text-slate-900 placeholder-slate-400"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Password
          </label>
          <a href="#" className="text-sm font-semibold text-[#FF5C73] hover:text-[#FF5C73]/80">
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] outline-none transition-all text-slate-900 placeholder-slate-400"
            required
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="checkbox" 
          id="remember" 
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="w-4 h-4 text-[#FF5C73] border-slate-300 rounded focus:ring-[#FF5C73]" 
        />
        <label htmlFor="remember" className="text-sm font-medium text-slate-700 cursor-pointer">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 mt-2"
        style={{ background: "#FF5C73", boxShadow: "0 4px 14px rgba(255,92,115,0.3)" }}
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? "Signing in..." : "Login"}
      </button>

      {roleType === "member" && (
        <div className="text-center mt-6">
          <a href="?method=otp" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            Login with OTP instead
          </a>
        </div>
      )}
    </form>
  );
}
