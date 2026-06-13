"use server";
import { getCurrentGym } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export async function getPlans() {
  return [] as any[];
}

export async function createPlan(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function updatePlan(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function deletePlan(id: string): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function togglePlanStatus(id: string, isActive: boolean): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}
