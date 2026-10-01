import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Play, Info } from "lucide-react";
import { motion } from "motion/react";

interface AiringCardProps {
  schedule: any;
}

export const AiringCard = ({ schedule }: AiringCardProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const anime = schedule.media;
  const title = anime.title.english || anime.title.romaji || anime.title.native;

  useEffect(() => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = schedule.airingAt - now;

      if (diff <= 0) {
        setTimeLeft("Airing Now");
        return;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [schedule.airingAt]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group flex gap-6 p-4 rounded-2xl glass-card hover:border-blue-500/40 transition-all shadow-xl"
    >
      <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-glass">
        <img
          src={anime.coverImage.large}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-2 left-2 right-2">
          <span className="block text-[10px] font-black text-white uppercase tracking-widest text-center bg-blue-600/90 backdrop-blur-sm rounded py-0.5 shadow-md">
            EP {schedule.episode}
          </span>
        </div>
      </div>

      <div className="flex-1 py-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
            <Clock className="w-3 h-3" />
            {timeLeft}
          </div>
          <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest">
            {anime.format}
          </span>
        </div>

        <h3 className="text-lg font-black text-main tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {anime.genres.slice(0, 2).map((genre: string) => (
            <span key={genre} className="text-[10px] font-bold text-muted glass-panel px-2 py-0.5 rounded border border-glass">
              {genre}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/anime/${anime.id}`} className="flex-1">
            <button className="w-full py-2 bg-main/5 text-main border border-glass text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-sm">
              <Info className="w-3 h-3" />
              Details
            </button>
          </Link>
          <Link to={`/anime/${anime.id}`}>
            <button className="p-2 glass-panel text-main rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-colors shadow-sm">
              <Play className="w-3 h-3 fill-current" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
