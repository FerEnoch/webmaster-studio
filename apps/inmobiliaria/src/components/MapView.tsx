"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { formatPrice, photo, type Property } from "@/lib/properties";

/** Mapa estilizado (sin servicio externo): río, autopistas y pines con precio. */
export default function MapView({
  items,
  active,
  onHover,
  className = "",
}: {
  items: Property[];
  active?: string | null;
  onHover?: (slug: string | null) => void;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-[#e9e4d8] ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="blocks" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="3.4" height="3.4" fill="#f3efe6" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#blocks)" />
        {/* Río */}
        <path d="M60 -5 C 75 20, 95 25, 105 40 L 105 -5 Z" fill="#b9cbd3" />
        <path d="M60 -5 C 75 20, 95 25, 105 40" fill="none" stroke="#a3b9c3" strokeWidth="0.6" />
        {/* Parques */}
        <ellipse cx="42" cy="38" rx="7" ry="4" fill="#cfd8b8" />
        <ellipse cx="20" cy="60" rx="9" ry="6" fill="#cfd8b8" />
        {/* Autopistas */}
        <path d="M-5 30 C 30 35, 50 45, 105 70" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M30 105 C 35 70, 45 40, 70 -5" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M-5 85 C 25 80, 60 85, 105 95" fill="none" stroke="#fff" strokeWidth="1.1" />
      </svg>

      {items.map((p) => {
        const on = active === p.slug;
        return (
          <Link
            key={p.slug}
            href={`/propiedades/${p.slug}`}
            onMouseEnter={() => onHover?.(p.slug)}
            onMouseLeave={() => onHover?.(null)}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${p.map[0]}%`, top: `${p.map[1] + 8}%`, zIndex: on ? 20 : 10 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: on ? 1.12 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className={`relative rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap shadow-lg transition-colors ${
                on ? "bg-ink text-ivory" : "bg-ivory text-ink"
              }`}
            >
              {p.currency === "USD" ? `US$ ${Math.round(p.price / 1000)}K` : `$ ${(p.price / 1e6).toFixed(1)}M`}
              <span className={`absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 ${on ? "bg-ink" : "bg-ivory"}`} />
            </motion.div>
            <AnimatePresence>
              {on && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute bottom-full left-1/2 mb-3 w-52 -translate-x-1/2 overflow-hidden rounded-2xl bg-ivory shadow-2xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo(p.cover, 420, 260)} alt="" className="h-28 w-full object-cover" />
                  <div className="p-3">
                    <p className="font-serif text-lg leading-tight">{p.title}</p>
                    <p className="text-xs text-ink/60">{formatPrice(p)}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}

      <span className="absolute bottom-3 left-3 rounded-full bg-ivory/90 px-3 py-1 text-[11px] text-ink/60">Mapa ilustrativo · AMBA y Patagonia</span>
    </div>
  );
}
