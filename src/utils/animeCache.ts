export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export const animeCache = {
  set: <T>(key: string, data: T) => {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`fanHub_${key}`, JSON.stringify(item));
  },

  get: <T>(key: string): T | null => {
    const itemStr = localStorage.getItem(`fanHub_${key}`);
    if (!itemStr) return null;

    try {
      const item: CacheItem<T> = JSON.parse(itemStr);
      const isExpired = Date.now() - item.timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(`fanHub_${key}`);
        return null;
      }
      
      return item.data;
    } catch (e) {
      localStorage.removeItem(`fanHub_${key}`);
      return null;
    }
  },

  clear: (key: string) => {
    localStorage.removeItem(`fanHub_${key}`);
  }
};
