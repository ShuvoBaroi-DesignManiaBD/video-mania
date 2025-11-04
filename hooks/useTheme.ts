"use client";
import { useEffect, useState } from "react";

type ThemeName = "theme-blue-light" | "theme-blue-dark";

const STORAGE_KEY = "videomania-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>("theme-blue-light");

  useEffect(() => {
    const saved = (typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as ThemeName | null) : null) ||
      "theme-blue-light";
    setThemeState(saved);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("theme-blue-light", "theme-blue-dark", "dark");
      document.documentElement.classList.add(saved);
    }
  }, []);

  const setTheme = (name: ThemeName) => {
    setThemeState(name);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("theme-blue-light", "theme-blue-dark", "dark");
      document.documentElement.classList.add(name);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, name);
    }
  };

  const toggle = () => setTheme(theme === "theme-blue-light" ? "theme-blue-dark" : "theme-blue-light");

  return { theme, setTheme, toggle } as const;
}