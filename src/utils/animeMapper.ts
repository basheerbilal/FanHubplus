import { Anime } from "../types/anime";
import { ContentItem } from "../types";

export const mapAnimeToContentItem = (anime: any): ContentItem => {
  return {
    id: `anime-${anime.id}`,
    title: anime.title.english || anime.title.romaji || anime.title.native,
    description: anime.description || "",
    image: anime.coverImage.extraLarge || anime.coverImage.large,
    category: "Anime",
    genre: anime.genres || [],
    year: anime.seasonYear || new Date().getFullYear(),
    rating: (anime.averageScore || 0) / 20, // Convert 0-100 to 0-5
    popularity: anime.popularity || 0,
    type: "video",
    isTrending: !!anime.trending,
    isPopular: anime.popularity > 50000,
  };
};
