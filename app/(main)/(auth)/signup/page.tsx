"use client";

import { signInWithGoogle, signUpWithEmail } from "@/features/auth/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

function ErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  if (!error) return null;

  let message = "An error occurred during authentication.";
  if (error === "oauth_configuration_error") {
    message = "Login is currently disabled. The site owner must add this domain to their Appwrite OAuth Platforms.";
  } else if (error === "oauth_failed") {
    message = "Google login failed or was canceled.";
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
      {message}
    </div>
  );
}

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [passwordError, setPasswordError] = useState("");

  async function onSubmit(formData: FormData) {
    const pwd = formData.get("password") as string;
    const confirmPwd = formData.get("confirmPassword") as string;

    if (pwd !== confirmPwd) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setLoading(true);
    setError("");
    const res = await signUpWithEmail(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
          Start your free trial 🚀
        </h2>
        <p className="text-[15px] leading-relaxed text-slate-500 font-medium">
          Create your fitness business and get a professional website in minutes.
        </p>
      </div>

      <Suspense fallback={null}>
        <ErrorBanner />
      </Suspense>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Primary Google Signup */}
      <form action={signInWithGoogle} className="mb-6">
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
          Continue with Google
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-slate-500 font-medium">or continue with email</span>
        </div>
      </div>

      <form ref={formRef} action={onSubmit} className="space-y-4 mb-6 animate-in slide-in-from-bottom-4">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF5C73] focus:ring-1 focus:ring-[#FF5C73] outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Karthik Raj"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF5C73] focus:ring-1 focus:ring-[#FF5C73] outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
            <PasswordInput
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
              showStrength={true}
              onChange={() => setPasswordError("")}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
            <PasswordInput
              name="confirmPassword"
              required
              minLength={8}
              placeholder="••••••••"
              onChange={() => setPasswordError("")}
            />
            {passwordError && (
              <p className="text-xs text-red-500 mt-1 font-medium">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !!passwordError}
            className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold text-white bg-[#FF5C73] hover:bg-rose-600 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-bold text-[#FF5C73] hover:text-rose-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
