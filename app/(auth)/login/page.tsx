"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signInWithGoogle } from "@/features/auth/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
          Welcome back 👋
        </h2>
        <p className="text-[15px] leading-relaxed text-slate-500 font-medium">
          Manage members, payments, attendance,<br className="hidden sm:block" />and your gym website from one place.
        </p>
      </div>

      {/* Google Login Button */}
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or sign in with email</span>
        <hr className="flex-1 border-slate-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            className="p-3 rounded-lg text-sm bg-rose-50 border border-rose-200 text-rose-600 font-medium"
          >
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-bold text-slate-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="e.g. owner@gym.com"
            className="w-full px-4 py-3 rounded-xl text-sm transition-all border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#FF5C73] focus:bg-white focus:ring-4 focus:ring-[#FF5C73]/10"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-slate-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-[#FF5C73] hover:text-rose-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 hover:bg-rose-500 active:scale-[0.98]"
          style={{
            background: "#FF5C73",
            boxShadow: "0 4px 14px rgba(255,92,115,0.3)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in…" : "Sign In to Dashboard"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#FF5C73] hover:text-rose-600 transition-colors"
        >
          Start free trial
        </Link>
      </p>
    </div>
  );
}
