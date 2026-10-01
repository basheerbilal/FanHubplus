import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Star, Bookmark } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../utils";

interface CreationItem {
  id: string;
  category: "Gaming" | "Cosplay";
  title: string;
  rating: string;
  creator: string;
  image: string;
  url: string;
}

const creations: CreationItem[] = [
  {
    id: "gc-1",
    category: "Gaming",
    title: "Cyberpunk: Edgerunners & Night City Tech",
    rating: "4.9",
    creator: "NightCityArchives",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/130591-JZ3bsMomOj8y.jpg",
    url: "/explore/Gaming",
  },
  {
    id: "gc-2",
    category: "Cosplay",
    title: "Mastering Wield & Foam: Professional Cosplay Guide",
    rating: "4.8",
    creator: "CosplayForge",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    url: "/explore/Cosplay",
  },
  {
    id: "gc-3",
    category: "Gaming",
    title: "Elden Ring: Shadow of the Erdtree Lore Secrets",
    rating: "5.0",
    creator: "TarnishedLore",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
    url: "/explore/Gaming",
  },
  {
    id: "gc-4",
    category: "Cosplay",
    title: "Genshin Impact: Fontaine Cosplay Crafting",
    rating: "4.7",
    creator: "TeyvatCreations",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800",
    url: "/explore/Cosplay",
  },
];

export const GamingCosplaySection = () => {
  const { watchlist, toggleWatchlist } = useAppContext();

  return (
    <section className="py-6 bg-bg-main transition-colors duration-300">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-main tracking-tight">
              Gaming & Cosplay Creations
            </h2>
          </div>

          <Link
            to="/explore/Gaming"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
          >
            Explore &gt;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {creations.map((item) => {
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
                      By {item.creator}
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
