import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Play, Volume2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaVaultItem {
  id: string;
  title: string;
  type: "Trailer" | "OST";
  duration: string;
  category: string;
  image: string;
  embedUrl: string;
}

const mediaItems: MediaVaultItem[] = [
  {
    id: "mv-1",
    title: "Demon Slayer: Infinity Castle Official Teaser",
    type: "Trailer",
    duration: "2:45",
    category: "Anime",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600",
    embedUrl: "https://www.youtube.com/embed/Q4XN3y7Uu3I",
  },
  {
    id: "mv-2",
    title: "Grand Theft Auto VI: Official Trailer 1",
    type: "Trailer",
    duration: "1:30",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
    embedUrl: "https://www.youtube.com/embed/QdBZY2fkU-0",
  },
  {
    id: "mv-3",
    title: "Arcane Season 2: Heavy Is The Crown (Official OST)",
    type: "OST",
    duration: "3:15",
    category: "TV Shows",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
    embedUrl: "https://www.youtube.com/embed/C3GouGa0noM",
  },
  {
    id: "mv-4",
    title: "Across The Spider-Verse: Annihilate Soundtrack",
    type: "OST",
    duration: "3:51",
    category: "Movies",
    image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=600",
    embedUrl: "https://www.youtube.com/embed/f02e6p4Hov8",
  },
];

export const MultimediaVaultSection = () => {
  const [activeMedia, setActiveMedia] = useState<MediaVaultItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeMedia) {
        setActiveMedia(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMedia]);

  return (
    <>
      <section className="py-6 bg-bg-main transition-colors duration-300">
        <div className="container mx-auto px-6 sm:px-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-cyan-400 fill-current" />
              <h2 className="text-xl sm:text-2xl font-black text-main tracking-tight">
                Multimedia Vault (Trailers & Soundtracks)
              </h2>
            </div>

            <Link
              to="/explore"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
            >
              Open player &gt;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveMedia(item)}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-main/5 border border-slate-200 dark:border-glass hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer flex flex-col shadow-sm"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-bg-main">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {/* Cyan Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
                      {item.type === "Trailer" ? (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white font-bold text-[9px] uppercase tracking-wider border border-white/10">
                    {item.category}
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-zinc-300">
                    {item.duration}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 dark:text-muted font-bold uppercase tracking-wider mt-1 block">
                    {item.type} Edition
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video / OST Player Modal rendered via Portal */}
      {createPortal(
        <AnimatePresence>
          {activeMedia && (
            <div 
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
              onClick={() => setActiveMedia(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl relative"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-cyan-400 fill-current ml-0.5" />
                    </div>
                    <span className="text-sm font-bold text-white line-clamp-1">{activeMedia.title}</span>
                  </div>
                  <button
                    onClick={() => setActiveMedia(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="aspect-video w-full bg-black relative">
                  <iframe
                    src={`${activeMedia.embedUrl}?autoplay=1&rel=0`}
                    title={activeMedia.title}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
