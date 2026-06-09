"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  gymName: z.string().min(2, "Gym name must be at least 2 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Google Sign In ────────────────────────────────────────────
export async function signInWithGoogle(_formData?: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}

// ── Sign Up ───────────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    gymName: formData.get("gymName") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.gymName }, // Keep as 'name' in Auth metadata for simplicity
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const subdomain = parsed.data.gymName.toLowerCase().replace(/[^a-z0-9]/g, "") || "yourgym" + Math.floor(Math.random() * 1000);

    // Create gym and user in a transaction
    await prisma.$transaction(async (tx) => {
      const gym = await tx.gym.create({
        data: {
          name: parsed.data.gymName,
          owner_name: "", // Will be filled later
          phone: "",      // Will be filled later
          email: parsed.data.email,
          subdomain,
        },
      });

      await tx.user.create({
        data: {
          id: data.user!.id,
          email: parsed.data.email,
          role: "gym_owner",
          gym_id: gym.id,
        },
      });
    });
  }

  redirect("/dashboard");
}

// ── Sign In ───────────────────────────────────────────────────
export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  // Check if user has a gym (completed onboarding)
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser?.role === "super_admin") {
      redirect("/admin");
    }

    if (dbUser?.gym_id) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  redirect("/dashboard");
}

// ── Sign Out ──────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ── Reset Password ────────────────────────────────────────────
export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email || !z.string().email().safeParse(email).success) {
    return { error: "Please enter a valid email address" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for a password reset link" };
}

// ── Get Current User ──────────────────────────────────────────
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return dbUser;
}

// ── Get Current Gym ───────────────────────────────────────────
export async function getCurrentGym() {
  const user = await getCurrentUser();
  if (!user?.gym_id) return null;

  return prisma.gym.findUnique({
    where: { id: user.gym_id },
    include: {
      branches: { where: { is_main: true }, take: 1 },
    },
  });
}
