/**
 * GMMX Notifications Service
 *
 * STUB IMPLEMENTATION – MVP only.
 * All methods log to console.
 * Future: Integrate with Twilio / WATI / Interakt / Resend.
 */

export interface NotificationPayload {
  to: string; // phone or email
  gymName: string;
  memberName?: string;
  leadName?: string;
  [key: string]: unknown;
}

// ── WhatsApp stubs ────────────────────────────────────────────

export async function sendWhatsAppReminder(payload: NotificationPayload): Promise<void> {
  console.log("[STUB] sendWhatsAppReminder:", payload);
  // Future: await twilioClient.messages.create({ ... })
}

export async function sendExpiryAlert(payload: NotificationPayload & { expiryDate: string }): Promise<void> {
  console.log("[STUB] sendExpiryAlert:", payload);
  // Future: await whatsappClient.sendTemplate("expiry_alert", payload)
}

export async function sendPaymentConfirmation(
  payload: NotificationPayload & { amount: number; receiptNumber: string }
): Promise<void> {
  console.log("[STUB] sendPaymentConfirmation:", payload);
  // Future: await resend.emails.send({ ... })
}

export async function sendWelcomeMessage(payload: NotificationPayload): Promise<void> {
  console.log("[STUB] sendWelcomeMessage:", payload);
  // Future: await whatsappClient.sendTemplate("welcome", payload)
}

export async function sendLeadFollowUpReminder(
  payload: NotificationPayload & { leadStatus: string }
): Promise<void> {
  console.log("[STUB] sendLeadFollowUpReminder:", payload);
  // Future: scheduled job to remind gym owner
}

export async function sendTrialExpiryWarning(
  payload: NotificationPayload & { trialEndsAt: string }
): Promise<void> {
  console.log("[STUB] sendTrialExpiryWarning:", payload);
  // Future: email to gym owner before trial expires
}
