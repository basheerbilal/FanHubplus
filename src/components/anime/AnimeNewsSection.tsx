import React from "react";
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight } from "lucide-react";
import { useAnimeNews } from "../../hooks/useAnimeNews";
import { AnimeNewsCard, NewsCardSkeleton } from "./AnimeNewsCard";
import { motion } from "motion/react";

import { StaggerContainer, StaggerItem } from "../common/StaggerContainer";

export const AnimeNewsSection = () => {
  const { data, loading, error } = useAnimeNews();

  if (error && !loading) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] glass-panel flex items-center justify-center text-brand-pink">
              <Newspaper className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-brand-pink uppercase tracking-[0.2em]">Industry Updates</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter leading-none">Anime News</h2>
            </div>
          </div>
          <Link to="/anime-news" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-muted hover:text-brand-pink transition-all duration-300">
            Read More News
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-all shadow-lg">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))
          ) : (
            data.slice(0, 3).map((article) => (
              <StaggerItem key={article.id}>
                <AnimeNewsCard article={article} />
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </div>
    </section>
  );
};
