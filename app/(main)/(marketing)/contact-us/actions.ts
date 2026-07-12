"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Resend } from "resend";

export async function submitMarketingLead(formData: FormData) {
  try {
    const { databases } = await createAdminClient();
    
    // Parse the fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string || "";
    const gymName = formData.get("gymName") as string || "";
    const inquiryType = formData.get("inquiryType") as string;
    const memberCount = formData.get("memberCount") as string || "";
    const currentSoftware = formData.get("currentSoftware") as string || "";
    const budget = formData.get("budget") as string || "";
    const startDate = formData.get("startDate") as string || "";
    const message = formData.get("message") as string;
    const source = formData.get("source") as string || "Direct";

    // Basic validation
    if (!name || !email || !inquiryType || !message) {
      return { success: false, error: "Missing required fields." };
    }

    // 1. Save to Appwrite
    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MARKETING_LEADS,
      ID.unique(),
      {
        name,
        email,
        phone,
        gymName,
        inquiryType,
        memberCount,
        currentSoftware,
        budget,
        startDate,
        message,
        source,
        status: "new",
      }
    );

    // 2. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const emailHtml = `
        <h2>New Lead from gmmx.app</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Gym Name:</strong> ${gymName || "N/A"}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Members:</strong> ${memberCount || "N/A"}</p>
        <p><strong>Current Software:</strong> ${currentSoftware || "N/A"}</p>
        <p><strong>Budget:</strong> ${budget || "N/A"}</p>
        <p><strong>Need By:</strong> ${startDate || "N/A"}</p>
        <p><strong>Source:</strong> ${source}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">${message}</blockquote>
      `;

      await resend.emails.send({
        from: "GMMX Alerts <onboarding@resend.dev>", // Note: Use your verified domain in production if possible
        to: "gmmxapp@gmail.com",
        subject: `New GMMX Lead: ${gymName || name} - ${inquiryType}`,
        html: emailHtml,
        replyTo: email,
      });
    } else {
      console.warn("RESEND_API_KEY is not set. Email notification was skipped.");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit marketing lead:", error);
    return { success: false, error: error.message || "Failed to submit lead." };
  }
}
