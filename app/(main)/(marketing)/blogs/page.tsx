import Link from "next/link";
import { ArrowRight, Clock, Calendar, Flame, Mail, ArrowUpRight, BookOpen } from "lucide-react";
import { BlogFilters } from "@/components/marketing/BlogFilters";
import { getPublishedBlogs } from "@/features/marketing/blog-queries";
import { formatRelativeDate } from "@/lib/utils";

// helper to calculate read time
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const blogs = await getPublishedBlogs(search, category);
  
  const featuredBlog = (!search && (!category || category === "All") && blogs.length > 0) ? blogs[0] : null;
  const gridBlogs = featuredBlog ? blogs.slice(1) : blogs;
  const popularBlogs = [...blogs].sort((a, b) => b.title.length - a.title.length).slice(0, 4); // Fake popularity by title length for now

  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative text-white min-h-[480px] flex flex-col justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/woman-helping-man-gym.jpg"
            alt="Gym background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <p className="text-rose-500 font-bold text-xs uppercase tracking-widest">Resources for Gym Owners</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Grow Your Gym With <span className="text-[#FF5C73]">Proven Strategies</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Learn how to increase memberships, reduce churn, automate operations, and scale your fitness business effortlessly.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        
        {/* Search & Categories */}
        <BlogFilters />

        {blogs.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No articles found</h3>
            <p className="mt-2">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column (Featured + Grid) */}
            <div className="flex-1 space-y-12">
              
              {/* Featured Article */}
              {featuredBlog && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-wider text-sm">
                    <Flame size={18} className="animate-pulse" /> Featured Article
                  </div>
                  <Link href={`/blogs/${featuredBlog.slug}`} className="group block">
                    <article className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-300 md:flex">
                      <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                        <img 
                          src={featuredBlog.coverImageUrl || getFallbackImage(featuredBlog.category)} 
                          alt={featuredBlog.title}
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-xs mb-4">
                          <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                            {featuredBlog.category || "General"}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {calculateReadTime(featuredBlog.content)}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-rose-500 transition-colors mb-4">
                          {featuredBlog.title}
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed line-clamp-3 mb-6">
                          {featuredBlog.excerpt || "Read our latest insights on how to grow your gym business effectively."}
                        </p>
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                              G
                            </div>
                            <span className="text-slate-700">GMMX Team</span>
                          </div>
                          <span className="text-rose-500 flex items-center gap-1">
                            Read article <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {gridBlogs.map((post: any) => (
                  <Link key={post.$id} href={`/blogs/${post.slug}`} className="group h-full">
                    <article className="bg-white h-full rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all flex flex-col">
                      <div className="h-48 overflow-hidden relative border-b border-slate-100">
                        <img 
                          src={post.coverImageUrl || getFallbackImage(post.category)} 
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                           <span className="px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm">
                            {post.category || "General"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h2 className="text-lg font-extrabold text-slate-950 tracking-tight leading-snug group-hover:text-rose-500 transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                          {post.excerpt || "Discover how to optimize your gym management workflow..."}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100 mt-auto">
                           <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <span>GMMX Team</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> {formatRelativeDate(post.publishedAt || post.createdAt)}
                            </span>
                          </div>
                          <span className="text-slate-400 font-medium flex items-center gap-1">
                            {calculateReadTime(post.content)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full lg:w-80 space-y-10 shrink-0">
              
              {/* Popular Articles */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
                <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                  <ArrowUpRight className="text-rose-500" size={20} /> Most Read
                </h3>
                <div className="space-y-6">
                  {popularBlogs.map((post: any, i: number) => (
                    <Link key={post.$id} href={`/blogs/${post.slug}`} className="flex gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-rose-500 leading-snug line-clamp-2 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{formatRelativeDate(post.publishedAt || post.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Free Tools Ad */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="relative z-10">
                  <span className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/20 mb-4 inline-block">
                    Free Tool
                  </span>
                  <h3 className="font-black text-xl mb-2">Gym Profit Calculator</h3>
                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    Calculate your break-even point and project future revenues instantly.
                  </p>
                  <Link href="/tools/gym-profit-calculator" className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors">
                    Use Free Calculator <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="font-black text-slate-900 mb-2">Weekly Growth Tips</h3>
                <p className="text-sm text-slate-500 mb-6">Join 500+ gym owners getting actionable advice every Tuesday.</p>
                
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                  <button type="submit" className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative text-white py-24 px-6 text-center border-t border-white/5 overflow-hidden">
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
