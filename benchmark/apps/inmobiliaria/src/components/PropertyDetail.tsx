"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, animate, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice, photo, properties, type Property } from "@/lib/properties";
import { FavButton } from "./Favorites";
import PlanMini from "./PlanMini";
import PropertyCard from "./PropertyCard";
import Tour from "./Tour";

const Lot3D = dynamic(() => import("./Lot3D"), {
  ssr: false,
  loading: () => <div className="aspect-[16/9] w-full animate-pulse rounded-[28px] bg-sand" />,
});

const ease = [0.16, 1, 0.3, 1] as const;

export default function PropertyDetail({ p }: { p: Property }) {
  const lot = useMemo(() => {
    if (p.lot) return p.lot;
    if (!p.m2Lote) return undefined;
    const frente = Math.round(Math.sqrt(p.m2Lote * 0.55));
    return {
      frente,
      fondo: Math.round(p.m2Lote / frente),
      orientacion: 200,
      pendiente: 0,
      fos: 0.4,
      alturaMax: 9,
      retiroFrente: 5,
      retiroLateral: 3,
      entorno: (p.barrio === "Los Cardales" ? "bosque" : "barrio") as "bosque" | "barrio",
    };
  }, [p]);
  const house = useMemo(() => {
    if (!lot || p.type === "Terreno") return undefined;
    const w = Math.min(lot.frente - 8, 18);
    return { w, d: Math.round(p.m2 / 2 / w + 2), h: 6.2 };
  }, [lot, p]);

  const sections = [
    p.tour && ["recorrido", "Recorrido"],
    p.plan && ["plano", "Plano"],
    lot && ["terreno", "Terreno 3D"],
    ["detalles", "Detalles"],
    ["costos", p.op === "Venta" ? "Financiación" : "Costo mensual"],
    ["visita", "Agendar visita"],
  ].filter(Boolean) as [string, string][];

  return (
    <article className="pt-24">
      <Gallery p={p} />

      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <Tabs sections={sections} />

          {p.tour && (
            <Section id="recorrido" kicker="Recorrido virtual" title="Entrá y caminala.">
              <Tour rooms={p.tour} plan={p.plan} title={p.title} />
            </Section>
          )}

          {p.plan && (
            <Section id="plano" kicker="Plano" title="Cada ambiente, con sus metros.">
              <PlanSection p={p} />
            </Section>
          )}

          {lot && (
            <Section id="terreno" kicker="Terreno en 3D" title={p.type === "Terreno" ? "Mirá dónde da el sol." : "La casa en su lote."}>
              <Lot3D lot={lot} house={house} />
            </Section>
          )}

          <Section id="detalles" kicker="Detalles" title="Lo que tiene.">
            <Details p={p} />
          </Section>

          <Section id="costos" kicker={p.op === "Venta" ? "Financiación" : "Costo mensual"} title={p.op === "Venta" ? "Calculá tu cuota." : "Lo que pagás por mes."}>
            {p.op === "Venta" ? <Mortgage price={p.price} /> : <RentCost p={p} />}
          </Section>

          <Section id="visita" kicker="Visita" title="Conocela en persona.">
            <Visit />
          </Section>
        </div>

        <aside className="hidden lg:block">
          <PriceCard p={p} />
        </aside>
      </div>

      <Similar p={p} />

      {/* CTA fija en mobile */}
      <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full bg-ink py-2 pr-2 pl-5 text-ivory shadow-2xl lg:hidden">
        <span className="text-sm font-medium">{formatPrice(p)}</span>
        <a href="#visita" className="rounded-full bg-brass px-5 py-2.5 text-sm">
          Agendar visita
        </a>
      </div>
    </article>
  );
}

/* ---------------------------------- Galería ---------------------------------- */

