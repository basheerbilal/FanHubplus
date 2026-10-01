import { useState, useEffect } from "react";
import { fetchLatestAnimeNews, fetchAnimeNewsById } from "../services/animeNews";
import { NewsArticle } from "../types/anime";
import { animeCache } from "../utils/animeCache";

export function useAnimeNews() {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const cached = animeCache.get<NewsArticle[]>("anime_news");
      
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      try {
        const news = await fetchLatestAnimeNews();
        setData(news);
        animeCache.set("anime_news", news);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { data, loading, error };
}

export function useAnimeNewsById(malId: number) {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!malId) return;
    const fetchNews = async () => {
      setLoading(true);
      try {
        const news = await fetchAnimeNewsById(malId);
        setData(news);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [malId]);

  return { data, loading, error };
}
