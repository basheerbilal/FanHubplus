import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Bookmark, Play } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useExternalMedia } from "../../hooks/useExternalMedia";

export const Trending = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: trendingItems, loading } = useExternalMedia("all");
  
  const displayItems = trendingItems.filter(item => item.rating > 7).slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-bg-main overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (displayItems.length === 0) return null;

  return (
    <section className="py-24 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 mb-12 flex items-end justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Global Pulse</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter">
            Trending Now
          </h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-2xl glass-panel text-muted hover:text-main hover:bg-main/5 transition-all flex items-center justify-center group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-2xl glass-panel text-muted hover:text-main hover:bg-main/5 transition-all flex items-center justify-center group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
 
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 lg:px-[calc((100vw-1440px)/2+24px)] scrollbar-hide pb-12 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((item, i) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="w-[320px] md:w-[400px] flex-shrink-0 snap-start group"
          >
            <Link to={`/content/${item.id}`}>
              <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-6 border border-glass group-hover:border-cyan-500/40 transition-all duration-500 shadow-2xl glass-card">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                    <Play className="w-8 h-8 fill-current ml-1 text-cyan-600" />
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2 text-white/80">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-white/30 text-xs">·</span>
                      <span className="text-white/80 text-xs font-medium">{item.year}</span>
                    </div>
                  <h3 className="text-2xl font-black text-white tracking-tight truncate group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
