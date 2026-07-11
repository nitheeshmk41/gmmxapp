"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, User, CreditCard, Users, ShieldAlert, Link as LinkIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/owner/dashboard/settings/profile", label: "Gym Profile", icon: Building2 },
  { href: "/owner/dashboard/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/owner/dashboard/settings/account", label: "Account", icon: User },
  { href: "/owner/dashboard/settings/team", label: "Team", icon: Users },
  { href: "/owner/dashboard/settings/security", label: "Security", icon: ShieldAlert },
  { href: "/owner/dashboard/settings/integrations", label: "Integrations", icon: LinkIcon },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.endsWith(item.href) || (pathname.includes("/billing") && item.href.includes("/billing"));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive 
                ? "bg-[#FF5C73] text-white shadow-md shadow-red-500/20" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
