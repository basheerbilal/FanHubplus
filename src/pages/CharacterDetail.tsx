import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Shield, Zap, Target, BookOpen, Sparkles, Check, Flame, MessageSquare, Compass, Trophy } from "lucide-react";
import { PageLoader } from "../components/common/PageLoader";
import { Button } from "../components/common/Button";
import { motion } from "motion/react";
import { anilistRequest, CHARACTER_DETAIL_QUERY } from "../services/anilist";
import { useAppContext } from "../context/AppContext";

const DETAILED_LORE_DATABASE: Record<string, any> = {
  "151807": {
    name: "Sung Jinwoo",
    nativeName: "성진우 / 成振宇",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png",
    fandom: "Solo Leveling",
    popularity: 148500,
    bio: "Originally ridiculed as 'Humanity's Weakest Hunter' of E-Rank, Sung Jinwoo was chosen as the sole Player of the mysterious System after surviving the deadly Double Dungeon in the Cartenon Temple. Through unyielding discipline, he broke past mortal level caps, inherited the sovereign mantle of Ashborn, and commanded millions of immortal shadow soldiers — including Igris and Beru — to defend Earth against the Monarchs.",
    traits: ["Shadow Monarch", "Necromancy", "Ruler's Authority", "Limitless Growth", "Monarch Slayer"],
    appearances: ["Solo Leveling (Anime Season 1 & 2)", "Solo Leveling: Ragnarok", "Solo Leveling: Arise"],
    loreChapters: [
      { title: "The Double Dungeon Awakening", text: "Trapped in the lethal temple sanctuary, Jinwoo solved the divine commandments and was chosen as the Player by the Architect." },
      { title: "Arise: Birth of the Shadow Army", text: "Defeating the Blood-Red Commander Igris gave Jinwoo the god-tier extraction power to summon defeated foes as loyal shadow warriors." },
      { title: "The Monarchs War", text: "Transcending human comprehension, Jinwoo unlocked the full power of the Shadow Realm and stood alone as Earth's ultimate protector." }
    ]
  },
  "101922": {
    name: "Tanjiro Kamado",
    nativeName: "竈門 炭治郎",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg",
    fandom: "Demon Slayer",
    popularity: 124200,
    bio: "A kindhearted boy whose family was slaughtered by Muzan Kibutsuji, leaving only his sister Nezuko turned into a demon. Driven by pure devotion and an indomitable will, Tanjiro mastered both Water Breathing and his ancestral Sun Breathing (Hinokami Kagura), ascending to the pinnacle of swordsmanship inside the shifting labyrinth of Infinity Castle.",
    traits: ["Sun Breathing", "Transparent World", "Empathetic Senses", "Nichirin Blade Master", "Demon Slayer Corps"],
    appearances: ["Demon Slayer: Kimetsu no Yaiba", "Mugen Train Arc", "Entertainment District Arc", "Swordsmith Village Arc", "Infinity Castle Trilogy"],
    loreChapters: [
      { title: "The Charcoal Seller's Vow", text: "After the tragedy at Mt. Kumotori, Tanjiro trained relentlessly on Mt. Sagiri under former Water Hashira Sakonji Urokodaki." },
      { title: "Dance of the Fire God", text: "During the desperate battle against Lower Rank Five Rui on Mt. Natagumo, Tanjiro recalled his father's sacred Sun Dance." },
      { title: "Infinity Castle Final Stand", text: "Infiltrating Muzan's domain, Tanjiro unlocked the Demon Slayer Mark and the Transparent World to sever the cycle of demonic torment." }
    ]
  },
  "113415": {
    name: "Satoru Gojo",
    nativeName: "五条 悟",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pUbHg8.jpg",
    fandom: "Jujutsu Kaisen",
    popularity: 198000,
    bio: "Widely acknowledged as the strongest Jujutsu Sorcerer in history. Born as the first heir in 400 years to inherit both the Limitless cursed technique and the Six Eyes, Gojo manipulates the fabric of space itself through Infinity, Blue (Attraction), Red (Repulsion), and Hollow Purple (Erasure), alongside his overwhelming Domain Expansion: Unlimited Void.",
    traits: ["Six Eyes", "Limitless & Infinity", "Hollow Purple", "Unlimited Void", "Special Grade"],
    appearances: ["Jujutsu Kaisen (Season 1 & 2)", "Jujutsu Kaisen 0 (Movie)", "Shibuya Incident Arc", "Culling Game"],
    loreChapters: [
      { title: "The Balance of the World", text: "Gojo's birth shifted the balance of cursed energy worldwide, forcing cursed spirits to grow drastically stronger to compensate." },
      { title: "Hidden Inventory Awakening", text: "Pushed to near-death by Toji Fushiguro, Gojo grasped the core of Reversed Cursed Technique and attained enlightenment: 'Throughout Heaven and Earth, I alone am the honored one.'" },
      { title: "Unlimited Void Domain", text: "His domain floods targets with infinite information, immobilizing mind and body in absolute cognitive overload." }
    ]
  },
  "arcane-jinx": {
    name: "Jinx (Powder)",
    nativeName: "Powder / Zaunite",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
    fandom: "Arcane / League of Legends",
    popularity: 165000,
    bio: "A brilliant, erratic inventor from the undercity of Zaun. After a tragic childhood blast separated her from her sister Vi, Powder was taken in by Silco and transformed into Jinx. Armed with customized hextech ordnance, Fishbones rocket launcher, and unstable chemtech shimmer, her chaotic presence ignited revolution between Piltover and Zaun.",
    traits: ["Hextech Genius", "Fishbones & Pow-Pow", "Chemtech Infusion", "Unpredictable Tactician", "Zaun Legend"],
    appearances: ["Arcane Season 1", "Arcane Season 2", "League of Legends Universes"],
    loreChapters: [
      { title: "The Last Drop Days", text: "Growing up under Vander in the Undercity, Powder sought to prove herself among older peers with hand-crafted wind-up gadgets." },
      { title: "Birth of Jinx", text: "Adopted by Silco, she forged her identity anew, creating lethal high-caliber inventions and embracing anarchic brilliance." },
      { title: "The Hextech Superweapon", text: "Constructing the ultimate Hextech rocket, Jinx forever shattered the status quo between the Council and Zaun." }
    ]
  },
  "spider-miles": {
    name: "Miles Morales",
    nativeName: "Spider-Man / Earth-1610",
    image: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    fandom: "Spider-Verse / Marvel",
    popularity: 142000,
    bio: "A teenager from Brooklyn who was bitten by an Alchemax radioactive spider from Earth-42. Stepping up in the wake of Peter Parker's demise, Miles mastered unique abilities including camouflage invisibility and bio-electric Venom Strikes, forging his own heroic destiny across the multiversal Web of Life and Destiny.",
    traits: ["Venom Blast", "Spider-Camouflage", "Dimensional Acrobatics", "Leap of Faith", "Spider-Sense"],
    appearances: ["Spider-Man: Into the Spider-Verse", "Spider-Man: Across the Spider-Verse", "Beyond the Spider-Verse"],
    loreChapters: [
      { title: "The Leap of Faith", text: "Finding his own rhythm and identity, Miles painted his iconic black-and-red suit and took his heroic leap off Brooklyn's skyline." },
      { title: "Defying the Canon", text: "Confronted by Miguel O'Hara and the Spider-Society, Miles refused to accept that tragic losses were mandatory for Spider-heroes." }
    ]
  },
  "david-martinez": {
    name: "David Martinez",
    nativeName: "Edgerunner / Night City",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx120377-hFjPz6i2g5aG.jpg",
    fandom: "Cyberpunk: Edgerunners",
    popularity: 98500,
    bio: "A Santo Domingo street kid who suffered devastating loss in Night City. Implanting a military-grade Sandevistan neural booster, David joined Maine's mercenary crew and ascended to become a top-tier Edgerunner, defying cyberpsychosis to protect his crew and help Lucy reach the Moon.",
    traits: ["Military Sandevistan", "Cyberskeleton", "Edgerunner Mercenary", "High Cyberware Affinity"],
    appearances: ["Cyberpunk: Edgerunners (Studio Trigger)", "Cyberpunk 2077 Night City Lore"],
    loreChapters: [
      { title: "The Sandevistan Surge", text: "After losing his mother, David installed the legendary Militech speed-booster, outrunning Night City's fastest corporate enforcers." },
      { title: "Legend of the Afterlife", text: "Carrying the dreams of his fallen crew, David blazed through Arasaka Tower, leaving an unforgettable legend engraved in Night City lore." }
    ]
  }
};

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addActivity } = useAppContext();
  const [char, setChar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadChar = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const cleanId = id.replace("char-", "");
        
        // 1. Check Detailed Local Lore Database
        if (DETAILED_LORE_DATABASE[cleanId]) {
          setChar({
            id: cleanId,
            ...DETAILED_LORE_DATABASE[cleanId]
          });
          return;
        }

        // 2. Fetch Live TMDB Person by ID (e.g. "tmdb-1234")
        if (id.startsWith("tmdb-")) {
          const tmdbId = id.replace("tmdb-", "");
          const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
          if (tmdbKey) {
            const res = await fetch(`https://api.themoviedb.org/3/person/${tmdbId}?api_key=${tmdbKey}`);
            const person = await res.json();
            if (person && person.name) {
              setChar({
                id,
                name: person.name,
                image: person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : "https://images.unsplash.com/photo-1541560052-5e137f229371?auto=format&fit=crop&q=80&w=1200",
                bio: person.biography || `${person.name} is an internationally acclaimed performer celebrated in global cinema and television universes. Known for outstanding portrayals and profound cinematic presence.`,
                fandom: person.known_for_department === "Acting" ? "Movies & Cinema" : "TV & Performing Arts",
                popularity: Math.round((person.popularity || 85) * 500),
                traits: [person.known_for_department || "Actor", "Cinematic Star", "Fan Icon"],
                appearances: person.also_known_as?.slice(0, 3) || ["Award-Winning Screenplay", "Box Office Feature"],
                loreChapters: [
                  { title: "Cinematic Journey", text: person.biography?.slice(0, 350) || "Career history recorded in TMDB Global Archives." },
                  { title: "Birthplace & Heritage", text: `Born in ${person.place_of_birth || "Worldwide"} on ${person.birthday || "Archive Record"}.` }
                ]
              });
              return;
            }
          }
        }

        // 3. Fetch Live RAWG Game/Character by ID (e.g. "rawg-3498")
        if (id.startsWith("rawg-")) {
          const rawgId = id.replace("rawg-", "");
          const rawgKey = import.meta.env.VITE_RAWG_API_KEY;
          if (rawgKey) {
            const res = await fetch(`https://api.rawg.io/api/games/${rawgId}?key=${rawgKey}`);
            const game = await res.json();
            if (game && game.name) {
              setChar({
                id,
                name: game.name,
                image: game.background_image || game.background_image_additional || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
                bio: game.description_raw || game.description?.replace(/<[^>]*>?/gm, '') || `Iconic gaming franchise lore entry for ${game.name}.`,
                fandom: "Gaming Universe",
                popularity: Math.round((game.rating || 4.8) * 30000),
                traits: [game.genres?.[0]?.name || "Action RPG", "Gaming Legend", "AAA Title"],
                appearances: game.platforms?.slice(0, 4).map((p: any) => p.platform?.name) || ["PlayStation", "PC", "Xbox"],
                loreChapters: [
                  { title: "Game Lore & Synopsis", text: game.description_raw?.slice(0, 400) || "Comprehensive gaming universe lore recorded on RAWG Database." },
                  { title: "Release & Accolades", text: `Released: ${game.released || "2024"}. Global Rating: ${game.rating}/5 across ${game.ratings_count?.toLocaleString()} gamers.` }
                ]
              });
              return;
            }
          }
        }

        // 4. Fetch Live AniList Character by ID (numeric or string)
        const rawId = parseInt(cleanId);
        if (!isNaN(rawId) && rawId > 0) {
          const data: any = await anilistRequest(CHARACTER_DETAIL_QUERY, { id: rawId });
          if (data?.Character) {
            const rawBio = data.Character.description || "";
            const cleanBio = rawBio.replace(/<[^>]*>?/gm, '').replace(/~!/g, '').replace(/!~/g, '');
            const mediaList = data.Character.media?.nodes || [];
            const primaryFandom = mediaList[0]?.title?.english || mediaList[0]?.title?.romaji || "Anime Universe";

            setChar({
              id: cleanId,
              name: data.Character.name.full,
              nativeName: data.Character.name.native || data.Character.name.userPreferred,
              image: data.Character.image.large,
              bio: cleanBio || "Iconic character legend in the Fan Hub Plus Multiverse.",
              fandom: primaryFandom,
              popularity: data.Character.favourites || 25000,
              traits: ["Canon Protagonist", "Fan Favorite", "Multiverse Legend", "Key Character"],
              appearances: mediaList.slice(0, 4).map((m: any) => m.title.english || m.title.romaji),
              loreChapters: [
                { 
                  title: "Origins & Chronicle", 
                  text: cleanBio.slice(0, 300) || "Character history documented from verified franchise records." 
                },
                { 
                  title: "Franchise Legacy", 
                  text: `Recognized across global audiences as a central figure in ${primaryFandom}.` 
                }
              ]
            });
            return;
          }
        }
        
        // 3. General Fallback
        const formattedTitle = id.replace(/[-_]/g, ' ').replace(/^char\s*/i, '').toUpperCase();
        setChar({
          id,
          name: formattedTitle,
          image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1200",
          bio: `${formattedTitle} is an iconic figure in the global fandom universe. Celebrated for distinctive personality, impactful storyline moments, and immense community love across fan communities.`,
          fandom: "Multiverse Universe",
          popularity: 95000,
          traits: ["Legendary Icon", "Hero of the Realm", "Fan Favorite"],
          appearances: ["Main Series Canon", "Multiverse Showcase", "Fan Hub Plus Lore Archive"],
          loreChapters: [
            { title: "Universe Lore", text: "This legend is chronicled in the Fan Hub Plus Multiverse archive with active community rating and lore discussions." }
          ]
        });

      } catch (err) {
        console.error("Character load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadChar();
  }, [id]);

  useEffect(() => {
    if (char) {
      addActivity({ type: "view", contentId: `char-${char.id}`, contentTitle: `Viewed Lore: ${char.name}` });
    }
  }, [char?.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <PageLoader fullScreen message="Accessing Character Lore Vault..." />;
  }

  if (!char) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-bg-main px-4">
        <div className="text-center p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/25 backdrop-blur-2xl shadow-xl max-w-md">
          <h2 className="text-3xl font-black mb-3 text-slate-900 dark:text-white">Character not found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">The requested character was not found in the archive.</p>
          <Button onClick={() => navigate("/characters")}>Back to Characters</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-bg-main">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        
        {/* Top Back Nav */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/characters")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all group active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-500 dark:text-cyan-400" />
            Back to Characters
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:text-cyan-400 hover:border-cyan-500/50 transition-all active:scale-95 shadow-md relative"
              title="Share Lore Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Hero Character Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Portrait */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-none mx-auto aspect-[3/4] rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-cyan-500/30 shadow-xl dark:shadow-2xl shadow-cyan-500/10"
            >
              <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90" />
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-10">
                <span className="px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-cyan-500/80 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-black uppercase tracking-wider shadow-md">
                  {char.fandom}
                </span>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-bold text-[11px] sm:text-xs backdrop-blur-md border shadow-lg transition-all active:scale-95 ${
                    isLiked
                      ? "bg-rose-500 border-rose-400 text-white shadow-rose-500/30"
                      : "bg-black/60 border-white/20 text-white hover:text-rose-400"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current text-white" : ""}`} />
                  <span>{(char.popularity + (isLiked ? 1 : 0)).toLocaleString()}</span>
                </button>
              </div>

              {/* Bottom Card Identity */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                {char.nativeName && (
                  <p className="text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5 sm:mb-1">
                    {char.nativeName}
                  </p>
                )}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {char.name}
                </h2>
              </div>
            </motion.div>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-[280px] sm:max-w-[340px] lg:max-w-none mx-auto w-full">
              <Link to="/explore" className="w-full">
                <Button variant="outline" className="w-full text-xs font-black uppercase tracking-wider h-10 sm:h-12 border-cyan-500/30 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/15 gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Explore Hub
                </Button>
              </Link>
              <Link to="/feedback" className="w-full">
                <Button variant="outline" className="w-full text-xs font-black uppercase tracking-wider h-10 sm:h-12 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:border-cyan-500/40 gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Discussion
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Full Lore & Storyline */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Main Header & Storyline Summary */}
            <div className="p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" /> Character Lore Archive
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {char.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base leading-relaxed font-normal whitespace-pre-line">
                {char.bio}
              </p>
            </div>

            {/* Trait & Spec Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-md">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 mb-2" />
                <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-2">Iconic Traits</h4>
                <div className="flex flex-wrap gap-1.5">
                  {char.traits?.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-md">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 mb-2" />
                <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-2">Appearances</h4>
                <div className="flex flex-col gap-1">
                  {char.appearances?.map((a: string) => (
                    <span key={a} className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">• {a}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-md">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-2" />
                <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-2">Fandom Franchise</h4>
                <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{char.fandom}</span>
              </div>
            </div>

            {/* Lore Chapters Section */}
            {char.loreChapters && char.loreChapters.length > 0 && (
              <div className="p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
                  Chronological Lore & Milestones
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {char.loreChapters.map((chap: any, idx: number) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1">
                      <h4 className="text-xs sm:text-sm font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                        {chap.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {chap.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
