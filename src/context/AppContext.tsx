import React, { createContext, useContext, useState, useEffect } from "react";
import { Activity, FandomCategory, Rating } from "../types";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";
import { storage } from "../utils/localStorage";

interface AppContextType {
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  favorites: FandomCategory[];
  toggleFavorite: (category: FandomCategory) => void;
  ratings: Rating[];
  rateContent: (contentId: string, score: number) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // User-scoped state: initialized fresh or from user-specific key
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const key = user?.id ? `WATCHLIST_${user.id}` : null;
    return key ? storage.get<string[]>(key) || [] : [];
  });
  const [favorites, setFavorites] = useState<FandomCategory[]>(() => {
    const key = user?.id ? `FAVORITES_${user.id}` : null;
    return key ? storage.get<FandomCategory[]>(key) || [] : [];
  });
  const [ratings, setRatings] = useState<Rating[]>(() => {
    const key = user?.id ? `RATINGS_${user.id}` : null;
    return key ? storage.get<Rating[]>(key) || [] : [];
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    const key = user?.id ? `ACTIVITY_${user.id}` : null;
    return key ? storage.get<Activity[]>(key) || [] : [];
  });

  // Switch and load isolated user data whenever user logs in, switches, or logs out
  useEffect(() => {
    if (!user?.id) {
      setWatchlist([]);
      setFavorites([]);
      setRatings([]);
      setActivities([]);
      return;
    }

    const userWatchlistKey = `WATCHLIST_${user.id}`;
    const userFavoritesKey = `FAVORITES_${user.id}`;
    const userRatingsKey = `RATINGS_${user.id}`;
    const userActivityKey = `ACTIVITY_${user.id}`;

    // Instant local restore for this specific user
    const cachedWatchlist = storage.get<string[]>(userWatchlistKey);
    const cachedFavorites = storage.get<FandomCategory[]>(userFavoritesKey);
    const cachedRatings = storage.get<Rating[]>(userRatingsKey);
    const cachedActivity = storage.get<Activity[]>(userActivityKey);

    setWatchlist(cachedWatchlist || []);
    setFavorites(cachedFavorites || (user.favorites as FandomCategory[]) || []);
    setRatings(cachedRatings || []);
    setActivities(cachedActivity || []);

    // Sync authoritative data from Node.js / MongoDB backend
    const fetchUserData = async () => {
      try {
        const data = await api.getUserData(user.id);
        if (data) {
          const wl = Array.isArray(data.watchlist) ? data.watchlist : [];
          const favs = Array.isArray(data.favorites) ? (data.favorites as FandomCategory[]) : (user.favorites as FandomCategory[]) || [];
          const rts = Array.isArray(data.ratings) ? data.ratings : [];
          const acts = Array.isArray(data.activities) ? data.activities : [];

          setWatchlist(wl);
          storage.set(userWatchlistKey, wl);

          setFavorites(favs);
          storage.set(userFavoritesKey, favs);

          setRatings(rts);
          storage.set(userRatingsKey, rts);

          setActivities(acts);
          storage.set(userActivityKey, acts);
        }
      } catch (err) {
        console.warn("Could not fetch user data from backend:", err);
      }
    };
    fetchUserData();
  }, [user?.id]);

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      if (user?.id) {
        storage.set(`WATCHLIST_${user.id}`, next);
      }
      return next;
    });

    if (user?.id) {
      api.toggleWatchlist(user.id, id).catch((err) => console.warn("Sync watchlist failed:", err));
    }
  };

  const toggleFavorite = (category: FandomCategory) => {
    setFavorites((prev) => {
      const next = prev.includes(category) ? prev.filter((f) => f !== category) : [...prev, category];
      if (user?.id) {
        storage.set(`FAVORITES_${user.id}`, next);
      }
      return next;
    });

    if (user?.id) {
      api.toggleFavorite(user.id, category).catch((err) => console.warn("Sync favorite failed:", err));
    }
  };

  const rateContent = (contentId: string, score: number) => {
    setRatings((prev) => {
      const existing = prev.find((r) => r.contentId === contentId);
      const next = existing
        ? prev.map((r) => (r.contentId === contentId ? { ...r, score } : r))
        : [...prev, { contentId, score }];
      if (user?.id) {
        storage.set(`RATINGS_${user.id}`, next);
      }
      return next;
    });

    if (user?.id) {
      api.rateContent(user.id, contentId, score).catch((err) => console.warn("Sync rating failed:", err));
    }
  };

  const addActivity = (activity: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setActivities((prev) => {
      const next = [newActivity, ...prev].slice(0, 50);
      if (user?.id) {
        storage.set(`ACTIVITY_${user.id}`, next);
      }
      return next;
    });

    if (user?.id) {
      api.addActivity(user.id, activity).catch((err) => console.warn("Sync activity failed:", err));
    }
  };

  return (
    <AppContext.Provider
      value={{
        watchlist,
        toggleWatchlist,
        favorites,
        toggleFavorite,
        ratings,
        rateContent,
        activities,
        addActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
