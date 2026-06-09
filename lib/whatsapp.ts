/**
 * WhatsApp URL builder utility
 *
 * IMPORTANT: This is URL-only. No automation, no API calls.
 * Opens wa.me links in a new tab — that's all.
 */

const COUNTRY_CODE = "91"; // India

export function buildWhatsAppUrl(phone: string, message: string): string {
  // Clean phone number (remove spaces, dashes, +91 prefix if present)
  const cleanPhone = phone
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/^\+91/, "")
    .replace(/^91(?=\d{10})/, "");

  return `https://wa.me/${COUNTRY_CODE}${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// ── Pre-built message templates ───────────────────────────────

export function buildLeadWelcomeUrl(
  phone: string,
  leadName: string,
  gymName: string
): string {
  const message = `Hi ${leadName}, welcome to ${gymName}! 🏋️ We'd love to help you reach your fitness goals. Would you like to know more about our membership plans?`;
  return buildWhatsAppUrl(phone, message);
}

export function buildExpiryReminderUrl(
  phone: string,
  memberName: string,
  gymName: string,
  expiryDate: string
): string {
  const message = `Hi ${memberName}, your membership at ${gymName} is expiring on ${expiryDate}. Renew now to continue your fitness journey without interruption! 💪`;
  return buildWhatsAppUrl(phone, message);
}

export function buildPaymentConfirmationUrl(
  phone: string,
  memberName: string,
  gymName: string,
  planName: string,
  amount: number
): string {
  const message = `Hi ${memberName}, your payment of ₹${amount} for ${planName} at ${gymName} has been confirmed. Welcome aboard! 🎉`;
  return buildWhatsAppUrl(phone, message);
}

export function buildGeneralMessageUrl(
  phone: string,
  memberName: string,
  gymName: string
): string {
  const message = `Hi ${memberName}, this is ${gymName} reaching out. `;
  return buildWhatsAppUrl(phone, message);
}
