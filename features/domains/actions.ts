"use server";

export async function getDomains() {
  return [];
}

export async function addDomain(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function removeDomain(id: string): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}
