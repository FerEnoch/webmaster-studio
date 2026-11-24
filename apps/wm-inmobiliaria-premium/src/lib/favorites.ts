import { useEffect, useState } from "react";
import { propertySlugs } from "./properties";

export const FAVORITES_KEY = "estudio-real-state:favorites:v1";
export const FAVORITES_EVENT = "estudio-real-state:favorites-changed";

export function readFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
    const valid = Array.isArray(parsed)
      ? [...new Set(parsed.filter((slug): slug is string => typeof slug === "string" && propertySlugs.has(slug)))]
      : [];
    if (JSON.stringify(parsed) !== JSON.stringify(valid)) localStorage.setItem(FAVORITES_KEY, JSON.stringify(valid));
    return valid;
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): string[] {
  if (!propertySlugs.has(slug)) return readFavorites();
  const current = readFavorites();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: next }));
  } catch {
    // Storage can be unavailable in privacy modes; the UI remains non-destructive.
  }
  return next;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return favorites;
}
