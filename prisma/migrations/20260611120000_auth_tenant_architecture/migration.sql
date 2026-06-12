CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'manager';

DO $$ BEGIN
  CREATE TYPE "AuthProvider" AS ENUM ('email', 'google');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OnboardingStatus" AS ENUM (
    'pending',
    'gym_created',
    'owner_profile_completed',
    'business_setup_completed',
    'completed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "tenants" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenants_slug_key" ON "tenants"("slug");

ALTER TABLE "gyms" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;

INSERT INTO "tenants" ("id", "name", "slug", "created_at", "updated_at")
SELECT
  gen_random_uuid()::TEXT,
  COALESCE(NULLIF("name", ''), 'Gym Tenant'),
  CONCAT(
    regexp_replace(lower(COALESCE(NULLIF("subdomain", ''), "id")), '[^a-z0-9]+', '-', 'g'),
    '-',
    substring("id", 1, 8)
  ),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "gyms"
WHERE "tenant_id" IS NULL;

UPDATE "gyms" g
SET "tenant_id" = t."id"
FROM "tenants" t
WHERE g."tenant_id" IS NULL
  AND t."slug" = CONCAT(
    regexp_replace(lower(COALESCE(NULLIF(g."subdomain", ''), g."id")), '[^a-z0-9]+', '-', 'g'),
    '-',
    substring(g."id", 1, 8)
  );

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "appwrite_user_id" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "provider" "AuthProvider" NOT NULL DEFAULT 'email';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;

UPDATE "users" u
SET "tenant_id" = g."tenant_id"
FROM "gyms" g
WHERE u."gym_id" = g."id" AND u."tenant_id" IS NULL;

UPDATE "users"
SET "appwrite_user_id" = "id"
WHERE "appwrite_user_id" IS NULL;

ALTER TABLE "users"
  ALTER COLUMN "appwrite_user_id" SET NOT NULL;

ALTER TABLE "users"
  ALTER COLUMN "onboarding_status" DROP DEFAULT;

ALTER TABLE "users"
  ALTER COLUMN "onboarding_status" TYPE "OnboardingStatus"
  USING lower("onboarding_status")::"OnboardingStatus";

ALTER TABLE "users"
  ALTER COLUMN "onboarding_status" SET DEFAULT 'pending';

ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "membership_plans" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "trainers" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "domains" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;

UPDATE "branches" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "members" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "leads" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "membership_plans" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "payments" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "attendance" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "trainers" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "website_settings" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "domains" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;
UPDATE "subscriptions" x SET "tenant_id" = g."tenant_id" FROM "gyms" g WHERE x."gym_id" = g."id" AND x."tenant_id" IS NULL;

ALTER TABLE "gyms" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "branches" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "members" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "leads" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "membership_plans" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "payments" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "attendance" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "trainers" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "website_settings" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "subscriptions" ALTER COLUMN "tenant_id" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "users_appwrite_user_id_key" ON "users"("appwrite_user_id");
CREATE INDEX IF NOT EXISTS "users_tenant_id_idx" ON "users"("tenant_id");
CREATE INDEX IF NOT EXISTS "users_gym_id_idx" ON "users"("gym_id");
CREATE INDEX IF NOT EXISTS "gyms_tenant_id_idx" ON "gyms"("tenant_id");
CREATE INDEX IF NOT EXISTS "branches_tenant_id_idx" ON "branches"("tenant_id");
CREATE INDEX IF NOT EXISTS "branches_gym_id_idx" ON "branches"("gym_id");
CREATE INDEX IF NOT EXISTS "members_tenant_id_idx" ON "members"("tenant_id");
CREATE INDEX IF NOT EXISTS "members_gym_id_idx" ON "members"("gym_id");
CREATE INDEX IF NOT EXISTS "members_branch_id_idx" ON "members"("branch_id");
CREATE INDEX IF NOT EXISTS "members_plan_id_idx" ON "members"("plan_id");
CREATE INDEX IF NOT EXISTS "members_trainer_id_idx" ON "members"("trainer_id");
CREATE INDEX IF NOT EXISTS "members_status_idx" ON "members"("status");
CREATE INDEX IF NOT EXISTS "leads_tenant_id_idx" ON "leads"("tenant_id");
CREATE INDEX IF NOT EXISTS "leads_gym_id_idx" ON "leads"("gym_id");
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads"("status");
CREATE INDEX IF NOT EXISTS "membership_plans_tenant_id_idx" ON "membership_plans"("tenant_id");
CREATE INDEX IF NOT EXISTS "membership_plans_gym_id_idx" ON "membership_plans"("gym_id");
CREATE INDEX IF NOT EXISTS "payments_tenant_id_idx" ON "payments"("tenant_id");
CREATE INDEX IF NOT EXISTS "payments_gym_id_idx" ON "payments"("gym_id");
CREATE INDEX IF NOT EXISTS "payments_member_id_idx" ON "payments"("member_id");
CREATE INDEX IF NOT EXISTS "payments_plan_id_idx" ON "payments"("plan_id");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "payments_paid_at_idx" ON "payments"("paid_at");
CREATE INDEX IF NOT EXISTS "attendance_tenant_id_idx" ON "attendance"("tenant_id");
CREATE INDEX IF NOT EXISTS "attendance_gym_id_idx" ON "attendance"("gym_id");
CREATE INDEX IF NOT EXISTS "attendance_branch_id_idx" ON "attendance"("branch_id");
CREATE INDEX IF NOT EXISTS "trainers_tenant_id_idx" ON "trainers"("tenant_id");
CREATE INDEX IF NOT EXISTS "trainers_gym_id_idx" ON "trainers"("gym_id");
CREATE INDEX IF NOT EXISTS "website_settings_tenant_id_idx" ON "website_settings"("tenant_id");
CREATE INDEX IF NOT EXISTS "domains_tenant_id_idx" ON "domains"("tenant_id");
CREATE INDEX IF NOT EXISTS "domains_gym_id_idx" ON "domains"("gym_id");
CREATE INDEX IF NOT EXISTS "subscriptions_tenant_id_idx" ON "subscriptions"("tenant_id");
CREATE INDEX IF NOT EXISTS "subscriptions_gym_id_idx" ON "subscriptions"("gym_id");

ALTER TABLE "gyms" ADD CONSTRAINT "gyms_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "branches" ADD CONSTRAINT "branches_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "members" ADD CONSTRAINT "members_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "membership_plans" ADD CONSTRAINT "membership_plans_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "website_settings" ADD CONSTRAINT "website_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "domains" ADD CONSTRAINT "domains_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

