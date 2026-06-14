"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { getCurrentGym } from "@/features/auth/actions";
import { APPWRITE_DB_ID, COLLECTIONS, LeadDocument } from "@/lib/appwrite/types";
import { ID, Query } from "node-appwrite";

export async function getLeads(params: { search?: string; status?: string; page?: number; pageSize?: number } = {}) {
  const gym = await getCurrentGym();
  if (!gym) return { data: [], total: 0 };

  const { databases } = await createAdminClient();
  const queries = [Query.equal("gymId", gym.$id)];

  if (params.search) {
    queries.push(Query.contains("name", params.search));
  }
  if (params.status && params.status !== "all") {
    queries.push(Query.equal("status", params.status));
  }

  queries.push(Query.orderDesc("createdAt"));

  const limit = params.pageSize || 25;
  const offset = ((params.page || 1) - 1) * limit;
  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  try {
    const res = await databases.listDocuments<LeadDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.LEADS,
      queries
    );
    return { data: res.documents, total: res.total };
  } catch (error) {
    console.error("[getLeads] Failed to fetch leads:", error);
    return { data: [], total: 0 };
  }
}

export async function createLead(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const status = (formData.get("status") as string) || "New";
  const source = (formData.get("source") as string) || "dashboard";

  if (!name || !phone) return { error: "Name and phone are required" };

  try {
    const { databases } = await createAdminClient();
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.LEADS, ID.unique(), {
      gymId: gym.$id,
      name,
      phone,
      status,
      source,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to create lead" };
  }
}

export async function updateLead(id: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as string;
  const source = formData.get("source") as string;

  if (!name || !phone) return { error: "Name and phone are required" };

  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.LEADS, id, {
      name,
      phone,
      status,
      source,
    });
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to update lead" };
  }
}

export async function updateLeadStatus(id: string, status: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.LEADS, id, {
      status,
    });
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to update lead status" };
  }
}

export async function deleteLead(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.LEADS, id);
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to delete lead" };
  }
}

export async function convertLeadToMember(leadId: string): Promise<{ success?: boolean; error?: string }> {
  const gym = await getCurrentGym();
  if (!gym) return { error: "Unauthorized" };

  try {
    const { databases, users } = await createAdminClient();
    const lead = await databases.getDocument<LeadDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.LEADS,
      leadId
    );

    const password = ID.unique() + ID.unique();
    const appwriteUser = await users.create(
      ID.unique(),
      undefined,
      lead.phone,
      password,
      lead.name
    );

    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.GYM_USERS,
      ID.unique(),
      {
        gymId: gym.$id,
        userId: appwriteUser.$id,
        role: "MEMBER"
      }
    );

    await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.MEMBERS,
      appwriteUser.$id,
      {
        gymId: gym.$id,
        name: lead.name,
        phone: lead.phone,
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
      }
    );

    await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.LEADS,
      leadId,
      {
        status: "Converted",
      }
    );

    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Failed to convert lead to member" };
  }
}

export async function createPublicLead(data: { gymId: string; name: string; phone: string; source?: string }): Promise<{ success?: boolean; error?: string }> {
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
