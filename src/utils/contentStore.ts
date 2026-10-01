import { storage } from "./localStorage";
import { api } from "../services/api";

export interface ManagedMerchItem {
  id: string;
  title: string;
  category: string;
  fandom: string;
  price: string;
  image: string;
  tags: string[];
  description: string;
  releaseDate?: string;
  isUpcoming?: boolean;
  addedAt: number;
}

export interface ManagedExploreItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string; // "Anime" | "Gaming" | "Movies" | "TV Shows" | "K-Pop" | "Comics" | "Manga" | "Cosplay" | "Community"
  rating: number;
  year: number;
  url: string;
  trailerUrl?: string; // YouTube or video link
  isCommunity?: boolean;
  isSubmission?: boolean;
  authorEmail?: string;
  submissionType?: string;
  addedAt: number;
}

// ── MERCHANDISE ──────────────────────────────────────────────
const DEFAULT_MERCH: ManagedMerchItem[] = [
  { id: "m1", title: "Satoru Gojo Nendoroid", category: "Figures", fandom: "Jujutsu Kaisen", price: "$59.99", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800", tags: ["Limited Edition", "Pre-Order"], description: "Highly detailed poseable figure with multiple expressions, blindfold swap heads, and domain expansion effect pieces.", addedAt: Date.now() - 8640000 * 5 },
  { id: "m2", title: "Cyberpunk 2077 Katana Replica", category: "Collectibles", fandom: "Gaming", price: "$299.99", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800", tags: ["Collectible", "Limited Edition"], description: "1:1 scale neon-lit replica of the Thermal Katana with aircraft-grade aluminum alloy handle and LED lighting core.", addedAt: Date.now() - 8640000 * 4 },
  { id: "m3", title: "Legend of Zelda: Master Sword", category: "Collectibles", fandom: "Gaming", price: "$149.99", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800", tags: ["Classic"], description: "High-quality forged stainless steel display replica with ornate resin scabbard and Triforce wall mount.", addedAt: Date.now() - 8640000 * 3 },
  { id: "m4", title: "Demon Slayer: Zenitsu Hoodie", category: "Apparel", fandom: "Anime", price: "$45.00", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", tags: ["New Arrival"], description: "Heavyweight 400GSM cotton hoodie featuring embroidered signature yellow-orange lightning triangle pattern.", addedAt: Date.now() - 8640000 * 2 },
  { id: "m5", title: "Gundam RX-78-2 Perfect Grade Unleashed", category: "Model Kits", fandom: "Anime", price: "$275.00", image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800", tags: ["Limited Edition", "Pre-Order"], description: "State-of-the-art multi-layer internal skeleton frame with etched metal parts and full LED illumination.", addedAt: Date.now() - 8640000 },
  { id: "m6", title: "Spider-Man 2 Advanced Suit 1/6 Scale", category: "Figures", fandom: "Comics", price: "$285.00", image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=800", tags: ["Pre-Order"], description: "Screen-accurate tailored suit with magnetic web wings, articulated symbiote tendrils, and dynamic skyline base.", addedAt: Date.now() },
  { id: "up-1", title: "Elden Ring: Messmer Helmet Replica", category: "Collectibles", fandom: "Gaming", price: "$399.00", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800", tags: ["Pre-Order", "Limited Edition"], description: "Numbered limited edition (9,999 units) wearable helm cast in pure brass and weathered resin finish.", releaseDate: "November 2026", isUpcoming: true, addedAt: Date.now() },
  { id: "up-2", title: "AOT: The Rumbling Colossal Titan Diorama", category: "Statues", fandom: "Anime", price: "$650.00", image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800", tags: ["Pre-Order"], description: "Massive 24-inch polystone diorama with translucent resin steam effects and LED glowing eyes.", releaseDate: "December 2026", isUpcoming: true, addedAt: Date.now() },
];

export function getMerchItems(): ManagedMerchItem[] {
  const stored = storage.get<ManagedMerchItem[]>("ADMIN_MERCH");
  if (stored && stored.length > 0) return stored;
  storage.set("ADMIN_MERCH", DEFAULT_MERCH);
  return DEFAULT_MERCH;
}

export function saveMerchItems(items: ManagedMerchItem[]): void {
  storage.set("ADMIN_MERCH", items);
}

export async function syncMerchandiseFromBackend(): Promise<ManagedMerchItem[]> {
  try {
    const res = await api.getMerchandise();
    if (res?.items && Array.isArray(res.items) && res.items.length > 0) {
      storage.set("ADMIN_MERCH", res.items);
      return res.items;
    }
  } catch (err) {
    console.warn("Could not sync backend merchandise data:", err);
  }
  return getMerchItems();
}


// ── EXPLORE CONTENT ──────────────────────────────────────────
const DEFAULT_EXPLORE: ManagedExploreItem[] = [
  { id: "exp-cos-1", title: "Satoru Gojo: Limitless & Six Eyes Cosplay", description: "The indisputable strongest sorcerer. Complete Tokyo Tech uniform with Six Eyes blindfold and Hollow Purple effects.", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png", category: "Cosplay", rating: 9.9, year: 2024, url: "https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo", addedAt: Date.now() - 8640000 * 5 },
  { id: "exp-cos-2", title: "Son Goku: Ultra Instinct Saiyan Cosplay", description: "Mastered Ultra Instinct state with glowing silver aura, torn Gi, and divine martial arts posture.", image: "https://s4.anilist.co/file/anilistcdn/character/large/246-wsRRr6z1kii8.png", category: "Cosplay", rating: 9.8, year: 2024, url: "https://dragonball.fandom.com/wiki/Goku", addedAt: Date.now() - 8640000 * 4 },
  { id: "exp-cos-3", title: "Monkey D. Luffy: Gear 5 Sun God Nika Cosplay", description: "Awakened Warrior of Liberation. Cloud-white hair, flowing Hagoromo steam clouds, and Straw Hat.", image: "https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png", category: "Cosplay", rating: 9.7, year: 2024, url: "https://onepiece.fandom.com/wiki/Monkey_D._Luffy", addedAt: Date.now() - 8640000 * 3 },
  { id: "exp-cos-4", title: "Naruto Uzumaki: Seventh Hokage Cloak", description: "Flames of Konoha! Six Paths Sage Mode with Kurama Chakra mantle and official Seventh Hokage cape.", image: "https://s4.anilist.co/file/anilistcdn/character/large/b17-phjcWCkRuIhu.png", category: "Cosplay", rating: 9.6, year: 2024, url: "https://naruto.fandom.com/wiki/Naruto_Uzumaki", addedAt: Date.now() - 8640000 * 2 },
  { id: "exp-cos-5", title: "Ryomen Sukuna: Heian Era Cursed Kimono", description: "King of Curses authentic facial tattoos, four-armed silhouette kimono, and Malevolent Shrine aura.", image: "https://s4.anilist.co/file/anilistcdn/character/large/b133701-rCQuDpHr3UZL.png", category: "Cosplay", rating: 9.9, year: 2024, url: "https://jujutsu-kaisen.fandom.com/wiki/Sukuna", addedAt: Date.now() - 8640000 },
  { id: "exp-cos-6", title: "Levi Ackerman: Scout Regiment 3D Maneuver Gear", description: "Humanity's Strongest Soldier. Dual ultra-hard steel blades, leather harness, and Wings of Freedom cloak.", image: "https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png", category: "Cosplay", rating: 9.8, year: 2024, url: "https://attackontitan.fandom.com/wiki/Levi_Ackerman", addedAt: Date.now() },
  { id: "exp-1", title: "Arcane: League of Legends", description: "Award-winning animated series set in the world of Runeterra. A masterpiece of storytelling.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800", category: "Gaming", rating: 9.2, year: 2023, url: "https://www.netflix.com/title/81435227", addedAt: Date.now() - 8640000 * 3 },
  { id: "exp-2", title: "Dune: Part Two", description: "Epic sci-fi sequel following Paul Atreides as he unites with the Fremen of Arrakis.", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&q=80&w=800", category: "Movies", rating: 8.8, year: 2024, url: "https://www.imdb.com/title/tt15239678/", addedAt: Date.now() - 8640000 * 2 },
  { id: "exp-3", title: "Elden Ring Shadow of the Erdtree", description: "Massive DLC expansion bringing new bosses, weapons, and the Land of Shadow to explore.", image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&q=80&w=800", category: "Gaming", rating: 9.4, year: 2024, url: "https://store.steampowered.com/app/2778580/ELDEN_RING_Shadow_of_the_Erdtree/", addedAt: Date.now() - 8640000 },
  { id: "exp-4", title: "NewJeans – How Sweet", description: "NewJeans' chart-topping bop blending dreamy retro synths with their signature Y2K-pop aesthetic.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800", category: "K-Pop", rating: 8.5, year: 2024, url: "https://www.youtube.com/watch?v=rC8tKf0YWLQ", addedAt: Date.now() },
];

export function getExploreItems(): ManagedExploreItem[] {
  const stored = storage.get<ManagedExploreItem[]>("ADMIN_EXPLORE");
  if (stored && stored.length > 0) return stored;
  return DEFAULT_EXPLORE;
}

export function saveExploreItems(items: ManagedExploreItem[]): void {
  storage.set("ADMIN_EXPLORE", items);
}

// Background sync from backend API into local storage
export async function syncExploreFromBackend(): Promise<ManagedExploreItem[]> {
  try {
    const res = await api.getExplore();
    let exploreList = res?.items && Array.isArray(res.items) ? [...res.items] : [];

    try {
      const subRes = await api.getSubmissions();
      if (subRes?.submissions && Array.isArray(subRes.submissions)) {
        const approved = subRes.submissions.filter((s: any) => s.status === "approved");
        for (const sub of approved) {
          const expId = `sub-${sub.id.replace(/^sub-/, "")}`;
          const exists = exploreList.some(e => e.id === expId || e.id === sub.id || (e.title && e.title.toLowerCase() === sub.title.toLowerCase()));
          if (!exists) {
            exploreList.unshift({
              id: expId,
              title: sub.title,
              description: sub.description,
              image: sub.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
              category: sub.category || "Anime",
              rating: 9.0,
              year: new Date(sub.timestamp || Date.now()).getFullYear(),
              url: sub.sourceUrl || "",
              trailerUrl: sub.sourceUrl?.includes("youtu") || sub.sourceUrl?.startsWith("/uploads/") ? sub.sourceUrl : "",
              isCommunity: true,
              isSubmission: true,
              authorEmail: sub.authorEmail || "",
              submissionType: sub.type || "Article",
              addedAt: sub.timestamp || Date.now(),
            });
          }
        }
      }
    } catch {}

    if (exploreList.length > 0) {
      storage.set("ADMIN_EXPLORE", exploreList);
      return exploreList;
    }
  } catch (err) {
    console.warn("Could not sync backend explore data:", err);
  }
  return getExploreItems();
}

if (typeof window !== "undefined") {
  syncExploreFromBackend();
  syncMerchandiseFromBackend();
}

// Helper to extract YouTube video id from any YouTube URL or string
export function extractYouTubeId(url?: string): string {
  if (!url) return "";
  const clean = url.trim();
  if (clean.includes("watch?v=")) {
    return clean.split("watch?v=")[1]?.split("&")[0]?.split("?")[0] || "";
  }
  if (clean.includes("youtu.be/")) {
    return clean.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0] || "";
  }
  if (clean.includes("embed/")) {
    return clean.split("embed/")[1]?.split("?")[0]?.split("&")[0] || "";
  }
  if (clean.includes("youtube.com/shorts/")) {
    return clean.split("youtube.com/shorts/")[1]?.split("?")[0]?.split("&")[0] || "";
  }
  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  return clean;
}

export function getCleanPosterImage(image?: string, videoLink?: string): string {
  if (!image || image.trim() === "") {
    if (videoLink) {
      const vid = extractYouTubeId(videoLink);
      if (vid) return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800";
  }
  if (image.includes("youtu.be") || image.includes("youtube.com")) {
    const vid = extractYouTubeId(image);
    if (vid) return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }
  return image;
}

// Convert custom admin explore item into standard Anime interface
export function managedExploreToAnime(item: ManagedExploreItem): any {
  const rawVideoLink = item.trailerUrl || (item.url?.includes("youtu") ? item.url : "");
  const isDirectFile =
    rawVideoLink.startsWith("/uploads/") ||
    rawVideoLink.startsWith("data:video/") ||
    rawVideoLink.startsWith("blob:") ||
    /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(rawVideoLink);

  const ytId = !isDirectFile ? extractYouTubeId(rawVideoLink || (item.image?.includes("youtu") ? item.image : "")) : "";
  const poster = getCleanPosterImage(item.image, rawVideoLink);

  return {
    id: item.id,
    idMal: 999999,
    customId: item.id,
    isCustom: true,
    trailerUrl: item.trailerUrl || "",
    videoUrl: item.trailerUrl || "",
    title: {
      english: item.title,
      romaji: item.title,
      native: item.title,
    },
    description: item.description || "An exclusive lore story and series registered in the multiverse database.",
    coverImage: {
      extraLarge: poster,
      large: poster,
      color: "#06b6d4",
    },
    bannerImage: poster,
    genres: [item.category || "Anime", "Action", "Adventure"],
    format: "TV",
    status: "RELEASING",
    season: "FALL",
    seasonYear: item.year || new Date().getFullYear(),
    episodes: 12,
    duration: 24,
    averageScore: Math.round((item.rating || 8.5) * 10),
    popularity: 50000,
    trailer: ytId ? {
      id: ytId,
      site: "youtube",
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    } : (item.trailerUrl ? {
      id: "",
      site: "direct",
      thumbnail: poster,
      url: item.trailerUrl,
    } : undefined),
    studios: {
      nodes: [{ name: "Multiverse Originals", isMain: true }]
    },
    characters: {
      nodes: []
    },
    relations: {
      nodes: []
    },
    staff: {
      nodes: []
    },
    siteUrl: `/anime/${item.id}`,
  };
}

export function getCustomAnimeItems(): any[] {
  const items = getExploreItems();
  return items
    .filter(i => {
      const cat = (i.category || "").toLowerCase().replace(/[\s-_]/g, "");
      return cat === "anime" || cat === "manga" || cat === "all";
    })
    .map(managedExploreToAnime);
}

// ── TOP 10 RANKED SHOWS (HOMEPAGE SLIDER) ──────────────────────
export interface ManagedTopShowItem {
  id: string;
  rank: number;
  title: string;
  category: string;
  views: string;
  rating: number;
  episodes: string;
  image: string;
  trailerUrl?: string;
  badge?: string;
  addedAt?: number;
}

export const DEFAULT_TOP_SHOWS: ManagedTopShowItem[] = [
  { rank: 1, id: "show-1", title: "Naruto: Shippuden", category: "Anime", views: "9.8M Views", rating: 8.7, episodes: "500 Episodes", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=1dmVICn2bJY", badge: "RANK #1", addedAt: Date.now() - 8640000 * 10 },
  { rank: 2, id: "show-2", title: "Solo Leveling: Shadow Monarch", category: "Anime & Webtoon", views: "8.9M Views", rating: 8.9, episodes: "24 Episodes", image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg", trailerUrl: "https://www.youtube.com/watch?v=9g_8r_r7-80", badge: "POPULAR", addedAt: Date.now() - 8640000 * 9 },
  { rank: 3, id: "show-3", title: "The Exiled Heavy Knight", category: "Anime & Gaming", views: "7.4M Views", rating: 8.5, episodes: "12 Episodes", image: "https://image.tmdb.org/t/p/w500/h2JZRLaFXWWhh61vAjqgHXeiZd8.jpg", trailerUrl: "https://youtu.be/UXgbofdm2vQ?si=_rFjVmUy29zs5olw", badge: "TRENDING", addedAt: Date.now() - 8640000 * 8 },
  { rank: 4, id: "show-4", title: "Naruto (Classic)", category: "Anime", views: "6.8M Views", rating: 8.3, episodes: "220 Episodes", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=-G9BqkgZXRA", badge: "CLASSIC", addedAt: Date.now() - 8640000 * 7 },
  { rank: 5, id: "show-5", title: "One Piece: Egghead Island", category: "Anime", views: "6.5M Views", rating: 9.0, episodes: "1100+ Episodes", image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=MCb13lbKpsM", badge: "HOT", addedAt: Date.now() - 8640000 * 6 },
  { rank: 6, id: "show-6", title: "Demon Slayer: Kimetsu no Yaiba", category: "Anime", views: "6.1M Views", rating: 8.8, episodes: "55 Episodes", image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-33MtJGsUSxga.jpg", trailerUrl: "https://www.youtube.com/watch?v=Q4XN3y7Uu3I", badge: "MUST WATCH", addedAt: Date.now() - 8640000 * 5 },
  { rank: 7, id: "show-7", title: "Jujutsu Kaisen: Shibuya Incident", category: "Anime", views: "5.7M Views", rating: 8.9, episodes: "47 Episodes", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=pkKu8vhV57E", badge: "BLOCKBUSTER", addedAt: Date.now() - 8640000 * 4 },
  { rank: 8, id: "show-8", title: "Attack on Titan: The Final Season", category: "Anime", views: "5.4M Views", rating: 9.1, episodes: "87 Episodes", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=M_OauHnAFc8", badge: "TOP RATED", addedAt: Date.now() - 8640000 * 3 },
  { rank: 9, id: "show-9", title: "Bleach: Thousand-Year Blood War", category: "Anime", views: "4.9M Views", rating: 8.7, episodes: "39 Episodes", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=78WIYzX_Bks", badge: "EPIC", addedAt: Date.now() - 8640000 * 2 },
  { rank: 10, id: "show-10", title: "Cyberpunk: Edgerunners", category: "Anime & Gaming", views: "4.5M Views", rating: 8.6, episodes: "10 Episodes", image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/130591-JZ3bsMomOj8y.jpg", trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg", badge: "AWARD WINNER", addedAt: Date.now() - 8640000 },
];

export function getTopShows(): ManagedTopShowItem[] {
  const stored = storage.get<ManagedTopShowItem[]>("ADMIN_TOP_SHOWS");
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  storage.set("ADMIN_TOP_SHOWS", DEFAULT_TOP_SHOWS);
  return DEFAULT_TOP_SHOWS;
}

export function saveTopShows(items: ManagedTopShowItem[]): void {
  storage.set("ADMIN_TOP_SHOWS", items);
}

export async function syncTopShowsFromBackend(): Promise<ManagedTopShowItem[]> {
  try {
    const res = await api.getTopShows();
    if (res?.items && Array.isArray(res.items) && res.items.length > 0) {
      storage.set("ADMIN_TOP_SHOWS", res.items);
      return res.items;
    }
  } catch (err) {
    console.warn("Could not sync backend top shows:", err);
  }
  return getTopShows();
}

