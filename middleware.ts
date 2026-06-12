import { NextRequest, NextResponse } from "next/server";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = new URL(request.url);
  const response = NextResponse.next({ request });

  // ── Subdomain Detection ──────────────────────────────────────
  const host = request.headers.get("host") || hostname;
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  let subdomain: string | null = null;

  if (!isLocalhost) {
    if (host.endsWith(`.${APP_DOMAIN}`)) {
      subdomain = host.replace(`.${APP_DOMAIN}`, "");
      if (subdomain === "www" || subdomain === "") {
        subdomain = null;
      }
    }
  } else {
    subdomain = request.nextUrl.searchParams.get("gym");
  }

  // ── Gym Website Routing ──────────────────────────────────────
  if (
    subdomain &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/gym/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Session Check ────────────────────────────────────────────
  const sessionCookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  const sessionCookie = request.cookies.get(sessionCookieName);
  const hasSession = !!sessionCookie?.value;

  // ── Auth Pages Guard (redirect logged-in users away) ─────────
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  if (isAuthPage && hasSession) {
    // Check for a redirect-loop breaker: if the request came from /dashboard
    // or /onboarding (via the Referer header or a query param), the session
    // cookie is stale. Delete it and let the user through to the login page.
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    if (redirectTo) {
      // This means a protected route already rejected the session.
      // The cookie is stale — delete it and let the user see the login page.
      const res = NextResponse.next({ request });
      res.cookies.delete(sessionCookieName);
      return res;
    }

    // Otherwise, user appears to have a valid session — send to dashboard.
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ── Protected Routes Guard ────────────────────────────────────
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isOnboarding = pathname.startsWith("/onboarding");

  if ((isDashboard || isAdmin || isOnboarding) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - Static files (_next/static, _next/image, favicon.ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
