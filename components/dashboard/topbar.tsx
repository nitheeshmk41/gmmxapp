"use client";

import { usePathname } from "next/navigation";
import { Bell, ExternalLink, Dumbbell } from "lucide-react";
import { GlobalSearch } from "./global-search";
import { MobileNav } from "./mobile-nav";
import { NotificationsPopover } from "./NotificationsPopover";

const PAGE_TITLES: Record<string, string> = {
  "/owner/dashboard": "Dashboard",
  "/owner/dashboard/members": "Members",
  "/owner/dashboard/leads": "Leads",
  "/owner/dashboard/trainers": "Trainers",
  "/owner/dashboard/plans": "Membership Plans",
  "/owner/dashboard/payments": "Payments",
  "/owner/dashboard/attendance": "Attendance",
  "/owner/dashboard/expiry": "Expiry Management",
  "/owner/dashboard/website": "Website Builder",
  "/owner/dashboard/domain": "Domain Management",
  "/owner/dashboard/analytics": "Website Analytics",
  "/owner/dashboard/settings": "Settings",
};

interface TopbarProps {
  gymSubdomain?: string;
}

export function Topbar({ gymSubdomain }: TopbarProps) {
  const pathname = usePathname();

  // Find the matching page title
  const title =
    Object.entries(PAGE_TITLES).find(([key]) => {
      if (key === "/owner/dashboard") return pathname === key;
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
      {/* Left side: Mobile Menu + Page title */}
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="hidden md:flex w-8 h-8 rounded-lg bg-[#FF5C73] items-center justify-center text-white mr-2">
          <Dumbbell size={16} strokeWidth={2.5} />
        </div>
        <h1 className="text-lg font-bold" style={{ color: "var(--color-foreground)" }}>
          {title}
        </h1>
      </div>


      {/* Right actions */}
      <div className="flex items-center gap-3">
        <GlobalSearch />

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
        <NotificationsPopover />
      </div>
    </header>
  );
}
