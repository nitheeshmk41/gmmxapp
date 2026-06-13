import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const response = NextResponse.next({ request });

  // 1. Read host header
  const host = request.headers.get("host") || "";

  // 2. Extract subdomain
  const subdomain = host.split(".")[0];

  // 6. Add debugging logs
  console.log(`[Middleware] Host: ${host} | Extracted Subdomain: ${subdomain} | Path: ${pathname}`);

  // 3. Ignore standard hosts and localhosts
  const isLocalhost = subdomain === "localhost" || host.startsWith("127.0.0.1");
  const isAppDomain = subdomain === "www" || subdomain === "gmmx" || host === "gmmx.app";

  // Check if we should rewrite to tenant
  if (
    !isLocalhost &&
    !isAppDomain &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup")
  ) {
    // 4. & 5. Rewrite internally and preserve query parameters
    const url = request.nextUrl.clone();
    url.pathname = `/tenant/${subdomain}${pathname === '/' ? '' : pathname}`;
    
    console.log(`[Middleware] Rewriting to internal path: ${url.pathname}${url.search}`);
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
    const redirectTo = searchParams.get("redirectTo");
    if (redirectTo) {
      const res = NextResponse.next({ request });
      res.cookies.delete(sessionCookieName);
      return res;
    }
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
