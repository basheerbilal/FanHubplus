import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Search, Filter, Grid, List as ListIcon, X, ExternalLink, Star, Play, Sparkles, User as UserIcon } from "lucide-react";
import { useExternalMedia } from "../hooks/useExternalMedia";
import { AnimeExploreGrid } from "../components/anime/AnimeExploreGrid";
import { CosplaySpotlight } from "../components/cosplay/CosplaySpotlight";
import { TrailerModal } from "../components/anime/TrailerModal";
import { cn } from "../utils";
import { motion, AnimatePresence } from "motion/react";

export default function Explore() {
  const { category: urlCategory } = useParams();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<{ url: string; title: string } | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory ? decodeURIComponent(urlCategory).toLowerCase() : "all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("trending");

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(decodeURIComponent(urlCategory).toLowerCase());
    }
  }, [urlCategory]);

  const { data: externalMedia, loading } = useExternalMedia(selectedCategory);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categories = ["all", "Community", "Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];

  const normCat = selectedCategory.toLowerCase().replace(/[\s\-_%20]/g, "").replace(/s$/, "");
  const isCommunity = normCat === "community" || normCat === "fancreation" || normCat === "fanupload" || normCat === "fan" || normCat === "submission";
  const isAnime = (normCat === "anime" || normCat === "manga") && !isCommunity;
  const isCosplay = normCat === "cosplay";
  const isAll = normCat === "all";

  const filteredContent = useMemo(() => {
    if (isAnime) return []; 
    
    let baseData = [...externalMedia];

    if (debouncedSearch) {
      baseData = baseData.filter((item) => 
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    return baseData.sort((a, b) => {
      if (sortBy === "latest") return b.year - a.year;
      if (sortBy === "popular") return b.rating - a.rating;
      if (sortBy === "alpha") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [externalMedia, debouncedSearch, isAnime, sortBy]);

  return (
    <div className="pt-4 pb-16 min-h-screen bg-bg-main">
      {activeTrailer && (
        <TrailerModal
          isOpen={true}
          onClose={() => setActiveTrailer(null)}
          trailerUrl={activeTrailer.url}
          title={activeTrailer.title}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter flex items-center gap-3">
              Explore the Fandom Universe
              {isCommunity && (
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-black uppercase tracking-widest shadow-md">
                  ✨ Community Vault
                </span>
              )}
            </h1>
            <p className="text-slate-600 dark:text-muted font-medium">
              {isCommunity 
                ? "Discover stories, character guides, and lore uploads submitted by fans and approved by administrators."
                : isAnime 
                ? "Exploring live trending anime from the multiverse constellation."
                : `Discover thousands of unique titles across all your favorite fandoms.`}
            </p>
          </div>

          {/* Quick Category Chips matching Navbar Pills */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-inner overflow-x-auto scrollbar-hide max-w-full">
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase() ||
                (cat === "TV Shows" && selectedCategory.toLowerCase().includes("tv")) ||
                (cat === "Community" && isCommunity);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat.toLowerCase())}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-xs tracking-tight transition-all duration-300 whitespace-nowrap cursor-pointer",
                    "hover:-translate-y-0.5 active:scale-95",
                    active
                      ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/30 dark:border-cyan-400/40 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                      : "text-slate-700 dark:text-zinc-300 font-bold hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200/70 dark:hover:bg-white/15 hover:border hover:border-cyan-500/30 dark:hover:border-cyan-400/40 hover:shadow-sm border border-transparent"
                  )}
                >
                  {cat === "all" ? "All Fandoms" : cat === "Community" ? "Fan Creations" : cat}
                </button>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-muted group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search anime, movies, games, fan lore..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-main placeholder:text-slate-400 dark:placeholder:text-muted/60 focus:outline-none focus:border-cyan-500/50 dark:focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-md shadow-slate-900/5 dark:shadow-none"
              />
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/submit">
                <button
                  className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-pink-500/30 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Upload Fan Content"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  Fan Upload
                </button>
              </Link>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 rounded-2xl border font-bold transition-all shadow-md shadow-slate-900/5 dark:shadow-none",
                  "hover:-translate-y-0.5 active:scale-95",
                  isFilterOpen 
                    ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border-cyan-500/30 dark:border-cyan-400/40 shadow-sm" 
                    : "bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-muted hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-50/50 dark:hover:bg-white/10 hover:border-cyan-500/30"
                )}
              >
                <Filter className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white dark:bg-main/5 rounded-2xl border border-slate-200 dark:border-glass p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-md"
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest mb-4">Category</label>
                  <select
                    value={selectedCategory.toLowerCase()}
                    onChange={(e) => setSelectedCategory(e.target.value.toLowerCase())}
                    className="w-full bg-slate-50 dark:bg-bg-main border border-slate-200 dark:border-glass rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 text-slate-900 dark:text-main"
                  >
                    {categories.map(c => <option key={c} value={c.toLowerCase()}>{c === "Community" ? "Fan Creations & Uploads" : c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest mb-4">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-bg-main border border-slate-200 dark:border-glass rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 text-slate-900 dark:text-main"
                  >
                    <option value="trending">Trending</option>
                    <option value="latest">Latest Release</option>
                    <option value="popular">Rating</option>
                    <option value="alpha">Alphabetical</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          {isAll && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-slate-900 dark:text-main mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full shadow-sm shadow-cyan-500/40" />
                Trending Anime
              </h2>
              <AnimeExploreGrid 
                searchQuery={debouncedSearch}
                genre={selectedGenre}
                sort="trending"
              />
              <div className="h-px w-full bg-slate-200 dark:bg-glass my-16" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-main mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full shadow-sm shadow-cyan-500/40" />
                Global Media & Community Creations
              </h2>
            </div>
          )}

          {isAnime ? (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-slate-900 dark:text-main mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full shadow-sm shadow-cyan-500/40" />
                Trending Anime
              </h2>
              <AnimeExploreGrid 
                searchQuery={debouncedSearch}
                genre={selectedGenre}
                sort={sortBy}
              />
            </div>
          ) : isCosplay ? (
            <div className="mb-12">
              <CosplaySpotlight />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
              {filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative flex flex-col bg-white dark:bg-main/5 border border-slate-200 dark:border-glass rounded-xl sm:rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 shadow-md"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-slate-950">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    {/* Category & Community Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                      {item.isCommunity ? (
                        <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-black text-[7.5px] uppercase tracking-wider shadow-md shadow-pink-500/20 backdrop-blur-md flex items-center gap-1">
                          <Sparkles className="w-2 h-2 text-amber-300 fill-amber-300" />
                          Fan Creation
                        </span>
                      ) : null}
                      <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-[7.5px] uppercase tracking-wider shadow-md shadow-cyan-500/20 backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>

                    {item.rating > 0 && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-[8.5px] font-black">
                        <Star className="w-2 h-2 fill-current" />
                        {item.rating.toFixed(1)}
                      </div>
                    )}
                    {item.trailerUrl && (
                      <button
                        type="button"
                        onClick={() => setActiveTrailer({ url: item.trailerUrl || "", title: item.title })}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                        title="Play Video"
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-500/90 text-white flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all">
                          <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-3 flex flex-col flex-1">
                    {item.authorEmail && (
                      <span className="text-[8.5px] text-cyan-600 dark:text-cyan-400 font-bold mb-0.5 flex items-center gap-1">
                        <UserIcon className="w-2 h-2" /> By {item.authorEmail.split("@")[0]}
                      </span>
                    )}
                    <Link to={`/content/${item.id}`} className="block">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-main mb-1 line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-slate-600 dark:text-muted text-[9.5px] line-clamp-2 mb-2 leading-relaxed flex-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-glass">
                      <span className="text-[8.5px] font-bold text-slate-500 dark:text-muted">{item.year}</span>
                      <div className="flex items-center gap-1">
                        {item.trailerUrl && (
                          <button 
                            type="button"
                            onClick={() => setActiveTrailer({ url: item.trailerUrl || "", title: item.title })}
                            className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all shadow-sm cursor-pointer"
                            title="Play Video"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </button>
                        )}
                        {item.url && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all shadow-sm"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && Array.from({ length: 12 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="aspect-[3/4] rounded-xl sm:rounded-2xl bg-main/5 animate-pulse border border-glass" />
              ))}
            </div>
          )}

          {!loading && filteredContent.length === 0 && !isAnime && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-main/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted/30" />
              </div>
              <h3 className="text-2xl font-bold text-main mb-2">No results found</h3>
              <p className="text-muted">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
