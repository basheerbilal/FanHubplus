import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, Users, Clock, Calendar, Bookmark, Share2, 
  Play, Info, ChevronRight, MessageSquare, Heart, X,
  Layers, Tv, Film, Sparkles, CheckCircle2, ListVideo
} from "lucide-react";
import { useAnimeDetail } from "../hooks/useAnime";
import { useAnimeNewsById } from "../hooks/useAnimeNews";
import { useAnimeEpisodes } from "../hooks/useAnimeEpisodes";
import { AnimeNewsCard } from "../components/anime/AnimeNewsCard";
import { AnimeCard } from "../components/anime/AnimeCard";
import { TrailerModal } from "../components/anime/TrailerModal";
import { CommunityDiscussion } from "../components/anime/CommunityDiscussion";
import { useAppContext } from "../context/AppContext";
import { cn } from "../utils";
import { motion } from "motion/react";
import { PageLoader } from "../components/common/PageLoader";

export default function AnimeDetail() {
  const { id } = useParams();
  const { data: anime, loading, error } = useAnimeDetail(id);
  const { data: news } = useAnimeNewsById(anime?.idMal || 0);
  const { episodes: episodeList, loading: loadingEpisodes } = useAnimeEpisodes(anime?.idMal, anime?.episodes);
  const { watchlist, toggleWatchlist, addActivity } = useAppContext();
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedEpisodeTitle, setSelectedEpisodeTitle] = useState<string | null>(null);
  const [currentPlayingEp, setCurrentPlayingEp] = useState<number | undefined>(undefined);
  const [episodeSearch, setEpisodeSearch] = useState("");
  const discussionRef = useRef<HTMLElement>(null);
  
  if (loading) {
    return <PageLoader fullScreen message="Loading Anime Lore & Details..." />;
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-main mb-4">Universe Expansion Failed</h2>
        <p className="text-muted mb-8 max-w-md">We couldn't reach the AniList constellation. Please check your connection or try again later.</p>
        <Link to="/" className="px-8 py-4 bg-brand-purple text-white font-black rounded-2xl hover:bg-brand-purple/80 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const isWatchlisted = watchlist.includes(`anime-${anime.id}`);
  const title = anime.title.english || anime.title.romaji || anime.title.native;

  const handleWatchNow = () => {
    setShowTrailer(true);
  };

  const handleToggleWatchlist = () => {
    const itemId = `anime-${anime.id}`;
    toggleWatchlist(itemId);
    
    if (!isWatchlisted) {
      addActivity({
        type: "watchlist",
        contentId: itemId,
        contentTitle: title
      });
    }
  };

  const scrollToDiscussion = () => {
    discussionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-bg-main text-main">
      <TrailerModal 
        isOpen={showTrailer} 
        onClose={() => {
          setShowTrailer(false);
          setSelectedEpisodeTitle(null);
          setCurrentPlayingEp(undefined);
        }} 
        trailerId={anime.trailer?.site === "youtube" ? anime.trailer?.id : undefined} 
        trailerUrl={(anime as any).trailerUrl || (anime as any).videoUrl || (anime.trailer as any)?.url || (anime.trailer?.id ? `https://www.youtube.com/watch?v=${anime.trailer.id}` : undefined)} 
        title={selectedEpisodeTitle ? `${title} • ${selectedEpisodeTitle}` : title} 
        animeId={anime.id}
        idMal={anime.idMal}
        episodeNumber={currentPlayingEp}
        totalEpisodes={anime.episodes || episodeList.length}
        onEpisodeChange={(newEp) => {
          setCurrentPlayingEp(newEp);
          const found = episodeList.find(e => e.mal_id === newEp);
          setSelectedEpisodeTitle(`Episode ${newEp}: ${found ? found.title : `Episode ${newEp}`}`);
        }}
        coverImage={anime.bannerImage || anime.coverImage.extraLarge}
      />

      {/* Hero Banner */}
      <div className="relative h-48 sm:h-64 md:h-[45vh] lg:h-[55vh] w-full overflow-hidden">
        <img 
          src={anime.bannerImage || anime.coverImage.extraLarge} 
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/60 to-black/30" />
        
        {/* Floating Actions */}
        <div className="absolute top-20 sm:top-24 right-4 sm:right-8 flex items-center gap-2 sm:gap-3 z-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleWatchlist}
            className={cn(
              "p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-md border transition-all shadow-md",
              isWatchlisted 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-cyan-500/30" 
                : "bg-black/40 border-white/10 text-zinc-300 hover:text-white"
            )}
            title={isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
          >
            <Bookmark className={cn("w-4 h-4 sm:w-5 sm:h-5", isWatchlisted && "fill-current")} />
          </motion.button>
          <button 
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/10 bg-black/40 text-zinc-300 hover:text-white transition-all shadow-md active:scale-95"
            title="Copy Link"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Content Header */}
      <div className="container mx-auto px-4 sm:px-6 -mt-20 sm:-mt-28 md:-mt-36 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
          
          {/* Left Column: Poster + Actions (Mobile & Desktop) */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col items-center lg:items-start">
            
            {/* Mobile Header: Side by side on small screens */}
            <div className="w-full flex flex-row lg:flex-col items-start gap-4 sm:gap-6">
              
              {/* Poster Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-32 sm:w-44 md:w-52 lg:w-full aspect-[2/3] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-bg-main shadow-xl dark:shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-slate-900"
              >
                <img src={anime.coverImage.extraLarge} alt={title} className="w-full h-full object-cover" />
              </motion.div>

              {/* Mobile Info Column (visible on small screens alongside poster) */}
              <div className="flex-1 min-w-0 lg:hidden flex flex-col justify-end pt-2">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    {anime.format || "TV"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 text-[9px] font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10">
                    {anime.status || "AIRING"}
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-2 mb-1">
                  {title}
                </h1>
                <p className="text-xs text-muted truncate mb-3">{anime.title.native || anime.title.romaji}</p>

                {/* Score & Popularity Inline */}
                <div className="flex items-center gap-2">
                  {anime.averageScore ? (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-black">
                      <Star className="w-3 h-3 fill-current text-amber-400" />
                      <span>{anime.averageScore}%</span>
                    </div>
                  ) : null}
                  <div className="text-[10px] text-muted font-bold">
                    {anime.season} {anime.seasonYear}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="w-full mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <button 
                onClick={handleWatchNow}
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/25 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Now / Trailer
              </button>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleWatchlist}
                  className={cn(
                    "w-full h-11 sm:h-12 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 transition-all border",
                    isWatchlisted 
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-400 shadow-sm" 
                      : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10"
                  )}
                >
                  {isWatchlisted ? <Heart className="w-4 h-4 fill-current text-cyan-500" /> : <Bookmark className="w-4 h-4" />}
                  <span>{isWatchlisted ? "Watchlisted" : "Save List"}</span>
                </motion.button>

                <button 
                  onClick={scrollToDiscussion}
                  className="w-full h-11 sm:h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discussion</span>
                </button>
              </div>
            </div>

            {/* Quick Stats (Desktop) */}
            <div className="w-full mt-4 hidden lg:grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <div className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Rating</div>
                <div className="text-base font-black text-cyan-500">{anime.averageScore || "85"}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <div className="text-[9px] font-black text-muted uppercase tracking-widest mb-0.5">Popularity</div>
                <div className="text-base font-black text-pink-500">{anime.popularity?.toLocaleString() || "10K+"}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Synopsis, Genres, Meta */}
          <div className="flex-1 lg:pt-28 min-w-0">
            {/* Desktop Title & Badges */}
            <div className="hidden lg:block">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {anime.format || "TV"}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10">
                  {anime.status || "AIRING"}
                </span>
                <div className="flex items-center gap-1.5 text-muted text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  {anime.season} {anime.seasonYear}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2 leading-tight break-words">
                {title}
              </h1>
              {anime.title.native && (
                <div className="text-base text-muted font-bold mb-4">{anime.title.native}</div>
              )}
            </div>

            {/* Genres Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
              {anime.genres.map(genre => (
                <span 
                  key={genre} 
                  className="px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="prose prose-invert max-w-none mb-8">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted mb-2">Synopsis & Storyline</h3>
              <p 
                className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-300 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: anime.description || "No synopsis available for this anime." }} 
              />
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-4 sm:py-6 border-y border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl px-4">
              <div>
                <div className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Episodes</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{anime.episodes ? `${anime.episodes} Eps` : "Ongoing"}</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Duration</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{anime.duration ? `${anime.duration} mins` : "24 mins"}</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Studio</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{anime.studios?.nodes?.[0]?.name || "Originals"}</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Source</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Manga / Webtoon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Characters Section */}
        {anime.characters?.nodes && anime.characters.nodes.length > 0 && (
          <section className="py-10 sm:py-16 md:py-20 border-t border-slate-200 dark:border-white/10 mt-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Main Characters</h2>
              <Link to="/characters" className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              {anime.characters.nodes.slice(0, 6).map((char: any) => (
                <div key={char.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-2 shadow-sm">
                    <img src={char.image.large} alt={char.name.full} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">{char.name.full}</h4>
                  <p className="text-[9px] font-bold text-muted uppercase tracking-wider">{char.role || "Main"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Discussion Section */}
        <section ref={discussionRef} id="discussion" className="py-10 sm:py-16 border-t border-slate-200 dark:border-white/10">
          <CommunityDiscussion animeId={anime.id} animeTitle={title} isOpenDefault={false} />
        </section>

        {/* Anime News Section */}
        {news && news.length > 0 && (
          <section className="py-10 sm:py-16 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Related News</h2>
              <Link to="/anime-news" className="flex items-center gap-1.5 text-pink-500 font-bold text-xs">
                More News <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {news.slice(0, 3).map(article => (
                <AnimeNewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Seasons & Series Universe Section */}
        {((anime.relations?.edges && anime.relations.edges.length > 0) || (anime.relations?.nodes && anime.relations.nodes.length > 0)) && (
          <section className="py-10 sm:py-16 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    All Seasons & Connected Series
                  </h2>
                  <p className="text-xs text-muted font-medium mt-0.5">Explore full franchise chronology: Prequels, Sequels, OVAs & Movies</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
              {(anime.relations.edges || anime.relations.nodes.map((n: any) => ({ relationType: n.relationType || "CONNECTED", node: n }))).map((rel: any, idx: number) => {
                const node = rel.node || rel;
                const relType = rel.relationType || node.relationType || "CONNECTED";
                const badgeLabel = 
                  relType === "SEQUEL" ? "Sequel / Next Season" :
                  relType === "PREQUEL" ? "Prequel / Prev Season" :
                  relType === "SIDE_STORY" ? "Side Story / Special" :
                  relType === "ALTERNATIVE" ? "Alternative / Movie" :
                  relType === "PARENT" ? "Main Series" :
                  relType.replace(/_/g, " ");

                const badgeColor = 
                  relType === "SEQUEL" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                  relType === "PREQUEL" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                  relType === "SIDE_STORY" ? "bg-purple-500/20 text-purple-400 border-purple-500/40" :
                  "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";

                return (
                  <Link 
                    key={node.id || idx}
                    to={`/anime/${node.id}`}
                    className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900/40">
                      <img 
                        src={node.coverImage?.large} 
                        alt={node.title?.english || node.title?.romaji} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border backdrop-blur-md", badgeColor)}>
                          {badgeLabel}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-0.5">
                          {node.format || "TV"} {node.episodes ? `• ${node.episodes} Eps` : ""}
                        </p>
                        <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight group-hover:text-cyan-300 transition-colors">
                          {node.title?.english || node.title?.romaji}
                        </h4>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Episodes Guide Section */}
        <section className="py-10 sm:py-16 border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-500">
                <ListVideo className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Episodes Guide
                  {episodeList.length > 0 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold">
                      {episodeList.length} Total
                    </span>
                  )}
                </h2>
                <p className="text-xs text-muted font-medium mt-0.5">Browse and watch individual episodes with full titles and release info</p>
              </div>
            </div>

            {episodeList.length > 6 && (
              <div className="w-full sm:w-64">
                <input 
                  type="text"
                  placeholder="Search episode by name or #..."
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder:text-muted focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            )}
          </div>

          {loadingEpisodes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/10" />
              ))}
            </div>
          ) : episodeList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center">
              <Tv className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Episodes Releasing Soon</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">This anime is currently airing or episode streaming schedule is synchronizing with MyAnimeList & AniList.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {episodeList
                .filter(ep => {
                  if (!episodeSearch.trim()) return true;
                  const query = episodeSearch.toLowerCase();
                  return (
                    ep.title.toLowerCase().includes(query) ||
                    String(ep.mal_id).includes(query)
                  );
                })
                .slice(0, 100)
                .map((ep) => (
                  <div 
                    key={ep.mal_id}
                    onClick={() => {
                      setCurrentPlayingEp(ep.mal_id);
                      setSelectedEpisodeTitle(`Episode ${ep.mal_id}: ${ep.title}`);
                      setShowTrailer(true);
                    }}
                    className="group relative p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-300">
                        <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 group-hover:text-white">
                          #{ep.mal_id}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-500 transition-colors">
                          {ep.title || `Episode ${ep.mal_id}`}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {ep.aired && (
                            <span className="text-[10px] text-muted font-medium">
                              {new Date(ep.aired).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                          {ep.filler && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase">
                              Filler
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-cyan-500 text-slate-700 dark:text-white group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
                      title="Play Episode"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
