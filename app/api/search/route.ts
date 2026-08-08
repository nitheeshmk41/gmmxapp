import { NextResponse } from "next/server";
import { getCurrentGym } from "@/features/auth/actions";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const gym = await getCurrentGym();
  if (!gym) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { databases } = await createAdminClient();
    
    // Perform searches across different collections
    // For MVP, we will use basic startsWith or search queries if supported, otherwise simple fetch and filter.
    // Appwrite supports Query.search() if full-text index is created. We will use Query.startsWith() or manual filter for MVP.
    // For safety and speed in MVP without knowing indexes, we fetch recent and filter in memory if the dataset is small, 
    // or use Query.equal if we want exact matches. We will use Query.contains if supported, or fetch and filter.
    // Given MVP limits, we will fetch up to 100 recent docs from each and filter in memory for fuzzy match.
    
    const [membersRes, trainersRes, leadsRes] = await Promise.all([
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.MEMBERS, [
        Query.equal("gymId", gym.$id),
        Query.limit(100),
        Query.orderDesc("$createdAt")
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.GYM_USERS, [
        Query.equal("gymId", gym.$id),
        Query.equal("role", "trainer"),
        Query.limit(50)
      ]),
      databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.LEADS, [
        Query.equal("gymId", gym.$id),
        Query.limit(100),
        Query.orderDesc("$createdAt")
      ])
    ]);

    const queryLower = q.toLowerCase();
    const members = [];
    const trainers = [];
    const leads = [];

    // Filter members
    for (const m of membersRes.documents) {
      if (members.length >= 5) break;
      if (m.name?.toLowerCase().includes(queryLower) || m.phone?.includes(queryLower)) {
        members.push({
          id: m.$id,
          type: "member",
          title: m.name,
          subtitle: m.phone || "No phone",
          url: `/${gym.subdomain}/members/${m.$id}`
        });
      }
    }

    // Filter trainers
    for (const t of trainersRes.documents) {
      if (trainers.length >= 5) break;
      if (t.name?.toLowerCase().includes(queryLower)) {
        trainers.push({
          id: t.$id,
          type: "trainer",
          title: t.name || "Trainer",
          subtitle: "Staff",
          url: `/${gym.subdomain}/team/trainers`
        });
      }
    }

    // Filter leads
    for (const l of leadsRes.documents) {
      if (leads.length >= 5) break;
      if (l.name?.toLowerCase().includes(queryLower) || l.phone?.includes(queryLower)) {
        leads.push({
          id: l.$id,
          type: "lead",
          title: l.name,
          subtitle: l.phone || "No phone",
          url: `/${gym.subdomain}/leads`
        });
      }
    }

    return NextResponse.json({ members, trainers, leads });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
