import { useState, useEffect } from "react";
import { fetchTMDBTrendingMovies, fetchRAWGGames, fetchComicVineCharacters } from "../services/external";
import { getExploreItems, syncExploreFromBackend } from "../utils/contentStore";
import { api } from "../services/api";

export interface ExternalMedia {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  year: number;
  url: string;
  trailerUrl?: string;
  isCommunity?: boolean;
  isSubmission?: boolean;
  authorEmail?: string;
  submissionType?: string;
}

export function useExternalMedia(category: string) {
  const [data, setData] = useState<ExternalMedia[]>([]);
  const [loading, setLoading] = useState(false);

  // Normalize category string e.g. "tv show", "tv shows", "tv%20show" -> "tvshows"
  const normCat = (category || "all").toLowerCase().replace(/[\s\-_%20]/g, "").replace(/s$/, "");
  const isCommunity = normCat === "community" || normCat === "fancreation" || normCat === "fanupload" || normCat === "fan" || normCat === "submission";

  useEffect(() => {
    if (normCat === "anime" && !isCommunity) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        let results: ExternalMedia[] = [];

        // 1. Fetch fresh explore items and submissions from backend
        let exploreDbItems = await syncExploreFromBackend();
        let approvedSubmissions: any[] = [];
        try {
          const subRes = await api.getSubmissions();
          if (subRes?.submissions && Array.isArray(subRes.submissions)) {
            approvedSubmissions = subRes.submissions.filter((s: any) => s.status === "approved");
          }
        } catch {}

        // Map approved submissions into explore items format
        const mappedSubmissions: ExternalMedia[] = approvedSubmissions.map((s: any) => ({
          id: `sub-${s.id.replace(/^sub-/, "")}`,
          title: s.title,
          description: s.description,
          image: s.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
          category: s.category || "Anime",
          rating: 9.0,
          year: new Date(s.timestamp || Date.now()).getFullYear(),
          url: s.sourceUrl || "",
          trailerUrl: s.sourceUrl?.includes("youtu") || s.sourceUrl?.startsWith("/uploads/") ? s.sourceUrl : "",
          isCommunity: true,
          isSubmission: true,
          authorEmail: s.authorEmail,
          submissionType: s.type || "Article",
        }));

        // Map explore items from content store
        const mappedExplore: ExternalMedia[] = exploreDbItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          category: item.category,
          rating: item.rating,
          year: item.year,
          url: item.url,
          trailerUrl: item.trailerUrl,
          isCommunity: item.isCommunity || item.isSubmission || item.id.startsWith("sub-"),
          isSubmission: item.isSubmission || item.id.startsWith("sub-"),
          authorEmail: item.authorEmail,
          submissionType: item.submissionType,
        }));

        // Combine custom & fan items (deduplicated by title)
        const combinedCustomMap = new Map<string, ExternalMedia>();
        for (const item of [...mappedExplore, ...mappedSubmissions]) {
          const key = (item.title || "").toLowerCase().trim();
          if (key && !combinedCustomMap.has(key)) {
            combinedCustomMap.set(key, item);
          }
        }
        const allCustomItems = Array.from(combinedCustomMap.values());

        // If category is "community" / "fan creations"
        if (isCommunity) {
          const communityItems = allCustomItems.filter(
            (i) => i.isCommunity || i.isSubmission || i.id.startsWith("sub-")
          );
          setData(communityItems.length > 0 ? communityItems : allCustomItems);
          setLoading(false);
          return;
        }

        // Fetch external 3rd party APIs for non-anime categories
        if (normCat === "all" || normCat === "movie" || normCat === "tvshow") {
          const movies = await fetchTMDBTrendingMovies();
          results = [
            ...results,
            ...movies.map((m: any) => ({
              id: `tmdb-${m.id}`,
              title: m.title || m.name,
              description: m.overview,
              image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
              category: m.media_type === "tv" ? "TV Shows" : "Movies",
              rating: m.vote_average,
              year: new Date(m.release_date || m.first_air_date || Date.now()).getFullYear(),
              url: `https://www.themoviedb.org/${m.media_type || 'movie'}/${m.id}`
            }))
          ];
        }

        if (normCat === "all" || normCat === "gaming" || normCat === "game") {
          const games = await fetchRAWGGames();
          results = [
            ...results,
            ...games.map((g: any) => ({
              id: `rawg-${g.id}`,
              title: g.name,
              description: `A highly-rated game with ${g.ratings_count} community reviews.`,
              image: g.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
              category: "Gaming",
              rating: g.rating,
              year: new Date(g.released || Date.now()).getFullYear(),
              url: `https://rawg.io/games/${g.slug}`
            }))
          ];
        }

        if (normCat === "all" || normCat === "comic") {
          const comics = await fetchComicVineCharacters();
          results = [
            ...results,
            ...comics.map((c: any) => ({
              id: `comicvine-${c.id}`,
              title: c.name,
              description: c.deck || `A legendary character from the ${c.publisher?.name || 'Comics'} universe.`,
              image: c.image?.screen_large_url || c.image?.medium_url || "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=800",
              category: "Comics",
              rating: 4.5,
              year: 2024,
              url: c.site_detail_url
            }))
          ];
        }

        // Filter custom items by normalized selected category
        const filteredCustom = allCustomItems.filter(item => {
          if (normCat === "all") return true;
          const itemCatNorm = (item.category || "").toLowerCase().replace(/[\s\-_%20]/g, "").replace(/s$/, "");
          return itemCatNorm === normCat || itemCatNorm.includes(normCat) || normCat.includes(itemCatNorm);
        });

        // Merge: custom items first, then filter out any API duplicates by title
        const customTitles = new Set(filteredCustom.map(i => i.title.toLowerCase().trim()));
        const deduped = results.filter(r => !customTitles.has(r.title.toLowerCase().trim()));
        setData([...filteredCustom, ...deduped]);
      } catch (error) {
        console.error("Media fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, normCat, isCommunity]);

  return { data, loading };
}
