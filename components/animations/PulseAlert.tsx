"use client";

import { ReactNode } from "react";

interface PulseAlertProps {
  children: ReactNode;
  active?: boolean;
  colorClass?: string; // e.g. "bg-red-500"
  className?: string;
}

export function PulseAlert({
  children,
  active = true,
  colorClass = "bg-red-500",
  className = "",
}: PulseAlertProps) {
  if (!active) return <>{children}</>;

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Outer pulsing ring */}
      <div className={`absolute -inset-1 rounded-lg ${colorClass} opacity-20 animate-pulse`} />
      {/* Inner component */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
