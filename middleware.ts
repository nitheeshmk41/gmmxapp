import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);
  const response = NextResponse.next({ request });

  // 1. Read host header
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // 2. Extract subdomain
  const parts = hostname.split(".");
  let subdomain: string | null = null;

  const reserved = [
    "server",
    "api",
    "www",
    "mail",
    "status",
  ];

  if (
    hostname !== "localhost" &&
    hostname !== "gmmx.app" &&
    hostname !== "www.gmmx.app" &&
    hostname !== "127.0.0.1" &&
    !reserved.includes(parts[0])
  ) {
    subdomain = parts[0];
  }

  // 6. Add debugging logs
  console.log(`[Middleware] Host: ${host} | Extracted Subdomain: ${subdomain} | Path: ${pathname}`);

  // Check if we should rewrite to tenant
  if (
    subdomain &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/tenant/")
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
  
  // Debug cookies
  console.log("[Middleware] Expected Cookie Name:", sessionCookieName);
  console.log("[Middleware] All Cookies:", request.cookies.getAll().map(c => c.name));
  console.log("[Middleware] Session Cookie Value:", sessionCookie?.value ? "PRESENT" : "MISSING");
  
  const hasSession = !!sessionCookie?.value;

  // ── Auth Pages Guard (redirect logged-in users away) ─────────
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  if (isAuthPage) {
    const tenantCookie = request.cookies.get("gmmx_tenant")?.value;
    if (tenantCookie && !subdomain) {
      const [cachedSubdomain, cachedRole] = tenantCookie.split(":");
      if (cachedSubdomain && cachedRole) {
        const url = request.nextUrl.clone();
        const port = host.split(":")[1];
        let baseHost = hostname.replace(/^www\./, "");
        if (port) baseHost += `:${port}`;
        
        url.host = `${cachedSubdomain}.${baseHost}`;
        url.pathname = hasSession ? `/${cachedRole.toLowerCase()}/dashboard` : `/${cachedRole.toLowerCase()}/login`;
        return NextResponse.redirect(url);
      }
    }

    if (hasSession) {
      const redirectTo = searchParams.get("redirectTo");
      if (redirectTo) {
        const res = NextResponse.next({ request });
        res.cookies.delete(sessionCookieName);
        return res;
      }
      const url = request.nextUrl.clone();
      if (subdomain) {
         // They are already on the tenant subdomain
         url.pathname = "/owner/dashboard"; 
      } else {
         url.pathname = "/dashboard";
      }
      return NextResponse.redirect(url);
    }
  }

  // ── Protected Routes Guard ────────────────────────────────────
  const isDashboard = pathname.startsWith("/owner/dashboard") || pathname.startsWith("/trainer/dashboard") || pathname.startsWith("/member/dashboard") || pathname.startsWith("/admin/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isOnboarding = pathname.startsWith("/onboarding");

  if ((isDashboard || isAdmin || isOnboarding) && !hasSession) {
    const url = request.nextUrl.clone();
    if (subdomain) {
       if (pathname.startsWith("/owner")) url.pathname = "/owner/login";
       else if (pathname.startsWith("/trainer")) url.pathname = "/trainer/login";
       else if (pathname.startsWith("/member")) url.pathname = "/member/login";
       else url.pathname = "/login";
    } else {
       url.pathname = "/signin";
    }
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
