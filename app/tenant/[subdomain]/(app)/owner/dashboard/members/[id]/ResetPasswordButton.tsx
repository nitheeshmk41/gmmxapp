"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { resendPasswordEmail } from "@/features/members/actions";

export function ResetPasswordButton({ memberId, memberEmail }: { memberId: string; memberEmail: string | null }) {
  const [isPending, setIsPending] = useState(false);

  async function handleReset() {
    if (!memberEmail) {
      toast.error("This member does not have an email address.");
      return;
    }
    
    if (!confirm(`Are you sure you want to generate a new temporary password and email it to ${memberEmail}?`)) {
      return;
    }

    setIsPending(true);
    const promise = resendPasswordEmail(memberId);
    
    toast.promise(promise, {
      loading: "Generating new password...",
      success: (res) => {
        if (res?.error) throw new Error(res.error);
        return "Password reset email sent successfully!";
      },
      error: (err) => err.message || "Failed to reset password."
    });

    try {
      await promise;
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleReset}
      disabled={isPending || !memberEmail}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        !memberEmail ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        color: "var(--color-foreground)",
      }}
      title={!memberEmail ? "Member needs an email address" : "Reset member's password"}
    >
      <KeyRound size={14} />
      {isPending ? "Sending..." : "Reset Password"}
    </button>
  );
}
