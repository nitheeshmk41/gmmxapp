"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { ID } from "node-appwrite";

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
  try {
    const { databases } = await createAdminClient();
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.LEADS, ID.unique(), {
      gymId: data.gymId,
      name: data.name,
      phone: data.phone,
      status: "New",
      source: data.source || "Website",
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to create lead." };
  }
}
