import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, Sparkles, Loader2, User, Flame, ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { cn } from "../utils";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { Button } from "../components/common/Button";

interface Character {
  id: string | number;
  name: { full: string };
  image: { large: string };
  description: string;
  fandom: string;
  favourites: number;
  role?: string;
}

const FALLBACK_EXPANDED_CHARACTERS: Character[] = [
  {
    id: "151807",
    name: { full: "Sung Jinwoo" },
    image: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png" },
    description: "The Shadow Monarch and humanity's ultimate hunter who rose from the weakest E-Rank to conquer Monarchs.",
    fandom: "Anime",
    favourites: 148500,
    role: "Shadow Monarch"
  },
  {
    id: "101922",
    name: { full: "Tanjiro Kamado" },
    image: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg" },
    description: "Sun Breathing swordsman of the Demon Slayer Corps on an unrelenting quest to cure his sister Nezuko.",
    fandom: "Anime",
    favourites: 124200,
    role: "Demon Slayer"
  },
  {
    id: "113415",
    name: { full: "Satoru Gojo" },
    image: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pUbHg8.jpg" },
    description: "The strongest Special Grade Jujutsu Sorcerer, wielder of the Limitless, Infinity, and the Six Eyes.",
    fandom: "Anime",
    favourites: 198000,
    role: "Special Grade Sorcerer"
  },
  {
    id: "arcane-jinx",
    name: { full: "Jinx (Powder)" },
    image: { large: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg" },
    description: "The chaotic genius marksman from Zaun with iconic blue braids, custom ordnance, and tragic backstory.",
    fandom: "Gaming",
    favourites: 165000,
    role: "The Loose Cannon"
  },
  {
    id: "spider-miles",
    name: { full: "Miles Morales" },
    image: { large: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" },
    description: "Brooklyn's Spider-Man wielding bio-electric venom strikes and dimension-hopping courage across universes.",
    fandom: "Comics",
    favourites: 142000,
    role: "Spider-Man"
  },
  {
    id: "david-martinez",
    name: { full: "David Martinez" },
    image: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx120377-hFjPz6i2g5aG.jpg" },
    description: "Night City mercenary outfitted with the military Sandevistan cyberware, blazing a legendary path.",
    fandom: "Anime",
    favourites: 98500,
    role: "Edgerunner"
  },
  {
    id: "45627",
    name: { full: "Levi Ackerman" },
    image: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg" },
    description: "Humanity's strongest soldier and captain of the Special Operations Squad in the Scout Regiment.",
    fandom: "Anime",
    favourites: 189000,
    role: "Scout Captain"
  },
  {
    id: "kratos-god-of-war",
    name: { full: "Kratos" },
    image: { large: "https://media.rawg.io/media/games/4be/4be6e4ad164223a6a341898d03b418f4.jpg" },
    description: "The Ghost of Sparta wielding the Leviathan Axe and Blades of Chaos across the Nine Realms.",
    fandom: "Gaming",
    favourites: 135000,
    role: "God of War"
  },
  {
    id: "geralt-witcher",
    name: { full: "Geralt of Rivia" },
    image: { large: "https://media.rawg.io/media/games/618/618c2031a070f46b5f69a04bfa3ba082.jpg" },
    description: "The White Wolf, mutated monster hunter of the School of the Wolf wielding silver and steel swords.",
    fandom: "Gaming",
    favourites: 128000,
    role: "Witcher"
  },
  {
    id: "batman-wayne",
    name: { full: "Bruce Wayne (Batman)" },
    image: { large: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    description: "Gotham's Dark Knight, master martial artist and world's greatest detective standing among gods.",
    fandom: "Comics",
    favourites: 175000,
    role: "The Dark Knight"
  },
  {
    id: "darth-vader",
    name: { full: "Darth Vader (Anakin)" },
    image: { large: "https://image.tmdb.org/t/p/w780/2pqCwG9e783PqV7a82pQ9k8E5z0.jpg" },
    description: "The Dark Lord of the Sith, former Chosen One who commands the dark side of the Force.",
    fandom: "Movies",
    favourites: 195000,
    role: "Sith Lord"
  },
  {
    id: "spider-gwen",
    name: { full: "Gwen Stacy (Ghost-Spider)" },
    image: { large: "https://image.tmdb.org/t/p/w780/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg" },
    description: "Earth-65's Spider-Woman, drummer of the Mary Janes with kinetic grace and multiversal rhythm.",
    fandom: "Comics",
    favourites: 112000,
    role: "Ghost-Spider"
  }
];

export default function Characters() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const { addActivity } = useAppContext();

  const categories = ["all", "Anime", "Gaming", "Movies", "TV Shows", "Comics"];

  const fetchCharactersForCategory = useCallback(async (targetPage: number, category: string): Promise<Character[]> => {
    let collected: Character[] = [];
    const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
    const rawgKey = import.meta.env.VITE_RAWG_API_KEY;

    // 1. Anime Data (AniList) - Fetch 24 per page
    if (category === "all" || category === "Anime") {
      try {
        const aniListQuery = `
          query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              pageInfo { hasNextPage }
              characters(sort: FAVOURITES_DESC) {
                id
                name { full }
                image { large }
                description
                favourites
              }
            }
          }
        `;
        const aniRes = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: aniListQuery, variables: { page: targetPage, perPage: category === "all" ? 18 : 24 } })
        });
        const aniData = await aniRes.json();
        if (aniData?.data?.Page?.characters) {
          const animeChars = aniData.data.Page.characters.map((c: any) => ({
            ...c,
            fandom: "Anime"
          }));
          collected = [...collected, ...animeChars];
        }
      } catch (err) {
        console.warn("AniList fetch error:", err);
      }
    }

    // 2. Movies & TV Shows (TMDB)
    if ((category === "all" || category === "Movies" || category === "TV Shows") && tmdbKey) {
      try {
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/trending/person/week?api_key=${tmdbKey}&page=${targetPage}`);
        const tmdbData = await tmdbRes.json();
        if (tmdbData?.results) {
          const tmdbChars: Character[] = tmdbData.results
            .filter((p: any) => p.profile_path && p.name)
            .map((p: any) => ({
              id: `tmdb-${p.id}`,
              name: { full: p.name },
              image: { large: `https://image.tmdb.org/t/p/w780${p.profile_path}` },
              description: `Renowned cinematic performer known for: ${p.known_for?.map((m: any) => m.title || m.name).join(", ") || "Global Cinema"}. Popularity match: ${Math.round(p.popularity)}%`,
              favourites: Math.round(p.popularity * 450),
              fandom: p.known_for_department === "Acting" ? "Movies" : "TV Shows",
              role: p.known_for?.[0]?.title || "Cinema Icon"
            }));
          collected = [...collected, ...tmdbChars];
        }
      } catch (err) {
        console.warn("TMDB fetch error:", err);
      }
    }

    // 3. Gaming (RAWG)
    if ((category === "all" || category === "Gaming") && rawgKey) {
      try {
        const rawgRes = await fetch(`https://api.rawg.io/api/games?key=${rawgKey}&page=${targetPage}&page_size=16&ordering=-rating`);
        const rawgData = await rawgRes.json();
        if (rawgData?.results) {
          const rawgChars: Character[] = rawgData.results
            .filter((g: any) => g.background_image)
            .map((g: any) => ({
              id: `rawg-${g.id}`,
              name: { full: g.name },
              image: { large: g.background_image },
              description: `Iconic franchise universe with ${g.rating}/5 rating and ${g.ratings_count?.toLocaleString()} community votes. Released: ${g.released || "2024"}.`,
              favourites: (g.ratings_count || 1200) * 10,
              fandom: "Gaming",
              role: g.genres?.[0]?.name || "Gaming Universe"
            }));
          collected = [...collected, ...rawgChars];
        }
      } catch (err) {
        console.warn("RAWG fetch error:", err);
      }
    }

    // 4. Comics & Fallback items for first page
    if (targetPage === 1 && (category === "all" || category === "Comics")) {
      const comicPicks = FALLBACK_EXPANDED_CHARACTERS.filter(c => category === "all" || c.fandom === category);
      collected = [...comicPicks, ...collected];
    }

    // Deduplicate by string ID
    const uniqueMap = new Map<string, Character>();
    collected.forEach(item => {
      const key = String(item.id);
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, []);

  // Initial Load & Category Change
  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      setLoading(true);
      setPage(1);
      const results = await fetchCharactersForCategory(1, activeCategory);
      if (isMounted) {
        if (results.length > 0) {
          setData(results);
          setHasMore(true);
        } else {
          setData(FALLBACK_EXPANDED_CHARACTERS);
        }
        setLoading(false);
      }
    };

    loadInitial();
    return () => { isMounted = false; };
  }, [activeCategory, fetchCharactersForCategory]);

  // Load More Pages
  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const newItems = await fetchCharactersForCategory(nextPage, activeCategory);
    
    if (newItems.length > 0) {
      setData(prev => {
        const map = new Map<string, Character>();
        prev.forEach(item => map.set(String(item.id), item));
        newItems.forEach(item => map.set(String(item.id), item));
        return Array.from(map.values());
      });
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const toggleLike = (char: Character) => {
    const charKey = String(char.id);
    const newStatus = !likedIds[charKey];
    setLikedIds(prev => ({ ...prev, [charKey]: newStatus }));
    if (newStatus) {
      addActivity({ type: "rate", contentId: charKey, contentTitle: `Favorited ${char.name.full}` });
    }
  };

  const filteredData = useMemo(() => {
    let list = data;
    if (activeCategory !== "all") {
      list = list.filter(c => c.fandom.toLowerCase() === activeCategory.toLowerCase());
      if (list.length === 0) list = data;
    }
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(char => 
      char.name.full.toLowerCase().includes(q) ||
      char.description?.toLowerCase().includes(q) ||
      char.fandom.toLowerCase().includes(q) ||
      char.role?.toLowerCase().includes(q)
    );
  }, [data, searchQuery, activeCategory]);

  return (
    <div className="pt-4 pb-24 min-h-screen bg-bg-main">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="max-w-2xl space-y-2.5 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[10px] sm:text-xs font-black uppercase tracking-widest backdrop-blur-md">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Character Multiverse Archive
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Iconic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600">Legends</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base md:text-lg leading-relaxed font-normal">
                Live streaming hundreds of legends across Anime (AniList), Movies & TV (TMDB), Gaming (RAWG), and Comics databases.
              </p>
            </div>
          </div>

          {/* Controls: Search & Category Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search hundreds of legends by name, series, or universe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/25 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm text-xs sm:text-sm font-medium backdrop-blur-xl"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-inner overflow-x-auto scrollbar-hide max-w-full">
              {categories.map(cat => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                    }}
                    className={cn(
                      "relative px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all duration-300 whitespace-nowrap cursor-pointer",
                      "hover:-translate-y-0.5 active:scale-95",
                      active
                        ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/30 dark:border-cyan-400/40 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                        : "text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200/70 dark:hover:bg-white/15 border border-transparent"
                    )}
                  >
                    {cat === "all" ? "All Fandoms" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character Cards Grid */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.25em] flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyan-500" />
                {activeCategory === "all" ? "Live Multiverse Stream" : `Live ${activeCategory} Stream`}
              </h2>
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
                {filteredData.length} Characters Loaded (Page {page})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredData.map((char) => {
                  const isLiked = !!likedIds[String(char.id)];
                  const totalLikes = char.favourites + (isLiked ? 1 : 0);

                  return (
                    <motion.div
                      key={`${char.id}-${char.fandom}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/25 hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 shadow-lg cursor-pointer"
                      onClick={() => navigate(`/characters/${char.id}`)}
                    >
                      <img
                        src={char.image.large}
                        alt={char.name.full}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-center justify-between z-10">
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-cyan-500/85 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-md">
                          {char.fandom}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(char);
                          }}
                          className={cn(
                            "flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full backdrop-blur-md text-[8px] sm:text-[9.5px] font-black transition-all border shadow-md active:scale-90",
                            isLiked
                              ? "bg-rose-500 border-rose-400 text-white shadow-rose-500/40"
                              : "bg-black/60 border-white/15 text-white hover:text-rose-400 hover:border-rose-400/40"
                          )}
                          title="Favorite Character"
                        >
                          <Heart className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3", isLiked && "fill-current")} />
                          <span className="hidden sm:inline">{totalLikes.toLocaleString()}</span>
                        </button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-10 space-y-1 sm:space-y-1.5">
                        <h3 className="text-xs sm:text-base lg:text-lg font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-tight drop-shadow-md line-clamp-1">
                          {char.name.full}
                        </h3>
                        <p className="text-slate-300 text-[9.5px] sm:text-xs line-clamp-1 sm:line-clamp-2 leading-relaxed font-normal">
                          {char.description?.replace(/<[^>]*>?/gm, '').replace(/~!/g, '').replace(/!~/g, '') || "Official universe character record."}
                        </p>
                        <div className="pt-1 flex items-center justify-between">
                          <Link 
                            to={`/characters/${char.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 border border-cyan-500/40 hover:border-cyan-400 text-[9px] sm:text-[10px] font-black text-cyan-300 hover:text-white uppercase tracking-wider transition-all group/link shadow-md"
                          >
                            <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span>Lore</span>
                            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                          <span className="hidden sm:inline text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Verified
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {(loading || loadingMore) && Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="aspect-[3/4] rounded-2xl sm:rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-cyan-500/20 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500 animate-spin opacity-40" />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {!loading && hasMore && (
              <div className="flex flex-col items-center justify-center pt-8 pb-4">
                <Button
                  size="lg"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="gap-3 px-10 h-14 rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:scale-105 active:scale-95 transition-all"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      Streaming Legends from APIs...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 text-white" />
                      Load More Legends (+24 Characters)
                    </>
                  )}
                </Button>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-3">
                  Streaming live data from AniList, TMDB, RAWG, and Comic Vine APIs
                </p>
              </div>
            )}

            {filteredData.length === 0 && !loading && (
              <div className="text-center py-20 bg-white/50 dark:bg-slate-950/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-cyan-500/30">
                <User className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">No characters found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search query or fandom filter.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
