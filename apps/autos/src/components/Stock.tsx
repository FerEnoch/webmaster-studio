"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { cars, img, type Car } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const TYPES = ["Todos", "Deportivo", "Sedán", "Familiar", "Eléctrico"] as const;
const COND = ["Todos", "0 km", "Usados"] as const;

/** Stock con filtros animados y comparador de hasta 3 autos. */
export default function Stock() {
  const [type, setType] = useState<(typeof TYPES)[number]>("Todos");
  const [cond, setCond] = useState<(typeof COND)[number]>("Todos");
  const [max, setMax] = useState(180000);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const list = useMemo(
    () =>
      cars.filter(
        (c) =>
          (type === "Todos" || c.type === type) &&
          (cond === "Todos" || (cond === "0 km" ? c.km === 0 : c.km > 0)) &&
          c.price <= max,
      ),
    [type, cond, max],
  );

  const toggle = (id: string) =>
    setCompare((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s));

  return (
    <section id="stock" className="px-5 py-28 sm:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-bold">
          Stock <span className="text-volt">disponible</span>
        </h2>
        <p className="text-chalk/60">
          <motion.span key={list.length} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-block font-display text-2xl text-chalk">
            {list.length}
          </motion.span>{" "}
          autos con tu búsqueda
        </p>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-3">
        <Pills options={TYPES} value={type} onChange={setType} id="type" />
        <Pills options={COND} value={cond} onChange={setCond} id="cond" />
        <label className="flex items-center gap-3 rounded-full border border-white/10 px-5 py-2.5 text-sm">
          Hasta <span className="w-24 font-display tabular-nums">US$ {Math.round(max / 1000)}K</span>
          <input type="range" min={30000} max={180000} step={5000} value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-32" />
        </label>
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c, i) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.55, delay: i * 0.04, ease }}
            >
              <CarCard car={c} selected={compare.includes(c.id)} onCompare={() => toggle(c.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Barra del comparador */}
      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-carbon/95 py-2 pr-2 pl-3 shadow-2xl backdrop-blur"
          >
            {compare.map((id) => {
              const c = cars.find((x) => x.id === id)!;
              return (
                <motion.button key={id} layout onClick={() => toggle(id)} className="group relative h-10 w-14 overflow-hidden rounded-full" title={`Quitar ${c.model}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(c.img, 160, 110)} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-night/70 opacity-0 transition-opacity group-hover:opacity-100">✕</span>
                </motion.button>
              );
            })}
            <span className="px-2 text-sm text-chalk/60">{compare.length}/3</span>
            <button
              disabled={compare.length < 2}
              onClick={() => setShowCompare(true)}
              className="rounded-full bg-volt px-5 py-2.5 text-sm font-semibold text-night disabled:opacity-30"
            >
              Comparar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompare && <Compare ids={compare} onClose={() => setShowCompare(false)} />}
      </AnimatePresence>
    </section>
  );
}

function Pills<T extends string>({ options, value, onChange, id }: { options: readonly T[]; value: T; onChange: (v: T) => void; id: string }) {
  return (
    <div className="flex rounded-full border border-white/10 p-1">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className="relative rounded-full px-4 py-2 text-sm">
          {o === value && <motion.span layoutId={`pill-${id}`} className="absolute inset-0 rounded-full bg-chalk" transition={{ type: "spring", stiffness: 450, damping: 34 }} />}
          <span className={`relative ${o === value ? "text-night" : "text-chalk/70"}`}>{o}</span>
        </button>
      ))}
    </div>
  );
}

function CarCard({ car, selected, onCompare }: { car: Car; selected: boolean; onCompare: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <motion.article
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateY: tilt.x * 6, rotateX: -tilt.y * 6 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformPerspective: 1000 }}
      className={`group overflow-hidden rounded-[28px] border bg-carbon transition-colors ${selected ? "border-volt" : "border-white/5"}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(car.img, 900, 560)} alt={`${car.brand} ${car.model}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
        {/* brillo que sigue al mouse */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(400px circle at ${(tilt.x + 0.5) * 100}% ${(tilt.y + 0.5) * 100}%, rgba(255,255,255,0.18), transparent 60%)` }}
        />
        {car.tag && <span className="absolute top-4 left-4 rounded-full bg-volt px-3 py-1 text-xs font-semibold text-night">{car.tag}</span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-chalk/50 uppercase">{car.brand}</p>
            <h3 className="font-display text-xl font-bold">{car.model}</h3>
          </div>
          <p className="font-display text-lg text-volt">US$ {car.price.toLocaleString("es-AR")}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-chalk/60">
          <span>{car.year}</span>
          <span>{car.km ? `${car.km.toLocaleString("es-AR")} km` : "0 km"}</span>
          <span>{car.hp} CV</span>
          <span>{car.trans}</span>
        </div>
        <div className="mt-5 flex gap-2">
          <a href="#test-drive" className="flex-1 rounded-full bg-chalk py-2.5 text-center text-sm font-medium text-night transition-colors hover:bg-volt">
            Quiero verlo
          </a>
          <button onClick={onCompare} className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${selected ? "border-volt bg-volt/10 text-volt" : "border-white/15 hover:border-white/40"}`}>
            {selected ? "✓ Comparando" : "+ Comparar"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Compare({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  const list = ids.map((id) => cars.find((c) => c.id === id)!);
  const rows: { label: string; get: (c: Car) => number; fmt: (v: number) => string; better: "high" | "low" }[] = [
    { label: "Potencia", get: (c) => c.hp, fmt: (v) => `${v} CV`, better: "high" },
    { label: "0 a 100 km/h", get: (c) => c.zeroTo100, fmt: (v) => `${v} s`, better: "low" },
    { label: "Velocidad máx.", get: (c) => c.topSpeed, fmt: (v) => `${v} km/h`, better: "high" },
    { label: "Kilometraje", get: (c) => c.km, fmt: (v) => (v ? `${v.toLocaleString("es-AR")} km` : "0 km"), better: "low" },
    { label: "Precio", get: (c) => c.price, fmt: (v) => `US$ ${v.toLocaleString("es-AR")}`, better: "low" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-lenis-prevent="" className="fixed inset-0 z-[80] overflow-y-auto bg-night/90 p-4 backdrop-blur-md sm:p-10" onClick={onClose}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.5, ease }}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-carbon p-6 sm:p-10"
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="font-display text-3xl font-bold">Comparador</p>
          <button onClick={onClose} className="h-10 w-10 rounded-full border border-white/15">
            ✕
          </button>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${list.length}, 1fr)` }}>
          <span />
          {list.map((c) => (
            <div key={c.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(c.img, 500, 300)} alt="" className="aspect-[5/3] w-full rounded-2xl object-cover" />
              <p className="mt-2 text-xs text-chalk/50">{c.brand}</p>
              <p className="font-display font-bold">{c.model}</p>
            </div>
          ))}
          {rows.map((r, ri) => {
            const vals = list.map(r.get);
            const best = r.better === "high" ? Math.max(...vals) : Math.min(...vals);
            const top = Math.max(...vals) || 1;
            return (
              <div key={r.label} className="contents">
                <span className="self-center text-sm text-chalk/60">{r.label}</span>
                {list.map((c, ci) => {
                  const v = r.get(c);
                  return (
                    <div key={c.id} className="self-center">
                      <p className={`text-sm ${v === best ? "text-volt" : ""}`}>
                        {r.fmt(v)} {v === best && "★"}
                      </p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className={`h-full rounded-full ${v === best ? "bg-volt" : "bg-chalk/50"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(4, (v / top) * 100)}%` }}
                          transition={{ duration: 1, delay: 0.2 + ri * 0.1 + ci * 0.05, ease }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
