import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "../data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H3 Headings
      if (trimmed.startsWith("###")) {
        return (
          <h3 key={index} className="text-xl sm:text-2xl font-black text-slate-950 mt-10 mb-4 tracking-tight">
            {trimmed.replace("###", "").trim()}
          </h3>
        );
      }

      // Bullet Lists
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

      // Numbered Lists with bold support
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

      // Regular Paragraphs
      return (
        <p key={index} className="text-slate-700 text-sm sm:text-base leading-relaxed my-5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Back button header area */}
      <div className="pt-28 max-w-3xl mx-auto px-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-wider group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" /> Back to all articles
        </Link>
      </div>

      {/* Main Post Section */}
      <article className="py-8 pb-24 max-w-3xl mx-auto px-6">
        {/* Category & Stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold mb-4">
          <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight mb-8">
          {post.title}
        </h1>

        {/* Author box */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200/50 mb-10 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500 font-bold text-sm">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">written by</p>
            <p className="text-sm font-extrabold text-slate-900">{post.author}</p>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose max-w-none border-t border-slate-200/60 pt-6">
          {renderContent(post.content)}
        </div>
      </article>

      {/* Bottom CTA */}
      <section className="relative text-white py-24 px-6 text-center border-t border-white/5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/gym_assert4.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Automate your gym operations today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Take the administrative weight off your shoulders. Launch a professional gym website, track members, and streamline renewals.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "#FF5C73",
                boxShadow: "0 4px 20px rgba(255,92,115,0.4)",
              }}
            >
              Start Free Trial Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
