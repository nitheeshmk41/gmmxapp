import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentGym } from "@/lib/auth/context";
import { redirect } from "next/navigation";
import { createBlog } from "@/features/admin/blog-actions";

export default async function NewBlogPage() {
  const ctx = await getCurrentGym();
  if (!ctx?.user || ctx.user.role !== "super_admin") redirect("/admin/blogs");

  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createBlog(ctx!.user!.id, formData);
    if (result.success) redirect("/admin/blogs");
    // errors handled client-side via form action
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm mb-4 hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-muted-foreground)" }}>
          <ArrowLeft size={14} /> All Posts
        </Link>
        <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>New Blog Post</h1>
      </div>

      <form action={handleCreate} className="space-y-5">
        <div className="card rounded-2xl p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Title *
            </label>
            <input name="title" type="text" required placeholder="e.g. Best Gym Management Software in India"
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }} />
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Slug * <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>
                (lowercase, hyphens only — shown in URL as /blog/slug)
              </span>
            </label>
            <input name="slug" type="text" required placeholder="e.g. best-gym-management-software-india"
              pattern="[a-z0-9-]+"
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none font-mono"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }} />
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Meta Description / Excerpt
            </label>
            <textarea name="excerpt" rows={2} placeholder="Short summary shown in search results and social previews..."
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }} />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Cover Image URL <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>(Optional)</span>
            </label>
            <input name="coverImageUrl" type="url" placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }} />
          </div>

          {/* Category + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
                Category
              </label>
              <select name="category"
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                style={{
                  background: "var(--color-background)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                }}>
                <option value="">Select category...</option>
                <option value="gym-management">Gym Management</option>
                <option value="member-retention">Member Retention</option>
                <option value="gym-marketing">Gym Marketing</option>
                <option value="fitness-industry">Fitness Industry</option>
                <option value="product-updates">Product Updates</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
                Tags <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>(comma separated)</span>
              </label>
              <input name="tags" type="text" placeholder="e.g. gym software, member management"
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                style={{
                  background: "var(--color-background)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                }} />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Content * <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>(Markdown supported)</span>
            </label>
            <textarea name="content" rows={16} required placeholder="# Heading&#10;&#10;Write your blog content here using Markdown...&#10;&#10;## Section&#10;&#10;Your content..."
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-y font-mono leading-relaxed"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }} />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--color-foreground)" }}>
              Status
            </label>
            <div className="flex items-center gap-4">
              {["draft", "published"].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={s} defaultChecked={s === "draft"}
                    className="accent-pink-500" />
                  <span className="text-sm capitalize font-medium" style={{ color: "var(--color-foreground)" }}>{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "var(--color-brand-primary)" }}>
            Save Post
          </button>
          <Link href="/admin/blogs"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "var(--color-border-muted)", color: "var(--color-muted-foreground)" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
