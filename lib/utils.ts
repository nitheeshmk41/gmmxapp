import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

// ── Class name utility ────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Date formatting ───────────────────────────────────────────
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getDaysUntilExpiry(expiryDate: Date | string | null | undefined): number | null {
  if (!expiryDate) return null;
  return differenceInDays(new Date(expiryDate), new Date());
}

// ── Currency formatting ───────────────────────────────────────
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "₹0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

// ── Receipt number generator ──────────────────────────────────
export function generateReceiptNumber(increment: number): string {
  const year = new Date().getFullYear();
  const counter = String(increment).padStart(5, "0");
  return `GMMX-${year}-${counter}`;
}

// ── Subdomain validation ──────────────────────────────────────
export function validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
  if (!subdomain) return { valid: false, error: "Subdomain is required" };
  if (subdomain.length < 3) return { valid: false, error: "At least 3 characters" };
  if (subdomain.length > 30) return { valid: false, error: "Maximum 30 characters" };
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return { valid: false, error: "Only lowercase letters, numbers, and hyphens" };
  }
  if (subdomain.startsWith("-") || subdomain.endsWith("-")) {
    return { valid: false, error: "Cannot start or end with a hyphen" };
  }
  const reserved = ["www", "api", "app", "admin", "mail", "support", "help", "blog", "dashboard"];
  if (reserved.includes(subdomain)) {
    return { valid: false, error: "This subdomain is reserved" };
  }
  return { valid: true };
}

// ── Expiry status helpers ─────────────────────────────────────
export type ExpiryStatus = "expired" | "critical" | "warning" | "upcoming" | "safe";

export function getExpiryStatus(membershipEnd: Date | string | null | undefined): ExpiryStatus {
  const days = getDaysUntilExpiry(membershipEnd);
  if (days === null) return "safe";
  if (days < 0) return "expired";
  if (days <= 3) return "critical";
  if (days <= 7) return "warning";
  if (days <= 30) return "upcoming";
  return "safe";
}

export function getExpiryBadgeClass(status: ExpiryStatus): string {
  const map: Record<ExpiryStatus, string> = {
    expired: "badge-danger",
    critical: "badge-danger",
    warning: "badge-warning",
    upcoming: "badge-warning",
    safe: "badge-success",
  };
  return map[status];
}

export function getExpiryRowClass(status: ExpiryStatus): string {
  const map: Record<ExpiryStatus, string> = {
    expired: "bg-red-50 border-l-2 border-red-400",
    critical: "bg-orange-50 border-l-2 border-orange-400",
    warning: "bg-yellow-50 border-l-2 border-yellow-400",
    upcoming: "bg-green-50 border-l-2 border-green-400",
    safe: "",
  };
  return map[status];
}

// ── Phone formatting ──────────────────────────────────────────
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
}

// ── Initials from name ────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ── Slugify ───────────────────────────────────────────────────
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ── CSV export ────────────────────────────────────────────────
export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val === null || val === undefined ? "" : String(val);
          return str.includes(",") ? `"${str}"` : str;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}
