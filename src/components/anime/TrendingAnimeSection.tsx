import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import { useTrendingAnime } from "../../hooks/useAnime";
import { AnimeCard, AnimeCardSkeleton } from "./AnimeCard";
import { motion } from "motion/react";

import { FALLBACK_TRENDING_ANIME } from "../../services/anilist";

export const TrendingAnimeSection = () => {
  const { data, loading } = useTrendingAnime(1, 10);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayData = data && data.length > 0 ? data : FALLBACK_TRENDING_ANIME;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

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
            <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-brand-purple uppercase tracking-[0.2em]">Live from AniList</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter">Trending Anime</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-2xl glass-panel text-muted hover:text-brand-purple hover:bg-main/10 transition-all flex items-center justify-center group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-2xl glass-panel text-muted hover:text-brand-purple hover:bg-main/10 transition-all flex items-center justify-center group"
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
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[160px] sm:w-[190px] md:w-[210px] flex-shrink-0">
              <AnimeCardSkeleton />
            </div>
          ))
        ) : (
          displayData.map((anime, i) => (
            <motion.div 
              key={anime.id} 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-[160px] sm:w-[190px] md:w-[210px] flex-shrink-0 snap-start"
            >
              <AnimeCard anime={anime} rank={i + 1} />
            </motion.div>
          ))
        )}
        
        {!loading && (
          <div className="w-[160px] sm:w-[190px] md:w-[210px] flex-shrink-0 flex items-center justify-center p-6">
            <Link to="/explore/anime" className="group flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-[2rem] glass-panel flex items-center justify-center group-hover:bg-brand-purple group-hover:border-brand-purple/50 transition-all duration-500 shadow-2xl">
                <ArrowRight className="w-10 h-10 text-muted group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted group-hover:text-main transition-colors">
                Explore Universe
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
