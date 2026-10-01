import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Clock, User as UserIcon, Share2, Bookmark, Play, Heart, MessageSquare, ArrowLeft, Sparkles, Check, CheckCircle2, Film } from "lucide-react";
import { PageLoader } from "../components/common/PageLoader";
import { Button } from "../components/common/Button";
import { useAppContext } from "../context/AppContext";
import { TrailerModal } from "../components/anime/TrailerModal";
import { cn } from "../utils";
import { motion, AnimatePresence } from "motion/react";
import { fetchTMDBDetail, fetchRAWGDetail } from "../services/external";
import { getExploreItems, getMerchItems, syncExploreFromBackend } from "../utils/contentStore";
import { FALLBACK_TRENDING_ANIME } from "../services/anilist";
import { api } from "../services/api";

const SPOTLIGHT_DATABASE: Record<string, any> = {
  "1": {
    id: "1",
    title: "Cyberpunk: Edgerunners",
    description: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid named David strives to become a mercenary outlaw — an edgerunner — after losing everything in a drive-by shooting in Night City.",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/130591-JZ3bsMomOj8y.jpg",
    category: "Gaming & Anime",
    rating: 4.9,
    year: 2024,
    type: "video",
    genre: ["Cyberpunk", "Action", "Sci-Fi", "Studio Trigger"],
    popularity: 98,
    author: "Studio Trigger / CD PROJEKT RED",
    duration: "10 Episodes (24 min each)",
    trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg"
  },
  "2": {
    id: "2",
    title: "Demon Slayer: Infinity Castle",
    description: "The ultimate battle begins inside the shifting halls of Infinity Castle. Tanjiro and the Demon Slayer Corps infiltrate Muzan Kibutsuji's shifting labyrinth for the final showdown against the Upper Rank demons.",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-33MtJGsUSxga.jpg",
    category: "Anime",
    rating: 5.0,
    year: 2024,
    type: "video",
    genre: ["Supernatural", "Action", "Historical", "ufotable"],
    popularity: 99,
    author: "ufotable / Koyoharu Gotouge",
    duration: "Film Trilogy (140 min)",
    trailerUrl: "https://www.youtube.com/embed/Q4XN3y7Uu3I"
  },
  "3": {
    id: "3",
    title: "Spider-Man: Beyond the Spider-Verse",
    description: "Miles Morales journeys across dimensions to challenge fate and save his universe alongside Gwen Stacy and the Spider-Society, defying the canon to protect those he loves most.",
    image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=2400",
    category: "Cinema & Comics",
    rating: 4.8,
    year: 2025,
    type: "video",
    genre: ["Animation", "Superhero", "Multiverse", "Sony Pictures"],
    popularity: 97,
    author: "Sony Pictures Animation / Marvel",
    duration: "Feature Film (145 min)",
    trailerUrl: "https://www.youtube.com/embed/cqGjhVJWtEg"
  },
  "4": {
    id: "4",
    title: "Arcane: Piltover & Zaun",
    description: "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions — Jinx and Vi — and the power that will tear them apart in an explosive conflict.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2400",
    category: "TV Shows & Gaming",
    rating: 4.9,
    year: 2024,
    type: "video",
    genre: ["Steampunk", "Action", "Drama", "Riot Games & Fortiche"],
    popularity: 99,
    author: "Riot Games / Fortiche Production",
    duration: "Season 2 (9 Episodes)",
    trailerUrl: "https://www.youtube.com/embed/fXmAurh012s"
  },
  "5": {
    id: "5",
    title: "Solo Leveling: Shadow Monarch",
    description: "From the world's weakest hunter to the supreme ruler of the shadow army. Sung Jinwoo overcomes deadly double dungeons and levels up beyond human limits to protect humanity from the Monarchs.",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg",
    category: "Anime & Webtoon",
    rating: 4.9,
    year: 2024,
    type: "video",
    genre: ["Action", "Fantasy", "Dungeons", "A-1 Pictures"],
    popularity: 98,
    author: "A-1 Pictures / Chugong",
    duration: "Season 2 (12 Episodes)",
    trailerUrl: "https://www.youtube.com/embed/9g_8r_r7-80"
  },
  "6": {
    id: "6",
    title: "Global K-Pop: Stadium Era",
    description: "Sold-out stadium stages and visual spectacles redefining global pop music with electrifying choreographies, innovative stagecraft, and worldwide fan engagements.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2400",
    category: "K-Pop & Music",
    rating: 4.9,
    year: 2024,
    type: "video",
    genre: ["K-Pop", "Performance", "Music", "Live Documentary"],
    popularity: 96,
    author: "HYBE / SM Entertainment / JYP",
    duration: "Live Showcase (115 min)",
    trailerUrl: "https://www.youtube.com/embed/gdZLi9oWNZg"
  }
};

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist, ratings, rateContent, addActivity } = useAppContext();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isWatchlisted = watchlist.includes(id || "");
  const userRating = ratings.find(r => r.contentId === id)?.score || 0;

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // 1. Check Spotlight ID (e.g. "1", "2", "3", "4", "5", "6" or "spotlight-1")
        const cleanSpotlightId = id.replace("spotlight-", "");
        if (SPOTLIGHT_DATABASE[cleanSpotlightId]) {
          setItem(SPOTLIGHT_DATABASE[cleanSpotlightId]);
          return;
        }

        // 2. Check Explore Items from Content Store (e.g. "exp-1", "exp-2", etc.)
        let exploreItems = getExploreItems();
        let foundExplore = exploreItems.find(e => e.id === id || e.id.toLowerCase() === id.toLowerCase() || e.title.toLowerCase() === id.toLowerCase());
        
        if (!foundExplore) {
          exploreItems = await syncExploreFromBackend();
          foundExplore = exploreItems.find(e => e.id === id || e.id.toLowerCase() === id.toLowerCase() || e.title.toLowerCase() === id.toLowerCase());
        }

        // Check if item is a fan submission (e.g. "sub-1", "submission-1", etc.)
        if (id.startsWith("sub-") || id.startsWith("submission-")) {
          try {
            const subRes = await api.getSubmissions();
            const rawSubId = id.replace("submission-", "sub-");
            const foundSub = subRes?.submissions?.find((s: any) => s.id === id || s.id === rawSubId || `sub-${s.id}` === id || `submission-${s.id}` === id);
            if (foundSub) {
              setItem({
                id: foundSub.id,
                title: foundSub.title,
                description: foundSub.description,
                image: foundSub.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1200",
                category: foundSub.category || "Community Lore",
                rating: 5.0,
                year: new Date(foundSub.timestamp || Date.now()).getFullYear(),
                type: foundSub.type || "Fan Submission",
                genre: [foundSub.category || "General", foundSub.type || "Article", "Fan Creation", "Community Verified"],
                popularity: 99,
                author: foundSub.authorEmail ? `Fan Contributor (${foundSub.authorEmail.split("@")[0]})` : "Verified Fan Contributor",
                url: foundSub.sourceUrl || "",
                trailerUrl: foundSub.sourceUrl?.includes("youtu") || foundSub.sourceUrl?.startsWith("/uploads/") ? foundSub.sourceUrl : "",
                duration: foundSub.type ? `${foundSub.type} • Community Verified` : "Verified Community Publication",
                isCommunity: true,
              });
              return;
            }
          } catch (e) {
            console.warn("Error fetching submission details:", e);
          }
        }

        if (foundExplore) {
          const videoUrl = foundExplore.trailerUrl || (foundExplore.url?.includes("youtu") ? foundExplore.url : "");
          setItem({
            id: foundExplore.id,
            title: foundExplore.title,
            description: foundExplore.description,
            image: foundExplore.image,
            category: foundExplore.category,
            rating: foundExplore.rating || 9.0,
            year: foundExplore.year || new Date().getFullYear(),
            type: foundExplore.submissionType || "Lore & Story",
            genre: [foundExplore.category, foundExplore.isCommunity ? "Fan Creation" : "Multiverse Hub", "Featured Showcase"],
            popularity: Math.round((foundExplore.rating || 8.5) * 10),
            author: foundExplore.authorEmail ? `Fan Contributor (${foundExplore.authorEmail.split("@")[0]})` : undefined,
            duration: foundExplore.isCommunity ? "Community Verified Submission" : undefined,
            url: foundExplore.url,
            trailerUrl: videoUrl || foundExplore.url,
            isCommunity: foundExplore.isCommunity,
          });
          return;
        }

        // 3. Check TMDB items (e.g. "tmdb-533535")
        if (id.startsWith("tmdb-")) {
          const rawId = id.replace("tmdb-", "");
          const data = await fetchTMDBDetail(rawId);
          if (data) {
            setItem({
              id,
              title: data.title || data.name,
              description: data.overview || "An exciting cinematic universe experience from TMDB.",
              image: data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
              category: data.genres?.[0]?.name || "Movies",
              rating: Number(data.vote_average?.toFixed(1)) || 8.0,
              year: new Date(data.release_date || data.first_air_date || Date.now()).getFullYear(),
              type: "video",
              genre: data.genres?.map((g: any) => g.name) || ["Cinema", "Action"],
              popularity: Math.round(data.popularity / 10) || 85,
              duration: data.runtime ? `${data.runtime} min` : undefined
            });
            return;
          }
        }

        // 4. Check RAWG items (e.g. "rawg-3498")
        if (id.startsWith("rawg-")) {
          const rawId = id.replace("rawg-", "");
          const data = await fetchRAWGDetail(rawId);
          if (data) {
            setItem({
              id,
              title: data.name,
              description: data.description_raw || data.description || "A critically acclaimed gaming universe experience with worldwide acclaim.",
              image: data.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
              category: "Gaming",
              rating: Number(data.rating?.toFixed(1)) || 4.8,
              year: new Date(data.released || Date.now()).getFullYear(),
              type: "video",
              genre: data.genres?.map((g: any) => g.name) || ["Gaming", "Adventure"],
              popularity: Math.round(data.rating * 20) || 90,
              author: data.developers?.[0]?.name
            });
            return;
          }
        }

        // 5. Check AniList Anime detail by numeric ID (e.g. "151807")
        const numId = Number(id);
        if (!isNaN(numId) && numId > 0) {
          const fallbackAnime = FALLBACK_TRENDING_ANIME.find(a => String(a.id) === id);
          if (fallbackAnime) {
            setItem({
              id: String(fallbackAnime.id),
              title: fallbackAnime.title.english || fallbackAnime.title.romaji,
              description: "Experience this iconic anime universe on Fan Hub Plus. Stream high-definition episodes, participate in community ratings, and follow weekly episode drops.",
              image: fallbackAnime.bannerImage || fallbackAnime.coverImage.extraLarge,
              category: "Anime",
              rating: Number(((fallbackAnime.averageScore || 85) / 10).toFixed(1)),
              year: fallbackAnime.seasonYear || 2024,
              type: "video",
              genre: fallbackAnime.genres,
              popularity: Math.min(100, Math.round(fallbackAnime.averageScore || 85)),
              duration: fallbackAnime.episodes ? `${fallbackAnime.episodes} Episodes` : undefined
            });
            return;
          }
        }

        // 6. Check Merchandise Store
        const merchItems = getMerchItems();
        const foundMerch = merchItems.find(m => m.id === id);
        if (foundMerch) {
          setItem({
            id: foundMerch.id,
            title: foundMerch.title,
            description: foundMerch.description,
            image: foundMerch.image,
            category: foundMerch.category,
            rating: 5.0,
            year: 2026,
            type: "collectible",
            genre: [foundMerch.fandom, foundMerch.category, ...foundMerch.tags],
            popularity: 99,
            duration: `Collector Item • ${foundMerch.price}`
          });
          return;
        }

        // 7. General Fallback with Default Content
        setItem({
          id,
          title: `Fandom Showcase: ${id.replace(/[-_]/g, ' ').toUpperCase()}`,
          description: "Curated fandom universe entry on Fan Hub Plus. Explore high-resolution media, interactive fan rankings, and detailed storyline lore.",
          image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=2400",
          category: "Fandom Universe",
          rating: 4.9,
          year: 2024,
          type: "video",
          genre: ["Discovery", "Fandom", "Showcase"],
          popularity: 95,
          trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        });

      } catch (err) {
        console.error("Detail load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  useEffect(() => {
    if (item) {
      addActivity({ type: "view", contentId: item.id, contentTitle: item.title });
    }
  }, [item?.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <PageLoader fullScreen message="Loading Multiverse Details..." />;
  }

  if (!item) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-bg-main px-4">
        <div className="text-center p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/25 backdrop-blur-2xl shadow-xl max-w-md">
          <h2 className="text-3xl font-black mb-3 text-slate-900 dark:text-white">Content not found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">The requested universe item was not found in our database.</p>
          <Button onClick={() => navigate("/explore")}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hero Banner */}
      <div className="relative h-56 sm:h-[50vh] md:h-[65vh] lg:h-[75vh] w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/60 to-black/40" />
        
        {/* Top Back Nav */}
        <div className="absolute top-20 sm:top-28 left-0 right-0 z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all group active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" />
              Back
            </button>
          </div>
        </div>

        {/* Hero Title & Actions Overlay */}
        <div className="absolute bottom-4 sm:bottom-10 left-0 right-0">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-2 sm:space-y-4"
            >
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                {item.isCommunity && (
                  <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                    Fan Creation
                  </span>
                )}
                <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-600 dark:text-cyan-300 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
                  {item.category}
                </span>
                <div className="flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 backdrop-blur-md">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[11px] sm:text-xs font-black">{item.rating}</span>
                </div>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/40 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-bold backdrop-blur-md">
                  {item.year}
                </span>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/40 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-bold capitalize backdrop-blur-md">
                  {item.type}
                </span>
              </div>
              
              <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words max-w-full drop-shadow-md">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                <Button 
                  size="md" 
                  onClick={() => setShowTrailer(true)}
                  className="gap-2 h-10 sm:h-12 px-5 sm:px-8 text-xs sm:text-sm font-black shadow-md shadow-cyan-500/25"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {item.trailerUrl ? "Watch Trailer / Stream" : "Explore Universe"}
                </Button>
                
                <button 
                  type="button"
                  className={cn(
                    "h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all border shadow-sm active:scale-95",
                    isWatchlisted 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400 text-white shadow-cyan-500/30" 
                      : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-white/15 text-slate-700 dark:text-white hover:text-cyan-400 hover:border-cyan-500/50"
                  )}
                  onClick={() => {
                    toggleWatchlist(item.id);
                    if (!isWatchlisted) addActivity({ type: "watchlist", contentId: item.id, contentTitle: item.title });
                  }}
                  title={isWatchlisted ? "Saved in Watchlist" : "Save to Watchlist"}
                >
                  <Bookmark className={cn("w-4 h-4 sm:w-5 sm:h-5", isWatchlisted && "fill-current")} />
                </button>

                <button 
                  type="button"
                  onClick={handleShare}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white hover:text-cyan-400 hover:border-cyan-500/50 flex items-center justify-center transition-all active:scale-95 shadow-sm relative"
                  title="Share Link"
                >
                  {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {copied && (
                    <span className="absolute -top-8 px-2 py-0.5 rounded bg-slate-950 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* Synopsis Card */}
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full shadow-sm shadow-cyan-500/40" />
                Storyline & Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            {/* Genres & Tags */}
            {item.genre && item.genre.length > 0 && (
              <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4">
                <h3 className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                  Fandom Categorization & Genres
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {item.genre.map((g: string) => (
                    <span 
                      key={g} 
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-zinc-200 hover:border-cyan-500/40 transition-colors"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Rating */}
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Community Rating</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Leave your live rating for this universe entry.</p>
              
              <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      rateContent(item.id, star);
                      addActivity({ type: "rate", contentId: item.id, contentTitle: item.title });
                    }}
                    className="group p-1 active:scale-95 transition-transform"
                    title={`Rate ${star} Stars`}
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 transition-all",
                        (userRating >= star) 
                          ? "text-amber-400 fill-current scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
                          : "text-slate-300 dark:text-zinc-700 hover:text-amber-400/60"
                      )} 
                    />
                  </button>
                ))}
                <span className="text-2xl font-black text-slate-900 dark:text-white ml-2">
                  {userRating ? `${userRating} / 5 Stars` : "Tap to rate"}
                </span>
              </div>
              
              <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-slate-400">
                <button 
                  onClick={() => toggleWatchlist(item.id)}
                  className="flex items-center gap-2 hover:text-cyan-500 transition-colors"
                >
                  <Heart className={cn("w-4 h-4", isWatchlisted && "text-red-500 fill-current")} />
                  <span>{isWatchlisted ? "Favorited" : "Add to favorites"}</span>
                </button>
                <Link to="/feedback" className="flex items-center gap-2 hover:text-cyan-500 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Send community feedback</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Specs */}
          <div className="space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Entry Specifications</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Release Year</span>
                  <span className="text-slate-900 dark:text-white font-black">{item.year}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Popularity Score</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-black">{item.popularity}% Match</span>
                </div>
                {item.author && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Studio / Creator</span>
                    <span className="text-slate-900 dark:text-white font-black text-right truncate max-w-[150px]">{item.author}</span>
                  </div>
                )}
                {item.duration && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Format & Duration</span>
                    <span className="text-slate-900 dark:text-white font-black">{item.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Fandom Live Badge Card */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-600/10 border border-cyan-500/30 backdrop-blur-2xl text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/30">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">Fan Hub Plus Spotlight</h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Connect with fans, participate in weekly voting polls, and explore related collectibles.
              </p>
              <Link to="/explore" className="block">
                <Button variant="outline" className="w-full text-xs font-black uppercase tracking-wider h-11 border-cyan-500/30 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/15">
                  Browse More Universes
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && item.trailerUrl && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          trailerUrl={item.trailerUrl}
          title={item.title}
        />
      )}
    </div>
  );
}
