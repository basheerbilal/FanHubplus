import React from "react";
import { motion } from "motion/react";
import { Star, TrendingUp } from "lucide-react";
import { useExternalMedia } from "../../hooks/useExternalMedia";

export const PopularThisWeek = () => {
  const { data: popularItems, loading } = useExternalMedia("movies");
  const displayItems = popularItems.slice(0, 5);

  if (loading) {
    return (
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 h-96 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <div className="p-4 rounded-2xl glass-panel text-brand-pink shadow-2xl">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter">
            Popular This Week
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-brand-pink/30 to-transparent ml-6 hidden md:block" />
        </motion.div>
      </div>

      <div className="flex gap-16 overflow-x-auto px-6 lg:px-[calc((100vw-1440px)/2+24px)] scrollbar-hide pb-12 snap-x">
        {displayItems.map((item, index) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
            className="flex-shrink-0 snap-start flex items-end"
          >
            {/* Giant Ranking Number */}
            <div className="relative group cursor-pointer">
              <div className="absolute -left-16 bottom-0 z-10 select-none pointer-events-none">
                <span className="text-[14rem] font-black leading-none tracking-tighter text-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-700" style={{ WebkitTextStroke: "2px var(--text-main)" }}>
                  {index + 1}
                </span>
              </div>

              {/* Content Artwork */}
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block relative w-[260px] md:w-[320px] aspect-[2/3] rounded-[3rem] overflow-hidden glass-card group-hover:border-brand-pink/30 transition-all duration-700 ml-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-[10px] font-black text-brand-pink uppercase tracking-[0.3em] mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tighter truncate mb-3">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-black">{item.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted/50 text-[10px] font-black uppercase tracking-widest">Trending #{index + 1}</span>
                  </div>
                </div>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
