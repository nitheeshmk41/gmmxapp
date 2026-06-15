"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/owner/dashboard/members", label: "Members", icon: Users },
  { href: "/owner/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/owner/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/owner/dashboard/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/owner/dashboard" && pathname.startsWith(item.href));

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
