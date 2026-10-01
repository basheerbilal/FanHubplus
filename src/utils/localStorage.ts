const KEYS = {
  USER: "fanHub_user",
  WATCHLIST: "fanHub_watchlist",
  FAVORITES: "fanHub_favorites",
  ACTIVITY: "fanHub_activity",
  RATINGS: "fanHub_ratings",
  THEME: "fanHub_theme",
  FONT_SIZE: "fanHub_fontSize",
  FEEDBACK: "fanHub_feedback",
  CHAT: "fanHub_chat",
  RECENT_SEARCHES: "fanHub_recentSearches",
  SUBMISSIONS: "fanHub_submissions",
  FAQS: "fanHub_faqs",
  MERCH_VIEWS: "fanHub_merchViews",
  ADMIN_MERCH: "fanHub_adminMerch",
  ADMIN_EXPLORE: "fanHub_adminExplore",
};

export const storage = {
  get: <T>(key: keyof typeof KEYS | string): T | null => {
    const storageKey = key in KEYS ? (KEYS as any)[key] : key;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  },
  set: (key: keyof typeof KEYS | string, value: any) => {
    const storageKey = key in KEYS ? (KEYS as any)[key] : key;
    localStorage.setItem(storageKey, JSON.stringify(value));
  },
  remove: (key: keyof typeof KEYS | string) => {
    const storageKey = key in KEYS ? (KEYS as any)[key] : key;
    localStorage.removeItem(storageKey);
  },
};
