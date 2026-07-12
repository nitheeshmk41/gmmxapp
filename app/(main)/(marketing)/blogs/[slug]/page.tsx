import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { getPublishedBlogs, getBlogBySlug, getRelatedBlogs } from "@/features/marketing/blog-queries";
import { formatRelativeDate } from "@/lib/utils";
import { ReadingProgress } from "@/components/marketing/ReadingProgress";

function calculateReadTime(content: string) {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Fallback image generator based on category
function getFallbackImage(category: string) {
  const cats: Record<string, string> = {
    "Gym Management": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    "Member Retention": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    "Gym Marketing": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    "Fitness Industry": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
  };
  return cats[category] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80";
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs();
  return blogs.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(post.category || "General", slug);
  const readTime = calculateReadTime(post.content);

  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("###")) {
        return (
          <h3 key={index} className="text-xl sm:text-2xl font-black text-slate-950 mt-10 mb-4 tracking-tight">
            {trimmed.replace("###", "").trim()}
          </h3>
        );
      }

      if (trimmed.startsWith("##")) {
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-black text-slate-950 mt-12 mb-6 tracking-tight">
            {trimmed.replace("##", "").trim()}
          </h2>
        );
      }

      if (trimmed.startsWith("#")) {
        return (
          <h1 key={index} className="text-3xl sm:text-4xl font-black text-slate-950 mt-14 mb-8 tracking-tight">
            {trimmed.replace("#", "").trim()}
          </h1>
        );
      }

      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const items = trimmed.split("\n").map((item) => item.replace(/^[-*]\s+/, ""));
        return (
          <ul key={index} className="list-disc pl-6 my-6 space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split("\n").map((item) => {
          const contentStr = item.replace(/^\d+\.\s+/, "");
          const parts = contentStr.split("**");
          if (parts.length >= 3) {
            return (
              <span key={item}>
                <strong className="font-extrabold text-slate-950">{parts[1]}</strong>
                {parts.slice(2).join("")}
              </span>
            );
          }
          return <span key={item}>{contentStr}</span>;
        });
        return (
          <ol key={index} className="list-decimal pl-6 my-6 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="pl-1">
                {item}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <p key={index} className="text-slate-700 text-sm sm:text-base leading-relaxed my-5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ReadingProgress />

      {/* Back button header area */}
      <div className="pt-28 max-w-4xl mx-auto px-6 mb-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-wider group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" /> Back to all articles
        </Link>
      </div>

      {/* Main Post Section */}
      <article className="max-w-4xl mx-auto px-6">
        
        {/* Cover Image */}
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-10 shadow-sm relative bg-slate-200">
          <img 
            src={post.coverImageUrl || getFallbackImage(post.category)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Category & Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold mb-6">
            <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {post.category || "General"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> Published: {formatRelativeDate(post.createdAt)}
            </span>
            {post.publishedAt !== post.createdAt && (
              <span className="flex items-center gap-1.5 text-slate-500">
                 Updated: {formatRelativeDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.1] tracking-tight mb-8">
            {post.title}
          </h1>

          {/* Author box */}
          <div className="flex items-center gap-4 py-6 border-y border-slate-200 mb-10">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Nitheesh K</p>
              <p className="text-xs text-slate-500 font-medium">Founder, GMMX</p>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none text-slate-700">
            {renderContent(post.content)}
          </div>

          {/* Try this in GMMX Box */}
          <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900">Try this in GMMX</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Automatic renewal reminders
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500" /> WhatsApp notifications
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Lead capturing gym website
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 bg-slate-900 shadow-md"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <div className="border-t border-slate-200 pt-16">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedPost: any) => (
                <Link key={relatedPost.$id} href={`/blogs/${relatedPost.slug}`} className="group h-full">
                  <article className="bg-white h-full rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all flex flex-col">
                    <div className="h-40 overflow-hidden relative border-b border-slate-100">
                      <img 
                        src={relatedPost.coverImageUrl || getFallbackImage(relatedPost.category)} 
                        alt={relatedPost.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-500 transition-colors mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between text-xs text-slate-400 font-medium pt-4">
                        <span>{formatRelativeDate(relatedPost.publishedAt || relatedPost.createdAt)}</span>
                        <span>{calculateReadTime(relatedPost.content)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
