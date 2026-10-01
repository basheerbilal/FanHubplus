import React, { useState } from "react";
import { Sparkles, Zap, Shield, Brain, Swords, Volume2, VolumeX, Quote, ExternalLink, Bookmark, Heart, Award } from "lucide-react";
import { categories, characters, CosplayCharacter, playSwitchSound, playPowerSurgeSound } from "../../data/cosplayCharacters";
import { cn } from "../../utils";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../../context/AppContext";

export const CosplaySpotlight = () => {
  const [selectedCat, setSelectedCat] = useState("All");
  const [activeChar, setActiveChar] = useState<CosplayCharacter>(characters[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { watchlist, favorites, toggleWatchlist, toggleFavorite } = useAppContext();

  const isSaved = watchlist.includes(`cosplay-${activeChar.id}`);
  const isFav = favorites.includes("Cosplay");

  const filtered = selectedCat === "All"
    ? characters
    : characters.filter(c => c.category === selectedCat);

  const handleSelectChar = (char: CosplayCharacter) => {
    setActiveChar(char);
    if (soundEnabled) {
      playSwitchSound(620);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCat(cat);
    const firstInCat = cat === "All" ? characters[0] : characters.find(c => c.category === cat) || characters[0];
    setActiveChar(firstInCat);
    if (soundEnabled) {
      playPowerSurgeSound();
    }
  };

  const statIcons: Record<string, any> = {
    power: Zap,
    speed: Sparkles,
    durability: Shield,
    intelligence: Brain,
    combatIQ: Swords,
  };

  return (
    <div className="space-y-10 my-8">
      {/* Top Header & Sound Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-md shadow-cyan-500/30">
              ⚡ Multiverse Cosplay & Characters
            </span>
            <span className="text-[10px] font-bold text-cyan-400">12 Legendary Profiles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cosplay & Character Showcase
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Explore authentic costumes, power statistics, quotes, and lore for top multiverse icons.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer",
            soundEnabled
              ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              : "bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white"
          )}
          title="Toggle interactive sound effects"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          <span>Sound FX {soundEnabled ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const active = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border cursor-pointer",
                active
                  ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30 scale-105"
                  : "bg-slate-900/60 border-white/10 text-zinc-300 hover:text-white hover:border-cyan-500/40 hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Hero Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChar.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl sm:rounded-[2.5rem] bg-[#0c1220]/95 border p-4 sm:p-8 lg:p-10 relative overflow-hidden backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          style={{
            borderColor: activeChar.themeColor + "55",
            boxShadow: `0 0 45px ${activeChar.accentGlow}`,
          }}
        >
          {/* Background Ambient Glow */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: activeChar.themeColor }}
          />

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-8 items-center lg:items-start relative z-10">
            {/* Left Column / Mobile Header: Character Artwork + Quick Info */}
            <div className="w-full lg:col-span-5 flex flex-col items-center">
              
              {/* Responsive Container: Side-by-side on mobile, centered card on desktop */}
              <div className="w-full flex flex-row lg:flex-col items-center lg:items-center gap-3.5 sm:gap-6">
                
                {/* Character Artwork */}
                <div
                  className="w-28 sm:w-44 md:w-52 lg:w-full lg:max-w-[320px] aspect-[3/4] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border-2 relative group shadow-xl bg-black/50"
                  style={{ borderColor: activeChar.themeColor }}
                >
                  <img
                    src={activeChar.image}
                    alt={activeChar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span
                      className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest shadow-md backdrop-blur-md"
                      style={{ backgroundColor: activeChar.themeColor }}
                    >
                      {activeChar.rank}
                    </span>
                  </div>

                  {/* Name Overlay (Desktop Only) */}
                  <div className="hidden lg:block absolute bottom-4 left-4 right-4 text-center">
                    <span className="text-[10px] font-bold text-white/70 block mb-0.5">{activeChar.japanese}</span>
                    <h3 className="text-2xl font-black text-white">{activeChar.name}</h3>
                    <p className="text-xs font-bold text-cyan-300 mt-0.5">{activeChar.anime}</p>
                  </div>
                </div>

                {/* Mobile Info (Beside Artwork on mobile) */}
                <div className="flex-1 min-w-0 lg:hidden flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] sm:text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider">
                      {activeChar.category}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 truncate">{activeChar.affiliation}</span>
                  </div>

                  <span className="text-[10px] font-bold text-cyan-300/80">{activeChar.japanese}</span>
                  <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight line-clamp-2">
                    {activeChar.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-zinc-300 mt-0.5 line-clamp-1">{activeChar.role}</p>

                  {/* Mobile Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => toggleWatchlist(`cosplay-${activeChar.id}`)}
                      className={cn(
                        "flex-1 h-9 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                        isSaved
                          ? "bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-500/30"
                          : "bg-white/[0.06] border-white/15 text-zinc-300 hover:text-white"
                      )}
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
                      <span>{isSaved ? "Saved" : "Watchlist"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite("Cosplay")}
                      className={cn(
                        "h-9 w-9 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer shrink-0",
                        isFav
                          ? "bg-pink-500 border-pink-400 text-white shadow-md shadow-pink-500/30"
                          : "bg-white/[0.06] border-white/15 text-zinc-300 hover:text-pink-400"
                      )}
                      title="Favorite"
                    >
                      <Heart className={cn("w-4 h-4", isFav && "fill-current text-pink-400")} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex items-center gap-3 mt-4 w-full max-w-[320px]">
                <button
                  type="button"
                  onClick={() => toggleWatchlist(`cosplay-${activeChar.id}`)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer",
                    isSaved
                      ? "bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-500/30"
                      : "bg-white/[0.06] border-white/15 text-zinc-300 hover:text-white hover:border-cyan-400/50"
                  )}
                >
                  <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
                  {isSaved ? "Saved in Watchlist" : "Save to Watchlist"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite("Cosplay")}
                  className={cn(
                    "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer",
                    isFav
                      ? "bg-pink-500 border-pink-400 text-white shadow-md shadow-pink-500/30"
                      : "bg-white/[0.06] border-white/15 text-zinc-300 hover:text-pink-400 hover:border-pink-400/50"
                  )}
                  title="Favorite"
                >
                  <Heart className={cn("w-4 h-4", isFav && "fill-current text-pink-400")} />
                </button>
              </div>
            </div>

            {/* Right: Character Stats & Lore Details */}
            <div className="w-full lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Desktop Header */}
              <div className="hidden lg:block">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    {activeChar.category}
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-xs font-bold text-zinc-400">{activeChar.affiliation}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {activeChar.name}
                </h1>
                <p className="text-xs font-semibold text-zinc-300 mt-1">{activeChar.role}</p>
              </div>

              {/* Quote box */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5 sm:gap-3">
                <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-cyan-200 italic font-medium leading-relaxed">
                  {activeChar.quote}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {activeChar.description}
              </p>

              {/* Power / Special Technique */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Signature Ability & Powers:
                </span>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  {activeChar.power}
                </p>
              </div>

              {/* Combat & Power Stats */}
              <div className="space-y-2 sm:space-y-3 pt-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                  Combat & Attribute Ratings:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {Object.entries(activeChar.stats).map(([statKey, statVal]) => {
                    const Icon = statIcons[statKey] || Award;
                    return (
                      <div key={statKey} className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 capitalize flex items-center gap-1.5 font-bold text-[11px] sm:text-xs">
                            <Icon className="w-3 h-3 text-cyan-400" />
                            {statKey.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="font-mono font-black text-white text-xs">{statVal}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${statVal}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: activeChar.themeColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {activeChar.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border"
                    style={{
                      backgroundColor: activeChar.themeColor + "15",
                      borderColor: activeChar.themeColor + "40",
                      color: activeChar.themeColor,
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Grid of all Cosplay Character Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Choose Cosplay Character:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {filtered.map((char) => {
            const isCurrent = activeChar.id === char.id;
            return (
              <motion.button
                key={char.id}
                type="button"
                onClick={() => handleSelectChar(char)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center cursor-pointer group shadow-sm",
                  isCurrent
                    ? "bg-slate-900 border-2 shadow-lg"
                    : "bg-slate-900/60 border-white/10 hover:border-cyan-500/40 hover:bg-white/5"
                )}
                style={{
                  borderColor: isCurrent ? char.themeColor : undefined,
                  boxShadow: isCurrent ? `0 0 20px ${char.accentGlow}` : undefined,
                }}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 border transition-transform group-hover:scale-105"
                  style={{ borderColor: isCurrent ? char.themeColor : "rgba(255,255,255,0.15)" }}
                >
                  <img src={char.avatar || char.image} alt={char.name} className="w-full h-full object-cover" />
                </div>

                <span className="text-[9px] font-bold text-zinc-400 truncate w-full">{char.anime}</span>
                <h4 className="text-xs font-black text-white truncate w-full mt-0.5 group-hover:text-cyan-400 transition-colors">
                  {char.name}
                </h4>
                <span
                  className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mt-1.5"
                  style={{
                    backgroundColor: char.themeColor + "20",
                    color: char.themeColor,
                  }}
                >
                  {char.category}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
