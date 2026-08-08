import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RESERVED_PATHS = new Set([
  "signin",
  "signup",
  "login",
  "signout",
  "auth",
  "onboarding",
  "forgot-password",
  "reset-password",
  "admin",
  "api",
  "_next",
  "favicon.ico",
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
  "dashboard",
  "tenant",
  "error",
  "not-found",
  "test-cookies",
]);

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
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === appDomain ||
    hostname === `www.${appDomain}`
  ) {
    return null;
  }

  if (hostname.endsWith(".localhost")) {
    const sub = hostname.replace(".localhost", "");
    return RESERVED_SUBDOMAINS.has(sub) ? null : sub;
  }

  if (hostname.endsWith(`.${appDomain}`)) {
    const sub = hostname.slice(0, -(appDomain.length + 1));
    return RESERVED_SUBDOMAINS.has(sub) ? null : sub;
  }

  return null;
}

function extractOrgSlug(pathname: string): string | null {
  const firstSegment = pathname.split("/")[1] ?? "";
  if (!firstSegment) return null;
  if (RESERVED_PATHS.has(firstSegment)) return null;
  if (!/^[a-z0-9-]+$/.test(firstSegment)) return null;
  return firstSegment;
}

// ---------------------------------------------------------------------------
// Clerk Middleware Integration
// ---------------------------------------------------------------------------

export default clerkMiddleware(async (auth, request) => {
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

  if (process.env.NODE_ENV === "development") {
    console.log(`[Proxy] host=${host} | path=${pathname}`);
  }

  // ── 1. Detect host type ───────────────────────────────────────────────────
  const subdomain = extractSubdomain(hostname, appDomain);

  // ── 2. Gym subdomain host (public website or legacy dashboard) ────────────
  if (subdomain) {
    const legacyDashboardPrefixes = ["/owner/", "/trainer/", "/member/"];
    const isLegacyDashboard = legacyDashboardPrefixes.some((p) =>
      pathname.startsWith(p),
    );

    if (isLegacyDashboard) {
      let newPath = pathname
        .replace(/^\/owner\/dashboard/, "/dashboard")
        .replace(/^\/owner\//, "/");
      const newUrl = `${proto}://${appDomain}/${subdomain}${newPath}`;
      return NextResponse.redirect(newUrl, { status: 301 });
    }

    if (
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/tenant/")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${subdomain}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next({ request });
  }

  // ── 3. Main domain (gmmx.app / localhost) ────────────────────────────────
  if (pathname.startsWith("/api") || pathname.startsWith("/auth") || pathname.startsWith("/__clerk")) {
    return NextResponse.next({ request });
  }

  // ── 3b. Session check (for auth guards) ──────────────────────────────────
  const { userId } = await auth();
  const hasSession = !!userId;

  // ── 3c. Auth pages: redirect logged-in users away ─────────────────────────
  const isAuthPage =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password");

  if (isAuthPage && hasSession) {
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    if (!redirectTo) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // ── 3d. Detect organization slug in path ──────────────────────────────────
  const orgSlug = extractOrgSlug(pathname);

  if (orgSlug) {
    const isOrgLogin = pathname.endsWith("/member/login") || pathname.endsWith("/trainer/login");
    if (!hasSession && !isOrgLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

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

  const response = NextResponse.next({ request });
  response.headers.set("x-pathname", pathname);
  return response;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};
