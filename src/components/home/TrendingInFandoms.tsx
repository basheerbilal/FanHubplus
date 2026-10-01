import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Flame, ChevronLeft, ChevronRight, Star, Bookmark } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../utils";

interface TrendingItem {
  id: string;
  category: string;
  title: string;
  rating: string;
  image: string;
  url: string;
}

const trendingList: TrendingItem[] = [
  {
    id: "trend-1",
    category: "Gaming",
    title: "Cyberpunk: Edgerunners & Night City",
    rating: "4.9",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130591-9O1cf7u6SfYa.jpg",
    url: "/content/1",
  },
  {
    id: "trend-2",
    category: "Anime",
    title: "Demon Slayer: Infinity Castle Arc",
    rating: "5.0",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg",
    url: "/content/2",
  },
  {
    id: "trend-3",
    category: "Movies",
    title: "Across The Spider-Verse",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=600",
    url: "/content/3",
  },
  {
    id: "trend-4",
    category: "TV Shows",
    title: "Arcane: The Evolution of Piltover",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
    url: "/content/4",
  },
  {
    id: "trend-5",
    category: "Manga",
    title: "Solo Leveling: Shadow Monarch",
    rating: "4.9",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png",
    url: "/content/5",
  },
  {
    id: "trend-6",
    category: "Cosplay",
    title: "Mastering Wield & Foam: Cosplay Guide",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600",
    url: "/content/6",
  },
  {
    id: "trend-7",
    category: "K-Pop",
    title: "The Global K-Pop Phenomenon",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
    url: "/content/7",
  },
  {
    id: "trend-8",
    category: "Comics",
    title: "Batman: The Caped Crusader",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600",
    url: "/content/8",
  },
];

export const TrendingInFandoms = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { watchlist, toggleWatchlist } = useAppContext();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 bg-bg-main transition-colors duration-300">
      <div className="container mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-cyan-400 fill-current" />
            <h2 className="text-xl sm:text-2xl font-black text-main tracking-tight">
              Trending in Fandoms
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider flex items-center gap-1"
            >
              Explore All &gt;
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-lg bg-white dark:bg-main/5 border border-slate-200 dark:border-glass text-slate-600 dark:text-muted hover:text-cyan-400 hover:border-cyan-400/40 transition-all shadow-sm flex items-center justify-center"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-lg bg-white dark:bg-main/5 border border-slate-200 dark:border-glass text-slate-600 dark:text-muted hover:text-cyan-400 hover:border-cyan-400/40 transition-all shadow-sm flex items-center justify-center"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Cards Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        >
          {trendingList.map((item) => {
            const isSaved = watchlist.includes(item.id);
            return (
              <div
                key={item.id}
                className="w-[190px] sm:w-[210px] flex-shrink-0 snap-start group relative rounded-2xl overflow-hidden bg-white dark:bg-main/5 border border-slate-200 dark:border-glass/80 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 shadow-sm"
              >
                {/* Thumbnail Image */}
                <div className="aspect-[16/10] relative overflow-hidden bg-bg-main">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />

                  {/* Category Badge on Top-Left */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 backdrop-blur-md text-white font-bold text-[9px] uppercase tracking-wider shadow-md shadow-cyan-500/20">
                    {item.category}
                  </span>

                  {/* Bookmark Button on Top-Right */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWatchlist(item.id);
                    }}
                    className={cn(
                      "absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-all z-20",
                      isSaved
                        ? "bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-500/30"
                        : "bg-black/60 border-white/20 text-white/80 hover:text-white hover:bg-black"
                    )}
                    title={isSaved ? "Saved" : "Save"}
                  >
                    <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-3">
                  <Link to={item.url}>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-glass/60 text-[11px]">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current" /> {item.rating}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-muted uppercase tracking-wider">
                      Popular
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
