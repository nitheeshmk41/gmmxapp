"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

const BlogSchema = z.object({
  title: z.string().min(3).max(500),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(10),
  excerpt: z.string().max(1000).optional(),
  status: z.enum(["draft", "published"]),
  category: z.string().max(100).optional(),
  tags: z.string().max(500).optional(),
});

export async function createBlog(authorId: string, formData: FormData) {
  try {
    const parsed = BlogSchema.parse({
      title: formData.get("title"),
      slug: (formData.get("slug") as string || "").toLowerCase().replace(/\s+/g, "-"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt") || undefined,
      status: formData.get("status") || "draft",
      category: formData.get("category") || undefined,
      tags: formData.get("tags") || undefined,
    });

    const { databases } = await createAdminClient();

    // Check slug uniqueness
    const existing = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.BLOGS, [
      Query.equal("slug", parsed.slug),
    ]);
    if (existing.total > 0) {
      return { success: false, error: `Slug "${parsed.slug}" already exists` };
    }

    const now = new Date().toISOString();
    await databases.createDocument(APPWRITE_DB_ID, COLLECTIONS.BLOGS, ID.unique(), {
      ...parsed,
      authorId,
      createdAt: now,
      publishedAt: parsed.status === "published" ? now : undefined,
    });

    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateBlog(blogId: string, formData: FormData) {
  try {
    const status = formData.get("status") as string || "draft";
    const parsed = BlogSchema.parse({
      title: formData.get("title"),
      slug: (formData.get("slug") as string || "").toLowerCase().replace(/\s+/g, "-"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt") || undefined,
      status,
      category: formData.get("category") || undefined,
      tags: formData.get("tags") || undefined,
    });

    const { databases } = await createAdminClient();
    const existing = await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.BLOGS, blogId);

    const updates: Record<string, any> = { ...parsed };
    if (parsed.status === "published" && (!existing.publishedAt || existing.status !== "published")) {
      updates.publishedAt = new Date().toISOString();
    }

    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.BLOGS, blogId, updates);
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteBlog(blogId: string) {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(APPWRITE_DB_ID, COLLECTIONS.BLOGS, blogId);
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function toggleBlogStatus(blogId: string, currentStatus: string) {
  try {
    const { databases } = await createAdminClient();
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await databases.updateDocument(APPWRITE_DB_ID, COLLECTIONS.BLOGS, blogId, {
      status: newStatus,
      publishedAt: newStatus === "published" ? new Date().toISOString() : undefined,
    });
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
