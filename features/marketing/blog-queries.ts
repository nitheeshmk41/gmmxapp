"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";

export async function getPublishedBlogs(search?: string, category?: string) {
  try {
    const { databases } = await createAdminClient();
    
    const queries = [
      Query.equal("status", "published"),
      Query.orderDesc("publishedAt"),
      Query.limit(100)
    ];

    if (category && category !== "All") {
      queries.push(Query.equal("category", category));
    }

    const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.BLOGS, queries);
    let docs = res.documents;

    if (search) {
      const lowerSearch = search.toLowerCase();
      docs = docs.filter(doc => 
        (doc.title && doc.title.toLowerCase().includes(lowerSearch)) || 
        (doc.content && doc.content.toLowerCase().includes(lowerSearch))
      );
    }

    return docs;
  } catch (e) {
    console.error("Error fetching published blogs:", e);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.BLOGS, [
      Query.equal("slug", slug),
      Query.equal("status", "published"),
      Query.limit(1)
    ]);
    
    if (res.documents.length === 0) return null;
    return res.documents[0];
  } catch (e) {
    console.error("Error fetching blog by slug:", e);
    return null;
  }
}

export async function getRelatedBlogs(category: string, excludeSlug: string) {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.BLOGS, [
      Query.equal("status", "published"),
      Query.equal("category", category),
      Query.orderDesc("publishedAt"),
      Query.limit(4)
    ]);
    
    return res.documents.filter(doc => doc.slug !== excludeSlug).slice(0, 3);
  } catch (e) {
    console.error("Error fetching related blogs:", e);
    return [];
  }
}
