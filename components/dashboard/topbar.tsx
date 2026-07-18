"use client";

import { useState, useEffect, useRef } from "react";

import { usePathname } from "next/navigation";
import { ExternalLink, Dumbbell, Plus, Moon, Sun, MessageSquare, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { GlobalSearch } from "./global-search";
import { MobileNav } from "./mobile-nav";
import { NotificationsPopover } from "./NotificationsPopover";
import { signOut } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

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
  userEmail?: string;
  gymName?: string;
}

export function Topbar({ gymSubdomain, userEmail, gymName }: TopbarProps) {
  const pathname = usePathname();

  // Find the matching page title
  const title =
    Object.entries(PAGE_TITLES).find(([key]) => {
      if (key === "/owner/dashboard") return pathname === key;
      return pathname.startsWith(key);
    })?.[1] || "Dashboard";

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between h-[72px] px-6 bg-white/75 dark:bg-[#0B1120]/75 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      {/* Left side: Mobile Menu + Page title */}
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hidden md:block">
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

        <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-4">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Plus size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex">
            <MessageSquare size={18} />
          </button>
          <NotificationsPopover />
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex"
          >
            {mounted ? (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />) : <div className="w-[18px] h-[18px]" />}
          </button>
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative ml-2" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform hover:scale-105 border border-[#FF5C73]/20"
            style={{
              backgroundColor: "rgba(255, 92, 115, 0.1)",
              color: "#FF5C73"
            }}
          >
            {userEmail ? userEmail[0].toUpperCase() : "U"}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/50 mb-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{gymName || "Workspace"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail || "Owner"}</p>
              </div>
              
              <form action={signOut} className="px-2">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
