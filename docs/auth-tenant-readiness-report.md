# GMMX Auth, Onboarding, Session, and Tenant Readiness Report

## Architecture Review

Appwrite is now treated as the authentication provider only. PostgreSQL stores the business identity: `Tenant`, `Gym`, internal `User`, role, onboarding state, and subscription. New users keep an internal UUID primary key and store Appwrite identity separately in `users.appwrite_user_id`.

The new shared auth layer is:

- `lib/auth/bootstrap.ts`: idempotent tenant, gym, branch, website settings, subscription, and owner creation.
- `lib/auth/context.ts`: `getCurrentContext()`, `requireAuth()`, `requireOwner()`, `requireManager()`, `requireTrainer()`.
- `lib/env.ts`: fail-fast environment validation.
- `lib/errors.ts`: structured application/auth/authorization/validation errors.
- `lib/logger.ts`: structured logs with correlation IDs and secret redaction.

## Bugs Found and Root Causes

- Appwrite IDs were used as Prisma user primary keys. Root cause: auth identity and business identity were merged.
- Email signup and OAuth signup duplicated workspace bootstrap logic. Root cause: no shared idempotent user lifecycle service.
- Middleware checked only cookie presence. Root cause: edge middleware was being used as the primary auth decision point.
- Onboarding state was a loose string and only marked pending/completed. Root cause: no database-backed state machine.
- Payment APIs looked up users by Appwrite ID in `users.id`. Root cause: identity coupling.
- Some write paths created business data without an explicit tenant boundary. Root cause: single-gym scoping was doing all isolation work.
- `test-db.js` contained a plaintext database URL. Root cause: local debugging helper was committed with credentials.

## Security Issues Found

- Tenant isolation depended only on `gym_id`; explicit `tenant_id` was missing.
- Payment order and verification APIs did not validate member ownership before creating Razorpay records.
- Raw errors and plain console logs existed in auth/onboarding paths.
- Environment variables were accessed directly without validation.
- Legacy Supabase RLS SQL no longer matched the Appwrite/PostgreSQL architecture and should not be applied as-is.

## Database Issues Found

- Missing `Tenant` model.
- Missing `users.appwrite_user_id` unique key.
- Missing auth provider field.
- Missing `manager` role.
- Missing onboarding status enum.
- Missing tenant indexes on high-traffic tables.
- Missing tenant foreign keys on business tables.

## Prisma Changes Required

Implemented in `prisma/schema.prisma`:

- Added `Tenant`.
- Added `AuthProvider` and `OnboardingStatus`.
- Added `manager` role.
- Added `tenant_id` to all business tables.
- Added `appwrite_user_id`, `provider`, `whatsapp`, and enum onboarding status to `User`.
- Added tenant indexes and foreign key relationships.

## Appwrite Changes Required

- Configure OAuth success URLs for local, staging, and production:
  - `http://localhost:3000/auth/callback`
  - `http://127.0.0.1:3000/auth/callback`
  - `https://staging.gmmx.app/auth/callback`
  - `https://gmmx.app/auth/callback`
- Keep Appwrite databases/storage unused for business data.
- Ensure `SUPER_ADMIN_APPWRITE_USER_ID` maps to the Appwrite admin user before running seed.

## Middleware Changes Required

Middleware remains a fast routing guard and subdomain rewrite layer. Authoritative validation now happens in server layouts, route handlers, server actions, and guards because those can validate Appwrite sessions and load PostgreSQL context safely.

## Environment Changes Required

Required:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_DOMAIN`
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_APPWRITE_KEY`
- `SUPER_ADMIN_APPWRITE_USER_ID` for seeding super admin

## Migration Scripts Required

Draft migration added at `prisma/migrations/20260611120000_auth_tenant_architecture/migration.sql`.

Before applying to production, take a database backup and verify whether legacy `users.id` values are Appwrite IDs. The runtime now creates new users with internal IDs, but existing rows may need a deeper primary-key rewrite if strict legacy cleanup is required.

## Final Authentication Flow

Signup/Login/OAuth -> Appwrite session -> session cookie -> `ensureOwnerWorkspace()` -> PostgreSQL `User/Tenant/Gym/Subscription` -> `routeForUser()` -> onboarding, billing, admin, or dashboard.

## Final Onboarding Flow

`pending` -> gym details -> `gym_created` -> owner details -> `owner_profile_completed` -> subdomain and templates -> `business_setup_completed` -> finish -> `completed`.

## Final Authorization Flow

Route/action/API -> `requireAuth()` -> load Appwrite user and PostgreSQL context -> role guard (`requireOwner`, `requireManager`, `requireTrainer`) -> tenant/gym-scoped query.

## Production Readiness Report

Ready after migration and Appwrite console configuration are applied. Current code passes TypeScript and ESLint with warnings only. Remaining hardening work: clean unused UI imports and image warnings, replace legacy Supabase RLS SQL with Appwrite-aware Postgres policies or application-level tenant enforcement, and add end-to-end tests for the checklist below.

## Test Checklist

- Email Signup
- Google Signup
- Email Login
- Google Login
- Logout
- Session Expiry
- Password Reset
- Email Verification
- Tenant Isolation
- Owner Permissions
- Trainer Permissions
- Member Permissions
- Onboarding Completion
- Subdomain Creation

