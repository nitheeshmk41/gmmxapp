import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const subdomain = host.split(".")[0];
  const { pathname, search } = new URL(request.url);

  return NextResponse.json({
    host,
    subdomain,
    pathname,
    search,
    message: "This is a debug route to verify wildcard routing.",
  });
}
