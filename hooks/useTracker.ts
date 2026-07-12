"use client";

import { useEffect, useState } from "react";
import { trackSession, trackEvent } from "@/features/analytics/actions";
import { v4 as uuidv4 } from "uuid";

export function useTracker(gymId: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!gymId) return;

    // 1. Manage Session
    let currentSessionId = sessionStorage.getItem(`gmmx_session_${gymId}`);
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      sessionStorage.setItem(`gmmx_session_${gymId}`, currentSessionId);
      
      // Attempt to parse UTM parameters and store them in localStorage for Lead forms
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get("utm_source") || undefined;
      const utmCampaign = params.get("utm_campaign") || undefined;
      const referrer = document.referrer || undefined;

      if (utmSource || utmCampaign) {
        localStorage.setItem(`gmmx_utm_${gymId}`, JSON.stringify({
          utmSource,
          utmCampaign,
          referrer,
          timestamp: Date.now()
        }));
      }

      // Track the new session
      trackSession({
        gymId,
        sessionId: currentSessionId,
        device: /Mobile|Android|iP(hone|od|ad)/.test(navigator.userAgent) ? "mobile" : "desktop",
        browser: navigator.userAgent.includes("Chrome") ? "chrome" 
                 : navigator.userAgent.includes("Safari") ? "safari" 
                 : navigator.userAgent.includes("Firefox") ? "firefox" : "other",
        utmSource,
        utmCampaign,
        referrer
      });

      // Track initial pageview
      trackEvent({
        gymId,
        sessionId: currentSessionId,
        eventType: "pageview",
        elementId: window.location.pathname
      });
    }

    setSessionId(currentSessionId);
  }, [gymId]);

  const logEvent = (elementId: string) => {
    if (!gymId || !sessionId) return;
    trackEvent({
      gymId,
      sessionId,
      eventType: "click",
      elementId
    });
  };

  return { logEvent, sessionId };
}
