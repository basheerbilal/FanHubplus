import React from "react";
import { useAnimeNews } from "../hooks/useAnimeNews";
import { AnimeNewsCard, NewsCardSkeleton } from "../components/anime/AnimeNewsCard";
import { Newspaper, Search, Filter } from "lucide-react";
import { motion } from "motion/react";

export default function AnimeNews() {
  const { data, loading, error } = useAnimeNews();

  return (
    <div className="pt-24 min-h-screen bg-bg-main">
      {/* Hero Header */}
      <div className="relative py-24 overflow-hidden border-b border-glass">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-8 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Newspaper className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-main tracking-tighter mb-6 leading-none">
              Anime <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">News & Updates</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed font-medium">
              Stay updated with the latest anime announcements, releases, adaptations and industry news from around the world.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search news, rumors, announcements..."
              className="w-full bg-main/5 border border-glass rounded-2xl py-4 pl-12 pr-4 text-main focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all shadow-lg"
            />
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-main/5 border border-glass rounded-2xl font-black text-main hover:bg-main/10 transition-all">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* News Grid */}
        {error && !loading ? (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-main mb-4">Latest news is temporarily unavailable</h3>
            <p className="text-muted">The constellation of news is currently out of reach.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))
            ) : (
              data.map((article) => (
                <AnimeNewsCard key={article.id} article={article} />
              ))
            )}
          </div>
        )}
        
        {!loading && data.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted">No news articles found at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
