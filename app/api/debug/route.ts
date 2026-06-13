import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  let subdomain: string | null = null;
  if (
    hostname !== "localhost" &&
    hostname !== "gmmx.app" &&
    hostname !== "www.gmmx.app" &&
    hostname !== "127.0.0.1"
  ) {
    subdomain = parts[0];
  }
  const { pathname, search } = new URL(request.url);

  return NextResponse.json({
    host,
    subdomain,
    pathname,
    search,
    message: "This is a debug route to verify wildcard routing.",
  });
}
