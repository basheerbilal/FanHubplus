import React from "react";
import { Link } from "react-router-dom";
import { Clapperboard, Star, Bookmark } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../utils";

interface HighlightItem {
  id: string;
  category: "Anime" | "Manga";
  title: string;
  rating: string;
  year: string;
  genre: string;
  image: string;
  url: string;
}

const highlights: HighlightItem[] = [
  {
    id: "am-1",
    category: "Anime",
    title: "Demon Slayer: Infinity Castle Arc",
    rating: "4.9",
    year: "2024",
    genre: "Action • Supernatural",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg",
    url: "/content/2",
  },
  {
    id: "am-2",
    category: "Manga",
    title: "Solo Leveling: Shadow Monarch",
    rating: "4.8",
    year: "2024",
    genre: "Fantasy • Action",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png",
    url: "/content/5",
  },
  {
    id: "am-3",
    category: "Anime",
    title: "Jujutsu Kaisen: Shibuya Incident",
    rating: "4.9",
    year: "2023",
    genre: "Dark Fantasy • Shonen",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg",
    url: "/anime/113415",
  },
  {
    id: "am-4",
    category: "Manga",
    title: "Chainsaw Man: Reze Arc",
    rating: "4.7",
    year: "2024",
    genre: "Action • Horror",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-DdP4vAdssLoz.png",
    url: "/anime/127230",
  },
];

export const AnimeMangaHighlights = () => {
  const { watchlist, toggleWatchlist } = useAppContext();

  return (
    <section className="py-6 bg-bg-main transition-colors duration-300">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-main tracking-tight">
              Anime & Manga Highlights
            </h2>
          </div>

          <Link
            to="/explore/Anime"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
          >
            View Category &gt;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((item) => {
            const isSaved = watchlist.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all shadow-md flex flex-col"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-bg-main">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />

                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 backdrop-blur-md text-white font-bold text-[9px] uppercase tracking-wider shadow-md shadow-cyan-500/20">
                    {item.category}
                  </span>

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

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <Link to={item.url}>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/10 text-[11px]">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current" /> {item.rating}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                      {item.year}
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
