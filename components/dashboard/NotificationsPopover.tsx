"use client";

import { useState, useEffect } from "react";
import { Bell, Activity, Loader2 } from "lucide-react";
import { getRecentNotifications } from "@/features/dashboard/notifications";
import { formatDistanceToNow } from "date-fns";
import { ActivityLogDocument } from "@/lib/appwrite/types";

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ActivityLogDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setIsLoading(true);
      getRecentNotifications().then((res) => {
        if (res.success && res.data) {
          setNotifications(res.data);
        }
        setIsLoading(false);
      });
    } else {
      // Just check if we have any initial unread (simulated by checking if we never opened)
      if (notifications.length === 0 && !isLoading) {
        setHasUnread(true);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all"
        style={{
          background: isOpen ? "var(--color-surface)" : "transparent",
          border: isOpen ? "1px solid var(--color-brand-primary)" : "1px solid transparent",
          color: isOpen ? "var(--color-brand-primary)" : "var(--color-muted-foreground)",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
            (e.currentTarget as HTMLElement).style.border = "1px solid var(--color-border)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.border = "1px solid transparent";
          }
        }}
      >
        <Bell size={18} />
        {hasUnread && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--color-brand-primary)" }}
          />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[400px]">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
              <span className="text-xs font-medium bg-[#FF5C73]/10 text-[#FF5C73] px-2 py-0.5 rounded-full">
                Recent
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="animate-spin text-slate-400" size={20} />
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <div key={notif.$id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF5C73]/10 flex items-center justify-center text-[#FF5C73] flex-shrink-0">
                        <Activity size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 leading-snug break-words">
                          <span className="font-semibold text-slate-900">{notif.action}</span>
                          {" - "}
                          <span className="text-slate-600">{notif.entity}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <Bell className="mx-auto mb-2 text-slate-300" size={24} />
                  No new notifications
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
