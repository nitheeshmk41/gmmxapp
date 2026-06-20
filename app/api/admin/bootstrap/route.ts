import { ensureStorageInfrastructure } from "@/lib/appwrite/bootstrap";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await ensureStorageInfrastructure();
  
  if (res.error) {
    return NextResponse.json({ success: false, error: res.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Storage infrastructure bootstrapped successfully." });
}
