import Link from "next/link";
import { BLOG_POSTS } from "./data";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export default function BlogsPage() {
  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header with Gym Photo Background */}
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/woman-helping-man-gym.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <p className="text-rose-500 font-bold text-xs uppercase tracking-widest">gym owner playbook</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            The <span className="text-white">gmmx</span><span className="text-[#FF5C73]">.app</span> blog
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Expert advice, guides, and tips on managing memberships, boosting retention, and growing your gym.
          </p>
        </div>
      </section>

      {/* Blog Listing Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-8 space-y-4">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500">
                    {post.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight leading-snug hover:text-rose-500 transition-colors">
                  <Link href={`/blogs/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Read button / Author */}
              <div className="px-8 pb-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                <span className="text-slate-400 font-semibold">{post.date}</span>
                <Link
                  href={`/blogs/${post.slug}`}
                  className="font-bold text-rose-500 hover:text-rose-600 inline-flex items-center gap-1 group"
                >
                  Read article <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative text-white py-24 px-6 text-center border-t border-white/5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/woman-helping-man-gym.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Want to scale your fitness center?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Put these insights to work. Sign up for a 14-day free trial on gmmx<span className="text-[#FF5C73]">.app</span> and start automating member management today.
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
