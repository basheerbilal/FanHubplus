import React, { useRef } from "react";
import { events } from "../../data/events";
import { Calendar, MapPin, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export const UpcomingEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 mb-16 flex items-end justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">Global Events</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter">Upcoming Events</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-2xl glass-panel text-muted hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-2xl glass-panel text-muted hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-6 lg:px-[calc((100vw-1440px)/2+24px)] scrollbar-hide pb-12 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {events.map((event, i) => (
          <motion.div 
            key={event.id} 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="w-[380px] md:w-[480px] flex-shrink-0 snap-start group"
          >
            <div className="relative glass-card rounded-[2.5rem] overflow-hidden p-8 hover:border-brand-orange/30 transition-all duration-500 shadow-2xl">
              <div className="flex gap-8">
                {/* Date Side */}
                <div className="flex flex-col items-center justify-center border-r border-white/10 pr-8">
                  <span className="text-brand-orange font-black text-4xl leading-none mb-1">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>

                {/* Content Side */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-main text-[10px] font-black uppercase tracking-[0.2em]">
                      {event.category}
                    </span>
                    <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-muted group-hover:bg-brand-orange group-hover:text-black group-hover:border-brand-orange transition-all duration-500 rotate-45 group-hover:rotate-0 shadow-lg">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-main tracking-tight mb-4 group-hover:text-brand-orange transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted">
                      <MapPin className="w-4 h-4 text-brand-orange/50" />
                      <span className="text-xs font-bold">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Calendar className="w-4 h-4 text-brand-orange/50" />
                      <span className="text-xs font-bold">
                        {new Date(event.date).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Artwork Hint */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <img 
                  src={event.image} 
                  alt="" 
                  className="w-full h-full object-cover rounded-bl-[4rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 to-transparent" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
