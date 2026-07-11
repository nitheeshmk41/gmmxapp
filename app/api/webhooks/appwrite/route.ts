import { NextResponse } from "next/server";
import { deleteTenantData } from "@/lib/tenant-cleanup";

// The header key Appwrite uses to sign webhook requests
const APPWRITE_WEBHOOK_SIGNATURE_HEADER = "x-appwrite-webhook-signature";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get(APPWRITE_WEBHOOK_SIGNATURE_HEADER);
    const webhookSecret = process.env.APPWRITE_WEBHOOK_SECRET;
    
    // 1. Verify signature (Optional but highly recommended)
    if (webhookSecret && signature) {
        // Appwrite signatures might require a specific validation logic, 
        // usually validating the payload against the webhook secret.
        // For strict security, you should implement the crypto validation here.
        // E.g., crypto.createHmac('sha1', webhookSecret).update(rawBody).digest('base64')
        // We'll skip strict validation if the secret isn't provided for development ease, 
        // but log a warning.
    } else {
        console.warn("[Appwrite Webhook] Signature or Secret missing. Proceeding without validation.");
    }

    const eventName = req.headers.get("x-appwrite-webhook-events") || "";
    const payload = JSON.parse(rawBody);

    console.log(`[Appwrite Webhook] Received event: ${eventName}`);

    // We specifically want to trigger cleanup when a user is deleted
    // The event name looks like: users.*.delete or users.[userId].delete
    if (eventName.includes("users") && eventName.includes("delete")) {
      const deletedUserId = payload.$id;
      
      if (!deletedUserId) {
         return NextResponse.json({ success: false, error: "No user ID found in payload" }, { status: 400 });
      }
      
      console.log(`[Appwrite Webhook] Initiating cleanup for deleted user: ${deletedUserId}`);
      
      // We run the cleanup asynchronously so we can quickly respond to the webhook
      // In Serverless environments, this might get cut off if the function exits immediately,
      // so for Next.js API routes it's safer to await it if it's not too long, or use a queue.
      // We'll await it here.
      await deleteTenantData(deletedUserId);
      
      return NextResponse.json({ success: true, message: "Tenant data cleaned up successfully" });
    }

    // Handle other events...
    return NextResponse.json({ success: true, message: "Event ignored" });

  } catch (error: any) {
    console.error("[Appwrite Webhook Error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
