"use client";

import { motion } from "motion/react";
import { useId } from "react";
import type { Wine } from "@/lib/content";

/** Copa: ícono de la marca. Hereda el color con currentColor. */
export function Glass({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="M10 4h28c1 12-2 24-14 26C12 28 9 16 10 4Z" />
      <path d="M11 16h26" opacity=".5" />
      <path d="M24 30v24M14 60h20" />
    </svg>
  );
}

/**
 * Botella ilustrada: así el catálogo se ve como una colección y no aparecen marcas reales.
 * Vidrio con brillo, cápsula de color y etiqueta crema con el nombre ficticio.
 */
export function Bottle({ wine, className = "" }: { wine: Wine; className?: string }) {
  const id = useId().replace(/:/g, "");
  const light = wine.type === "blanco" || wine.type === "rosado";
  return (
    <svg viewBox="0 0 120 400" className={className} aria-label={`${wine.name} ${wine.varietal}`}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={wine.glass} stopOpacity={light ? 0.85 : 1} />
          <stop offset=".45" stopColor={wine.glass} stopOpacity={light ? 0.7 : 0.92} />
          <stop offset="1" stopColor="#000" stopOpacity={light ? 0.35 : 0.9} />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Vidrio */}
      <path
        d={wine.type === "espumante" ? "M48 6h24v70c0 30 34 46 34 86v220c0 6-4 10-10 10H24c-6 0-10-4-10-10V162c0-40 34-56 34-86Z" : "M47 6h26v104c0 18 32 22 32 52v220c0 6-4 10-10 10H25c-6 0-10-4-10-10V162c0-30 32-34 32-52Z"}
        fill={`url(#g${id})`}
      />
      {/* Vino visible en botellas claras */}
      {light && <path d="M16 230h88v152c0 5-4 9-9 9H25c-5 0-9-4-9-9Z" fill={wine.liquid} opacity=".55" />}
      {/* Cápsula */}
      <path d={wine.type === "espumante" ? "M45 2h30v62H45Z" : "M46 2h28v70H46Z"} fill={wine.capsule} />
      <path d="M46 62h28v4H46Z" fill="#000" opacity=".25" />
      {/* Etiqueta */}
      <rect x="22" y="214" width="76" height="112" rx="3" fill="#f3ece0" />
      <rect x="27" y="219" width="66" height="102" rx="2" fill="none" stroke={wine.capsule} strokeWidth=".8" opacity=".6" />
      <text x="60" y="240" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="5.4" letterSpacing="1.6" fill="#5a1426">
        {wine.producer.toUpperCase()}
      </text>
      <text x="60" y="270" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize={wine.name.length > 11 ? 12.5 : 16} fill="#160d10">
        {wine.name}
      </text>
      <path d="M44 280h32" stroke="#c19a5b" strokeWidth=".8" />
      <text x="60" y="294" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="6.2" fill="#160d10">
        {wine.varietal}
      </text>
      <text x="60" y="310" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="5.2" fill="#160d10" opacity=".6">
        {wine.year} · {wine.altitude.toLocaleString("es-AR")} m
      </text>
      {/* Brillo */}
      <rect x="30" y="150" width="10" height="236" rx="5" fill={`url(#s${id})`} />
    </svg>
  );
}

/** Copa que se llena con el color del vino (ola animada). */
export function FillGlass({ color, level, className = "" }: { color: string; level: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  // level 0..1 → altura del líquido dentro del cáliz (y de 150 a 40)
  const y = 150 - 110 * level;
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden>
      <defs>
        <clipPath id={`c${id}`}>
          <path d="M40 20h120c6 60 0 120-60 132C40 140 34 80 40 20Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <motion.g initial={{ y: 150 }} animate={{ y }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
          <motion.path
            animate={{ x: [-150, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            d="M0 6 C25 0 50 0 75 6 S125 12 150 6 S200 0 225 6 S275 12 300 6 S350 0 375 6 S400 12 400 6 V200 H0Z"
            fill={color}
          />
        </motion.g>
      </g>
      <path d="M40 20h120c6 60 0 120-60 132C40 140 34 80 40 20Z" fill="none" stroke="currentColor" strokeWidth="3" opacity=".7" />
      <path d="M100 152v118M60 284h80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      <path d="M58 34c-2 30 2 60 16 80" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".18" fill="none" />
    </svg>
  );
}
