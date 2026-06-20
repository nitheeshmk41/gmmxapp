"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutTemplate, Palette, Type, Users, Rocket, Eye } from "lucide-react";

interface Props {
  subdomain: string;
}

export function WebsiteBuilderTabs({ subdomain }: Props) {
  const pathname = usePathname() || "";

  const tabs = [
    { id: "templates", label: "Templates", icon: <LayoutTemplate size={16} /> },
    { id: "branding", label: "Branding", icon: <Palette size={16} /> },
    { id: "content", label: "Content", icon: <Type size={16} /> },
    { id: "team", label: "Team", icon: <Users size={16} /> },
    { id: "publish", label: "Publish", icon: <Rocket size={16} /> },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website Builder</h1>
          <p className="text-sm text-slate-500">Configure your public gym website.</p>
        </div>
        <Link 
          href={`/tenant/${subdomain}/preview`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <Eye size={16} />
          Preview Website
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map(tab => {
          const isActive = pathname.includes(`/website/${tab.id}`);
          return (
            <Link
              key={tab.id}
              href={`/tenant/${subdomain}/owner/dashboard/website/${tab.id}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold transition-all border-b-2",
                isActive 
                  ? "border-[#FF5C73] text-[#FF5C73] bg-red-50/50" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
