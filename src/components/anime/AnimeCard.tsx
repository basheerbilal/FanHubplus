import React from "react";
import { Link } from "react-router-dom";
import { Star, Play, Bookmark, Heart, Clock, Calendar } from "lucide-react";
import { Anime } from "../../types/anime";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../utils";
import { motion } from "motion/react";

interface AnimeCardProps {
  anime: Anime;
  rank?: number;
}

export const AnimeCard = ({ anime, rank }: AnimeCardProps) => {
  const { watchlist, toggleWatchlist } = useAppContext();
  const isWatchlisted = watchlist.includes(`anime-${anime.id}`);

  const title = anime.title.english || anime.title.romaji || anime.title.native;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="group relative aspect-[2/3] overflow-hidden rounded-2xl flex-shrink-0 border border-white/10 shadow-lg"
    >
      <Link to={`/anime/${anime.id}`} className="absolute inset-0">
        <img
          src={anime.coverImage.extraLarge || anime.coverImage.large}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
      </Link>

      {rank && (
        <span className="absolute -left-1 -bottom-3 text-6xl font-black text-white/10 italic pointer-events-none group-hover:text-cyan-500/20 transition-colors">
          {rank}
        </span>
      )}

      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20">
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white bg-gradient-to-r from-cyan-600 to-blue-600 backdrop-blur-md shadow-sm">
          {anime.format || "ANIME"}
        </span>
        {anime.status === "RELEASING" && (
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
            Airing
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWatchlist(`anime-${anime.id}`);
        }}
        className={cn(
          "absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 z-20",
          isWatchlisted 
            ? "bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-500/30" 
            : "bg-black/60 border-white/20 text-white/80 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400/50"
        )}
        title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
      >
        <Bookmark className={cn("w-3 h-3", isWatchlisted && "fill-current")} />
      </button>

      <div className="absolute bottom-3 left-3 right-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300 z-20">
        <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 mb-0.5 font-bold">
          <div className="flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" />
            <span>{anime.seasonYear}</span>
          </div>
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-0.5 text-amber-400">
            <Star className="w-2.5 h-2.5 fill-current" />
            <span>{(anime.averageScore || 0) / 10}</span>
          </div>
        </div>
        <h3 className="font-bold text-xs text-white line-clamp-1 mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
          <Link to={`/anime/${anime.id}`} className="flex-1">
            <button type="button" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[9px] font-black uppercase py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all shadow-md shadow-cyan-500/30 border border-cyan-400/30 active:scale-95">
              <Play className="w-2.5 h-2.5 fill-current" />
              Details
            </button>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(`anime-${anime.id}`);
            }}
            className={cn(
              "p-1.5 rounded-lg backdrop-blur-md border transition-all duration-300",
              isWatchlisted 
                ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-500/20" 
                : "bg-black/60 border-white/20 text-white hover:text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/40"
            )}
            title={isWatchlisted ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={cn("w-3 h-3", isWatchlisted && "fill-current text-cyan-400")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const AnimeCardSkeleton = () => (
  <div className="aspect-[2/3] rounded-2xl bg-main/5 border border-glass animate-pulse relative overflow-hidden shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
    <div className="absolute bottom-4 left-4 right-4 space-y-2">
      <div className="h-2.5 w-1/3 bg-main/10 rounded-lg" />
      <div className="h-4 w-2/3 bg-main/10 rounded-lg" />
    </div>
  </div>
);
