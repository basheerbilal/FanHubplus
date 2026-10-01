import React from "react";
import { Link } from "react-router-dom";
import { Gem, Eye, Heart } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../utils";

interface MerchPreview {
  id: string;
  title: string;
  fandom: string;
  price: string;
  tag: string;
  views: string;
  image: string;
}

const merchItems: MerchPreview[] = [
  {
    id: "m1",
    title: "Satoru Gojo Nendoroid & Scale Figure",
    fandom: "Jujutsu Kaisen",
    price: "$59.99",
    tag: "PRE-ORDER",
    views: "5.4k views",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "m2",
    title: "Cyberpunk 2077 Thermal Katana Replica",
    fandom: "Cyberpunk 2077",
    price: "$299.99",
    tag: "LIMITED EDITION",
    views: "4.8k views",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "m6",
    title: "Spider-Man 2 Advanced Suit 1/6 Scale",
    fandom: "Marvel Comics",
    price: "$285.00",
    tag: "PRE-ORDER",
    views: "3.9k views",
    image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "m5",
    title: "Gundam RX-78-2 Perfect Grade Unleashed",
    fandom: "Anime Mecha",
    price: "$275.00",
    tag: "COLLECTIBLE",
    views: "6.2k views",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800",
  },
];

export const MerchShowcaseSection = () => {
  const { watchlist, toggleWatchlist } = useAppContext();

  return (
    <section className="py-6 bg-bg-main transition-colors duration-300">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-black text-main tracking-tight">
              Exclusive Merchandise Showcase
            </h2>
          </div>

          <Link
            to="/merchandise"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
          >
            Showcase gallery &gt;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {merchItems.map((item) => {
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

                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-[8px] uppercase tracking-wider shadow-md shadow-cyan-500/20">
                    {item.tag}
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
                    <Heart className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
                  </button>

                  <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] text-zinc-300 font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    <Eye className="w-3 h-3 text-cyan-400" /> {item.views}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-300 block mb-0.5">
                      {item.fandom}
                    </span>
                    <Link to="/merchandise">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/10 text-[11px]">
                    <span className="font-black text-slate-900 dark:text-white text-xs">
                      {item.price}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Discovery Only
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
