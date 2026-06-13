import { z } from "zod";

const envSchema = z.object({

  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_APP_DOMAIN: z.string().min(1).default("gmmx.app"),
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string().url("NEXT_PUBLIC_APPWRITE_ENDPOINT must be a valid URL"),
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string().min(1, "NEXT_PUBLIC_APPWRITE_PROJECT_ID is required"),
  NEXT_APPWRITE_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const appwriteAdminEnvSchema = z.object({
  NEXT_APPWRITE_KEY: z.string().min(1, "NEXT_APPWRITE_KEY is required for Appwrite admin operations"),
});

export const env = envSchema.parse({

  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  NEXT_APPWRITE_KEY: process.env.NEXT_APPWRITE_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});

export function getAppwriteAdminKey() {
  return appwriteAdminEnvSchema.parse({
    NEXT_APPWRITE_KEY: process.env.NEXT_APPWRITE_KEY,
  }).NEXT_APPWRITE_KEY;
}
