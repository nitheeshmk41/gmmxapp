import Razorpay from "razorpay";
import crypto from "crypto";

// ── Razorpay instance ─────────────────────────────────────────
let razorpayInstance: Razorpay | null = null;

export function getRazorpay() {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables.");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

// ── Create Order ──────────────────────────────────────────────
export async function createRazorpayOrder({
  amount, // in rupees (will be converted to paise)
  receipt,
  notes,
}: {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const rzp = getRazorpay();
  const order = await rzp.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency: "INR",
    receipt,
    notes,
  });
  return order;
}

// ── Verify Payment Signature ──────────────────────────────────
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

// ── Verify Webhook Signature ──────────────────────────────────
export function verifyRazorpayWebhook({
  body,
  signature,
}: {
  body: string;
  signature: string;
}): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

// ── Receipt Number Generator ──────────────────────────────────
let receiptCounter = 1;

export function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const counter = String(receiptCounter++).padStart(5, "0");
  return `GMMX-${year}-${counter}`;
}
