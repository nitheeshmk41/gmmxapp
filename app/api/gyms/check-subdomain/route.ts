import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json({ error: "Subdomain required" }, { status: 400 });
  }

  try {
    const existing = await prisma.gym.findUnique({
      where: { subdomain },
      select: { id: true },
    });

    return NextResponse.json({ available: !existing });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
