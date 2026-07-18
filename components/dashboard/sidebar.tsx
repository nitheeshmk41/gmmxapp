"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserPlus, Dumbbell, CreditCard, CalendarCheck,
  Globe, Settings, LogOut, ChevronRight, Building2, TrendingUp, BarChart,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/features/auth/actions";

const NAV_ITEMS = [
  { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
    href: "/owner/dashboard/members", 
    label: "Members", 
    icon: Users,
    subItems: [
      { href: "/owner/dashboard/members", label: "All Members" },
      { href: "/owner/dashboard/members/new", label: "Add Member" },
      { href: "/owner/dashboard/members/expiring", label: "Expiring Soon" },
      { href: "/owner/dashboard/members/renewals", label: "Renewals" }
    ]
  },
  { 
    href: "/owner/dashboard/attendance", 
    label: "Attendance", 
    icon: CalendarCheck,
    subItems: [
      { href: "/owner/dashboard/attendance", label: "Today" },
      { href: "/owner/dashboard/attendance/history", label: "History" }
    ]
  },
  { 
    href: "/owner/dashboard/payments", 
    label: "Payments", 
    icon: CreditCard,
    subItems: [
      { href: "/owner/dashboard/payments", label: "Transactions" },
      { href: "/owner/dashboard/payments/renewals", label: "Renewals" },
      { href: "/owner/dashboard/payments/pending", label: "Pending" },
      { href: "/owner/dashboard/payments/revenue", label: "Revenue" }
    ]
  },
  { 
    href: "/owner/dashboard/leads", 
    label: "Leads", 
    icon: UserPlus,
    subItems: [
      { href: "/owner/dashboard/leads", label: "Pipeline" },
      { href: "/owner/dashboard/leads/new", label: "Add Lead" }
    ]
  },
  { 
    href: "/owner/dashboard/team", 
    label: "Team", 
    icon: Dumbbell,
    subItems: [
      { href: "/owner/dashboard/team/trainers", label: "Trainers" },
      { href: "/owner/dashboard/team/receptionists", label: "Receptionists" }
    ]
  },
  { href: "/owner/dashboard/plans", label: "Plans", icon: Building2 },
  { 
    href: "/owner/dashboard/website", 
    label: "Website", 
    icon: Globe,
    subItems: [
      { href: "/owner/dashboard/website/templates", label: "Templates" },
      { href: "/owner/dashboard/website/branding", label: "Branding" },
      { href: "/owner/dashboard/website/content", label: "Content" },
      { href: "/owner/dashboard/website/gallery", label: "Gallery" },
      { href: "/owner/dashboard/website/trainers", label: "Trainers" },
      { href: "/owner/dashboard/website/publish", label: "Publish" },
    ]
  },
  { 
    href: "/owner/dashboard/reports", 
    label: "Reports", 
    icon: TrendingUp,
    subItems: [
      { href: "/owner/dashboard/reports/revenue", label: "Revenue" },
      { href: "/owner/dashboard/reports/attendance", label: "Attendance" },
      { href: "/owner/dashboard/reports/members", label: "Members" }
    ]
  },
  { href: "/owner/dashboard/analytics", label: "Analytics", icon: BarChart },
];

const BOTTOM_NAV_ITEMS = [
  { href: "/owner/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  gymName?: string;
  gymSubdomain?: string;
  userEmail?: string;
}

export function Sidebar({ gymName = "Your Gym", gymSubdomain, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    // Cleanup on unmount
    return () => document.body.classList.remove('sidebar-collapsed');
  }, [isCollapsed]);

  return (
    <aside
      className={cn(
        "fixed inset-y-4 left-4 z-50 flex flex-col bg-white dark:bg-[#0F172A] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 bg-[#FF5C73] shadow-sm shadow-[#FF5C73]/20">
          {gymName.charAt(0).toUpperCase()}
        </div>
        {!isCollapsed && (
          <div className="min-w-0 animate-in fade-in zoom-in-95 duration-200">
            <div className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base truncate">{gymName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">Workspace</div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
                           (item.href !== "/owner/dashboard" && 
                            (pathname.startsWith(item.href) || 
                             item.subItems?.some(sub => pathname.startsWith(sub.href))));

          return (
            <div key={item.href} className="flex flex-col">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-[#FF5C73]/10 text-[#FF5C73]" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                  isCollapsed && "justify-center px-0"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className={cn("shrink-0", isActive ? "text-[#FF5C73]" : "text-slate-500 group-hover:text-slate-700")} />
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && item.subItems && (
                  <ChevronRight 
                    size={14} 
                    className={cn("ml-auto transition-transform", isActive ? "rotate-90 text-[#FF5C73]" : "text-slate-400")} 
                  />
                )}
              </Link>

              {/* Sub Items */}
              {!isCollapsed && item.subItems && isActive && (
                <div className="flex flex-col gap-1 mt-1 ml-9 pl-3 border-l-2 border-slate-100 animate-in slide-in-from-top-2 fade-in duration-200">
                  {item.subItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          isSubActive 
                            ? "text-[#FF5C73] bg-[#FF5C73]/5 font-semibold" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-2 border-t border-slate-100">
        <div className="space-y-1">
          {BOTTOM_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0 text-slate-500 group-hover:text-slate-700" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} className="shrink-0 text-slate-500 group-hover:text-slate-700" />
            ) : (
              <PanelLeftClose size={18} className="shrink-0 text-slate-500 group-hover:text-slate-700" />
            )}
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2 py-1.5")}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#FF5C73] bg-[#FF5C73]/10 text-xs font-bold shrink-0 border border-[#FF5C73]/20">
            {userEmail ? userEmail[0].toUpperCase() : "U"}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{gymName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail || "Owner"}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <form action={signOut} className="mt-2">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
