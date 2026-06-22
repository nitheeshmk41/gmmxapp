import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentGym } from "@/lib/auth/context";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { updateBlog } from "@/features/admin/blog-actions";

async function getBlog(id: string) {
  try {
    const { databases } = await createAdminClient();
    return await databases.getDocument(APPWRITE_DB_ID, COLLECTIONS.BLOGS, id);
  } catch {
    return null;
  }
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await getCurrentGym();
  if (!ctx?.user || ctx.user.role !== "super_admin") redirect("/admin/blogs");

  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateBlog(id, formData);
    if (result.success) redirect("/admin/blogs");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm mb-4 hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-muted-foreground)" }}>
          <ArrowLeft size={14} /> All Posts
        </Link>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Edit Post</h1>
        <p className="text-xs mt-1 font-mono" style={{ color: "var(--color-muted-foreground)" }}>
          /blog/{blog.slug}
        </p>
      </div>

      <form action={handleUpdate} className="space-y-5">
        <div className="card rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>Title *</label>
            <input name="title" type="text" required defaultValue={blog.title}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
              style={{ background: "var(--color-background)", borderColor: "var(--color-border)", color: "var(--color-foreground)" }} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>Slug *</label>
            <input name="slug" type="text" required defaultValue={blog.slug} pattern="[a-z0-9-]+"
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none font-mono"
              style={{ background: "var(--color-background)", borderColor: "var(--color-border)", color: "var(--color-foreground)" }} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>Excerpt</label>
            <textarea name="excerpt" rows={2} defaultValue={blog.excerpt || ""}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none"
              style={{ background: "var(--color-background)", borderColor: "var(--color-border)", color: "var(--color-foreground)" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>Category</label>
              <select name="category" defaultValue={blog.category || ""}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                style={{ background: "var(--color-background)", borderColor: "var(--color-border)", color: "var(--color-foreground)" }}>
                <option value="">Select category...</option>
                {["gym-management","member-retention","gym-marketing","fitness-industry","product-updates"].map((c) => (
                  <option key={c} value={c}>{c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>Tags</label>
              <input name="tags" type="text" defaultValue={blog.tags || ""}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                style={{ background: "var(--color-background)", borderColor: "var(--color-border)", color: "var(--color-foreground)" }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Content * <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>(Markdown)</span>
            </label>
            <textarea name="content" rows={18} required defaultValue={blog.content}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-y font-mono leading-relaxed"
              style={{ background: "var(--color-background)", borderColor: "var(--color-border)", color: "var(--color-foreground)" }} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>Status</label>
            <div className="flex items-center gap-4">
              {["draft", "published"].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={s} defaultChecked={blog.status === s} className="accent-pink-500" />
                  <span className="text-sm capitalize font-medium" style={{ color: "var(--color-foreground)" }}>{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
            style={{ background: "var(--color-brand-primary)" }}>
            Save Changes
          </button>
          <Link href="/admin/blogs"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80"
            style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
