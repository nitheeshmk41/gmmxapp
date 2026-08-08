"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Building2, User, CreditCard, Users, ShieldAlert, Link as LinkIcon, Webhook } from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Workspace",
    items: [
      { suffix: "/settings/profile", label: "Gym Profile", icon: Building2 },
      { suffix: "/settings/billing", label: "Billing", icon: CreditCard },
      { suffix: "/settings/team", label: "Team", icon: Users },
    ]
  },
  {
    title: "Account",
    items: [
      { suffix: "/settings/account", label: "Profile", icon: User },
      { suffix: "/settings/security", label: "Security", icon: ShieldAlert },
    ]
  },
  {
    title: "Developers",
    items: [
      { suffix: "/settings/integrations", label: "Integrations", icon: LinkIcon },
    ]
  }
];

export function OrgSettingsNav() {
  const pathname = usePathname();
  const params = useParams<{ organizationSlug: string }>();
  const slug = params?.organizationSlug ?? "";

  return (
    <nav className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
            {group.title}
          </h4>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => {
              const href = `/${slug}${item.suffix}`;
              const Icon = item.icon;
              const isActive =
                pathname === href ||
                (item.suffix.includes("/billing") && pathname.includes("/billing")) ||
                (item.suffix !== "/settings/profile" && pathname.endsWith(item.suffix));

              return (
                <Link
                  key={href}
                  href={href}
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
          </div>
        </div>
      ))}
    </nav>
  );
}
