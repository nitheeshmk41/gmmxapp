"use client";

import { useState } from "react";
import { signInWithGoogle, signInWithEmail, checkAuthMethod, sendPasswordCreationEmail } from "@/features/auth/actions";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface Props {
  roleType?: "admin" | "trainer" | "member";
  hideOtpLink?: boolean;
}

export function TenantLoginForm({ roleType = "member", hideOtpLink = false }: Props) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleOnlyUser, setGoogleOnlyUser] = useState(false);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);

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
    
    const authCheck = await checkAuthMethod(finalEmail);
    if (authCheck?.method === "google") {
      setGoogleOnlyUser(true);
      setLoading(false);
      return;
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

  if (passwordEmailSent) {
    return (
      <div className="p-6 bg-green-50 border border-green-100 rounded-xl text-center animate-in fade-in">
        <h3 className="font-semibold text-green-900 mb-2">Check your email</h3>
        <p className="text-sm text-green-700">
          We've sent a password creation link to <strong>{emailOrPhone}</strong>.
        </p>
      </div>
    );
  }

  if (googleOnlyUser) {
    return (
      <div className="space-y-4 animate-in fade-in">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
          <h3 className="font-semibold text-blue-900 mb-1">This account uses Google Sign-In.</h3>
          <p className="text-sm text-blue-700">You haven't set a password for this account yet.</p>
        </div>
        
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
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

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500 font-medium">or</span>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError("");
            let finalEmail = emailOrPhone;
            if (/^\d{10}$/.test(emailOrPhone)) {
              finalEmail = `${emailOrPhone}@phone.gmmx.app`;
            }
            const res = await sendPasswordCreationEmail(finalEmail, window.location.origin);
            if (res.success) setPasswordEmailSent(true);
            else setError(res.error || "Failed to send email");
            setLoading(false);
          }}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Password
        </button>
      </div>
    );
  }

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

      {!hideOtpLink && roleType === "member" && (
        <div className="text-center mt-6">
          <a href="?method=otp" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            Login with OTP instead
          </a>
        </div>
      )}
    </form>
  );
}
