import React from "react";
import { ExternalLink, Calendar, User } from "lucide-react";
import { NewsArticle } from "../../types/anime";
import { motion } from "motion/react";

interface AnimeNewsCardProps {
  article: NewsArticle;
}

export const AnimeNewsCard = ({ article }: AnimeNewsCardProps) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group glass-card rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all shadow-2xl"
    >
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {article.animeTitle && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                {article.animeTitle}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-500" />
              {formattedDate}
            </div>
            <span className="text-muted/30">·</span>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-cyan-500" />
              {article.source}
            </div>
          </div>
          
          <h3 className="text-xl font-black text-main tracking-tight mb-4 group-hover:text-cyan-500 transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>
          
          <p className="text-muted text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
            {article.description}
          </p>
          
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-main group-hover:text-cyan-500 transition-all">
            Read Full Coverage
            <ExternalLink className="w-4 h-4 text-cyan-500" />
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export const NewsCardSkeleton = () => (
  <div className="glass-card rounded-[2rem] overflow-hidden animate-pulse border border-glass shadow-2xl">
    <div className="aspect-video bg-main/5" />
    <div className="p-6 space-y-4">
      <div className="h-3 w-1/4 bg-main/5 rounded-lg" />
      <div className="h-6 w-full bg-main/5 rounded-lg" />
      <div className="h-4 w-3/4 bg-main/5 rounded-lg" />
    </div>
  </div>
);
