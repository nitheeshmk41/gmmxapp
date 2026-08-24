import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Path prefixes (first segment after /) that must NEVER be treated as
 * organization slugs. Keep in sync with RESERVED_ORG_SLUGS in lib/utils/org-url.ts
 * and RESERVED_SUBDOMAINS in lib/utils/subdomain.ts.
 */
const RESERVED_PATHS = new Set([
  // Auth & onboarding
  "signin",
  "signup",
  "login",
  "signout",
  "auth",
  "onboarding",
  "forgot-password",
  "reset-password",

  // Super Admin
  "admin",

  // System / API
  "api",
  "_next",
  "favicon.ico",

  // Marketing
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

  // Internal Next.js / catch-all
  "dashboard",
  "tenant",
  "error",
  "not-found",
  "test-cookies",
]);

/** Subdomains that are infrastructure, not gyms. */
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "server",
  "mail",
  "status",
  "admin",
  "cdn",
  "ftp",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractSubdomain(hostname: string, appDomain: string): string | null {
  // localhost / dev IP
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === appDomain ||
    hostname === `www.${appDomain}`
  ) {
    return null;
  }

  // {sub}.localhost  (local dev for public gym site)
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.replace(".localhost", "");
    return RESERVED_SUBDOMAINS.has(sub) ? null : sub;
  }

  // {sub}.gmmx.app
  if (hostname.endsWith(`.${appDomain}`)) {
    const sub = hostname.slice(0, -(appDomain.length + 1));
    return RESERVED_SUBDOMAINS.has(sub) ? null : sub;
  }

  // Custom domain — not a subdomain we extract here; public website handles it.
  return null;
}

function extractOrgSlug(pathname: string): string | null {
  // First segment: /slug/... → "slug"
  const firstSegment = pathname.split("/")[1] ?? "";
  if (!firstSegment) return null;
  if (RESERVED_PATHS.has(firstSegment)) return null;
  // Must look like a valid slug: lowercase letters, digits, hyphens
  if (!/^[a-z0-9-]+$/.test(firstSegment)) return null;
  return firstSegment;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "gmmx.app";
  const isProduction = process.env.NODE_ENV === "production";
  const proto = isProduction ? "https" : "http";

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next({ request });
  }

  // ── Dev logging ────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] host=${host} | path=${pathname}`);
  }

  // ── 1. Detect host type ───────────────────────────────────────────────────
  const subdomain = extractSubdomain(hostname, appDomain);
  const isMainDomain =
    hostname === appDomain ||
    hostname === `www.${appDomain}` ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(`.localhost`) === false && !hostname.includes(".");

  // ── 2. Gym subdomain host (public website or legacy dashboard) ────────────
  if (subdomain) {
    // ── 2a. Legacy dashboard URL on subdomain → redirect to path-based URL ──
    //        e.g. nitish.gmmx.app/owner/dashboard → gmmx.app/nitish/dashboard
    const legacyDashboardPrefixes = ["/owner/", "/trainer/", "/member/"];
    const isLegacyDashboard = legacyDashboardPrefixes.some((p) =>
      pathname.startsWith(p),
    );

    if (isLegacyDashboard) {
      // Map old role-prefixed paths to new org-slug paths
      let newPath = pathname
        .replace(/^\/owner\/dashboard/, "/dashboard")
        .replace(/^\/owner\//, "/");
      const newUrl = `${proto}://${appDomain}/${subdomain}${newPath}`;
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Legacy redirect: ${host}${pathname} → ${newUrl}`);
      }
      return NextResponse.redirect(newUrl, { status: 301 });
    }

    // ── 2b. Public gym website — rewrite to /tenant/{subdomain}{pathname} ───
    if (
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/tenant/")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${subdomain}${pathname === "/" ? "" : pathname}`;
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Public site rewrite: ${host}${pathname} → ${url.pathname}`);
      }
      return NextResponse.rewrite(url);
    }

    return NextResponse.next({ request });
  }

  // ── 3. Main domain (gmmx.app / localhost) ────────────────────────────────

  // ── 3a. API routes — pass through, no rewrite ────────────────────────────
  if (pathname.startsWith("/api") || pathname.startsWith("/auth")) {
    return NextResponse.next({ request });
  }

  // ── 3b. Session check (for auth guards) ──────────────────────────────────
  const sessionCookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  const sessionCookie = request.cookies.get(sessionCookieName);
  const hasSession = !!sessionCookie?.value;

  // ── 3c. Auth pages: redirect logged-in users away ─────────────────────────
  const isAuthPage =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password");

  if (isAuthPage && hasSession) {
    // Don't redirect if there's a ?redirectTo param (stale cookie scenario)
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    if (!redirectTo) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard"; // will further redirect to /{slug}/dashboard
      return NextResponse.redirect(url);
    }
  }

  // ── 3d. Detect organization slug in path ──────────────────────────────────
  const orgSlug = extractOrgSlug(pathname);

  if (orgSlug) {
    const isOrgLogin = pathname.endsWith("/member/login") || pathname.endsWith("/trainer/login");
    // ── 3e. Unauthenticated access to org dashboard → login ─────────────────
    if (!hasSession && !isOrgLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirectTo", pathname);
      if (process.env.NODE_ENV === "development") {
        console.log(`[Middleware] Unauthenticated org access, redirecting to signin`);
      }
      return NextResponse.redirect(url);
    }

    // ── 3f. Set x-organization-slug header for layout.tsx authorization ──────
    const response = NextResponse.next({ request });
    response.headers.set("x-organization-slug", orgSlug);
    response.headers.set("x-pathname", pathname);
    return response;
  }

  // ── 3g. Protected non-org routes ──────────────────────────────────────────
  const isAdminRoute = pathname.startsWith("/admin");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isGenericDashboard = pathname.startsWith("/dashboard");

  if ((isAdminRoute || isOnboarding || isGenericDashboard) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Set x-pathname for admin layout
  const response = NextResponse.next({ request });
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
