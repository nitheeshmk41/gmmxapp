"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { removeGym } from "../actions";
import { useRouter } from "next/navigation";

export default function RemoveGymButton({ gymId }: { gymId: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this gym? This action cannot be undone.")) return;
    
    setIsPending(true);
    const res = await removeGym(gymId);
    if (res.success) {
      router.push("/admin/gyms");
    } else {
      alert(res.error || "Failed to remove gym");
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 text-white disabled:opacity-50"
      style={{ background: "#ef4444" }}
    >
      {isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
      Delete Gym
    </button>
  );
}
