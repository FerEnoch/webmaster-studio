"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { clubPlans, faqs, img, P, PLACES, regions, services, trips, TYPE_LABEL, wines, type WineType } from "@/lib/content";
import AutoVideo from "./AutoVideo";
import { WineCard } from "./Home";
import { Bottle, Glass } from "./Icons";
import { useShop } from "./Shop";
import { Count, ease, Kicker, Reveal } from "./ui";

/* ================================== TIENDA ================================== */

type Sort = "destacados" | "menor" | "mayor" | "altura";

export function Store() {
  const [type, setType] = useState<WineType | "todos">("todos");
  const [region, setRegion] = useState<string>("todas");
  const [sort, setSort] = useState<Sort>("destacados");
  const list = useMemo(() => {
    const l = wines.filter((w) => (type === "todos" || w.type === type) && (region === "todas" || w.region === region));
    if (sort === "menor") l.sort((a, b) => a.price - b.price);
    if (sort === "mayor") l.sort((a, b) => b.price - a.price);
    if (sort === "altura") l.sort((a, b) => b.altitude - a.altitude);
    if (sort === "destacados") l.sort((a, b) => Number(!!b.pick) - Number(!!a.pick));
    return l;
  }, [type, region, sort]);

  return (
    <section className="px-5 pb-24 sm:px-10">
      <div className="no-scrollbar sticky top-24 z-30 -mx-2 mb-10 flex items-center gap-2 overflow-x-auto rounded-[28px] bg-night/85 p-2 whitespace-nowrap backdrop-blur-xl md:flex-wrap md:overflow-visible">
        {(["todos", "tinto", "blanco", "rosado", "espumante"] as const).map((t) => (
          <Chip key={t} group="tipo" on={type === t} onClick={() => setType(t)}>
            {t === "todos" ? "Todos" : TYPE_LABEL[t]}
          </Chip>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-paper/15 sm:block" />
        {[{ id: "todas", name: "Todas las zonas" }, ...regions].map((r) => (
          <Chip key={r.id} group="zona" on={region === r.id} onClick={() => setRegion(r.id)}>
            {r.name}
          </Chip>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="ml-auto shrink-0 rounded-full border border-paper/15 bg-night px-4 py-2 text-sm outline-none" aria-label="Ordenar">
          <option value="destacados">Destacados</option>
          <option value="menor">Menor precio</option>
          <option value="mayor">Mayor precio</option>
          <option value="altura">Más altura</option>
        </select>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((w, i) => (
            <motion.div key={w.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.45, ease }}>
              <WineCard w={w} i={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="py-20 text-center text-paper/50">No hay vinos con esos filtros… todavía.</p>}
    </section>
  );
}

function Chip({ group, on, onClick, children }: { group: string; on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="relative shrink-0 rounded-full px-4 py-2 text-sm">
      {on && <motion.span layoutId={`chip-${group}`} className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
      <span className={`relative ${on ? "text-night" : "text-paper/70 hover:text-paper"}`}>{children}</span>
    </button>
  );
}

export function CellarBanner() {
  return (
    <section className="px-3 pb-10 sm:px-6">
      <div className="grade relative h-[60vh] overflow-hidden rounded-[40px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(P.archCellar, 2000)} alt="Cava de la boutique" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/40 to-transparent" />
        <div className="relative flex h-full max-w-xl flex-col justify-center px-6 sm:px-12">
          <Kicker>La boutique</Kicker>
          <p className="display mt-4 text-[clamp(2.6rem,5vw,5rem)]">
            Más de 400 etiquetas <em className="text-brass">en la cava.</em>
          </p>
          <p className="mt-4 text-paper/70">Online mostramos una selección. Si buscás algo puntual, escribinos: lo conseguimos.</p>
        </div>
      </div>
    </section>
  );
}

/* ================================== VIAJES ================================== */

export function TripsDetail() {
  const [tid, setTid] = useState(trips[0].id);
  const [active, setActive] = useState(0);
  const { bookTrip } = useShop();
  const t = trips.find((x) => x.id === tid)!;
  const pts = t.stops.slice(0, active + 1).map((s) => s.at);
  const d = pts.map((p, k) => `${k ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

  return (
    <section className="px-5 pb-24 sm:px-10">
      {/* Selector de experiencia */}
      <div className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {trips.map((x) => (
          <button
            key={x.id}
            onClick={() => {
              setTid(x.id);
              setActive(0);
            }}
            className="relative shrink-0 rounded-full border border-paper/15 px-5 py-3 text-sm"
          >
            {x.id === tid && <motion.span layoutId="trip-tab" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className={`relative ${x.id === tid ? "text-night" : "text-paper/70"}`}>{x.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={t.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease }}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            {/* Itinerario hora a hora */}
            <div>
              <div className="arch grade relative mb-10 aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                {t.video ? (
                  <AutoVideo id={t.video} className="absolute inset-0" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(t.img, 1400, 900)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="label text-brass">{t.kicker}</p>
                  <p className="display mt-2 text-5xl">{t.name}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 border-y border-paper/10 py-5">
                {[
                  ["Duración", t.hours],
                  ["Por persona", `USD ${t.price}`],
                  ["Mínimo", `${t.min} ${t.min === 1 ? "persona" : "personas"}`],
                  ...(t.season ? [["Temporada", t.season]] : []),
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="label text-paper/50">{k}</p>
                    <p className="display text-3xl">{v}</p>
                  </div>
                ))}
              </div>
              <ol className="relative mt-4">
                <span className="absolute top-6 bottom-6 left-[3.15rem] w-px bg-paper/15" />
                {t.stops.map((s, k) => (
                  <motion.li key={s.time + s.title} onViewportEnter={() => setActive(k)} viewport={{ margin: "-45% 0px -45% 0px" }} className="relative grid grid-cols-[5.5rem_1fr] gap-4 py-8">
                    <span className="display text-2xl tabular-nums">{s.time}</span>
                    <motion.span animate={{ scale: k === active ? 1.4 : 1, backgroundColor: k <= active ? "#c19a5b" : "#160d10" }} className="absolute top-10 left-[2.85rem] h-3 w-3 rounded-full border border-brass" />
                    <div>
                      <p className={`display text-3xl transition-colors ${k === active ? "text-paper" : "text-paper/45"}`}>{s.title}</p>
                      <p className="mt-1 text-paper/60">{s.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
              <div className="mt-8 rounded-[28px] bg-paper/5 p-6">
                <p className="label text-brass">Incluye</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {t.includes.map((x) => (
                    <li key={x} className="flex gap-3 text-paper/80">
                      <Glass className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-paper/40">Degustaciones de 3–4 copas de 40 ml por bodega, con agua y opción sin alcohol. Traslado incluido: no manejes.</p>
              </div>
              <button onClick={() => bookTrip(t.id)} className="mt-6 w-full rounded-full bg-brass py-4 font-semibold text-night transition-transform hover:scale-[1.02] sm:w-auto sm:px-10">
                Reservar · USD {t.price} por persona
              </button>
            </div>

            {/* Mapa que dibuja la ruta */}
            <div className="hidden lg:block">
              <div className="sticky top-28 rounded-[40px] bg-smoke p-6">
                <p className="label flex justify-between text-paper/50">
                  <span>Mendoza · ruta del día</span>
                  <span className="text-brass">
                    Parada {active + 1}/{t.stops.length}
                  </span>
                </p>
                <MendozaMap d={d} stops={t.stops.map((s) => s.at)} active={active} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function MendozaMap({ d, stops, active }: { d: string; stops: [number, number][]; active: number }) {
  return (
    <svg viewBox="0 0 100 120" className="mt-4 h-[calc(100vh-14rem)] max-h-[680px] w-full">
      {/* Cordillera */}
      <path d="M0 0 L22 0 L14 10 L24 20 L12 32 L22 44 L10 56 L20 68 L8 80 L18 92 L6 104 L14 120 L0 120Z" fill="#2c2024" />
      <path d="M0 0 L12 0 L6 12 L13 22 L4 34 L11 46 L3 58 L10 70 L2 82 L9 94 L1 106 L6 120 L0 120Z" fill="#3a2b31" />
      {[[6, 12], [5, 34], [4, 58], [3, 82]].map(([x, y]) => (
        <path key={y} d={`M${x} ${y} l3 4 l-6 0Z`} fill="#f3ece0" opacity=".7" />
      ))}
      <text x="4" y="118" fontSize="2.6" fill="#f3ece0" opacity=".4" transform="rotate(-90 4 118)" letterSpacing=".6">
        CORDILLERA DE LOS ANDES
      </text>
      {/* Zonas */}
      {[
        ["Maipú", 78, 24, 14],
        ["Luján de Cuyo", 58, 42, 16],
        ["Valle de Uco", 38, 82, 26],
      ].map(([n, x, y, r]) => (
        <g key={n as string}>
          <circle cx={x as number} cy={y as number} r={r as number} fill="#6b7a4b" opacity=".12" />
          <text x={x as number} y={(y as number) - (r as number) + 3} textAnchor="middle" fontSize="2.8" fill="#c19a5b" letterSpacing=".4">
            {(n as string).toUpperCase()}
          </text>
        </g>
      ))}
      {/* Río Mendoza */}
      <path d="M20 40 C34 38 40 34 52 32 S70 34 80 40" fill="none" stroke="#8aa0b0" strokeWidth=".6" opacity=".5" strokeDasharray="1.5 1" />
      {/* Ciudad */}
      <circle cx={PLACES.ciudad[0]} cy={PLACES.ciudad[1]} r="1.6" fill="#f3ece0" />
      <text x={PLACES.ciudad[0] + 3} y={PLACES.ciudad[1] + 1} fontSize="2.8" fill="#f3ece0">
        Ciudad de Mendoza
      </text>
      {/* Ruta del día */}
      <motion.path key={d} d={d} fill="none" stroke="#c19a5b" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeInOut" }} />
      {stops.map(([x, y], k) => (
        <g key={k}>
          {k === active && <motion.circle cx={x} cy={y} r="4" fill="#c19a5b" initial={{ opacity: 0.5, scale: 0.5 }} animate={{ opacity: 0, scale: 1.6 }} transition={{ duration: 1.4, repeat: Infinity }} />}
          <circle cx={x} cy={y} r={k === active ? 1.8 : 1.2} fill={k <= active ? "#c19a5b" : "#160d10"} stroke="#c19a5b" strokeWidth=".5" />
        </g>
      ))}
    </svg>
  );
}

/* ================================== SERVICIOS ================================== */

export function ServiceStory() {
  const [active, setActive] = useState(0);
  const s = services[active];
  return (
    <section className="px-5 pb-24 sm:px-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="sticky top-28 h-[calc(100vh-9rem)] overflow-hidden rounded-[40px]">
            <AnimatePresence initial={false}>
              <motion.div key={s.id} initial={{ clipPath: "inset(100% 0 0 0 round 40px)" }} animate={{ clipPath: "inset(0% 0 0 0 round 40px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} className="grade absolute inset-0">
                {"video" in s && s.video ? (
                  <AutoVideo id={s.video} className="absolute inset-0" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(s.img, 1400, 1600)} alt={s.name} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
                <p className="display absolute bottom-6 left-7 text-5xl">
                  <em className="text-brass">{String(active + 1).padStart(2, "0")}</em> / {String(services.length).padStart(2, "0")}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div>
          {services.map((x, i) => (
            <motion.article key={x.id} onViewportEnter={() => setActive(i)} viewport={{ margin: "-45% 0px -45% 0px" }} className="flex min-h-[70vh] flex-col justify-center border-b border-paper/10 py-12">
              <div className="grade mb-6 aspect-video overflow-hidden rounded-[28px] lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(x.img, 1000, 560)} alt={x.name} className="h-full w-full object-cover" />
              </div>
              <motion.p animate={{ color: active === i ? "#c19a5b" : "rgba(243,236,224,0.4)" }} className="label">
                {String(i + 1).padStart(2, "0")} · {x.from}
              </motion.p>
              <motion.h2 animate={{ opacity: active === i ? 1 : 0.35 }} className="display mt-3 text-[clamp(2.8rem,5vw,4.8rem)]">
                {x.name}
              </motion.h2>
              <p className="mt-4 max-w-lg text-lg text-paper/70">{x.text}</p>
              <ul className="mt-6 space-y-2">
                {x.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-paper/80">
                    <Glass className="h-4 w-4 text-brass" />
                    {pt}
                  </li>
                ))}
              </ul>
              <a href="#" className="mt-8 self-start rounded-full border border-brass px-6 py-3 text-sm text-brass transition-colors hover:bg-brass hover:text-night">
                Pedir propuesta por WhatsApp
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================== CLUB ================================== */

export function ClubPlans() {
  return (
    <section className="px-5 pb-20 sm:px-10">
      <div className="grid gap-4 lg:grid-cols-3">
        {clubPlans.map((pl, i) => {
          const hi = "highlight" in pl && pl.highlight;
          const box = wines.slice(i * 3, i * 3 + (pl.bottles > 3 ? 4 : 3));
          return (
            <Reveal key={pl.id} delay={i * 0.1}>
              <div className={`group relative flex h-full flex-col rounded-[36px] p-8 ${hi ? "bg-paper text-night" : "border border-paper/10 bg-smoke"}`}>
                {hi && <span className="absolute -top-3 left-8 rounded-full bg-wine px-4 py-1 text-xs font-semibold text-paper">El más elegido</span>}
                <div className="flex h-40 items-end justify-center gap-1">
                  {box.map((w) => (
                    <Bottle key={w.id} wine={w} className="h-36 w-auto transition-transform duration-500 group-hover:-translate-y-2" />
                  ))}
                </div>
                <p className="display mt-6 text-5xl">{pl.name}</p>
                <p className="mt-2 opacity-70">{pl.pitch}</p>
                <p className="display mt-6 text-6xl">
                  $ <Count to={pl.monthly} />
                </p>
                <p className="text-sm opacity-50">por mes · {pl.bottles} botellas</p>
                <ul className="mt-8 flex-1 space-y-3">
                  {pl.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Glass className={`mt-0.5 h-4 w-4 shrink-0 ${hi ? "text-wine" : "text-brass"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`mt-10 rounded-full py-4 font-semibold transition-transform hover:scale-[1.02] ${hi ? "bg-wine text-paper" : "bg-brass text-night"}`}>Suscribirme</button>
              </div>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-paper/50">Sin permanencia: te das de baja cuando quieras desde el botón de baja, sin llamar.</p>
    </section>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const steps = [
    ["Elegimos", "Nuestro sommelier prueba más de 60 vinos por mes y elige seis."],
    ["Te llega", "La caja llega a tu casa la primera semana del mes, con fichas de cata."],
    ["Probás", "Con maridajes sugeridos y una cata online en vivo para charlar los vinos."],
    ["Repetís", "Si un vino te encantó, lo recomprás con descuento de socio."],
  ];
  return (
    <section ref={ref} className="px-5 py-24 sm:px-10">
      <Kicker>Cómo funciona</Kicker>
      <div className="mt-10 grid gap-8 md:grid-cols-4">
        {steps.map(([t, d], k) => (
          <motion.div key={t} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: k * 0.12, duration: 0.7, ease }}>
            <span className="display text-7xl text-brass/40 italic">0{k + 1}</span>
            <p className="display mt-2 text-4xl">{t}</p>
            <p className="mt-2 text-paper/60">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  const [o, setO] = useState<number | null>(0);
  return (
    <section className="px-5 py-24 sm:px-10">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Kicker>Preguntas</Kicker>
          <h2 className="display mt-4 text-[clamp(3rem,6vw,6rem)]">
            Antes de <em className="text-brass">brindar.</em>
          </h2>
        </div>
        <div className="border-t border-paper/10">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-paper/10">
              <button onClick={() => setO(o === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl">
                {f.q}
                <motion.span animate={{ rotate: o === i ? 45 : 0 }} className="text-3xl text-brass">
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {o === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden pr-10 text-paper/70">
                    <span className="block pb-6">{f.a}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

