"use server";

export async function getMembers(params: any = {}) {
  return { data: [], total: 0, page: 1, limit: 10 };
}

export async function getMemberById(id: string) {
  return {} as any;
}

export async function createMember(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function updateMember(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function deleteMember(id: string): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function getMembersForExport() {
  return [];
}
