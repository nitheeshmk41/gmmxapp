"use server";

export async function getLeads(params: any = {}) {
  return { data: [], total: 0 };
}

export async function createLead(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function updateLead(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function deleteLead(id: string): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function convertLeadToMember(leadId: string): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function createPublicLead(data: any): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}
