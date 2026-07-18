"use client";

import { usePathname } from "next/navigation";
import { ExternalLink, Dumbbell, Plus, Moon, MessageSquare } from "lucide-react";
import { GlobalSearch } from "./global-search";
import { MobileNav } from "./mobile-nav";
import { NotificationsPopover } from "./NotificationsPopover";

const PAGE_TITLES: Record<string, string> = {
  "/owner/dashboard": "Dashboard Overview",
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
      className="sticky top-0 z-40 flex items-center justify-between h-[72px] px-6"
      style={{
        background: "rgba(248,250,252,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Left side: Mobile Menu + Page title */}
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">
          {title}
        </h1>
      </div>


      {/* Right actions */}
      <div className="flex items-center gap-4">
        <div className="w-64 hidden lg:block">
          <GlobalSearch />
        </div>

        {/* View website */}
        {gymSubdomain && (
          <a
            href={`https://${gymSubdomain}.gmmx.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
            style={{
              background: "#FFF0F2",
              color: "#FF5C73",
              border: "1px solid rgba(255,92,115,0.2)",
            }}
          >
            <ExternalLink size={12} />
            View Site
          </a>
        )}

        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <Plus size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors hidden sm:flex">
            <MessageSquare size={18} />
          </button>
          <NotificationsPopover />
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors hidden sm:flex">
            <Moon size={18} />
          </button>
        </div>
        
        {/* Profile Dropdown Placeholder */}
        <div className="ml-2 w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer shrink-0">
          <span className="text-xs font-bold text-slate-600">U</span>
        </div>
      </div>
    </header>
  );
}
