const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const COMIC_VINE_API_KEY = import.meta.env.VITE_COMIC_VINE_API_KEY;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const RAWG_BASE_URL = "https://api.rawg.io/api";
const COMIC_VINE_BASE_URL = "https://comicvine.gamespot.com/api";

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const fetchWithProxy = async (url: string) => {
  try {
    const response = await fetch(url);
    return response;
  } catch (e) {
    console.warn("Direct fetch failed, trying proxy for:", url);
    return fetch(`/api/proxy/external?url=${encodeURIComponent(url)}`);
  }
};

async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type");
  if (!res.ok) {
    throw new Error(`External API error: ${res.status}`);
  }
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("External API returned non-JSON response");
  }
  return res.json();
}

// Movies & TV Shows (TMDB)
export async function fetchTMDBTrendingPeople() {
  if (!TMDB_API_KEY) return [];
  try {
    const res = await fetchWithProxy(`${TMDB_BASE_URL}/trending/person/week?api_key=${TMDB_API_KEY}`);
    const data = await safeJson(res);
    return data.results || [];
  } catch (error) {
    console.warn("TMDB People Fetch Error:", error);
    return [];
  }
}

export async function fetchTMDBTrendingMovies() {
  if (!TMDB_API_KEY) return [];
  try {
    const res = await fetchWithProxy(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
    const data = await safeJson(res);
    return data.results || [];
  } catch (error) {
    console.warn("TMDB Movies Fetch Error:", error);
    return [];
  }
}

export async function fetchTMDBDetail(id: string) {
  if (!TMDB_API_KEY) return null;
  try {
    const res = await fetchWithProxy(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
    if (!res.ok) {
      const tvRes = await fetchWithProxy(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`);
      return await safeJson(tvRes);
    }
    return await safeJson(res);
  } catch (error) {
    console.warn("TMDB Detail Fetch Error:", error);
    return null;
  }
}

// Gaming (RAWG)
export async function fetchRAWGGames() {
  if (!RAWG_API_KEY) return [];
  try {
    const res = await fetchWithProxy(`${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page_size=12`);
    const data = await safeJson(res);
    return data.results || [];
  } catch (error) {
    console.warn("RAWG Games Fetch Error:", error);
    return [];
  }
}

export async function fetchRAWGDetail(id: string) {
  if (!RAWG_API_KEY) return null;
  try {
    const res = await fetchWithProxy(`${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`);
    return await safeJson(res);
  } catch (error) {
    console.warn("RAWG Detail Fetch Error:", error);
    return null;
  }
}

// Comics (Comic Vine)
export async function fetchComicVineCharacters() {
  if (!COMIC_VINE_API_KEY) return [];
  try {
    const targetUrl = `${COMIC_VINE_BASE_URL}/characters/?api_key=${COMIC_VINE_API_KEY}&format=json&sort=count_of_issue_appearances:desc&limit=12`;
    const res = await fetchWithProxy(targetUrl);
    const data = await safeJson(res);
    return data.results || [];
  } catch (error) {
    console.warn("Comic Vine Fetch Error:", error);
    return [];
  }
}
