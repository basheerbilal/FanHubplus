import React from "react";
import { useAiringAnime } from "../hooks/useAnime";
import { AiringCard } from "../components/anime/AiringCard";
import { Calendar, Clock, Filter } from "lucide-react";
import { motion } from "motion/react";

export default function Airing() {
  const { data, loading, error } = useAiringAnime(1, 50);

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Header */}
      <div className="relative py-24 overflow-hidden border-b border-glass">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-brand-purple/15" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-3xl glass-panel flex items-center justify-center text-blue-400 mb-8 shadow-2xl border border-blue-500/20">
              <Calendar className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-main tracking-tighter mb-6 leading-none">
              Anime <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Airing</span> Now
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed font-medium">
              Track the exact moment your favorite series release their next episodes. Live countdowns for today's hottest releases.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Timeline Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl glass-panel text-blue-400 border border-blue-500/20 shadow-xl">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-main tracking-tighter">Airing Today</h2>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 glass-panel rounded-2xl font-black text-main hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-lg">
            <Filter className="w-4 h-4" />
            Full Week
          </button>
        </div>

        {/* Airing Grid */}
        {error && !loading ? (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-main mb-4">Airing schedule is temporarily unavailable</h3>
            <p className="text-muted">The cosmic clock is currently being recalibrated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 bg-main/5 rounded-2xl animate-pulse" />
              ))
            ) : (
              data.map((schedule) => (
                <AiringCard key={schedule.id} schedule={schedule} />
              ))
            )}
          </div>
        )}
        
        {!loading && data.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted">No episodes airing in the current time range.</p>
          </div>
        )}
      </div>
    </div>
  );
}
