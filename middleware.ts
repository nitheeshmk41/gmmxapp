import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "gmmx.app";

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = new URL(request.url);
  const response = NextResponse.next({ request });

  // ── Subdomain Detection ──────────────────────────────────────
  // Extract subdomain from hostname
  // e.g. ironfit.gmmx.app → ironfit
  // e.g. localhost → no subdomain (use ?gym= query param in dev)
  const host = request.headers.get("host") || hostname;
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  let subdomain: string | null = null;

  if (!isLocalhost) {
    // Production: extract subdomain
    if (host.endsWith(`.${APP_DOMAIN}`)) {
      subdomain = host.replace(`.${APP_DOMAIN}`, "");
      // Exclude www and bare domain
      if (subdomain === "www" || subdomain === "") {
        subdomain = null;
      }
    }
  } else {
    // Development: use ?gym= query param as subdomain fallback
    subdomain = request.nextUrl.searchParams.get("gym");
  }

  // ── Gym Website Routing ──────────────────────────────────────
  // If subdomain detected AND path is not a dashboard/admin path,
  // rewrite to the gym website handler
  if (
    subdomain &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/gym/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Auth Protection ──────────────────────────────────────────
  // Protect /dashboard and /admin routes
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isOnboarding = pathname.startsWith("/onboarding");

  if (isDashboard || isAdmin || isOnboarding) {
    // Create a Supabase client for auth check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Super admin guard
    if (isAdmin) {
      // Role check done at page level for now
      // Could add super_admin check here via DB query if needed
    }
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
