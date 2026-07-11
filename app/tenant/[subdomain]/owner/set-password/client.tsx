"use client";

import { useState, useEffect } from "react";
import { completePasswordSetup } from "@/features/auth/actions";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export function SetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams?.get("userId");
  const secret = searchParams?.get("secret");

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Live validation states
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecial;
  const doPasswordsMatch = password === passwordAgain && password.length > 0;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/owner/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !secret) {
      setError("Invalid or expired password reset link.");
      return;
    }
    
    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("secret", secret);
    formData.append("password", password);
    formData.append("passwordAgain", passwordAgain);

    const res = await completePasswordSetup(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (!userId || !secret) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h2>
            <p className="text-sm text-slate-500 mb-6">This password reset link is invalid or has expired.</p>
            <a href="/owner/login" className="text-[#FF5C73] font-semibold hover:underline">Back to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-slate-100">
          <div className="mb-8 text-center animate-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Create Your Password</h1>
            <p className="text-[15px] text-slate-500 font-medium">You're almost ready. Create a secure password to protect your workspace.</p>
          </div>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Password created!</h2>
              <p className="text-sm text-slate-500">Redirecting to Dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73] outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                    placeholder="Enter new password"
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

              {/* Password Strength Checklist */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Password requirements</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${hasMinLength ? 'text-green-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={16} className={hasMinLength ? "opacity-100" : "opacity-30"} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${hasUppercase ? 'text-green-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={16} className={hasUppercase ? "opacity-100" : "opacity-30"} />
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${hasNumber ? 'text-green-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={16} className={hasNumber ? "opacity-100" : "opacity-30"} />
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${hasSpecial ? 'text-green-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={16} className={hasSpecial ? "opacity-100" : "opacity-30"} />
                    <span>Special character</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordAgain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-xl border focus:ring-2 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium ${
                      passwordAgain.length > 0 && !doPasswordsMatch
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400 bg-red-50/30'
                        : doPasswordsMatch
                        ? 'border-green-300 focus:ring-green-100 focus:border-green-400'
                        : 'border-slate-200 focus:ring-[#FF5C73]/20 focus:border-[#FF5C73]'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid || !doPasswordsMatch}
                className="w-full py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 mt-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                style={{ background: "#FF5C73", boxShadow: "0 8px 20px -4px rgba(255,92,115,0.4)" }}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Saving..." : "Create Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
