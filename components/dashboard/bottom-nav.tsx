"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  /** New: org slug for path-based routing */
  organizationSlug?: string;
}

export function BottomNav({ organizationSlug }: BottomNavProps) {
  const pathname = usePathname();
  const base = organizationSlug ? `/${organizationSlug}` : `/owner/dashboard`;
  const dashboardHref = organizationSlug ? `${base}/dashboard` : base;

  const NAV_ITEMS = [
    { href: dashboardHref, label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: `${base}/members`, label: "Members", icon: Users, exact: false },
    { href: `${base}/attendance`, label: "Attendance", icon: CalendarCheck, exact: false },
    { href: `${base}/payments`, label: "Payments", icon: CreditCard, exact: false },
    { href: `${base}/settings`, label: "Settings", icon: Settings, exact: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-8 rounded-full transition-all",
                  isActive ? "bg-[#FF5C73]/10 text-[#FF5C73]" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-[#FF5C73] font-bold" : "text-slate-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
