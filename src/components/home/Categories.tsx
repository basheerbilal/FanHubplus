import React from "react";
import { Link } from "react-router-dom";
import { 
  Gamepad2, 
  Tv, 
  Film, 
  Music, 
  BookOpen, 
  Layers, 
  Camera, 
  Ghost,
  ArrowUpRight
} from "lucide-react";
import { FandomCategory } from "../../types";
import { motion } from "motion/react";
import { cn } from "../../utils";

interface CategoryInfo {
  name: FandomCategory;
  icon: any;
  image: string;
  count: string;
  description: string;
}

const categories: CategoryInfo[] = [
  { 
    name: "Anime", 
    icon: Ghost, 
    image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800",
    count: "1,240+",
    description: "Stories beyond imagination and reality."
  },
  { 
    name: "Gaming", 
    icon: Gamepad2, 
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    count: "850+",
    description: "Interactive adventures and competitive play."
  },
  { 
    name: "Movies", 
    icon: Film, 
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    count: "620+",
    description: "Cinematic experiences that move the world."
  },
  { 
    name: "TV Shows", 
    icon: Tv, 
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    count: "430+",
    description: "Serial storytelling at its peak."
  },
  { 
    name: "K-Pop", 
    icon: Music, 
    image: "https://images.unsplash.com/photo-1514525253361-b83f859b21c0?auto=format&fit=crop&q=80&w=800",
    count: "310+",
    description: "Global rhythm, style, and community."
  },
  { 
    name: "Comics", 
    icon: BookOpen, 
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=800",
    count: "540+",
    description: "Visual narratives of heroes and icons."
  },
  { 
    name: "Manga", 
    icon: Layers, 
    image: "https://images.unsplash.com/photo-1613376023733-0d743de2363e?auto=format&fit=crop&q=80&w=800",
    count: "780+",
    description: "Japanese masterworks of visual art."
  },
  { 
    name: "Cosplay", 
    icon: Camera, 
    image: "https://images.unsplash.com/photo-1541560052-5e137f229371?auto=format&fit=crop&q=80&w=800",
    count: "290+",
    description: "Bringing legendary characters to life."
  },
];

export const Categories = () => {
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
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Discover</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter">Explore Fandoms</h2>
          </div>
          <p className="text-muted max-w-md md:text-right font-medium">
            Choose your universe and dive deep into curated collections of content, characters, and events.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-[320px]">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] glass-card",
                i === 0 || i === 3 ? "lg:col-span-2" : ""
              )}
            >
              <Link
                to={`/explore/${cat.name.toLowerCase().replace(" ", "-")}`}
                className="block w-full h-full"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-5">
                      <div className="p-4 rounded-[1.2rem] bg-white/10 backdrop-blur-xl border border-white/10 text-white group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-500 group-hover:rotate-6 shadow-2xl">
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                          {cat.count} items
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-white/70 max-w-xs opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 leading-relaxed font-medium">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
