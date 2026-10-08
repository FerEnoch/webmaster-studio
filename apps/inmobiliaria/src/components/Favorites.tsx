"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { favs: string[]; toggle: (slug: string) => void; has: (slug: string) => boolean };
const FavCtx = createContext<Ctx>({ favs: [], toggle: () => {}, has: () => false });

const KEY = "umbral:favs";

/** Favoritos del visitante (solo en su navegador). */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch {}
  }, []);

  const toggle = (slug: string) =>
    setFavs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  return <FavCtx.Provider value={{ favs, toggle, has: (s) => favs.includes(s) }}>{children}</FavCtx.Provider>;
}

export const useFavorites = () => useContext(FavCtx);

/** Corazón con "explosión" de partículas al marcar. */
export function FavButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle } = useFavorites();
  const on = has(slug);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={on ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-transform active:scale-90 ${className}`}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        animate={on ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <path
          d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"
          fill={on ? "#a8834b" : "none"}
          stroke={on ? "#a8834b" : "#14130f"}
          strokeWidth="1.6"
        />
      </motion.svg>
      <AnimatePresence>
        {on &&
          Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-brass"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 22, y: Math.sin(a) * 22, opacity: 0, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            );
          })}
      </AnimatePresence>
    </button>
  );
}
