"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ExternalLink } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/members": "Members",
  "/dashboard/leads": "Leads",
  "/dashboard/trainers": "Trainers",
  "/dashboard/plans": "Membership Plans",
  "/dashboard/payments": "Payments",
  "/dashboard/attendance": "Attendance",
  "/dashboard/expiry": "Expiry Management",
  "/dashboard/website": "Website Builder",
  "/dashboard/domain": "Domain Management",
  "/dashboard/settings": "Settings",
};

interface TopbarProps {
  gymSubdomain?: string;
}

export function Topbar({ gymSubdomain }: TopbarProps) {
  const pathname = usePathname();

  // Find the matching page title
  const title =
    Object.entries(PAGE_TITLES).find(([key]) => {
      if (key === "/dashboard") return pathname === key;
      return pathname.startsWith(key);
    })?.[1] || "Dashboard";

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between h-16 px-6"
      style={{
        background: "rgba(248,250,252,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Page title */}
      <div>
        <h1 className="text-lg font-bold" style={{ color: "var(--color-foreground)" }}>
          {title}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Search shortcut */}
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted-foreground)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
          }}
        >
          <Search size={13} />
          <span>Search…</span>
          <kbd
            className="ml-2 px-1.5 py-0.5 rounded text-xs"
            style={{ background: "var(--color-border)", color: "var(--color-muted-foreground)", fontFamily: "monospace" }}
          >
            ⌘K
          </kbd>
        </button>

        {/* View website */}
        {gymSubdomain && (
          <a
            href={`https://${gymSubdomain}.gmmx.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: "var(--color-brand-light)",
              color: "var(--color-brand-primary)",
              border: "1px solid rgba(255,92,115,0.2)",
            }}
          >
            <ExternalLink size={12} />
            View Site
          </a>
        )}

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted-foreground)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-primary)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-brand-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-muted-foreground)";
          }}
        >
          <Bell size={16} />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--color-brand-primary)" }}
          />
        </button>
      </div>
    </header>
  );
}
