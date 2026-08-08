"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, User, Dumbbell, CreditCard, UserPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchResult {
  id: string;
  type: "member" | "trainer" | "lead" | "payment";
  title: string;
  subtitle: string;
  url: string;
}

interface GlobalSearchProps {
  organizationSlug?: string;
}

export function GlobalSearch({ organizationSlug }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<{ members: SearchResult[], trainers: SearchResult[], leads: SearchResult[] }>({ members: [], trainers: [], leads: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults({ members: [], trainers: [], leads: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setResults({ members: [], trainers: [], leads: [] });
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
          headers: {
            "x-organization-slug": organizationSlug || ""
          }
        });
        if (res.ok) {
          const data = await res.json();
          setResults({
            members: data.members || [],
            trainers: data.trainers || [],
            leads: data.leads || []
          });
        }
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "member": return <User size={16} className="text-blue-500" />;
      case "trainer": return <Dumbbell size={16} className="text-orange-500" />;
      case "lead": return <UserPlus size={16} className="text-emerald-500" />;
      case "payment": return <CreditCard size={16} className="text-purple-500" />;
      default: return <Search size={16} className="text-slate-500" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          color: "var(--color-muted-foreground)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
        }}
      >
        <Search size={13} />
        <span>Search…</span>
        <kbd
          className="ml-2 px-1.5 py-0.5 rounded text-xs"
          style={{ background: "var(--color-border)", color: "var(--color-muted-foreground)", fontFamily: "monospace" }}
        >
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200">
            <div className="flex items-center px-4 py-3 border-b border-slate-100">
              <Search size={20} className="text-slate-400 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members, trainers, leads..."
                className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {loading && <Loader2 size={16} className="text-slate-400 animate-spin mr-3" />}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!query.trim() && (
                <div className="py-12 text-center text-sm text-slate-500">
                  Type to start searching...
                </div>
              )}
              
              {query.trim() && !loading && results.members.length === 0 && results.trainers.length === 0 && results.leads.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500">
                  No results found for "{query}"
                </div>
              )}

              {query.trim() && (results.members.length > 0 || results.trainers.length > 0 || results.leads.length > 0) && (
                <div className="space-y-4 p-2">
                  {results.members.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Members</h4>
                      <div className="space-y-1">
                        {results.members.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <User size={14} className="text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{result.title}</p>
                              <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.trainers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Team</h4>
                      <div className="space-y-1">
                        {results.trainers.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                              <Dumbbell size={14} className="text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{result.title}</p>
                              <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.leads.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Leads</h4>
                      <div className="space-y-1">
                        {results.leads.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                              <UserPlus size={14} className="text-emerald-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{result.title}</p>
                              <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
