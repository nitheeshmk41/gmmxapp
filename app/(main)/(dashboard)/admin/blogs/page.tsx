export const dynamic = "force-dynamic";

import {
  BookOpen, PenSquare, Eye, Trash2, Plus, Globe, FileText,
} from "lucide-react";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { deleteBlog, toggleBlogStatus } from "@/features/admin/blog-actions";

async function getBlogs() {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(APPWRITE_DB_ID, COLLECTIONS.BLOGS, [
      Query.limit(100),
      Query.orderDesc("createdAt"),
    ]);
    return res.documents;
  } catch (e) {
    return [];
  }
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();
  const published = blogs.filter((b: any) => b.status === "published").length;
  const drafts = blogs.filter((b: any) => b.status === "draft").length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--color-foreground)" }}>Blog Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            SEO-optimized content for GMMX marketing
          </p>
        </div>
        <Link href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "var(--color-brand-primary)" }}>
          <Plus size={14} /> New Post
        </Link>
      </div>

      {/* SEO tip */}
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "#6366f110", border: "1px solid #6366f125" }}>
        <Globe size={14} style={{ color: "#6366f1" }} className="flex-shrink-0" />
        <p className="text-xs" style={{ color: "#6366f1cc" }}>
          <strong style={{ color: "#6366f1" }}>SEO Tip:</strong> Blog posts targeting keywords like "Best Gym Management Software", 
          "How To Grow Your Gym", and "Member Retention Tips" can drive significant organic traffic to GMMX.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Posts", value: blogs.length, icon: BookOpen, color: "#FF5C73" },
          { label: "Published", value: published, icon: Globe, color: "#22c55e" },
          { label: "Drafts", value: drafts, icon: FileText, color: "#f59e0b" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${c.color}15` }}>
                <Icon size={18} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "var(--color-foreground)" }}>{c.value}</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blog list */}
      {blogs.length > 0 ? (
        <div className="card rounded-2xl overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>All Posts</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border-muted)" }}>
            {blogs.map((blog: any) => (
              <div key={blog.$id} className="px-5 py-4 flex items-center gap-4 table-row-hover">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-foreground)" }}>
                      {blog.title}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      blog.status === "published"
                        ? "text-green-700 bg-green-50"
                        : "text-amber-600 bg-amber-50"
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    <span className="font-mono">/blog/{blog.slug}</span>
                    {blog.category && <span>· {blog.category}</span>}
                    <span>· {formatRelativeDate(blog.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/blogs/${blog.$id}/edit`}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                    style={{ background: "#6366f115", color: "#6366f1" }}>
                    <PenSquare size={11} /> Edit
                  </Link>
                  <form action={async () => { "use server"; await toggleBlogStatus(blog.$id, blog.status); }}>
                    <button type="submit"
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                      style={{
                        background: blog.status === "published" ? "#f59e0b15" : "#22c55e15",
                        color: blog.status === "published" ? "#f59e0b" : "#22c55e",
                      }}>
                      {blog.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={async () => { "use server"; await deleteBlog(blog.$id); }}>
                    <button type="submit"
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                      style={{ background: "#ef444415", color: "#ef4444" }}>
                      <Trash2 size={11} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--color-border-muted)" }}>
            <BookOpen size={24} style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>No blog posts yet</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>
              Create your first post to start driving SEO traffic
            </p>
          </div>
          <Link href="/admin/blogs/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "var(--color-brand-primary)" }}>
            <Plus size={14} /> Write First Post
          </Link>
        </div>
      )}
    </div>
  );
}
