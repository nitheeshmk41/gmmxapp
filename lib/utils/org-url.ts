/**
 * Centralized organization URL builder.
 *
 * All internal dashboard links must be generated through this helper to ensure
 * consistent path-based tenant routing: gmmx.app/{organizationSlug}/...
 */

/**
 * Build an organization-scoped dashboard URL.
 *
 * @example
 * getOrgUrl("nitish", "/dashboard")   → "/nitish/dashboard"
 * getOrgUrl("nitish", "/members")     → "/nitish/members"
 * getOrgUrl("nitish", "/members/new") → "/nitish/members/new"
 * getOrgUrl("nitish")                 → "/nitish/dashboard"
 */
export function getOrgUrl(slug: string, path: string = "/dashboard"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${slug}${normalizedPath}`;
}

/**
 * Build a public gym website URL (subdomain-based).
 *
 * @example
 * getPublicGymUrl("nitish")       → "https://nitish.gmmx.app"
 * getPublicGymUrl("nitish", dev)  → "http://nitish.localhost:3000"
 */
export function getPublicGymUrl(
  slug: string,
  appDomain: string = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "gmmx.app",
  isProduction: boolean = process.env.NODE_ENV === "production",
): string {
  if (isProduction) {
    return `https://${slug}.${appDomain}`;
  }
  return `http://${slug}.localhost:3000`;
}

/**
 * Reserved path segments that must NOT be treated as organization slugs.
 * Keep this in sync with RESERVED_PATHS in middleware.ts.
 */
export const RESERVED_ORG_SLUGS = new Set([
  "signin",
  "signup",
  "login",
  "admin",
  "api",
  "auth",
  "onboarding",
  "pricing",
  "features",
  "about",
  "contact",
  "contact-us",
  "blogs",
  "blog",
  "privacy",
  "terms",
  "refund",
  "solutions",
  "testimonials",
  "tools",
  "how-it-works",
  "_next",
  "favicon.ico",
  "not-found",
  "error",
  "dashboard",
  "signout",
  "test-cookies",
  "tenant",
]);
