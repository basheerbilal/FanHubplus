import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { anilistRequest, ANIME_SEARCH_QUERY, FALLBACK_TRENDING_ANIME } from "../../services/anilist";
import { AnimeCard, AnimeCardSkeleton } from "./AnimeCard";
import { Anime } from "../../types/anime";
import { motion } from "motion/react";

import { StaggerContainer, StaggerItem } from "../common/StaggerContainer";

import { getCustomAnimeItems, syncExploreFromBackend } from "../../utils/contentStore";

interface AnimeExploreGridProps {
  searchQuery: string;
  genre: string;
  sort: string;
}

export const AnimeExploreGrid = ({ searchQuery, genre, sort }: AnimeExploreGridProps) => {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Map our UI sort to AniList sort
  const getAniListSort = (s: string) => {
    switch (s) {
      case "popular": return ["POPULARITY_DESC"];
      case "rating": return ["SCORE_DESC"];
      case "latest": return ["START_DATE_DESC"];
      case "alpha": return ["TITLE_ROMAJI"];
      default: return ["TRENDING_DESC"];
    }
  };

  useEffect(() => {
    setPage(1);
    setData([]);
    setError(null);
  }, [searchQuery, genre, sort]);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const variables: any = {
          page,
          perPage: 20,
          sort: getAniListSort(sort),
          isAdult: false
        };

        if (searchQuery) variables.search = searchQuery;
        if (genre !== "all") variables.genre = genre;

        const result: any = await anilistRequest(ANIME_SEARCH_QUERY, variables);
        let mediaList: Anime[] = result?.Page?.media || [];

        // Fetch custom anime added by Admin
        let customList: Anime[] = [];
        if (page === 1) {
          let allCustom = getCustomAnimeItems();
          if (allCustom.length === 0) {
            await syncExploreFromBackend();
            allCustom = getCustomAnimeItems();
          }
          customList = allCustom.filter((item: any) => {
            const matchesSearch = !searchQuery || 
              (item.title?.english || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.title?.romaji || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
          });
        }
        
        if (mediaList.length > 0 || customList.length > 0) {
          // Merge: custom items first, then AniList mediaList without title duplicates
          const customTitles = new Set(customList.map(c => (c.title.english || c.title.romaji || "").toLowerCase()));
          const dedupedMedia = mediaList.filter(m => !customTitles.has((m.title.english || m.title.romaji || "").toLowerCase()));
          const combined = [...customList, ...dedupedMedia];

          setData(prev => page === 1 ? combined : [...prev, ...dedupedMedia]);
          setHasNextPage(result?.Page?.pageInfo?.hasNextPage ?? false);
        } else if (page === 1) {
          setData(FALLBACK_TRENDING_ANIME);
        }
      } catch (err: any) {
        console.warn("Anime Explore Error, using curated fallback:", err?.message);
        if (page === 1) {
          const allCustom = getCustomAnimeItems();
          setData([...allCustom, ...FALLBACK_TRENDING_ANIME]);
        } else {
          setError(err.message || "Failed to connect to the multiverse database.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [page, searchQuery, genre, sort]);

  if (error && data.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-main mb-2">Connection Error</h3>
        <p className="text-muted mb-8">{error}</p>
        <button 
          onClick={() => setPage(1)}
          className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
        {data.map((anime) => (
          <StaggerItem key={anime.id}>
            <AnimeCard anime={anime} />
          </StaggerItem>
        ))}
        {loading && Array.from({ length: 12 }).map((_, i) => (
          <AnimeCardSkeleton key={`skeleton-${i}`} />
        ))}
      </StaggerContainer>

      {hasNextPage && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-12 py-4 bg-white dark:bg-bg-main border border-slate-200 dark:border-glass rounded-2xl font-black text-slate-800 dark:text-main hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-md"
          >
            Load More Discoveries
          </button>
        </div>
      )}

      {!hasNextPage && data.length > 0 && (
        <div className="text-center py-12 text-muted font-bold uppercase tracking-widest text-sm">
          You've reached the end of this universe
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="py-24 text-center">
          <h3 className="text-2xl font-bold text-main mb-2">No anime found</h3>
          <p className="text-muted">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};
