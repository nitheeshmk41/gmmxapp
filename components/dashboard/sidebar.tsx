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

interface SidebarProps {
  gymName?: string;
  gymSubdomain?: string;
  /** New: org slug for path-based routing (gmmx.app/{slug}/...) */
  organizationSlug?: string;
  userEmail?: string;
}

export function Sidebar({ gymName = "Your Gym", gymSubdomain, organizationSlug, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Build base prefix for nav links
  // New path-based: /{slug}/... | Legacy subdomain: /owner/dashboard/...
  const base = organizationSlug ? `/${organizationSlug}` : `/owner/dashboard`;

  const NAV_ITEMS = [
    { href: `${base}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    {
      href: `${base}/members`,
      label: "Members",
      icon: Users,
      subItems: [
        { href: `${base}/members`, label: "All Members" },
        { href: `${base}/members/new`, label: "Add Member" },
        { href: `${base}/members/expiring`, label: "Expiring Soon" },
        { href: `${base}/members/renewals`, label: "Renewals" },
      ]
    },
    {
      href: `${base}/attendance`,
      label: "Attendance",
      icon: CalendarCheck,
      subItems: [
        { href: `${base}/attendance`, label: "Today" },
        { href: `${base}/attendance/history`, label: "History" },
      ]
    },
    {
      href: `${base}/payments`,
      label: "Payments",
      icon: CreditCard,
      subItems: [
        { href: `${base}/payments`, label: "Transactions" },
        { href: `${base}/payments/renewals`, label: "Renewals" },
        { href: `${base}/payments/pending`, label: "Pending" },
        { href: `${base}/payments/revenue`, label: "Revenue" },
      ]
    },
    {
      href: `${base}/leads`,
      label: "Leads",
      icon: UserPlus,
      subItems: [
        { href: `${base}/leads`, label: "Pipeline" },
        { href: `${base}/leads/new`, label: "Add Lead" },
      ]
    },
    {
      href: `${base}/team`,
      label: "Team",
      icon: Dumbbell,
      subItems: [
        { href: `${base}/team/trainers`, label: "Trainers" },
        { href: `${base}/team/receptionists`, label: "Receptionists" },
      ]
    },
    { href: `${base}/plans`, label: "Plans", icon: Building2 },
    {
      href: `${base}/website`,
      label: "Website",
      icon: Globe,
      subItems: [
        { href: `${base}/website/templates`, label: "Templates" },
        { href: `${base}/website/branding`, label: "Branding" },
        { href: `${base}/website/content`, label: "Content" },
        { href: `${base}/website/gallery`, label: "Gallery" },
        { href: `${base}/website/trainers`, label: "Trainers" },
        { href: `${base}/website/publish`, label: "Publish" },
      ]
    },
    {
      href: `${base}/reports`,
      label: "Reports",
      icon: TrendingUp,
      subItems: [
        { href: `${base}/reports/revenue`, label: "Revenue" },
        { href: `${base}/reports/attendance`, label: "Attendance" },
        { href: `${base}/reports/members`, label: "Members" },
      ]
    },
    { href: `${base}/analytics`, label: "Analytics", icon: BarChart },
  ];

  const BOTTOM_NAV_ITEMS = [
    { href: `${base}/settings`, label: "Settings", icon: Settings },
  ];

  // The "dashboard root" item (exact match only)
  const dashboardHref = `${base}/dashboard`;

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }
    return () => document.body.classList.remove("sidebar-collapsed");
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
          const isActive =
            (item.href === dashboardHref ? pathname === item.href : pathname.startsWith(item.href)) ||
            item.subItems?.some((sub) => pathname.startsWith(sub.href));

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
    </aside>
  );
}
