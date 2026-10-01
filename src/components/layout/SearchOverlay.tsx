import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Command, TrendingUp, History, Star, ArrowRight, Database, Sparkles, ShoppingBag, Film, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { anilistRequest, ANIME_SEARCH_QUERY } from "../../services/anilist";
import { Anime } from "../../types/anime";
import { api } from "../../services/api";
import { getExploreItems, getMerchItems, ManagedExploreItem, ManagedMerchItem } from "../../utils/contentStore";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DatabaseResultItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating?: number;
  price?: string;
  year?: number;
  type: "explore" | "merch";
  trailerUrl?: string;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [dbResults, setDbResults] = useState<DatabaseResultItem[]>([]);
  const [animeResults, setAnimeResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setDbResults([]);
      setAnimeResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const queryLower = query.toLowerCase().trim();

        // 1. Fetch & search custom database entries (Explore + Merch)
        let exploreList: ManagedExploreItem[] = getExploreItems();
        let merchList: ManagedMerchItem[] = getMerchItems();

        try {
          const [expRes, merchRes] = await Promise.allSettled([
            api.getExplore(),
            api.getMerchandise(),
          ]);
          if (expRes.status === "fulfilled" && expRes.value?.items) {
            exploreList = expRes.value.items;
          }
          if (merchRes.status === "fulfilled" && merchRes.value?.items) {
            merchList = merchRes.value.items;
          }
        } catch {
          // Keep local fallback
        }

        const matchedExplore: DatabaseResultItem[] = exploreList
          .filter((item) =>
            item.title.toLowerCase().includes(queryLower) ||
            (item.description || "").toLowerCase().includes(queryLower) ||
            (item.category || "").toLowerCase().includes(queryLower)
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
            category: item.category || "General",
            rating: item.rating || 8.5,
            year: item.year,
            type: "explore",
            trailerUrl: item.trailerUrl,
          }));

        const matchedMerch: DatabaseResultItem[] = merchList
          .filter((item) =>
            item.title.toLowerCase().includes(queryLower) ||
            (item.description || "").toLowerCase().includes(queryLower) ||
            (item.fandom || "").toLowerCase().includes(queryLower) ||
            (item.category || "").toLowerCase().includes(queryLower) ||
            (item.tags || []).some((t) => t.toLowerCase().includes(queryLower))
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
            category: `${item.fandom} · ${item.category}`,
            price: item.price,
            type: "merch",
          }));

        const combinedDb = [...matchedExplore, ...matchedMerch];
        setDbResults(combinedDb);

        // 2. AniList External API Search
        let apiAnimeHits: Anime[] = [];
        try {
          const animeRes: any = await anilistRequest(ANIME_SEARCH_QUERY, {
            search: query,
            perPage: 6,
            isAdult: false,
          });
          apiAnimeHits = animeRes?.Page?.media || [];
        } catch (apiErr) {
          console.warn("AniList search fallback:", apiErr);
        }

        // Deduplicate against custom database titles
        const dbTitles = new Set(combinedDb.map((d) => d.title.toLowerCase()));
        const dedupedAnime = apiAnimeHits.filter(
          (a) =>
            !dbTitles.has((a.title.english || "").toLowerCase()) &&
            !dbTitles.has((a.title.romaji || "").toLowerCase())
        );

        setAnimeResults(dedupedAnime.slice(0, 6));
      } catch (err) {
        console.error("Search API Error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDatabaseItemClick = (item: DatabaseResultItem) => {
    onClose();
    if (item.type === "merch") {
      navigate("/merchandise");
    } else if ((item.category || "").toLowerCase() === "anime") {
      navigate(`/anime/${item.id}`);
    } else {
      navigate(`/content/${item.id}`);
    }
  };

  const suggestions = ["Fullmetal Alchemist", "Cyberpunk", "Elden Ring", "Arcane", "Solo Leveling", "Demon Slayer"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] px-3 sm:px-4"
        >
          <div 
            className="absolute inset-0 bg-bg-main/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl glass-panel rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl border border-glass"
          >
            {/* Search Input Bar */}
            <div className="p-6 sm:p-8 border-b border-[var(--glass-border)] flex items-center gap-4 sm:gap-6 bg-white/5">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-500 dark:text-cyan-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search Database, Anime, Merchandise..."
                className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl text-main placeholder:text-muted/50 font-black tracking-tight"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-3 shrink-0">
                {isSearching && <div className="w-5 h-5 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />}
                <kbd className="hidden sm:flex h-7 items-center gap-1 rounded-lg border border-[var(--glass-border)] bg-white/5 px-2 font-mono text-[10px] font-black text-muted">
                  <Command className="w-3 h-3" /> K
                </kbd>
                <button 
                  onClick={onClose}
                  className="p-2 glass-panel hover:bg-white/10 rounded-xl transition-all"
                  title="Close Search"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-muted hover:text-main" />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto scrollbar-hide space-y-8">
              {query.trim() === "" ? (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Trending Universe Prompts
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-5 py-2.5 rounded-2xl glass-card text-xs sm:text-sm font-bold text-main hover:border-cyan-500/50 hover:text-cyan-500 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <History className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Universe Portals
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                      {["Anime", "Gaming", "Movies", "Merchandise", "Characters", "Airing"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            onClose();
                            if (cat === "Merchandise") navigate("/merchandise");
                            else if (cat === "Characters") navigate("/characters");
                            else if (cat === "Airing") navigate("/airing");
                            else navigate(`/explore/${cat.toLowerCase()}`);
                          }}
                          className="p-5 rounded-2xl glass-card text-left group"
                        >
                          <span className="block text-sm sm:text-base font-black text-main group-hover:text-cyan-500 transition-colors mb-1">{cat}</span>
                          <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Portal Access</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* 👑 DEDICATED SEPARATE DIV FOR DATABASE / MANUAL ENTRIES */}
                  {dbResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 sm:p-6 rounded-[2rem] bg-gradient-to-br from-violet-950/70 via-slate-950/90 to-cyan-950/70 border-2 border-brand-purple/60 shadow-[0_0_35px_rgba(168,85,247,0.25)] relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-3 mb-5 border-b border-brand-purple/20 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-purple/30 border border-brand-purple/50 flex items-center justify-center text-brand-purple shadow-sm">
                            <Database className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                                Database & Manual Vault Entries
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-brand-purple text-[9px] font-black text-white uppercase tracking-widest shadow-sm">
                                {dbResults.length} {dbResults.length === 1 ? "Match" : "Matches"}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400">
                              Stored in Node.js Database & Admin Panel
                            </p>
                          </div>
                        </div>

                        <span className="text-[9px] font-black text-brand-purple bg-brand-purple/20 border border-brand-purple/40 px-2.5 py-1 rounded-full uppercase tracking-widest hidden sm:inline-block">
                          👑 Verified Custom Data
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {dbResults.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleDatabaseItemClick(item)}
                            className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 hover:bg-brand-purple/25 border border-white/10 hover:border-brand-purple transition-all group text-left shadow-lg"
                          >
                            <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 shadow-md bg-black border border-white/10 relative">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800";
                                }}
                              />
                              {item.type === "merch" && (
                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-pink-600 text-[8px] font-black text-white">
                                  MERCH
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-md bg-brand-purple/30 text-brand-purple border border-brand-purple/40 text-[9px] font-black uppercase tracking-wider">
                                  {item.category || "Custom"}
                                </span>
                                {item.type === "merch" ? (
                                  <span className="text-[11px] font-black text-pink-400 font-mono">
                                    {item.price}
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-1 text-amber-400 text-[10px] font-black">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{item.rating || 8.5}</span>
                                  </div>
                                )}
                              </div>
                              <h4 className="text-sm font-black text-white group-hover:text-brand-purple transition-colors truncate">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 🌐 EXTERNAL ANILIST / WEB API STREAM */}
                  {animeResults.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-cyan-500 dark:text-cyan-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" /> External Live AniList Stream
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {animeResults.map((anime) => (
                          <button
                            key={anime.id}
                            onClick={() => {
                              onClose();
                              navigate(`/anime/${anime.id}`);
                            }}
                            className="w-full flex items-center gap-4 p-3.5 rounded-2xl glass-card group text-left border border-white/5 hover:border-cyan-500/40 transition-all"
                          >
                            <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 shadow-xl glass-panel">
                              <img
                                src={anime.coverImage.large}
                                alt={anime.title.romaji}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black text-main truncate group-hover:text-cyan-500 transition-colors tracking-tight">
                                {anime.title.english || anime.title.romaji}
                              </h4>
                              <div className="flex items-center gap-3 mt-1.5">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                                  <span className="text-[11px] font-black text-muted">
                                    {((anime.averageScore || 0) / 10).toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-muted/30">·</span>
                                <span className="text-[9px] font-black text-muted uppercase tracking-widest">
                                  {anime.format || "ANIME"}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted group-hover:text-cyan-400 transition-colors shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state if nothing in DB and nothing from API */}
                  {dbResults.length === 0 && animeResults.length === 0 && !isSearching && (
                    <div className="py-16 text-center">
                      <p className="text-muted text-base font-medium italic mb-2">
                        No matches found in Database or live multiverse
                      </p>
                      <p className="text-muted/50 text-xs mb-6">"{query}" was not found.</p>
                      <button 
                        onClick={() => setQuery("")}
                        className="px-6 py-2.5 rounded-xl glass-panel text-cyan-500 font-black uppercase tracking-widest text-xs hover:bg-cyan-500/10 border border-cyan-500/30 transition-all"
                      >
                        Reset Search
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Keyboard Legend */}
            <div className="p-4 sm:p-5 bg-black/10 border-t border-[var(--glass-border)] text-[9px] font-black text-muted/50 flex items-center justify-between uppercase tracking-[0.2em]">
              <div className="flex gap-6">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-[var(--glass-border)] text-muted">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-[var(--glass-border)] text-muted">Enter</kbd> select</span>
              </div>
              <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded border border-[var(--glass-border)] text-muted">ESC</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

