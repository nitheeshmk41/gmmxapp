"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/features/auth/actions";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const result = await resetPassword(formData);

    if (result?.error) setError(result.error);
    if (result?.success) setSuccess(result.success);
    setLoading(false);
  }

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-foreground)" }}>
          Reset your password
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {success ? (
        <div
          className="p-5 rounded-xl text-center space-y-3"
          style={{ background: "var(--color-success-light)", border: "1px solid #86efac" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "#16a34a" }}
          >
            <Mail size={20} className="text-white" />
          </div>
          <p className="font-semibold text-sm" style={{ color: "#15803d" }}>
            Check your email
          </p>
          <p className="text-xs" style={{ color: "#166534" }}>
            We sent a password reset link to your email address.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                background: "var(--color-danger-light)",
                color: "#dc2626",
                border: "1px solid #fca5a5",
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium"
              style={{ color: "var(--color-foreground)" }}
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@yourgym.com"
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-all"
              style={{
                border: "1.5px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-brand-primary)";
                e.target.style.boxShadow = "0 0 0 3px rgba(255,92,115,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
            style={{
              background: "var(--color-brand-primary)",
              boxShadow: "var(--shadow-brand)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
