"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, UserPlus, Dumbbell, CreditCard, CalendarCheck, Globe, Settings, LogOut, ChevronRight, Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/features/auth/actions";

const NAV_ITEMS = [
  { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/owner/dashboard/members", label: "Members", icon: Users },
  { href: "/owner/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/owner/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/owner/dashboard/leads", label: "Leads", icon: UserPlus },
  { href: "/owner/dashboard/team", label: "Team", icon: Dumbbell },
  { href: "/owner/dashboard/plans", label: "Plans", icon: Building2 },
  { href: "/owner/dashboard/website", label: "Website", icon: Globe },
  { href: "/owner/dashboard/reports", label: "Reports", icon: TrendingUp },
  { href: "/owner/dashboard/analytics", label: "Analytics", icon: TrendingUp }, // Temporary fallback icon until we import BarChart in mobile-nav
  { href: "/owner/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-left-full duration-300">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF5C73] flex items-center justify-center text-white">
                <Dumbbell size={16} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">Menu</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-slate-100 text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/owner/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive ? "bg-[#FF5C73]/10 text-[#FF5C73]" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-slate-100">
             <form action={signOut}>
               <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                 <LogOut size={20} />
                 Sign Out
               </button>
             </form>
          </div>
        </div>
      )}
    </>
  );
}
