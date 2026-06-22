"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/60 rounded-md ${className}`}
    />
  );
}

export function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid var(--color-border-muted)" }}>
      <td className="px-4 py-4"><div className="flex gap-3 items-center"><Skeleton className="w-9 h-9 rounded-full" /><div className="space-y-2"><Skeleton className="w-24 h-4" /><Skeleton className="w-32 h-3" /></div></div></td>
      <td className="px-4 py-4"><Skeleton className="w-24 h-4" /></td>
      <td className="px-4 py-4"><div className="space-y-2"><Skeleton className="w-20 h-4" /><Skeleton className="w-16 h-3" /></div></td>
      <td className="px-4 py-4"><Skeleton className="w-24 h-4" /></td>
      <td className="px-4 py-4"><Skeleton className="w-16 h-6 rounded-full" /></td>
      <td className="px-4 py-4"><div className="flex justify-end gap-2"><Skeleton className="w-7 h-7 rounded-lg" /><Skeleton className="w-7 h-7 rounded-lg" /><Skeleton className="w-7 h-7 rounded-lg" /></div></td>
    </tr>
  );
}
