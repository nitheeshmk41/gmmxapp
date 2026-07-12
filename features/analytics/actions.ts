"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { headers } from "next/headers";

export async function trackSession(data: {
  gymId: string;
  sessionId: string;
  device?: string;
  browser?: string;
  utmSource?: string;
  utmCampaign?: string;
  referrer?: string;
}) {
  try {
    const { databases } = await createAdminClient();
    const headersList = await headers();
    
    // Attempt to get IP and Country (works on platforms like Vercel or Cloudflare proxy)
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const country = headersList.get("cf-ipcountry") || headersList.get("x-vercel-ip-country") || "unknown";
    const city = headersList.get("cf-ipcity") || headersList.get("x-vercel-ip-city") || "unknown";

    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.WEBSITE_SESSIONS,
      ID.unique(),
      {
        gymId: data.gymId,
        sessionId: data.sessionId,
        ip,
        device: data.device || "unknown",
        browser: data.browser || "unknown",
        country,
        city,
        utmSource: data.utmSource,
        utmCampaign: data.utmCampaign,
        referrer: data.referrer,
        timestamp: new Date().toISOString(),
      }
    );
    return { success: true };
  } catch (error) {
    console.error("[trackSession] Error:", error);
    return { success: false };
  }
}

export async function trackEvent(data: {
  gymId: string;
  sessionId: string;
  eventType: string; // "click", "pageview"
  elementId: string; // e.g. "whatsapp", "call", "join"
}) {
  try {
    const { databases } = await createAdminClient();
    
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.WEBSITE_EVENTS,
      ID.unique(),
      {
        gymId: data.gymId,
        sessionId: data.sessionId,
        eventType: data.eventType,
        elementId: data.elementId,
        timestamp: new Date().toISOString(),
      }
    );
    return { success: true };
  } catch (error) {
    console.error("[trackEvent] Error:", error);
    return { success: false };
  }
}
