import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { notFound } from "next/navigation";
import LeadDetailClient from "./client";

interface Props {
  params: Promise<{ subdomain: string; id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  
  const { databases } = await createAdminClient();
  let lead: any = null;

  try {
    lead = await databases.getDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.LEADS,
      id
    );
  } catch (error) {
    console.error("Failed to fetch lead", error);
  }

  if (!lead) {
    notFound();
  }

  const safeLead = {
    id: lead.$id,
    name: lead.name,
    phone: lead.phone,
    status: lead.status,
    source: lead.source || "Website",
    createdAt: lead.createdAt || lead.$createdAt || new Date().toISOString(),
  };

  return <LeadDetailClient lead={safeLead as any} />;
}
