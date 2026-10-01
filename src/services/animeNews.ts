import { NewsArticle } from "../types/anime";

export interface GlobalEditorialArticle extends NewsArticle {
  id: string;
  title: string;
  category: "Anime" | "Gaming" | "K-Pop" | "Movies" | "Comics";
  tag: string;
  date: string;
  author: string;
  readTime: string;
  description: string;
  content?: string;
  image: string;
  url: string;
  featured?: boolean;
  publishedAt: string;
  source: string;
  animeTitle?: string;
}

export const FALLBACK_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800";

export const CURATED_GLOBAL_NEWS: GlobalEditorialArticle[] = [
  {
    id: "news-demon-slayer-infinity-castle",
    title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle Film Trilogy Announced Worldwide",
    category: "Anime",
    tag: "Anime Premiere",
    date: "Sep 28, 2026",
    publishedAt: new Date().toISOString(),
    source: "Ufotable Newsdesk",
    author: "Ufotable Newsdesk",
    readTime: "4 min read",
    animeTitle: "Demon Slayer",
    description: "Crunchyroll and Sony Pictures Entertainment confirm the theatrical release of the epic concluding three-part cinematic arc for Tanjiro and the Hashira.",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg",
    url: "https://demonslayer-anime.com",
    featured: true
  },
  {
    id: "news-gta-6-vice-city",
    title: "Grand Theft Auto VI: Revolutionary Open-World Physics & Next-Gen Lighting Revealed",
    category: "Gaming",
    tag: "Gaming Spotlight",
    date: "Sep 27, 2026",
    publishedAt: new Date().toISOString(),
    source: "Rockstar Intel",
    author: "Rockstar Intel",
    readTime: "5 min read",
    animeTitle: "GTA VI",
    description: "Rockstar Games details the technological leaps in Leonida state, showcasing next-generation crowd density, realistic weather simulation, and dual protagonist dynamics.",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800",
    url: "https://www.rockstargames.com/VI"
  },
  {
    id: "news-solo-leveling-s2",
    title: "Solo Leveling Season 2 - Arise from the Shadow: Official Teaser Breaks Viewership Records",
    category: "Anime",
    tag: "Trailer Drop",
    date: "Sep 26, 2026",
    publishedAt: new Date().toISOString(),
    source: "A-1 Pictures",
    author: "A-1 Pictures Studio",
    readTime: "3 min read",
    animeTitle: "Solo Leveling",
    description: "Sung Jinwoo's evolution into the supreme Shadow Monarch continues as the Red Gate and Jeju Island raid arcs prepare to debut with high-octane animation.",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png",
    url: "https://sololeveling-anime.net"
  },
  {
    id: "news-bts-world-tour",
    title: "BTS 2026-2027 World Reunion Stadium Tour: Dates, Pre-Order & Setlist Teaser",
    category: "K-Pop",
    tag: "World Tour",
    date: "Sep 25, 2026",
    publishedAt: new Date().toISOString(),
    source: "BigHit Music",
    author: "BigHit Music",
    readTime: "4 min read",
    animeTitle: "BTS Global",
    description: "Following the historic completion of military service, all seven members reunite for an unprecedented 40-city global stadium tour kicking off in Seoul.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    url: "https://ibighit.com/bts"
  },
  {
    id: "news-elden-ring-shadow-erdtree",
    title: "Elden Ring: Shadow of the Erdtree Dominates GOTY Discussions with Masterful Boss Design",
    category: "Gaming",
    tag: "Game Review",
    date: "Sep 24, 2026",
    publishedAt: new Date().toISOString(),
    source: "FromSoftware Chronicle",
    author: "FromSoftware Chronicle",
    readTime: "6 min read",
    animeTitle: "Elden Ring",
    description: "Miyazaki's Land of Shadow delivers punishing difficulty and breathtaking vertical world design, setting a new benchmark for expansion content in modern gaming.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    url: "https://en.bandainamcoent.eu/elden-ring"
  },
  {
    id: "news-jujutsu-kaisen-culling-game",
    title: "Jujutsu Kaisen Season 3 'Culling Game Arc' in Full Production at MAPPA",
    category: "Anime",
    tag: "Production News",
    date: "Sep 23, 2026",
    publishedAt: new Date().toISOString(),
    source: "MAPPA Studio",
    author: "MAPPA Studio Dispatch",
    readTime: "3 min read",
    animeTitle: "Jujutsu Kaisen",
    description: "Following the catastrophic Shibuya Incident, Kenjaku's deadly sorcery tournament begins. Yuji Itadori and Yuta Okkotsu join forces in fatal battle arenas.",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800",
    url: "https://jujutsukaisen.jp"
  },
  {
    id: "news-blackpink-comeback",
    title: "BLACKPINK Sets Global YouTube Milestone with Comeback Title Track & Global Music Video",
    category: "K-Pop",
    tag: "Chart Records",
    date: "Sep 22, 2026",
    publishedAt: new Date().toISOString(),
    source: "YG Entertainment",
    author: "YG Entertainment",
    readTime: "3 min read",
    animeTitle: "BLACKPINK",
    description: "Jisoo, Jennie, Rosé, and Lisa smash the 24-hour premiere barrier with infectious beats and high-fashion cyber-chic visuals across streaming platforms.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    url: "https://yg-blackpink.com"
  },
  {
    id: "news-spider-verse-beyond",
    title: "Spider-Man: Beyond the Spider-Verse Animation Tech Pushes Beyond 2D/3D Frontiers",
    category: "Movies",
    tag: "Cinema Tech",
    date: "Sep 21, 2026",
    publishedAt: new Date().toISOString(),
    source: "Sony Pictures Animation",
    author: "Sony Pictures Animation",
    readTime: "5 min read",
    animeTitle: "Spider-Verse",
    description: "Directors Joaquim Dos Santos and Kemp Powers share behind-the-scenes insights into Miles Morales' dramatic battle against Spot across six distinct art dimensions.",
    image: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    url: "https://www.sonypictures.com/movies/spidermanbeyondthespiderverse"
  },
  {
    id: "news-valorant-champions",
    title: "Valorant Champions Tour 2026: Grand Finals Breaks Esports Concurrent Peak Records",
    category: "Gaming",
    tag: "Esports",
    date: "Sep 20, 2026",
    publishedAt: new Date().toISOString(),
    source: "Riot Games Esports",
    author: "Riot Games Esports",
    readTime: "4 min read",
    animeTitle: "Valorant Champions",
    description: "A thrilling five-map overtime thriller in Paris crowns the world champions in front of a sold-out arena and over 3 million live digital viewers.",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800",
    url: "https://playvalorant.com"
  },
  {
    id: "news-arcane-season-2",
    title: "Arcane Season 2 'Piltover & Zaun War': Soundtracks by Iconic International Artists Released",
    category: "Gaming",
    tag: "Original Soundtrack",
    date: "Sep 19, 2026",
    publishedAt: new Date().toISOString(),
    source: "Fortiche & Riot Games",
    author: "Fortiche & Riot Games",
    readTime: "4 min read",
    animeTitle: "Arcane League",
    description: "The official soundtrack features adrenaline-fueled tracks accompanying the heartbreaking conflict between sisters Jinx and Vi.",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
    url: "https://arcane.com"
  },
  {
    id: "news-batman-part-2",
    title: "The Batman Epic Crime Saga Expands: Arkham and GCPD Spin-Offs Slated for Production",
    category: "Comics",
    tag: "Comic Book Movies",
    date: "Sep 18, 2026",
    publishedAt: new Date().toISOString(),
    source: "DC Studios News",
    author: "DC Studios News",
    readTime: "4 min read",
    animeTitle: "DC Comics",
    description: "Matt Reeves confirms noir detective focus and deep character-driven arcs exploring Gotham City's darkest psychological corners.",
    image: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    url: "https://www.dc.com"
  },
  {
    id: "news-newjeans-hyperpop",
    title: "NewJeans Ignites Global Billboard Top 10 with Futuristic Y2K Hyperpop EP",
    category: "K-Pop",
    tag: "Music Release",
    date: "Sep 17, 2026",
    publishedAt: new Date().toISOString(),
    source: "ADOR Music",
    author: "ADOR Music",
    readTime: "3 min read",
    animeTitle: "NewJeans K-Pop",
    description: "Minji, Hanni, Danielle, Haerin, and Hyein pioneer crisp garage rhythms and breezy nostalgic melodies capturing listeners worldwide.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800",
    url: "https://newjeans.kr"
  }
];

