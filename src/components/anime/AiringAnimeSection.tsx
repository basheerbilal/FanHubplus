import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { useAiringAnime } from "../../hooks/useAnime";
import { AiringCard } from "./AiringCard";
import { motion } from "motion/react";

export const AiringAnimeSection = () => {
  const { data, loading, error } = useAiringAnime(1, 4);

  if (error && !loading) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Airing Now</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter leading-none">Release Schedule</h2>
            </div>
          </div>
          <Link to="/airing" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-muted hover:text-emerald-500 transition-all duration-300">
            View Full Schedule
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-main/5 rounded-2xl animate-pulse" />
            ))
          ) : (
            data.map((schedule) => (
              <AiringCard key={schedule.id} schedule={schedule} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
