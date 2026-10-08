"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { properties, type Property } from "@/lib/properties";
import { useFavorites } from "./Favorites";
import MapView from "./MapView";
import PropertyCard from "./PropertyCard";

const OPS = ["Todas", "Venta", "Alquiler"] as const;
const TYPES = ["Todos", "Casa", "Departamento", "Loft", "Terreno"] as const;
const SORTS = {
  relevancia: "Relevancia",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
  m2: "Más m²",
} as const;

export default function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const { favs } = useFavorites();
  const [q, setQ] = useState("");
  const [amb, setAmb] = useState(0);
  const [sort, setSort] = useState<keyof typeof SORTS>("relevancia");
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "map">("grid");

  const op = (params.get("op") as (typeof OPS)[number]) ?? "Todas";
  const type = (params.get("type") as (typeof TYPES)[number]) ?? "Todos";
  const onlyFavs = params.get("favs") === "1";

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    router.replace(`/propiedades?${next.toString()}`, { scroll: false });
  };

  const list = useMemo(() => {
    let out: Property[] = properties.filter(
      (p) =>
        (op === "Todas" || p.op === op) &&
        (type === "Todos" || p.type === type) &&
        (!amb || (p.amb ?? 0) >= amb) &&
        (!onlyFavs || favs.includes(p.slug)) &&
        (!q || `${p.title} ${p.barrio} ${p.ciudad}`.toLowerCase().includes(q.toLowerCase())),
    );
    // Precio comparable: alquileres en ARS se pasan a USD con un tipo de cambio de referencia.
    const usd = (p: Property) => (p.currency === "USD" ? p.price : p.price / 1200);
    if (sort === "precio-asc") out = [...out].sort((a, b) => usd(a) - usd(b));
    if (sort === "precio-desc") out = [...out].sort((a, b) => usd(b) - usd(a));
    if (sort === "m2") out = [...out].sort((a, b) => b.m2 - a.m2);
    return out;
  }, [op, type, amb, onlyFavs, favs, q, sort]);

  return (
    <div className="px-4 pt-28 pb-24 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs tracking-[0.25em] text-ink/50 uppercase">{onlyFavs ? "Tus favoritas" : "Catálogo"}</p>
            <h1 className="mt-2 font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.9]">
              <motion.span key={list.length} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block tabular-nums">
                {list.length}
              </motion.span>{" "}
              <span className="italic">propiedades</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar barrio o ciudad…"
              className="w-full rounded-full border border-ink/15 bg-white/60 px-5 py-3 text-sm outline-none focus:border-brass lg:w-72"
            />
            <div className="flex rounded-full bg-sand p-1 lg:hidden">
              {(["grid", "map"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-2 text-sm ${view === v ? "bg-ink text-ivory" : ""}`}>
                  {v === "grid" ? "Lista" : "Mapa"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="sticky top-24 z-30 -mx-1 mb-8 flex flex-wrap items-center gap-2 rounded-3xl bg-ivory/80 p-1 backdrop-blur-xl">
          <Chips options={OPS} value={op} onChange={(v) => setParam("op", v === "Todas" ? null : v)} id="op" />
          <Chips options={TYPES} value={type} onChange={(v) => setParam("type", v === "Todos" ? null : v)} id="type" />
          <Chips
            options={["Amb.", "1+", "2+", "3+", "4+"] as const}
            value={amb ? `${amb}+` : "Amb."}
            onChange={(v) => setAmb(v === "Amb." ? 0 : Number(v[0]))}
            id="amb"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}
            className="ml-auto rounded-full border border-ink/15 bg-transparent px-4 py-2 text-sm outline-none"
            aria-label="Ordenar"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          {onlyFavs && (
            <button onClick={() => setParam("favs", null)} className="rounded-full bg-brass px-4 py-2 text-sm text-white">
              Ver todas ✕
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(360px,38%)]">
          <motion.div layout className={`grid gap-x-6 gap-y-12 sm:grid-cols-2 ${view === "map" ? "hidden lg:grid" : ""}`}>
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PropertyCard p={p} onHover={setHover} highlight={hover === p.slug} />
                </motion.div>
              ))}
            </AnimatePresence>
            {list.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-ink/20 p-16 text-center">
                <p className="font-serif text-3xl">Sin resultados</p>
                <p className="mt-2 text-ink/60">Probá quitar algún filtro.</p>
              </div>
            )}
          </motion.div>

          <div className={`${view === "grid" ? "hidden lg:block" : ""}`}>
            <MapView items={list} active={hover} onHover={setHover} className="sticky top-44 h-[70vh]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Chips<T extends string>({ options, value, onChange, id }: { options: readonly T[]; value: string; onChange: (v: T) => void; id: string }) {
  return (
    <div className="flex rounded-full bg-sand p-1">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className="relative rounded-full px-3.5 py-2 text-sm sm:px-4">
          {value === o && (
            <motion.span layoutId={`chip-${id}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
          )}
          <span className={`relative ${value === o ? "text-ivory" : "text-ink/75"}`}>{o}</span>
        </button>
      ))}
    </div>
  );
}
