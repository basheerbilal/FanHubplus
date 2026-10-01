export interface Anime {
  id: number;
  idMal?: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    extraLarge: string;
    large: string;
    color: string;
  };
  bannerImage: string;
  genres: string[];
  tags: {
    name: string;
    description: string;
  }[];
  format: string;
  status: string;
  season: string;
  seasonYear: number;
  episodes: number;
  duration: number;
  averageScore: number;
  meanScore: number;
  popularity: number;
  trending: number;
  favourites: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  studios: {
    nodes: {
      name: string;
      isMain: boolean;
    }[];
  };
  characters: {
    nodes: CharacterNode[];
  };
  staff: {
    nodes: StaffNode[];
  };
  relations: {
    nodes: RelationNode[];
    edges?: RelationEdge[];
  };
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
  airingSchedule: {
    nodes: AiringScheduleNode[];
  };
  siteUrl: string;
  isAdult: boolean;
  trailer?: {
    id: string;
    site: string;
    thumbnail: string;
  };
}

export interface CharacterNode {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    large: string;
  };
  description?: string;
  role?: string;
}

export interface StaffNode {
  id: number;
  name: {
    full: string;
  };
  image: {
    large: string;
  };
  primaryOccupations: string[];
}

export interface RelationNode {
  id: number;
  title: {
    romaji: string;
    english?: string;
  };
  type: string;
  status: string;
  format: string;
  relationType?: string;
  episodes?: number;
  season?: string;
  seasonYear?: number;
  coverImage: {
    large: string;
  };
}

export interface RelationEdge {
  relationType: string;
  node: RelationNode;
}

export interface AiringScheduleNode {
  airingAt: number;
  episode: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  publishedAt: string;
  source: string;
  animeId?: number;
  animeTitle?: string;
}

export interface PaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}
