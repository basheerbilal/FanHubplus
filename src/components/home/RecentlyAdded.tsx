import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Star, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useExternalMedia } from "../../hooks/useExternalMedia";

export const RecentlyAdded = () => {
  const { data: recentItems, loading } = useExternalMedia("all");
  const displayItems = recentItems.slice(0, 8);

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
            <div className="w-16 h-16 rounded-[1.5rem] glass-panel flex items-center justify-center text-cyan-500">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Global Discovery</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter leading-none">Fresh Updates</h2>
            </div>
          </div>
          <Link to="/explore" className="group flex items-center gap-4 text-sm font-black uppercase tracking-widest text-muted hover:text-main transition-all duration-300">
            Explore All Hubs
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white transition-all shadow-lg">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {displayItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative flex flex-col glass-card rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-300 shadow-2xl"
            >
              <div className="aspect-[2/3] relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-black text-main mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-[11px] font-black">{item.rating.toFixed(1)}</span>
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl glass-panel text-muted hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
          
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="aspect-[2/3] rounded-[2rem] glass-card animate-pulse shadow-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
};
