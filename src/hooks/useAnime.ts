import { useState, useEffect } from "react";
import { anilistRequest, TRENDING_ANIME_QUERY, POPULAR_ANIME_QUERY, ANIME_SEARCH_QUERY, ANIME_DETAIL_QUERY, AIRING_NOW_QUERY, FALLBACK_TRENDING_ANIME } from "../services/anilist";
import { Anime, PaginationInfo } from "../types/anime";
import { animeCache } from "../utils/animeCache";

export function useTrendingAnime(page = 1, perPage = 10) {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const cacheKey = `trending_${page}_${perPage}`;
      const cached = animeCache.get<Anime[]>(cacheKey);
      
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      try {
        const result: any = await anilistRequest(TRENDING_ANIME_QUERY, { page, perPage });
        const animeList = result.Page.media;
        setData(animeList);
        animeCache.set(cacheKey, animeList);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [page, perPage]);

  return { data, loading, error };
}

export function usePopularAnime(page = 1, perPage = 10) {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      const cacheKey = `popular_${page}_${perPage}`;
      const cached = animeCache.get<Anime[]>(cacheKey);
      
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      try {
        const result: any = await anilistRequest(POPULAR_ANIME_QUERY, { page, perPage });
        const animeList = result.Page.media;
        setData(animeList);
        animeCache.set(cacheKey, animeList);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, [page, perPage]);

  return { data, loading, error };
}

export function useAiringAnime(page = 1, perPage = 20) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiring = async () => {
      setLoading(true);
      
      // Get a wider range (3 days ago to 3 days from now) to ensure data is visible
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
      const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
      
      const start = Math.floor(threeDaysAgo.getTime() / 1000);
      const end = Math.floor(threeDaysFromNow.getTime() / 1000);

      try {
        const result: any = await anilistRequest(AIRING_NOW_QUERY, { 
          page, 
          perPage, 
          airingAt_greater: start, 
          airingAt_lesser: end 
        });
        // Sort by airingAt to keep them chronological
        const sorted = (result.Page.airingSchedules || []).sort((a: any, b: any) => a.airingAt - b.airingAt);
        setData(sorted);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAiring();
  }, [page, perPage]);

  return { data, loading, error };
}

import { getExploreItems, managedExploreToAnime, syncExploreFromBackend } from "../utils/contentStore";

export function useAnimeDetail(id: number | string | undefined) {
  const [data, setData] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);

      const idStr = String(id).trim();
      const idNum = Number(id);

      // 1. Check if it's a custom admin-created explore/anime item
      let exploreItems = getExploreItems();
      
      const findInExplore = (items: typeof exploreItems) => {
        const exact = items.find(
          (e) => e.id === idStr || String(e.id).toLowerCase() === idStr.toLowerCase()
        );
        if (exact) return exact;
        if (!idStr.startsWith("exp-") && isNaN(Number(idStr))) {
          return items.find((e) => e.title.toLowerCase() === idStr.toLowerCase());
        }
        return undefined;
      };

      let directMatch = findInExplore(exploreItems);
      
      // If not found in local memory, sync immediately from backend API
      if (!directMatch) {
        exploreItems = await syncExploreFromBackend();
        directMatch = findInExplore(exploreItems);
      }

      if (directMatch) {
        setData(managedExploreToAnime(directMatch));
        setLoading(false);
        setError(null);
        return;
      }

      // If ID starts with custom prefix "exp-", do not call AniList or fallback
      if (idStr.startsWith("exp-") || idStr.startsWith("custom-")) {
        const generated = managedExploreToAnime({
          id: idStr,
          title: idStr.replace(/[-_]/g, " "),
          description: "Curated anime universe entry registered in the multiverse database.",
          image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
          category: "Anime",
          rating: 8.5,
          year: 2026,
          url: "",
          addedAt: Date.now()
        });
        setData(generated);
        setLoading(false);
        setError(null);
        return;
      }

      // 2. Fetch from AniList API if valid numeric ID
      if (!isNaN(idNum) && idNum > 0 && idNum < 900000) {
        try {
          const result: any = await anilistRequest(ANIME_DETAIL_QUERY, { id: idNum });
          if (result?.Media) {
            setData(result.Media);
            setError(null);
            setLoading(false);
            return;
          }
        } catch (err: any) {
          console.warn("AniList detail API error:", err?.message);
        }
      }

      // 3. Fallback to curated anime if available
      const fallback = FALLBACK_TRENDING_ANIME.find(
        (a) => a.id === idNum || String(a.id) === idStr
      );
      if (fallback) {
        setData(fallback);
        setError(null);
        setLoading(false);
        return;
      }

      // 4. If all fails, provide a graceful item
      setData(managedExploreToAnime({
        id: idStr,
        title: idStr.replace(/[-_]/g, " "),
        description: "Curated anime universe entry on Fan Hub Plus.",
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
        category: "Anime",
        rating: 8.5,
        year: 2026,
        url: "",
        addedAt: Date.now()
      }));

      setError(null);
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  return { data, loading, error };
}


