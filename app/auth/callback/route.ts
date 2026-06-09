import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { id: data.user.id },
      });

      if (!existingUser) {
        // Create user record
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            role: "gym_owner",
          },
        });
        
        // Since it's a new Google sign in, they don't have a gym yet
        return NextResponse.redirect(`${origin}/onboarding`);
      } else {
        // Redirect super admin to admin panel
        if (existingUser.role === "super_admin") {
          return NextResponse.redirect(`${origin}/admin`);
        }

        // User exists, check if they have a gym
        if (!existingUser.gym_id) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
        
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