function Gallery({ p }: { p: Property }) {
  const [open, setOpen] = useState<number | null>(null);
  const pics = p.gallery;
  return (
    <header className="mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-[0.25em] text-ink/50 uppercase">
            {p.type} en {p.op.toLowerCase()} · {p.barrio}, {p.ciudad}
          </motion.p>
          <h1 className="mt-2 overflow-hidden font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.95]">
            <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease }}>
              {p.title}
            </motion.span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <FavButton slug={p.slug} className="border border-ink/10" />
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-serif text-4xl">
            {formatPrice(p)}
          </motion.p>
        </div>
      </div>

      {/* Mosaico que se "abre en abanico" al cargar */}
      <div className="grid h-[52vh] min-h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[28px]">
        {pics.slice(0, 5).map((src, i) => (
          <motion.button
            key={src}
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, scale: 1.1, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease }}
            className={`group relative overflow-hidden ${i === 0 ? "col-span-4 row-span-2 sm:col-span-2" : "hidden sm:block"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo(src, i === 0 ? 1600 : 800)} alt="" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            {i === 4 && pics.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 font-serif text-3xl text-ivory">+{pics.length - 5}</span>
            )}
          </motion.button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tour && (
          <a href="#recorrido" className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-ivory">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inset-0 rounded-full bg-brass" />
              <span className="relative h-2 w-2 rounded-full bg-brass" />
            </span>
            Iniciar recorrido virtual
          </a>
        )}
        {(p.lot || p.m2Lote) && (
          <a href="#terreno" className="rounded-full border border-ink/15 px-5 py-3 text-sm hover:bg-ink/5">
            Ver terreno en 3D
          </a>
        )}
        <button onClick={() => setOpen(0)} className="rounded-full border border-ink/15 px-5 py-3 text-sm hover:bg-ink/5">
          Ver las {pics.length} fotos
        </button>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent=""
            className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur"
            onClick={() => setOpen(null)}
          >
            <div className="flex items-center justify-between p-5 text-ivory">
              <span className="text-sm tabular-nums">
                {open + 1} / {pics.length}
              </span>
              <button className="text-sm">Cerrar ✕</button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={open}
                  src={photo(pics[open], 2200)}
                  alt=""
                  initial={{ opacity: 0, x: 80, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -80, scale: 0.96 }}
                  transition={{ duration: 0.5, ease }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) setOpen((open + 1) % pics.length);
                    if (info.offset.x > 60) setOpen((open - 1 + pics.length) % pics.length);
                  }}
                  className="absolute inset-0 m-auto max-h-full max-w-[92vw] cursor-grab rounded-2xl object-contain"
                />
              </AnimatePresence>
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  onClick={() => setOpen((open + d + pics.length) % pics.length)}
                  className={`absolute top-1/2 ${d < 0 ? "left-4" : "right-4"} flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/15 text-ivory hover:bg-ivory/30`}
                >
                  {d < 0 ? "←" : "→"}
                </button>
              ))}
            </div>
            <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto p-4" onClick={(e) => e.stopPropagation()}>
              {pics.map((src, i) => (
                <button key={src} onClick={() => setOpen(i)} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === open ? "border-brass" : "border-transparent opacity-60"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo(src, 200, 140)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------------------------- Pestañas ---------------------------------- */

function Tabs({ sections }: { sections: [string, string][] }) {
  const [active, setActive] = useState(sections[0][0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);
  return (
    <nav className="no-scrollbar sticky top-24 z-30 mt-10 flex gap-1 overflow-x-auto rounded-full bg-ivory/85 p-1 backdrop-blur-xl">
      {sections.map(([id, label]) => (
        <a key={id} href={`#${id}`} className="relative shrink-0 rounded-full px-4 py-2.5 text-sm">
          {active === id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
          <span className={`relative ${active === id ? "text-ivory" : "text-ink/70"}`}>{label}</span>
        </a>
      ))}
    </nav>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-40 pt-20">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }}>
        <p className="text-xs tracking-[0.25em] text-brass uppercase">{kicker}</p>
        <h2 className="mt-2 mb-8 font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-none">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

/* ---------------------------------- Plano ---------------------------------- */

function PlanSection({ p }: { p: Property }) {
  const [sel, setSel] = useState(p.plan![0].id);
  const room = p.plan!.find((r) => r.id === sel)!;
  const tourRoom = p.tour?.find((r) => r.id === sel);
  return (
    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
      <div className="rounded-[28px] border border-ink/10 bg-white/50 p-4 sm:p-8">
        <PlanMini plan={p.plan!} current={sel} onSelect={setSel} showM2 className="w-full" />
      </div>
      <div className="overflow-hidden rounded-[28px] bg-ink text-ivory">
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            {tourRoom && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo(tourRoom.img, 900, 560)} alt="" className="h-48 w-full object-cover" />
            )}
            <div className="p-6">
              <p className="text-xs tracking-[0.2em] text-ivory/50 uppercase">Ambiente</p>
              <p className="mt-1 font-serif text-4xl">{room.name}</p>
              <p className="mt-3 font-serif text-6xl text-brass tabular-nums">
                {room.m2}
                <span className="ml-1 text-2xl text-ivory/60">m²</span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------- Detalles ---------------------------------- */

