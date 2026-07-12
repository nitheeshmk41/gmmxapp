"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const CATEGORIES = [
  "All",
  "Marketing",
  "Retention",
  "Payments",
  "Website",
  "AI",
  "Operations",
  "Pricing",
  "Growth",
  "Success Stories"
];

export function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("search") || "";
  
  const [searchValue, setSearchValue] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    // Only push if it changed to avoid infinite loops
    if (debouncedSearch !== currentSearch) {
      updateUrl(currentCategory, debouncedSearch);
    }
  }, [debouncedSearch]);

  const updateUrl = (cat: string, search: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== "All") params.set("category", cat);
    if (search) params.set("search", search);
    
    router.push(`/blogs?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    updateUrl(cat, searchValue);
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search articles (e.g. attendance, pricing, marketing...)"
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-sm transition-all"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map(cat => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#111827] text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
