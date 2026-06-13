"use server";

export async function getPayments(params: any = {}) {
  return { data: [], total: 0, page: 1, limit: 10 };
}

export async function createPayment(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  return { success: true };
}

export async function getPaymentById(id: string) {
  return null;
}
