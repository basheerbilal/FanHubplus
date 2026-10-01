import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { events, FandomEvent } from "../data/events";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Ticket, 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  Info, 
  X, 
  Sparkles, 
  Compass, 
  Globe, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Navigation
} from "lucide-react";
import { cn } from "../utils";
import { motion, AnimatePresence } from "motion/react";

export default function Events() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bookedEvent, setBookedEvent] = useState<FandomEvent | null>(null);

  const cities = ["all", "Tokyo", "Seoul", "New York", "London", "Los Angeles", "San Diego", "Lahore", "Karachi"];
  const eventTypes = ["all", "Convention", "Premiere", "Tournament", "Concert", "Fan Meetup", "Exhibition"];
  const categories = ["all", "Anime", "Gaming", "K-Pop", "Comics", "Movies"];

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === "all" || evt.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesType = selectedType === "all" || evt.type.toLowerCase() === selectedType.toLowerCase();
      const matchesCategory = selectedCategory === "all" || evt.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCity && matchesType && matchesCategory;
    });
  }, [searchQuery, selectedCity, selectedType, selectedCategory]);

  return (
    <div className="min-h-screen bg-bg-main pt-20 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            {/* Glowing Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-cyan-500/25 shadow-md shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(6,182,212,0.25)] backdrop-blur-2xl">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
                Multiverse Gatherings & Premieres
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              Fan <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Events</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
              Connect with fellow fans at worldwide anime conventions, gaming tournaments, cosplay summits, and official stage premieres.
            </p>
          </div>
          
          {/* Grid / List View Switcher (Navbar Style Pill) */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.2)] self-start md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 select-none",
                "hover:-translate-y-0.5 active:scale-95",
                viewMode === "grid"
                  ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/40 dark:border-cyan-400/50 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                  : "text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent"
              )}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
              {viewMode === "grid" && (
                <motion.div
                  layoutId="events-view-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 border border-cyan-500/40 dark:border-cyan-400/50 backdrop-blur-md pointer-events-none"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 select-none",
                "hover:-translate-y-0.5 active:scale-95",
                viewMode === "list"
                  ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/40 dark:border-cyan-400/50 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                  : "text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent"
              )}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
              {viewMode === "list" && (
                <motion.div
                  layoutId="events-view-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 border border-cyan-500/40 dark:border-cyan-400/50 backdrop-blur-md pointer-events-none"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-[2rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)] p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-muted group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search events, venues, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-11 pr-10 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-muted/60 focus:outline-none focus:border-cyan-500/50 dark:focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/50 dark:focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🌍 All Cities</option>
                {cities.filter(c => c !== "all").map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    📍 {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Event Type Dropdown */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/50 dark:focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🎪 All Event Types</option>
                {eventTypes.filter(t => t !== "all").map(t => (
                  <option key={t} value={t} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    ✨ {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Quick Fandom Category Pills */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-muted shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Fandom:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 border select-none",
                  "hover:-translate-y-0.5 active:scale-95",
                  selectedCategory === cat
                    ? "bg-cyan-500/15 dark:bg-white/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 dark:border-cyan-400/50 shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "bg-slate-100/80 dark:bg-white/[0.03] text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-300 border-slate-200 dark:border-white/10"
                )}
              >
                {cat === "all" ? "All Fandoms" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Location-Aware Discovery Map Banner */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-cyan-500/25 bg-white/80 dark:bg-slate-950/75 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-25 dark:opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-12 md:p-14 text-center max-w-2xl mx-auto space-y-6">
            {/* Glowing Map Pin Icon */}
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(6,182,212,0.35)] group-hover:scale-110 transition-all duration-300">
              <Navigation className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Location-Aware Multiverse Map
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Discover nearby cosplay meetups, movie premieres, and fan expos nearest to your current coordinates with live interactive GPS discovery.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button 
                onClick={() => setSelectedCity("Tokyo")}
                className="h-10 px-6 rounded-full font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" /> Discover In Tokyo
              </button>
              <button 
                onClick={() => { setSelectedCity("all"); setSelectedType("all"); setSelectedCategory("all"); }}
                className="h-10 px-6 rounded-full font-bold uppercase tracking-wider text-xs border border-cyan-500/30 dark:border-cyan-400/40 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" /> Explore Worldwide
              </button>
            </div>
          </div>

          {/* Floating animated radar pins */}
          <div className="hidden sm:block absolute top-6 left-10 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-cyan-500/40 text-cyan-600 dark:text-cyan-300 font-black text-[10px] uppercase tracking-wider shadow-lg dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse">
            📍 AX'26 LA
          </div>
          <div className="hidden sm:block absolute bottom-8 right-12 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-sky-500/40 text-sky-600 dark:text-sky-300 font-black text-[10px] uppercase tracking-wider shadow-lg dark:shadow-[0_0_15px_rgba(14,165,233,0.3)] animate-bounce delay-500">
            🎤 K-POP DOME SEOUL
          </div>
        </div>

        {/* Event Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Upcoming Events ({filteredEvents.length})
            </h2>
          </div>
          {(selectedCity !== "all" || selectedType !== "all" || selectedCategory !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("all");
                setSelectedType("all");
                setSelectedCategory("all");
              }}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Event Results Grid / List */}
        {filteredEvents.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredEvents.map((evt) => (
              <motion.div
                layout
                key={evt.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={cn(
                  "rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-400/50 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between",
                  viewMode === "list" && "md:flex-row md:items-center p-6 sm:p-8 gap-8"
                )}
              >
                {/* Ambient hover top glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />

                {/* Event Image Banner (for Grid view) */}
                {viewMode === "grid" && evt.image && (
                  <div className="relative h-48 w-full overflow-hidden border-b border-slate-200 dark:border-white/10">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
                        {evt.type}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-sky-300 text-[10px] font-black uppercase tracking-wider border border-sky-500/30">
                        {evt.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className={cn("p-6 sm:p-7 flex-1 flex flex-col justify-between", viewMode === "list" && "p-0")}>
                  <div>
                    <div className="flex items-start gap-4 mb-5">
                      {/* Date Badge with Year */}
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/25 flex flex-col items-center justify-center text-cyan-600 dark:text-cyan-300 flex-shrink-0 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider leading-none">
                          {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black leading-none my-0.5">
                          {new Date(evt.date).getDate()}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 leading-none">
                          {new Date(evt.date).getFullYear()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        {viewMode === "list" && (
                          <div className="flex gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-[9.5px] font-black uppercase tracking-wider border border-cyan-500/25">
                              {evt.type}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 text-[9.5px] font-black uppercase tracking-wider border border-sky-500/25">
                              {evt.category}
                            </span>
                          </div>
                        )}
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors tracking-tight line-clamp-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          {evt.venue}, {evt.city}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 mt-auto">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-muted text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{evt.time || "10:00 AM"}</span>
                      </div>
                      {evt.price && (
                        <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                          {evt.price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setBookedEvent(evt)}
                      className="h-8.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5" /> Get Passes
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl p-8 max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-sm">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">No Events Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                No multiverse gatherings match your current search query or filter selection.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("all");
                setSelectedType("all");
                setSelectedCategory("all");
              }}
              className="h-9 px-6 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-500/30 dark:border-cyan-400/40 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Ticket Pass Confirmation Modal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {bookedEvent && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setBookedEvent(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-7 backdrop-blur-2xl text-center space-y-6 z-10 my-auto"
              >
                <button
                  onClick={() => setBookedEvent(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-16 h-16 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(6,182,212,0.35)]">
                  <Ticket className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                    {bookedEvent.category} · {bookedEvent.type}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {bookedEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    📍 {bookedEvent.venue}, {bookedEvent.city}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-muted font-semibold">Pass Type:</span>
                    <span className="font-bold text-slate-900 dark:text-white">VIP All-Access Pass</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-muted font-semibold">Date & Time:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{bookedEvent.date} ({bookedEvent.time || "10:00 AM"})</span>
                  </div>
                  {bookedEvent.price && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-muted font-semibold">Pass Price:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{bookedEvent.price}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-muted font-semibold">Status:</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passes Available (Upcoming)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setBookedEvent(null)}
                    className="flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-white/15 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      alert(`Pass reserved for ${bookedEvent.title}! Check your dashboard email for verification.`);
                      setBookedEvent(null);
                    }}
                    className="flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
                  >
                    Confirm Pass
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
