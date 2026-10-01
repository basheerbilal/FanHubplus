import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Play, Info, Plus, Check, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../../context/AppContext";

export interface HeroSpotlight {
  id: string;
  category: string;
  title: string;
  match: string;
  year: string;
  ageRating: string;
  quality: string;
  rating: string;
  description: string;
  backdrop: string;
  trailerUrl: string;
  moreInfoUrl: string;
}

export const spotlightItems: HeroSpotlight[] = [
  {
    id: "spotlight-1",
    category: "GAMING UNIVERSE | SPOTLIGHT",
    title: "Cyberpunk: Edgerunners",
    match: "98% Match",
    year: "2024",
    ageRating: "18+",
    quality: "4K ULTRA HD",
    rating: "4.9",
    description: "Studio Trigger's neon-soaked cyberpunk masterpiece set in Night City.",
    backdrop: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/130591-JZ3bsMomOj8y.jpg",
    trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg",
    moreInfoUrl: "/content/1",
  },
  {
    id: "spotlight-2",
    category: "ANIME UNIVERSE | SPOTLIGHT",
    title: "Demon Slayer: Infinity Castle",
    match: "99% Match",
    year: "2024",
    ageRating: "16+",
    quality: "4K ULTRA HD",
    rating: "5.0",
    description: "The ultimate battle begins inside the shifting halls of Infinity Castle.",
    backdrop: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-33MtJGsUSxga.jpg",
    trailerUrl: "https://www.youtube.com/embed/Q4XN3y7Uu3I",
    moreInfoUrl: "/content/2",
  },
  {
    id: "spotlight-3",
    category: "CINEMA & COMICS | SPOTLIGHT",
    title: "Spider-Man: Beyond the Spider-Verse",
    match: "97% Match",
    year: "2025",
    ageRating: "PG-13",
    quality: "DOLBY VISION",
    rating: "4.8",
    description: "Miles Morales journeys across dimensions to challenge fate and save his universe.",
    backdrop: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=2400",
    trailerUrl: "https://www.youtube.com/embed/cqGjhVJWtEg",
    moreInfoUrl: "/content/3",
  },
  {
    id: "spotlight-4",
    category: "TV SHOWS | SPOTLIGHT",
    title: "Arcane: Piltover & Zaun",
    match: "99% Match",
    year: "2024",
    ageRating: "16+",
    quality: "HDR10+",
    rating: "4.9",
    description: "Jinx and Vi's fractured bond collides as two worlds clash in all-out war.",
    backdrop: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2400",
    trailerUrl: "https://www.youtube.com/embed/fXmAurh012s",
    moreInfoUrl: "/content/4",
  },
  {
    id: "spotlight-5",
    category: "MANGA & WEBTOON | SPOTLIGHT",
    title: "Solo Leveling: Shadow Monarch",
    match: "98% Match",
    year: "2024",
    ageRating: "16+",
    quality: "4K ULTRA HD",
    rating: "4.9",
    description: "From the weakest hunter to supreme ruler of the shadow army.",
    backdrop: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg",
    trailerUrl: "https://www.youtube.com/embed/9g_8r_r7-80",
    moreInfoUrl: "/content/5",
  },
  {
    id: "spotlight-6",
    category: "K-POP UNIVERSE | SPOTLIGHT",
    title: "Global K-Pop: Stadium Era",
    match: "96% Match",
    year: "2024",
    ageRating: "ALL",
    quality: "DOLBY ATMOS",
    rating: "4.9",
    description: "Sold-out stadium stages and visual spectacles redefining global pop music.",
    backdrop: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2400",
    trailerUrl: "https://www.youtube.com/embed/gdZLi9oWNZg",
    moreInfoUrl: "/content/6",
  },
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { watchlist, toggleWatchlist } = useAppContext();

  // Smooth auto-advance every 6.5 seconds for relaxing, immersive viewing
  useEffect(() => {
    if (isTrailerOpen) return; // pause when watching trailer
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightItems.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isTrailerOpen]);

  const current = spotlightItems[currentIndex];
  const isSaved = watchlist.includes(current.id);

  // Handle ESC key to close trailer modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTrailerOpen) {
        setIsTrailerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTrailerOpen]);

  return (
    <>
      <section className="relative w-full h-[78vh] min-h-[520px] max-h-[760px] bg-black overflow-hidden select-none">
      {/* Background Image Carousel with Smooth Crossfade & Subtle Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full absolute inset-0"
          >
            <img
              src={current.backdrop}
              alt={current.title}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Vignettes and Left Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/80 to-transparent z-[1] w-full md:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-black/50 z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-bg-main to-transparent z-[2]" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 container mx-auto px-6 sm:px-12 h-full flex flex-col justify-center">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5"
            >
              {/* Category Pill with Glowing Dot */}
              {/* Category Pill */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                  {current.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] drop-shadow-xl">
                {current.title}
              </h1>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold text-[10px]">
                  {current.match}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-main/5 border border-glass text-muted font-bold text-[10px]">
                  {current.year}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-black text-[10px] tracking-wider uppercase">
                  {current.quality}
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px] ml-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {current.rating}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg line-clamp-2 drop-shadow">
                {current.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {/* Play Trailer Button */}
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play Trailer
                </button>

                {/* More Info Button */}
                <Link
                  to={current.moreInfoUrl}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-main/10 hover:bg-main/20 backdrop-blur-md text-main font-bold text-xs sm:text-sm border border-glass transition-all hover:scale-105 active:scale-95 hover:border-cyan-500/40"
                >
                  <Info className="w-3.5 h-3.5 text-muted" /> Details
                </Link>

                {/* Watchlist Toggle (+) */}
                <button
                  onClick={() => toggleWatchlist(current.id)}
                  className="w-10 h-10 rounded-xl bg-main/10 hover:bg-main/20 backdrop-blur-md border border-glass flex items-center justify-center text-main transition-all hover:scale-105 active:scale-95 hover:border-cyan-500/40"
                  title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
                >
                  {isSaved ? <Check className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Progress Indicators on Bottom Right */}
        <div className="absolute bottom-8 right-6 sm:right-12 z-20 flex items-center gap-2">
          {spotlightItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className="group py-2"
              title={item.title}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentIndex === idx
                    ? "w-8 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                    : "w-2 bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>

    {/* Trailer Modal Popup rendered directly into Body via Portal */}
    {createPortal(
      <AnimatePresence>
        {isTrailerOpen && (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
            onClick={() => setIsTrailerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-cyan-400 fill-current ml-0.5" />
                  </div>
                  <span className="text-sm font-bold text-white line-clamp-1">{current.title} — Official Trailer</span>
                </div>
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src={`${current.trailerUrl}?autoplay=1&rel=0`}
                  title={current.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
  </>
);
};
