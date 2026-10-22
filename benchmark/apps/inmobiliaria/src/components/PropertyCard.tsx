"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { formatPrice, photo, type Property } from "@/lib/properties";
import { FavButton } from "./Favorites";

/** Tarjeta: al pasar el mouse sobre la foto, la galería se recorre según la posición del cursor. */
export default function PropertyCard({
  p,
  onHover,
  highlight = false,
  className = "",
}: {
  p: Property;
  onHover?: (slug: string | null) => void;
  highlight?: boolean;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const pics = p.gallery.slice(0, 5);

  return (
    <Link
      href={`/propiedades/${p.slug}`}
      onMouseEnter={() => onHover?.(p.slug)}
      onMouseLeave={() => {
        onHover?.(null);
        setI(0);
      }}
      className={`group block ${className}`}
    >
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setI(Math.min(pics.length - 1, Math.floor(((e.clientX - r.left) / r.width) * pics.length)));
        }}
        className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand transition-shadow duration-500 ${
          highlight ? "ring-2 ring-brass ring-offset-2 ring-offset-ivory" : ""
        }`}
      >
        {pics.map((src, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={photo(src, 900, 675)}
            alt={k === 0 ? p.title : ""}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-105 ${
              k === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${p.op === "Venta" ? "bg-ink text-ivory" : "bg-brass text-white"}`}>
            {p.op}
          </span>
          {(p.tour || p.lot) && (
            <span className="flex items-center gap-1 rounded-full bg-ivory/90 px-3 py-1 text-[11px] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              {p.lot ? "Terreno 3D" : "Recorrido virtual"}
            </span>
          )}
        </div>
        <FavButton slug={p.slug} className="absolute top-3 right-3" />

        {/* indicadores de galería */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {pics.map((_, k) => (
            <motion.span key={k} animate={{ width: k === i ? 18 : 6 }} className="h-1.5 rounded-full bg-white/90" />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.15em] text-ink/50 uppercase">
            {p.type} · {p.barrio}
          </p>
          <h3 className="mt-1 truncate font-serif text-2xl leading-tight transition-colors group-hover:text-brass">{p.title}</h3>
        </div>
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-all duration-500 group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
          →
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between px-1 text-sm">
        <span className="font-medium">{formatPrice(p)}</span>
        <span className="flex gap-3 text-ink/60">
          <span>{p.m2.toLocaleString("es-AR")} m²</span>
          {p.amb && <span>{p.amb} amb</span>}
          {p.dorm && <span>{p.dorm} dorm</span>}
        </span>
      </div>
    </Link>
  );
}
