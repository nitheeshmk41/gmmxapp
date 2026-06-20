"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Dumbbell,
  CreditCard,
  CalendarCheck,
  AlertTriangle,
  Globe,
  LinkIcon,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
  TrendingUp,
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
  { 
    href: "/owner/dashboard/settings", 
    label: "Settings", 
    icon: Settings,
    subItems: [
      { href: "/owner/dashboard/settings", label: "General" },
      { href: "/owner/dashboard/settings/profile", label: "Profile" },
      { href: "/owner/dashboard/settings/billing", label: "Billing" },
      { href: "/owner/dashboard/settings/team", label: "Team" }
    ]
  },
];

interface SidebarProps {
  gymName?: string;
  gymSubdomain?: string;
  userEmail?: string;
}

export function Sidebar({ gymName = "Your Gym", gymSubdomain, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col scrollbar-thin"
      style={{
        background: "var(--color-sidebar)",
        borderRight: "1px solid var(--color-sidebar-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid var(--color-sidebar-border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: "var(--color-brand-primary)" }}
        >
          G
        </div>
        <div className="min-w-0">
          <div className="font-bold text-white tracking-tight text-base truncate">GMMX</div>
          <div className="text-xs truncate" style={{ color: "var(--color-sidebar-muted)" }}>
            Gym Management
          </div>
        </div>
      </div>


      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin">
        <div className="space-y-0.5">
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive ? "sidebar-item-active" : ""
                  )}
                  style={{
                    color: isActive ? "var(--color-brand-primary)" : "var(--color-sidebar-muted)",
                    background: isActive ? "rgba(255,92,115,0.1)" : "transparent",
                    borderRight: isActive ? "2px solid var(--color-brand-primary)" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "var(--color-sidebar-accent)";
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-sidebar-muted)";
                    }
                  }}
                >
                  <Icon size={17} className="flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.subItems && (
                    <ChevronRight 
                      size={14} 
                      className={cn("ml-auto transition-transform", isActive ? "rotate-90 text-[#FF5C73]" : "text-slate-500")} 
                    />
                  )}
                </Link>

                {/* Sub Items (Only show if parent is active) */}
                {item.subItems && isActive && (
                  <div className="flex flex-col gap-1 mt-1 ml-9 pl-3 border-l border-[#FF5C73]/20 animate-in slide-in-from-top-2 fade-in duration-200">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            isSubActive ? "text-[#FF5C73] bg-[#FF5C73]/10" : "text-slate-400 hover:text-white hover:bg-slate-800"
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
        </div>
      </nav>

      {/* User footer */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid var(--color-sidebar-border)" }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1"
          style={{ background: "var(--color-sidebar-accent)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "var(--color-brand-primary)" }}
          >
            {userEmail ? userEmail[0].toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{gymName}</p>
            <p className="text-xs truncate" style={{ color: "var(--color-sidebar-muted)" }}>
              {userEmail || "Owner"}
            </p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ color: "var(--color-sidebar-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
              (e.currentTarget as HTMLElement).style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-sidebar-muted)";
            }}
          >
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
