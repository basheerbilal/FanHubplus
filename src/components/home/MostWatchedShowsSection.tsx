import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Star, Flame, Eye, Film } from "lucide-react";
import { TrailerModal } from "../anime/TrailerModal";
import { cn } from "../../utils";
import { motion } from "motion/react";

import { getTopShows, syncTopShowsFromBackend, ManagedTopShowItem } from "../../utils/contentStore";

export const MostWatchedShowsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shows, setShows] = useState<ManagedTopShowItem[]>(() => getTopShows());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    syncTopShowsFromBackend().then((items) => {
      if (items && items.length > 0) {
        setShows(items);
      }
    });
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [shows]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -480 : 480;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-8 bg-bg-main transition-colors duration-300 relative overflow-hidden">
      {activeTrailer && (
        <TrailerModal
          isOpen={true}
          onClose={() => setActiveTrailer(null)}
          trailerUrl={activeTrailer.url}
          title={activeTrailer.title}
        />
      )}

      <div className="container mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Most-Watched Shows
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300">
                  Top 10 Ranked
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-muted font-medium hidden sm:block">
                The most trending multiverse & anime series streamed across the fandom network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/explore"
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 uppercase tracking-wider hidden md:inline-block mr-2"
            >
              Explore all shows &gt;
            </Link>

            {/* Prev / Next Arrows */}
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 shadow-sm cursor-pointer",
                canScrollLeft
                  ? "bg-white dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:border-cyan-500 hover:text-cyan-500"
                  : "bg-slate-100 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 text-slate-400 dark:text-muted/40 cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all active:scale-95 shadow-sm cursor-pointer",
                canScrollRight
                  ? "bg-white dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:border-cyan-500 hover:text-cyan-500"
                  : "bg-slate-100 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 text-slate-400 dark:text-muted/40 cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Ranked Carousel */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-8 pt-2 pl-4 pr-8 -mx-4 sm:-mx-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {shows.map((show) => {
            return (
              <div
                key={show.rank}
                style={{ scrollSnapAlign: "start" }}
                className="relative flex-shrink-0 flex items-end group select-none w-[180px] sm:w-[200px] md:w-[230px] pl-8 sm:pl-10"
              >
                {/* Giant Outlined Rank Number (Positioned BEHIND the card: z-0) */}
                <span
                  className={cn(
                    "absolute left-0 bottom-0 z-0 font-black font-sans leading-none pointer-events-none select-none tracking-tighter",
                    "text-7xl sm:text-8xl md:text-9xl",
                    "text-black [-webkit-text-stroke:2.5px_#ffffff] dark:[-webkit-text-stroke:3px_#ffffff] drop-shadow-[0_6px_14px_rgba(0,0,0,0.9)]"
                  )}
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {show.rank}
                </span>

                {/* Show Poster Card (Positioned IN FRONT of rank number: z-10) */}
                <div className="relative z-10 w-full aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 group-hover:border-cyan-400 dark:group-hover:border-cyan-400 group-hover:shadow-[0_0_24px_rgba(6,182,212,0.35)] transition-all duration-500 shadow-xl">
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Badge */}
                  {show.badge && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold text-[8px] uppercase tracking-wider shadow-md backdrop-blur-md">
                        {show.badge}
                      </span>
                    </div>
                  )}

                  {/* Play Trailer Button on Hover */}
                  {show.trailerUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveTrailer({ url: show.trailerUrl || "", title: show.title });
                      }}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Play Preview Trailer"
                    >
                      <div className="w-12 h-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </button>
                  )}

                  {/* Bottom Show Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10 flex flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent pt-8">
                    <Link to={`/content/${show.id}`} className="block">
                      <h3 className="text-xs sm:text-sm font-black text-white line-clamp-1 group-hover:text-cyan-400 transition-colors drop-shadow-sm">
                        {show.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-300 font-bold">
                      <span className="flex items-center gap-1 text-cyan-400 font-mono">
                        <Eye className="w-3 h-3" />
                        {show.views}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-black">
                        <Star className="w-3 h-3 fill-current" />
                        {show.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Progress Bar / Slider Track (Matches Image 1 bottom bar) */}
        <div className="mt-1 max-w-md mx-auto h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden relative shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-sm shadow-cyan-500/50"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </section>
  );
};
