import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Flame, 
  BookOpen, 
  ExternalLink, 
  X,
  Share2,
  Bookmark,
  Filter
} from "lucide-react";
import { PageLoader } from "../components/common/PageLoader";
import { motion, AnimatePresence } from "motion/react";
import { fetchLatestAnimeNews, GlobalEditorialArticle } from "../services/animeNews";
import { cn } from "../utils";
import { useAppContext } from "../context/AppContext";

export default function Articles() {
  const [articles, setArticles] = useState<GlobalEditorialArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<GlobalEditorialArticle | null>(null);
  const { watchlist, toggleWatchlist } = useAppContext();

  const categories = ["all", "Anime", "Gaming", "K-Pop", "Movies", "Comics"];

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const news = await fetchLatestAnimeNews();
        setArticles(news);
      } catch (err) {
        console.error("News load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesCat = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = filteredArticles[0] || articles[0];
  const otherArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  if (loading) {
    return <PageLoader fullScreen message="Loading Live Global Editorial News..." />;
  }

  return (
    <div className="pt-2 sm:pt-4 min-h-screen bg-bg-main pb-24">
      {/* Article Detail Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-4 sm:my-8 max-h-[88vh] flex flex-col"
            >
              {/* Modal Header Image */}
              <div className="relative h-40 sm:h-64 w-full overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-white text-[9px] font-black uppercase tracking-wider shadow-md">
                    {activeArticle.category} • {activeArticle.tag}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 backdrop-blur-md bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                    <Clock className="w-3 h-3 text-cyan-400" /> {activeArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-slate-900 dark:text-slate-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{activeArticle.author}</span>
                    <span>•</span>
                    <span>{activeArticle.date}</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
                    {activeArticle.title}
                  </h2>
                </div>

                <div className="h-px bg-slate-200 dark:bg-cyan-500/20 w-full" />

                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                    {activeArticle.description}
                  </p>
                  <p>
                    Fan Hub Global Editorial coverage provides real-time verification and live tracking across international entertainment databases. 
                    This development highlights ongoing creative expansion in the {activeArticle.category} sector, with fans across the world engaging in live community discussions and theory analysis.
                  </p>
                  <p>
                    Stay tuned to the Fan Hub Editorial stream as we provide continuous updates, premiere breakdown guides, and exclusive behind-the-scenes perspectives.
                  </p>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-200 dark:border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => toggleWatchlist(activeArticle.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                      watchlist.includes(activeArticle.id)
                        ? "bg-cyan-500 border-cyan-400 text-white"
                        : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                    )}
                  >
                    <Bookmark className="w-3 h-3" />
                    {watchlist.includes(activeArticle.id) ? "Saved" : "Save"}
                  </button>

                  <a
                    href={activeArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Official Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-6">
        <div className="flex flex-col gap-4 sm:gap-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-6">
            <div className="max-w-3xl space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[9.5px] sm:text-xs font-black uppercase tracking-widest backdrop-blur-md">
                <Sparkles className="w-3 h-3" /> Live Multiverse Editorial Stream
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Fan Hub <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600">Editorial</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] sm:text-sm md:text-base leading-relaxed">
                Live global industry news, anime premiere breakdowns, game releases, and K-Pop coverage.
              </p>
            </div>
          </div>

          {/* Controls: Search & Category Filter Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search global news, anime, gaming, idols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/25 rounded-xl py-2 sm:py-2.5 pl-9 sm:pl-10 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm text-xs sm:text-sm font-medium backdrop-blur-xl"
              />
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-inner overflow-x-auto scrollbar-hide max-w-full">
              {categories.map(cat => {
                const active = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                    className={cn(
                      "relative px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-300 whitespace-nowrap cursor-pointer",
                      "hover:-translate-y-0.5 active:scale-95",
                      active
                        ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/30 dark:border-cyan-400/40 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                        : "text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200/70 dark:hover:bg-white/15 border border-transparent"
                    )}
                  >
                    {cat === "all" ? "All News" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Headline Hero Banner */}
          {featuredArticle && (
            <div
              onClick={() => setActiveArticle(featuredArticle)}
              className="group block relative h-48 sm:h-64 md:h-80 overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-200 dark:border-cyan-500/25 hover:border-cyan-500/60 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title} 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800";
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
              
              <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 space-y-1 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[8.5px] sm:text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-white font-black shadow-md">
                    Featured
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200">
                    {featuredArticle.category} • {featuredArticle.tag}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-2.5 h-2.5 text-cyan-400" /> {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-sm sm:text-xl md:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-snug max-w-4xl drop-shadow-md line-clamp-2">
                  {featuredArticle.title}
                </h2>

                <p className="hidden sm:block text-slate-300 text-xs sm:text-sm line-clamp-2 max-w-3xl font-normal leading-relaxed">
                  {featuredArticle.description}
                </p>

                <div className="pt-1 flex items-center justify-between text-slate-400 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-slate-200 font-bold">{featuredArticle.author}</span>
                    <span>•</span>
                    <span>{featuredArticle.date}</span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-white font-black text-[9.5px] sm:text-xs uppercase tracking-wider transition-all border border-cyan-500/40">
                    <BookOpen className="w-3 h-3" />
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Global News Stories */}
          <div className="space-y-3 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] sm:text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyan-500" />
                {selectedCategory === "all" ? "Live Multiverse News" : `${selectedCategory} Coverage`}
              </h2>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                {otherArticles.length} Stories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6">
              {otherArticles.map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => setActiveArticle(article)}
                  className="group flex flex-row sm:flex-col items-center sm:items-stretch gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all shadow-sm cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 sm:w-full sm:h-auto sm:aspect-[16/10] overflow-hidden rounded-lg sm:rounded-xl bg-slate-900 shrink-0 relative shadow-inner">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800";
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden sm:block" />
                    
                    <div className="absolute top-2 left-2 hidden sm:flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[8px] font-black uppercase tracking-wider shadow-md">
                        {article.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-bold text-slate-200 uppercase tracking-wider">
                        {article.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-1.5 right-1.5 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-bold text-slate-300">
                      <Clock className="w-2 h-2 text-cyan-400" />
                      {article.readTime}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 min-w-0 py-0.5 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold sm:hidden">{article.category} •</span>
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold hidden sm:inline">{article.author}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{article.date}</span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug tracking-tight">
                        {article.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 text-[10.5px] sm:text-xs line-clamp-1 sm:line-clamp-2 leading-relaxed font-normal">
                        {article.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[9.5px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read Story <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(article.id);
                        }}
                        className={cn(
                          "p-1 rounded-md border transition-all active:scale-90",
                          watchlist.includes(article.id)
                            ? "bg-cyan-500 border-cyan-400 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-cyan-400"
                        )}
                        title={watchlist.includes(article.id) ? "Saved" : "Save"}
                      >
                        <Bookmark className={cn("w-2.5 h-2.5", watchlist.includes(article.id) && "fill-current")} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
