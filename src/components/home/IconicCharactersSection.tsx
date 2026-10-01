import React from "react";
import { Link } from "react-router-dom";
import { Crown, Heart } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../utils";

interface CharacterItem {
  id: string;
  name: string;
  universe: string;
  fandom: string;
  image: string;
  quote: string;
}

const charactersList: CharacterItem[] = [
  {
    id: "101922",
    name: "Tanjiro Kamado",
    universe: "Demon Slayer: Kimetsu no Yaiba",
    fandom: "Anime",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg",
    quote: "Water Breathing & Hinokami Kagura",
  },
  {
    id: "arcane-jinx",
    name: "Jinx (Powder)",
    universe: "League of Legends / Arcane",
    fandom: "Gaming",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
    quote: "Zaunite Anarchist & Marksman",
  },
  {
    id: "151807",
    name: "Sung Jin-woo",
    universe: "Solo Leveling",
    fandom: "Manga",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png",
    quote: "Monarch of Shadows",
  },
  {
    id: "spider-miles",
    name: "Miles Morales",
    universe: "Spider-Man: Across the Spider-Verse",
    fandom: "Movies",
    image: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    quote: "Spider-Man of Earth-1610",
  },
];

export const IconicCharactersSection = () => {
  const { watchlist, toggleWatchlist } = useAppContext();

  return (
    <section className="py-6 sm:py-8 bg-bg-main transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-2xl font-black text-main tracking-tight">
              Iconic Character Profiles
            </h2>
          </div>

          <Link
            to="/characters"
            className="text-[11px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider transition-colors"
          >
            View all characters &gt;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {charactersList.map((char) => {
            const isSaved = watchlist.includes(char.id);
            return (
              <Link
                key={char.id}
                to={`/characters/${char.id}`}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-main/5 border border-slate-200 dark:border-glass hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all shadow-sm flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-bg-main">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />

                  <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 backdrop-blur-md text-white font-bold text-[8.5px] sm:text-[9px] uppercase tracking-wider shadow-md shadow-cyan-500/20">
                    {char.fandom}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWatchlist(char.id);
                    }}
                    className={cn(
                      "absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-all z-20",
                      isSaved
                        ? "bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-500/30"
                        : "bg-black/60 border-white/20 text-white/80 hover:text-white hover:bg-black"
                    )}
                    title={isSaved ? "Saved" : "Save"}
                  >
                    <Heart className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5", isSaved && "fill-current")} />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 space-y-0.5">
                    <span className="text-[9px] sm:text-[10px] font-bold text-cyan-300 line-clamp-1">
                      {char.universe}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {char.name}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-zinc-300 line-clamp-1 font-medium">
                      {char.quote}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