function Details({ p }: { p: Property }) {
  const specs = [
    ["Superficie", `${p.m2.toLocaleString("es-AR")} m²`],
    p.m2Lote && p.m2Lote !== p.m2 ? ["Lote", `${p.m2Lote.toLocaleString("es-AR")} m²`] : null,
    p.amb ? ["Ambientes", p.amb] : null,
    p.dorm ? ["Dormitorios", p.dorm] : null,
    p.banos ? ["Baños", p.banos] : null,
    p.cochera ? ["Cocheras", p.cochera] : null,
    p.antiguedad ? ["Antigüedad", p.antiguedad] : null,
    p.expensas ? ["Expensas", `$ ${p.expensas.toLocaleString("es-AR")}`] : null,
  ].filter(Boolean) as [string, string | number][];
  return (
    <div>
      <p className="max-w-2xl text-xl leading-relaxed text-ink/80">{p.blurb}</p>
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-4">
        {specs.map(([k, v], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-ivory p-5"
          >
            <p className="text-xs tracking-[0.15em] text-ink/50 uppercase">{k}</p>
            <p className="mt-1 font-serif text-3xl">{v}</p>
          </motion.div>
        ))}
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {p.features.map((f, i) => (
          <motion.li
            key={f}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 border-b border-ink/10 py-3"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass/15 text-brass">✓</span>
            {f}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------- Costos ---------------------------------- */

function useTween(value: number) {
  const [v, setV] = useState(value);
  const last = useRef(value);
  useEffect(() => {
    const c = animate(last.current, value, { duration: 0.6, ease: "easeOut", onUpdate: setV });
    last.current = value;
    return () => c.stop();
  }, [value]);
  return v;
}

function Mortgage({ price }: { price: number }) {
  const [down, setDown] = useState(30);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(6.5);
  const loan = price * (1 - down / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  const fee = r ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  const shown = useTween(fee);
  return (
    <div className="grid gap-8 rounded-[28px] bg-ink p-6 text-ivory sm:p-10 md:grid-cols-2">
      <div className="space-y-6">
        <Slider label="Anticipo" value={down} min={10} max={70} step={5} unit="%" onChange={setDown} />
        <Slider label="Plazo" value={years} min={5} max={30} step={1} unit=" años" onChange={setYears} />
        <Slider label="Tasa anual" value={rate} min={3} max={12} step={0.25} unit="%" onChange={setRate} />
      </div>
      <div className="flex flex-col justify-end">
        <p className="text-xs tracking-[0.2em] text-ivory/50 uppercase">Cuota estimada</p>
        <p className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-none text-brass tabular-nums">US$ {Math.round(shown).toLocaleString("es-AR")}</p>
        <p className="mt-2 text-sm text-ivory/60">
          Préstamo de US$ {Math.round(loan).toLocaleString("es-AR")} · anticipo US$ {Math.round(price - loan).toLocaleString("es-AR")}
        </p>
        <p className="mt-4 text-xs text-ivory/40">Simulación orientativa con sistema francés. No es una oferta de crédito.</p>
      </div>
    </div>
  );
}

function RentCost({ p }: { p: Property }) {
  const [months, setMonths] = useState(3);
  const total = p.price + (p.expensas ?? 0);
  const shown = useTween(total);
  return (
    <div className="grid gap-8 rounded-[28px] bg-ink p-6 text-ivory sm:p-10 md:grid-cols-2">
      <div className="space-y-4">
        {[
          ["Alquiler", p.price],
          ["Expensas", p.expensas ?? 0],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-ivory/10 pb-3">
            <span className="text-ivory/70">{k}</span>
            <span className="tabular-nums">$ {Number(v).toLocaleString("es-AR")}</span>
          </div>
        ))}
        <Slider label="Ajuste cada" value={months} min={3} max={12} step={3} unit=" meses" onChange={setMonths} />
      </div>
      <div className="flex flex-col justify-end">
        <p className="text-xs tracking-[0.2em] text-ivory/50 uppercase">Total mensual</p>
        <p className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-none text-brass tabular-nums">$ {Math.round(shown).toLocaleString("es-AR")}</p>
        <p className="mt-2 text-sm text-ivory/60">Para ingresar: 1 mes de depósito + 1 mes de adelanto. Ajuste por ICL cada {months} meses.</p>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm">
        <span className="text-ivory/70">{label}</span>
        <span className="tabular-nums">
          {value}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full" />
    </label>
  );
}

/* ---------------------------------- Visita ---------------------------------- */

function Visit() {
  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 7) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push(new Date(d));
    }
    return out;
  }, []);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState<string | null>(null);
  const [mode, setMode] = useState<"Presencial" | "Videollamada">("Presencial");
  const [done, setDone] = useState(false);
  const hours = ["10:00", "11:30", "13:00", "15:30", "17:00", "18:30"];

  return (
    <div className="rounded-[28px] border border-ink/10 bg-white/50 p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brass text-3xl text-white">
              ✓
            </motion.div>
            <p className="mt-6 font-serif text-4xl">¡Visita reservada!</p>
            <p className="mt-2 text-ink/60">
              {mode} · {days[day].toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} a las {hour}
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }}>
            <div className="mb-6 flex w-fit rounded-full bg-sand p-1">
              {(["Presencial", "Videollamada"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className="relative rounded-full px-4 py-2 text-sm">
                  {mode === m && <motion.span layoutId="visit-mode" className="absolute inset-0 rounded-full bg-ink" />}
                  <span className={`relative ${mode === m ? "text-ivory" : ""}`}>{m}</span>
                </button>
              ))}
            </div>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {days.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setDay(i)}
                  className={`flex w-20 shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors ${i === day ? "border-ink bg-ink text-ivory" : "border-ink/15 hover:border-ink/40"}`}
                >
                  <span className="text-[11px] uppercase opacity-70">{d.toLocaleDateString("es-AR", { weekday: "short" })}</span>
                  <span className="font-serif text-3xl">{d.getDate()}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {hours.map((h) => (
                <button key={h} onClick={() => setHour(h)} className={`rounded-full border py-2.5 text-sm transition-colors ${hour === h ? "border-brass bg-brass text-white" : "border-ink/15 hover:border-ink/40"}`}>
                  {h}
                </button>
              ))}
            </div>
            <button
              disabled={!hour}
              onClick={() => setDone(true)}
              className="mt-6 w-full rounded-full bg-ink py-4 text-ivory transition-opacity disabled:opacity-30 sm:w-auto sm:px-10"
            >
              {hour ? `Reservar ${hour}` : "Elegí un horario"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- Lateral y similares ---------------------------------- */

function PriceCard({ p }: { p: Property }) {
  return (
    <div className="sticky top-28 mt-10 rounded-[28px] bg-ink p-7 text-ivory">
      <p className="text-xs tracking-[0.2em] text-ivory/50 uppercase">{p.op}</p>
      <p className="mt-1 font-serif text-4xl">{formatPrice(p)}</p>
      {p.expensas && <p className="text-sm text-ivory/60">+ $ {p.expensas.toLocaleString("es-AR")} expensas</p>}
      <div className="my-6 grid grid-cols-3 gap-2 border-y border-ivory/10 py-5 text-center">
        {[
          [p.m2.toLocaleString("es-AR"), "m²"],
          [p.amb ?? "—", "amb."],
          [p.dorm ?? "—", "dorm."],
        ].map(([v, l]) => (
          <div key={String(l)}>
            <p className="font-serif text-2xl">{v}</p>
            <p className="text-xs text-ivory/50">{l}</p>
          </div>
        ))}
      </div>
      <a href="#visita" className="block rounded-full bg-brass py-3.5 text-center text-sm font-medium">
        Agendar visita
      </a>
      <a href="#" className="mt-2 block rounded-full border border-ivory/20 py-3.5 text-center text-sm hover:bg-ivory/10">
        Consultar por WhatsApp
      </a>
      <p className="mt-5 text-xs text-ivory/40">Ref. {p.slug.toUpperCase().slice(0, 12)} · Respuesta en menos de 1 h</p>
    </div>
  );
}

function Similar({ p }: { p: Property }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const items = properties.filter((x) => x.slug !== p.slug && (x.op === p.op || x.type === p.type)).slice(0, 3);
  return (
    <section ref={ref} className="mx-auto mt-28 max-w-[1400px] px-4 pb-32 sm:px-8">
      <h2 className="mb-10 font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-none">
        También te puede <span className="italic">gustar</span>
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x, i) => (
          <motion.div key={x.slug} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.8, ease }}>
            <PropertyCard p={x} />
          </motion.div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/propiedades" className="inline-flex rounded-full border border-ink/20 px-6 py-3 text-sm hover:bg-ink hover:text-ivory">
          Ver todo el catálogo
        </Link>
      </div>
    </section>
  );
}
