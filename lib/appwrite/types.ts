import { Models } from "node-appwrite";

// SaaS & Tenancy
export interface SaasPlanDocument extends Models.Document {
  name: string;
  price: number;
  maxMembers: number;
  maxTrainers: number;
  customDomain: boolean;
  websiteBuilder: boolean;
  mobileApp: boolean;
}

export interface SubscriptionDocument extends Models.Document {
  gymId: string;
  planId: string;
  status: "trial" | "active" | "past_due" | "cancelled";
  startsAt: string; // ISO Datetime
  endsAt: string; // ISO Datetime
  paymentProvider?: string;
  featuresJson?: string;
}

export interface GymDocument extends Models.Document {
  name: string;
  subdomain: string;
  customDomain?: string;
  status: "trial" | "active" | "suspended" | "cancelled";
  isDeleted: boolean;
  deletedAt?: string; // ISO Datetime
  ownerId: string; // Convenience lookup
  country?: string;
  timezone?: string;
  currency?: string;
  template?: string;
}

export interface GymUserDocument extends Models.Document {
  gymId: string;
  userId: string;
  role: "owner" | "manager" | "receptionist" | "trainer";
  status: "active" | "invited" | "disabled";
}

// Business Operations
export interface LeadDocument extends Models.Document {
  gymId: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: "new" | "contacted" | "converted" | "lost";
  source: "website" | "whatsapp" | "manual" | "facebook" | "instagram";
}

export interface MemberDocument extends Models.Document {
  gymId: string;
  memberCode: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  memberPhotoFileId?: string;
  planId?: string;
  status: "active" | "expired";
  joinedAt: string; // ISO Datetime
  membershipStartDate?: string; // ISO Datetime
  membershipEndDate?: string; // ISO Datetime
  createdBy?: string;
  updatedBy?: string;
}

export interface MembershipPlanDocument extends Models.Document {
  gymId: string;
  name: string;
  durationDays: number;
  amount: number;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface TrainerDocument extends Models.Document {
  gymId: string;
  name: string;
  slug: string;
  photoFileId?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface AttendanceDocument extends Models.Document {
  gymId: string;
  memberId: string;
  attendanceDate: string; // YYYY-MM-DD
  checkIn: string; // ISO Datetime
  checkOut?: string; // ISO Datetime
  method: "qr" | "manual" | "fingerprint" | "face";
  source: "mobile_qr" | "reception_qr" | "api" | "manual";
}

export interface PaymentDocument extends Models.Document {
  gymId: string;
  memberId: string;
  membershipPlanId?: string;
  amount: number;
  planNameSnapshot?: string;
  planAmountSnapshot?: number;
  status: "success" | "pending" | "failed";
  paymentMethod: "cash" | "card" | "upi";
  transactionId?: string;
  paidAt: string; // ISO Datetime
  renewalNotes?: string;
}

export interface TestimonialDocument extends Models.Document {
  gymId: string;
  name: string;
  review: string;
  rating: number;
}

// Website Builder
export interface GymSettingsDocument extends Models.Document {
  gymId: string;
  websiteStatus: "draft" | "published" | "maintenance";
  publishedAt?: string; // ISO Datetime
  theme: string;
  themeVersion: number;
  logoFileId?: string;
}

export interface WebsiteSectionDocument extends Models.Document {
  gymId: string;
  sectionKey: string;
  contentJson: string; // Stringified JSON
  version: number;
  sortOrder: number;
  isEnabled: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface GymProfileDocument extends Models.Document {
  gymId: string;
  seoTitle?: string;
  seoDescription?: string;
  phone?: string;
  address?: string;
}

export interface GymSocialsDocument extends Models.Document {
  gymId: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
}

export interface GymServicesDocument extends Models.Document {
  gymId: string;
  title: string;
  slug: string;
  icon?: string;
}

export interface GymGalleryDocument extends Models.Document {
  gymId: string;
  imageFileId: string;
  caption?: string;
  sortOrder: number;
}

// Audit & Security
export interface ActivityLogDocument extends Models.Document {
  gymId: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  metadataJson?: string;
  timestamp: string; // ISO Datetime
}

// SaaS Operations
export interface CouponDocument extends Models.Document {
  code: string;
  type: "percent" | "flat";
  value: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string; // ISO Datetime
  isActive: boolean;
  description?: string;
  createdAt: string; // ISO Datetime
}

export interface BlogDocument extends Models.Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published";
  category?: string;
  tags?: string;
  featuredImageFileId?: string;
  authorId: string;
  publishedAt?: string; // ISO Datetime
  createdAt: string; // ISO Datetime
}

// Appwrite Collection IDs (assumed to be matching the collection names or defined in env)
export const COLLECTIONS = {
  SAAS_PLANS: "saas_plans",
  SUBSCRIPTIONS: "subscriptions",
  GYMS: "gyms",
  GYM_USERS: "gym_users",
  LEADS: "leads",
  MEMBERS: "members",
  MEMBERSHIP_PLANS: "membership_plans",
  TRAINERS: "trainers",
  ATTENDANCE: "attendance",
  PAYMENTS: "payments",
  GYM_SETTINGS: "gym_settings",
  WEBSITE_SECTIONS: "website_sections",
  GYM_PROFILE: "gym_profile",
  GYM_SOCIALS: "gym_socials",
  GYM_SERVICES: "gym_services",
  GYM_GALLERY: "gym_gallery",
  ACTIVITY_LOGS: "activity_logs",
  TESTIMONIALS: "testimonials",
  COUPONS: "coupons",
  BLOGS: "blogs",
};

// Ensure this matches your Appwrite configuration
export const APPWRITE_DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "gmmx_db";
