"use client";

import { useEffect, useState } from "react";
import { Activity, MousePointerClick, Users } from "lucide-react";
// Assuming you have standard UI components in @/components/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityFeed({ gymId }: { gymId: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would fetch from a Server Action `getRecentEvents(gymId)`
  // which queries `WEBSITE_EVENTS` joining with `WEBSITE_SESSIONS`
  useEffect(() => {
    // Mock data for initial UI presentation
    setTimeout(() => {
      setEvents([
        { id: 1, type: "click", element: "whatsapp_floating", time: "2 mins ago", country: "India" },
        { id: 2, type: "pageview", element: "/plans", time: "15 mins ago", country: "US" },
        { id: 3, type: "lead", element: "join_form", time: "1 hour ago", country: "India" },
      ]);
      setLoading(false);
    }, 1000);
  }, [gymId]);

  if (loading) return <div className="p-4 text-sm text-slate-500">Loading activity feed...</div>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
          <div className="p-2 rounded-full bg-white shadow-sm">
            {event.type === "click" && <MousePointerClick size={16} className="text-blue-500" />}
            {event.type === "pageview" && <Activity size={16} className="text-slate-500" />}
            {event.type === "lead" && <Users size={16} className="text-green-500" />}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {event.type === "click" ? `Someone clicked ${event.element}` :
               event.type === "pageview" ? `Viewed ${event.element}` :
               `New Lead from ${event.element}`}
            </p>
            <p className="text-xs text-slate-500">{event.time} • {event.country}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
