"use server";

import { getCurrentContext, getCurrentGym as getGymContext } from "@/lib/auth/context";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Active Clerk Auth Context Actions
// ---------------------------------------------------------------------------

export async function getCurrentUser() {
  const context = await getCurrentContext();
  return context?.user ?? null;
}

export async function getCurrentGym() {
  const context = await getGymContext();
  return context?.gym ?? null;
}

// ---------------------------------------------------------------------------
// Legacy/Obsolete Actions (Stubbed to prevent compiler errors)
// ---------------------------------------------------------------------------

export async function signOut() {
  redirect("/signin");
}

export async function signInWithGoogle() {
  return { error: "Deprecated. Use Clerk sign-in." };
}

export async function signUpWithEmail(formData: FormData) {
  return { error: "Deprecated. Use Clerk sign-up." };
}

export async function signInWithEmail(formData: FormData) {
  return { error: "Deprecated. Use Clerk sign-in." };
}

export async function sendOtp(formData: FormData) {
  return { error: "Deprecated. Use Clerk." };
}

export async function verifyOtp(formData: FormData) {
  return { error: "Deprecated. Use Clerk." };
}

export async function changeInitialPassword(formData: FormData) {
  return { error: "Deprecated. Password management is handled by Clerk." };
}

export async function checkAuthMethod(email: string) {
  return { error: "Deprecated. Handled by Clerk." };
}

export async function sendPasswordCreationEmail(email: string, currentUrl?: string) {
  return { error: "Deprecated. Handled by Clerk." };
}

export async function completePasswordSetup(formData: FormData) {
  return { error: "Deprecated. Handled by Clerk." };
}
