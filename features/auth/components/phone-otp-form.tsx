"use client";

import { useState } from "react";
import { sendOtp, verifyOtp } from "@/features/auth/actions";
import { Loader2 } from "lucide-react";

export function PhoneOtpForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await sendOtp(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success && result.userId) {
      setUserId(result.userId);
      setStep("otp");
    }
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("userId", userId);
    
    const result = await verifyOtp(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg text-sm bg-rose-50 border border-rose-200 text-rose-600 font-medium">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-bold text-slate-700">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-3 rounded-xl text-sm transition-all border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#FF5C73] focus:bg-white focus:ring-4 focus:ring-[#FF5C73]/10"
            />
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
            {loading ? "Sending OTP…" : "Continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg text-sm bg-rose-50 border border-rose-200 text-rose-600 font-medium">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="secret" className="block text-sm font-bold text-slate-700">
              Enter the 6-digit OTP sent to {phone}
            </label>
            <input
              id="secret"
              name="secret"
              type="text"
              required
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl text-sm transition-all border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#FF5C73] focus:bg-white focus:ring-4 focus:ring-[#FF5C73]/10 text-center tracking-widest font-mono text-lg"
              maxLength={6}
            />
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
            {loading ? "Verifying…" : "Sign In"}
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Use a different phone number
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
