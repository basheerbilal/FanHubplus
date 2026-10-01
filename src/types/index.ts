/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ContentType = "article" | "video" | "audio" | "image";
export type FandomCategory = "Anime" | "Gaming" | "Movies" | "TV Shows" | "K-Pop" | "Comics" | "Manga" | "Cosplay";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: FandomCategory;
  genre: string[];
  year: number;
  rating: number;
  popularity: number;
  type: ContentType;
  duration?: string; // for video/audio
  author?: string; // for article
  readTime?: string; // for article
  isTrending?: boolean;
  isPopular?: boolean;
}

export interface Character {
  id: string;
  name: string;
  fandom: FandomCategory;
  image: string;
  bio: string;
  traits: string[];
  appearances: string[];
  popularity: number;
}

export interface EventItem {
  id: string;
  title: string;
  city: string;
  date: string;
  venue: string;
  type: "Convention" | "Premiere" | "Tournament" | "Concert" | "Fan Meetup" | "Exhibition";
  description: string;
  category: FandomCategory;
}

export type Event = EventItem;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isEmailVerified?: boolean;
  favorites: FandomCategory[];
  role: "visitor" | "registered" | "admin";
}

export interface ChatFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FanSubmission {
  id: string;
  title: string;
  category: FandomCategory;
  type: string;
  description: string;
  image?: string;
  sourceUrl?: string;
  authorEmail?: string;
  status: "pending" | "approved" | "rejected";
  timestamp: number;
}

export interface Activity {
  id: string;
  type: "watchlist" | "view" | "rate" | "join";
  contentId?: string;
  contentTitle?: string;
  timestamp: number;
}

export interface Rating {
  contentId: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
}

export interface TopShowItem {
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
