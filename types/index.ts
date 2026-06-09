// ─────────────────────────────────────────────
// GMMX – Shared TypeScript Types
// ─────────────────────────────────────────────

export type UserRole = "super_admin" | "gym_owner" | "trainer" | "member";

export type SubscriptionStatus = "trial" | "active" | "suspended" | "cancelled" | "expired";

export type GymPlan = "starter" | "professional" | "enterprise";

export type Gender = "male" | "female" | "other";

export type MemberStatus = "active" | "expired" | "paused";

export type LeadSource = "walk_in" | "website" | "referral" | "instagram" | "other";

export type LeadStatus = "new" | "contacted" | "interested" | "trial" | "converted" | "lost";

export type PaymentMethod = "cash" | "upi" | "card" | "bank_transfer" | "razorpay";

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type WebsiteTemplate = "modern" | "minimal" | "performance";

export type DomainVerificationStatus = "pending" | "verified" | "failed";

// ── Entities ──────────────────────────────────────────────────

export interface Gym {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  subdomain: string;
  custom_domain?: string;
  logo_url?: string;
  subscription_status: SubscriptionStatus;
  plan: GymPlan;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  gym_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  gym_id: string;
  name: string;
  address?: string;
  phone?: string;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  gym_id: string;
  branch_id?: string;
  name: string;
  phone: string;
  email?: string;
  gender?: Gender;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
  join_date: string;
  plan_id?: string;
  trainer_id?: string;
  status: MemberStatus;
  notes?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  // Relations
  plan?: MembershipPlan;
  trainer?: Trainer;
  latest_payment?: Payment;
}

export interface Lead {
  id: string;
  gym_id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  gym_id: string;
  name: string;
  duration_days: number;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  gym_id: string;
  member_id: string;
  plan_id?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  receipt_number: string;
  paid_at: string;
  membership_start?: string;
  membership_end?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  member?: Member;
  plan?: MembershipPlan;
}

export interface Attendance {
  id: string;
  gym_id: string;
  member_id: string;
  branch_id?: string;
  date: string;
  marked_at: string;
  marked_by?: string;
  type: "manual" | "qr";
  created_at: string;
  // Relations
  member?: Member;
}

export interface Trainer {
  id: string;
  gym_id: string;
  name: string;
  phone: string;
  email?: string;
  specialization?: string;
  experience_years?: number;
  photo_url?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  members?: Member[];
}

export interface WebsiteSettings {
  id: string;
  gym_id: string;
  template: WebsiteTemplate;
  hero_image_url?: string;
  description?: string;
  gallery_urls: string[];
  social_instagram?: string;
  social_facebook?: string;
  social_youtube?: string;
  whatsapp_number?: string;
  contact_email?: string;
  address?: string;
  tagline?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  gym_id: string;
  custom_domain: string;
  verification_status: DomainVerificationStatus;
  dns_type: "A" | "CNAME";
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  gym_id: string;
  plan: GymPlan;
  status: SubscriptionStatus;
  razorpay_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

// ── Dashboard Stats ───────────────────────────────────────────

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringThisWeek: number;
  expiringThisMonth: number;
  revenueThisMonth: number;
  attendanceToday: number;
  totalLeads: number;
  newLeadsThisWeek: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface AttendanceTrend {
  date: string;
  count: number;
}

// ── API Response ──────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ── Pagination ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Plan config ───────────────────────────────────────────────

export interface PricingPlan {
  id: GymPlan;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 499,
    period: "month",
    description: "Perfect for small gyms getting started",
    features: [
      "Up to 100 members",
      "Subdomain website (yourname.gmmx.app)",
      "Member management",
      "Payment tracking",
      "Lead management",
      "14-day free trial",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "professional",
    name: "Professional",
    price: 999,
    period: "month",
    description: "For growing gyms that need more power",
    features: [
      "Unlimited members",
      "Custom domain support",
      "Attendance tracking",
      "Advanced reports",
      "Trainer management",
      "Expiry management",
      "Priority support",
      "14-day free trial",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0,
    period: "custom",
    description: "For large gym chains with multiple branches",
    features: [
      "Multi-branch support",
      "Everything in Professional",
      "Dedicated onboarding",
      "Custom integrations",
      "Priority support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
  },
];
