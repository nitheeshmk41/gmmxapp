import { Models } from "node-appwrite";

export interface GymDocument extends Models.Document {
  name: string;
  subdomain: string;
  ownerId: string;
  template: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  trialEndsAt?: string; // ISO DateTime
}

export interface GymUserDocument extends Models.Document {
  gymId: string;
  userId: string;
  role: "OWNER" | "TRAINER" | "MEMBER";
}

export interface MemberDocument extends Models.Document {
  gymId: string;
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
  joinDate: string;
  planId?: string;
  trainerId?: string;
  status: "active" | "expired" | "paused";
  notes?: string;
  photoUrl?: string;
}

export interface TrainerDocument extends Models.Document {
  gymId: string;
  name: string;
  phone: string;
  email?: string;
  specialization?: string;
  experienceYears?: number;
  photoUrl?: string;
  bio?: string;
  isActive: boolean;
}

export interface AttendanceDocument extends Models.Document {
  gymId: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  markedAt: string; // ISO DateTime
  markedBy?: string;
  type: "manual" | "qr";
}

export interface MembershipPlanDocument extends Models.Document {
  gymId: string;
  name: string;
  durationDays: number;
  price: number;
  description?: string;
  isActive: boolean;
}

export interface PaymentDocument extends Models.Document {
  gymId: string;
  memberId: string;
  planId?: string;
  amount: number;
  method: "cash" | "upi" | "card" | "bank_transfer" | "razorpay";
  status: "paid" | "pending" | "failed" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  receiptNumber: string;
  paidAt: string; // ISO DateTime
  membershipStart?: string;
  membershipEnd?: string;
  notes?: string;
}

export interface SubscriptionDocument extends Models.Document {
  gymId: string;
  plan: string;
  status: "trial" | "active" | "suspended" | "cancelled" | "expired";
  razorpaySubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

// Appwrite Collection IDs (assumed to be matching the collection names or defined in env)
export const COLLECTIONS = {
  GYMS: "gyms",
  GYM_USERS: "gym_users",
  MEMBERS: "members",
  TRAINERS: "trainers",
  ATTENDANCE: "attendance",
  PLANS: "membership_plans",
  PAYMENTS: "payments",
  SUBSCRIPTIONS: "subscriptions",
};

// Ensure this matches your Appwrite configuration
export const APPWRITE_DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "gmmx_db";
