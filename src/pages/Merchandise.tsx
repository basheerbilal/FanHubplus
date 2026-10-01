import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  Filter, 
  ShoppingBag, 
  ExternalLink, 
  Heart, 
  Tag, 
  Info, 
  Eye, 
  Bookmark, 
  X, 
  Sparkles, 
  Calendar, 
  ShieldAlert,
  Layers,
  Clock,
  CheckCircle2,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/common/Button";
import { useAppContext } from "../context/AppContext";
import { storage } from "../utils/localStorage";
import { cn } from "../utils";
import { getMerchItems, ManagedMerchItem } from "../utils/contentStore";

type MerchandiseItem = ManagedMerchItem;

export default function Merchandise() {
  const { watchlist, toggleWatchlist } = useAppContext();
  const [selectedFandom, setSelectedFandom] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);

  // Load from shared store (admin-managed)
  const [allItems, setAllItems] = useState<MerchandiseItem[]>(getMerchItems());
  
  React.useEffect(() => {
    // Dynamically sync and update
    import("../utils/contentStore").then((m) => {
      m.syncMerchandiseFromBackend().then((items) => {
        setAllItems(items);
      });
    });
  }, []);

  const mockMerch = allItems.filter(i => !i.isUpcoming);
  const upcomingReleases = allItems.filter(i => i.isUpcoming);

  // View count tracking stored in LocalStorage
  const [views, setViews] = useState<Record<string, number>>(() => {
    return storage.get<Record<string, number>>("MERCH_VIEWS") || {
      m1: 1420,
      m2: 890,
      m3: 654,
      m4: 412,
      m5: 720,
      m6: 935,
      "up-1": 1820,
      "up-2": 1540,
    };
  });

  const fandoms = ["all", "Anime", "Gaming", "Comics", "K-Pop", "Movies"];

  const handleOpenDetails = (item: MerchandiseItem) => {
    // Increment view count
    const updatedCount = (views[item.id] || 0) + 1;
    const newViews = { ...views, [item.id]: updatedCount };
    setViews(newViews);
    storage.set("MERCH_VIEWS", newViews);
    setSelectedItem(item);
  };

  const filteredMerch = mockMerch.filter((item) => {
    return (
      selectedFandom === "all" ||
      item.fandom.toLowerCase().includes(selectedFandom.toLowerCase()) ||
      item.category.toLowerCase().includes(selectedFandom.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-bg-main pt-4 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="max-w-3xl space-y-4">
          {/* Glowing Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-cyan-500/25 shadow-md shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(6,182,212,0.25)] backdrop-blur-2xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
              Editorial Discovery Showcase
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            Collector's <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Vault</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
            Explore curated collectible figures, premium apparel, and statues from your favorite fandom universes. 
            <span className="text-cyan-600 dark:text-cyan-400 font-bold"> Showcase only</span> — actual purchases or financial transactions are not supported.
          </p>
        </div>

        {/* Upcoming Releases & Drops Pipeline */}
        {upcomingReleases.length > 0 && (
          <section className="rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)] p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Ambient top right glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(6,182,212,0.25)]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Upcoming Releases & Pre-Orders
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Anticipated premium drops scheduled for worldwide fandom release.
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-[10.5px] font-black uppercase tracking-widest border border-cyan-500/25 shadow-sm">
                Official Drop Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {upcomingReleases.map((item) => {
                const isSaved = watchlist.includes(item.id);
                const count = views[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-400/50 hover:bg-cyan-500/[0.02] dark:hover:bg-cyan-500/10 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col sm:flex-row gap-5 group relative"
                  >
                    <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden relative flex-shrink-0 border border-slate-200 dark:border-white/10">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-cyan-300 font-black text-[9px] uppercase tracking-wider border border-cyan-500/30">
                        {item.releaseDate}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[9.5px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest truncate">
                            {item.category} • {item.fandom}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-muted flex items-center gap-1 font-bold shrink-0">
                            <Eye className="w-3 h-3 text-cyan-500" /> {count}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between mt-auto">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{item.price}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWatchlist(item.id);
                            }}
                            className={cn(
                              "p-2 rounded-xl border transition-all z-20 active:scale-95",
                              isSaved 
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30" 
                                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/40"
                            )}
                            title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
                          >
                            <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
                          </button>
                          
                          <button
                            onClick={() => handleOpenDetails(item)}
                            className="h-8 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 hover:shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            <Info className="w-3 h-3" /> Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Fandom Category Filter Bar */}
        <div className="rounded-[2rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)] p-3 sm:p-4">
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar flex-wrap">
            {fandoms.map((f) => {
              const isActive = selectedFandom === f;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFandom(f)}
                  className={cn(
                    "relative px-5 py-2.5 rounded-full text-xs font-bold tracking-tight transition-all duration-300 shrink-0 select-none",
                    "hover:-translate-y-0.5 active:scale-95",
                    isActive
                      ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/40 dark:border-cyan-400/50 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                      : "text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent"
                  )}
                >
                  <span className="relative z-10">{f === "all" ? "All Fandoms" : f}</span>
                  {isActive && (
                    <motion.div
                      layoutId="merch-fandom-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 border border-cyan-500/40 dark:border-cyan-400/50 backdrop-blur-md pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Vault Items ({filteredMerch.length})
            </h2>
          </div>
          {selectedFandom !== "all" && (
            <button
              onClick={() => setSelectedFandom("all")}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reset Filter
            </button>
          )}
        </div>

        {/* Catalog Grid */}
        {filteredMerch.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMerch.map((item, i) => {
                const isSaved = watchlist.includes(item.id);
                const count = views[item.id] || 0;
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.02 }}
                    className="rounded-[2.2rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-400/50 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between"
                  >
                    {/* Ambient hover top glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />

                    {/* Image Area */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-black/40 border-b border-slate-200 dark:border-white/10">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Tags */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[75%]">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[8.5px] font-black uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bookmark Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWatchlist(item.id);
                        }}
                        className={cn(
                          "absolute top-3 right-3 w-8.5 h-8.5 rounded-full backdrop-blur-md border flex items-center justify-center transition-all z-20 active:scale-95",
                          isSaved
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30"
                            : "bg-slate-950/70 border-white/20 text-white hover:bg-cyan-500 hover:border-cyan-400"
                        )}
                        title={isSaved ? "Saved to watchlist" : "Save to watchlist"}
                      >
                        <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                      </button>
                    </div>

                    {/* Info Area */}
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Tag className="w-3 h-3 text-cyan-500 shrink-0" />
                            <span className="text-[9.5px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest truncate">
                              {item.category} • {item.fandom}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-muted flex items-center gap-1 font-bold shrink-0 ml-1">
                            <Eye className="w-3 h-3 text-cyan-500" /> {count}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1 tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between mt-auto">
                        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{item.price}</span>
                        <button
                          onClick={() => handleOpenDetails(item)}
                          className="h-8 px-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-cyan-500/30 dark:border-cyan-400/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition-all flex items-center gap-1"
                        >
                          <Info className="w-3 h-3" /> Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl p-8 max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-sm">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">No Merchandise Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                No vault collectibles found in this fandom category.
              </p>
            </div>
            <button
              onClick={() => setSelectedFandom("all")}
              className="h-9 px-6 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-500/30 dark:border-cyan-400/40 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 transition-all"
            >
              Show All Fandoms
            </button>
          </div>
        )}

        {/* Non-Functional Disclaimer Notice */}
        <div className="rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)] p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(6,182,212,0.25)]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                SRS Section 1.5
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Merchandise Showcase & Scope Clarification
              </h4>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              "Merchandise showcases are for display, bookmarking, and discovery purposes only. This application does not possess any functionality for actual merchandise transactions, order fulfillment, shopping carts, or payment gateway integrations."
            </p>
          </div>
        </div>

      </div>

      {/* Quick Details Modal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/30 rounded-[2.5rem] p-6 sm:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] overflow-y-auto backdrop-blur-2xl z-10 my-auto"
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900/50">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(selectedItem.tags || []).map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-[9px] font-black uppercase tracking-wider border border-cyan-500/25"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                        {selectedItem.category} • {selectedItem.fandom}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 mb-2 tracking-tight">
                        {selectedItem.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-muted font-bold uppercase tracking-wider">Estimated Value</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">{selectedItem.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-muted font-bold uppercase tracking-wider">Popularity</span>
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {(views && views[selectedItem.id]) || 0} fans explored
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => toggleWatchlist(selectedItem.id)}
                        className="w-full h-12 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Bookmark className="w-4 h-4" />
                        {watchlist.includes(selectedItem.id) ? "Saved in Watchlist" : "Save to Watchlist"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
