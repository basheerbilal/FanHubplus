import { useState, useEffect } from "react";

export interface AnimeEpisode {
  mal_id: number;
  title: string;
  title_japanese?: string;
  title_romanji?: string;
  aired?: string;
  score?: number;
  filler?: boolean;
  recap?: boolean;
  forum_url?: string;
}

export function useAnimeEpisodes(idMal?: number, totalEpisodes?: number) {
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchEpisodes() {
      if (!idMal) {
        // Fallback: generate episode stubs based on totalEpisodes
        if (totalEpisodes && totalEpisodes > 0) {
          const count = Math.min(totalEpisodes, 100);
          const mockEps: AnimeEpisode[] = Array.from({ length: count }, (_, i) => ({
            mal_id: i + 1,
            title: `Episode ${i + 1}`,
          }));
          if (isMounted) {
            setEpisodes(mockEps);
            setLoading(false);
          }
        } else {
          if (isMounted) setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${idMal}/episodes`);
        if (!response.ok) {
          throw new Error("Failed to load episode stream");
        }
        const data = await response.json();
        if (isMounted) {
          if (data && data.data && data.data.length > 0) {
            setEpisodes(data.data);
          } else if (totalEpisodes && totalEpisodes > 0) {
            const count = Math.min(totalEpisodes, 100);
            setEpisodes(Array.from({ length: count }, (_, i) => ({
              mal_id: i + 1,
              title: `Episode ${i + 1}`,
            })));
          }
          setError(null);
        }
      } catch (err: any) {
        console.warn("Jikan episodes fetch warning:", err);
        // Fallback if Jikan rate-limited: generate from totalEpisodes
        if (isMounted) {
          if (totalEpisodes && totalEpisodes > 0) {
            const count = Math.min(totalEpisodes, 100);
            setEpisodes(Array.from({ length: count }, (_, i) => ({
              mal_id: i + 1,
              title: `Episode ${i + 1}`,
            })));
          }
          setError(null); // Don't show hard error to user
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchEpisodes();

    return () => {
      isMounted = false;
    };
  }, [idMal, totalEpisodes]);

  return { episodes, loading, error };
}
