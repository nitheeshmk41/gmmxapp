import { NextResponse } from "next/server";

/**
 * Debug route — disabled in production.
 * Only available in development for verifying wildcard routing.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Debug route is only available in development.",
    env: process.env.NODE_ENV,
  });
}
