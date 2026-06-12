"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp, signInWithGoogle } from "@/features/auth/actions";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    // Minimal client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  // Simple password strength calculation for UI visual
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 5) return 1;
    if (password.length < 8) return 2;
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 3;
    return 2; // Medium fallback if >= 8 chars but missing numbers/caps
  };
  const strength = getPasswordStrength();

  return (
    <div className="animate-in">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
          Start your free trial
        </h2>
        <p className="text-[15px] font-medium text-slate-500">
          14 days free • No credit card required
        </p>
      </div>

      {/* Google Sign Up Button */}
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm mb-6"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
          Continue with Google
        </button>
      </form>

      <div className="flex items-center gap-3 mb-6">
        <hr className="flex-1 border-slate-100" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or register with email</span>
        <hr className="flex-1 border-slate-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg text-sm bg-rose-50 border border-rose-200 text-rose-600 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-bold text-slate-700">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-3 rounded-xl text-sm transition-all border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#FF5C73] focus:bg-white focus:ring-4 focus:ring-[#FF5C73]/10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-bold text-slate-700">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. owner@gym.com"
            className="w-full px-4 py-3 rounded-xl text-sm transition-all border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#FF5C73] focus:bg-white focus:ring-4 focus:ring-[#FF5C73]/10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-bold text-slate-700">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-xl text-sm transition-all border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#FF5C73] focus:bg-white focus:ring-4 focus:ring-[#FF5C73]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Password Strength & Hint */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 w-1/2">
              <div className="flex gap-1.5 flex-1">
                <div className={`h-1.5 flex-1 rounded-full ${strength >= 1 ? (strength === 1 ? 'bg-rose-400' : (strength === 2 ? 'bg-amber-400' : 'bg-emerald-500')) : 'bg-slate-200'}`} />
                <div className={`h-1.5 flex-1 rounded-full ${strength >= 2 ? (strength === 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                <div className={`h-1.5 flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${strength === 0 ? 'text-slate-400' : strength === 1 ? 'text-rose-500' : strength === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {strength === 0 ? "Weak" : strength === 1 ? "Weak" : strength === 2 ? "Medium" : "Strong"}
              </span>
            </div>
            <span className={`text-[11px] font-semibold flex items-center gap-1 ${password.length >= 8 ? 'text-emerald-500' : 'text-slate-400'}`}>
              <Check size={12} /> 8+ characters
            </span>
          </div>
        </div>

        <label className="flex items-start gap-2.5 pt-2 pb-1 cursor-pointer group">
          <input type="checkbox" required className="mt-1 flex-shrink-0 accent-[#FF5C73]" />
          <span className="text-xs font-medium text-slate-500 leading-snug">
            I agree to the <a href="#" className="font-bold text-[#FF5C73] hover:text-rose-600 transition-colors">Terms of Service</a> and <a href="#" className="font-bold text-[#FF5C73] hover:text-rose-600 transition-colors">Privacy Policy</a>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 mt-2 hover:bg-rose-500 active:scale-[0.98]"
          style={{
            background: "#FF5C73",
            boxShadow: "0 4px 14px rgba(255,92,115,0.3)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating your gym…" : "Create My Gym →"}
        </button>
        
        <p className="text-center text-xs font-bold text-slate-400 mt-3 flex items-center justify-center gap-1.5">
          Setup takes less than 5 minutes
        </p>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#FF5C73] hover:text-rose-600 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
