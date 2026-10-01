import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Eye, Bookmark as BookmarkIcon, Trophy, ExternalLink } from "lucide-react";
import { useExternalMedia } from "../../hooks/useExternalMedia";
import { cn } from "../../utils";

type Tab = "movies" | "gaming" | "tv shows";

export const FanFavorites = () => {
  const [activeTab, setActiveTab] = useState<Tab>("movies");
  const { data: items, loading } = useExternalMedia(activeTab);
  const displayItems = items.slice(0, 4);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "movies", label: "Top Movies", icon: Eye },
    { id: "gaming", label: "Pro Gaming", icon: BookmarkIcon },
    { id: "tv shows", label: "Must Watch", icon: Trophy },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Live Hubs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter">Global Favorites</h2>
          </div>
          
          <div className="flex p-2 glass-panel rounded-2xl relative overflow-x-auto no-scrollbar shadow-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 z-10 flex items-center gap-3 whitespace-nowrap",
                  activeTab === tab.id ? "text-cyan-300 font-extrabold" : "text-muted hover:text-main"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-cyan-400" : "text-muted/50")} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 bg-cyan-500/20 border border-cyan-500/40 rounded-xl -z-10 shadow-lg shadow-cyan-500/20 backdrop-blur-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col glass-card rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-300 shadow-2xl"
              >
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-black text-main mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-[11px] font-black">{item.rating.toFixed(1)}</span>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl glass-panel text-muted hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="aspect-[2/3] rounded-[2rem] glass-card animate-pulse shadow-2xl" />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