export async function fetchLatestAnimeNews(): Promise<GlobalEditorialArticle[]> {
  try {
    const response = await fetch('/api/proxy/jikan/recommendations/anime');
    if (!response.ok) return CURATED_GLOBAL_NEWS;
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return CURATED_GLOBAL_NEWS;

    const data = await response.json();
    
    if (data && data.data && data.data.length > 0) {
      const liveAnime: GlobalEditorialArticle[] = data.data.slice(0, 4).map((item: any, index: number) => {
        const anime1 = item.entry[0];
        const anime2 = item.entry[1];
        
        return {
          id: `live-anime-${index}`,
          title: `Editorial Pairing: Why ${anime2.title} is essential viewing after ${anime1.title}`,
          category: "Anime" as const,
          tag: "Anime Guide",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          publishedAt: new Date().toISOString(),
          source: item.user?.username || "AniList Dispatch",
          author: item.user?.username || "AniList Dispatch",
          readTime: "3 min read",
          animeTitle: anime1.title || "Anime News",
          description: item.content || `A deep comparative analysis exploring thematic parallels, animation styles, and character arcs between ${anime1.title} and ${anime2.title}.`,
          image: anime2.images?.jpg?.large_image_url || anime1.images?.jpg?.large_image_url || FALLBACK_ARTICLE_IMAGE,
          url: item.user?.url || "https://myanimelist.net",
        };
      });

      return [...liveAnime, ...CURATED_GLOBAL_NEWS];
    }
    return CURATED_GLOBAL_NEWS;
  } catch (error) {
    console.warn("Live news load failed, returning rich curated news:", error);
    return CURATED_GLOBAL_NEWS;
  }
}

export async function fetchAnimeNewsById(malId: number): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`/api/proxy/jikan/anime/${malId}/news`);
    if (!response.ok) return [];
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return [];

    const data = await response.json();
    
    return (data.data || []).map((n: any) => ({
      id: n.mal_id.toString(),
      title: n.title,
      description: n.excerpt || n.intro || "",
      image: n.images?.jpg?.image_url || FALLBACK_ARTICLE_IMAGE,
      url: n.url,
      publishedAt: n.date,
      source: n.author_name || "MyAnimeList"
    }));
  } catch (error) {
    console.warn(`Anime News Error for ${malId}:`, error);
    return [];
  }
}
