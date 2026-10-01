import React, { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../utils/localStorage";

type Theme = "dark" | "light";
type FontSize = "small" | "medium" | "large";

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => storage.get<Theme>("THEME") || "dark");
  const [fontSize, setFontSizeState] = useState<FontSize>(() => storage.get<FontSize>("FONT_SIZE") || "medium");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    storage.set("THEME", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px";
    storage.set("FONT_SIZE", fontSize);
  }, [fontSize]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const setFontSize = (size: FontSize) => setFontSizeState(size);

  return (
    <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
