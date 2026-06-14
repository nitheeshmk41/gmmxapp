import { z } from "zod";

const envSchema = z.object({

  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_APP_DOMAIN: z.string().min(1).default("gmmx.app"),
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string().url("NEXT_PUBLIC_APPWRITE_ENDPOINT must be a valid URL"),
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string().min(1, "NEXT_PUBLIC_APPWRITE_PROJECT_ID is required"),
  APPWRITE_API_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const appwriteAdminEnvSchema = z.object({
  APPWRITE_API_KEY: z.string().min(1, "APPWRITE_API_KEY is required for Appwrite admin operations"),
});

const cleanEnv = (value: string | undefined) => {
  if (!value) return value;
  // Remove surrounding quotes and trim spaces which Dokploy/Docker often leave behind
  return value.replace(/^["']|["']$/g, '').trim();
};

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_APP_URL: cleanEnv(process.env.NEXT_PUBLIC_APP_URL),
  NEXT_PUBLIC_APP_DOMAIN: cleanEnv(process.env.NEXT_PUBLIC_APP_DOMAIN),
  NEXT_PUBLIC_APPWRITE_ENDPOINT: cleanEnv(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: cleanEnv(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  APPWRITE_API_KEY: cleanEnv(process.env.APPWRITE_API_KEY),
  RAZORPAY_KEY_ID: cleanEnv(process.env.RAZORPAY_KEY_ID),
  RAZORPAY_KEY_SECRET: cleanEnv(process.env.RAZORPAY_KEY_SECRET),
  RAZORPAY_WEBHOOK_SECRET: cleanEnv(process.env.RAZORPAY_WEBHOOK_SECRET),
  NODE_ENV: cleanEnv(process.env.NODE_ENV),
});

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  // We don't throw here immediately so Next.js can at least render error pages
  // but be warned that runtime behavior may be unstable without these vars.
}

export const env = parsedEnv.success ? parsedEnv.data : ({} as z.infer<typeof envSchema>);

export function getAppwriteAdminKey() {
  return appwriteAdminEnvSchema.parse({
    APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
  }).APPWRITE_API_KEY;
}
