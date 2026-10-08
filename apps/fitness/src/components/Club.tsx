"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { img, sedes, zones } from "@/lib/content";
import AutoVideo from "./AutoVideo";
import { useBooking } from "./Booking";
import { ease, Kicker, Lines, Reveal } from "./ui";

/** Recorrido del club: cada tramo de scroll es una zona; la foto "te mete" en la siguiente. */
export function Tour() {
  const ref = useRef<HTMLElement>(null);
  const n = zones.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, n - 1]);
  const p = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.5 });
  const [i, setI] = useState(0);
  useMotionValueEvent(p, "change", (v) => setI(Math.min(n - 1, Math.max(0, Math.round(v)))));
  const z = zones[i];

  const goTo = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * k) / (n - 1);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} style={{ height: `${n * 100}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="grade grain absolute inset-0">
          {zones.map((zone, k) => (
            <Frame key={zone.id} k={k} p={p} zone={zone} active={k === i} />
          ))}
          <div className="absolute inset-0 z-[20] bg-gradient-to-r from-coal/85 via-coal/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[20] h-1/3 bg-gradient-to-t from-coal to-transparent" />
        </div>

        {/* Texto de la zona */}
        <div className="relative z-30 flex h-full flex-col justify-end px-5 pb-28 sm:px-10 md:justify-center md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div key={z.id} className="max-w-xl">
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="text-xs tracking-[0.3em] text-signal uppercase">
                {z.kicker}
              </motion.p>
              <h2 className="display mt-3 text-[clamp(3.5rem,10vw,9rem)]">
                <span className="block overflow-hidden">
                  <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} exit={{ y: "-105%" }} transition={{ duration: 0.7, ease }}>
                    {z.name}
                  </motion.span>
                </span>
              </h2>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="mt-4 max-w-md text-lg text-bone/80">
                {z.text}
              </motion.p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {z.facts.map((f, k) => (
                  <motion.li key={f} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 + k * 0.07 }} className="rounded-full border border-white/20 bg-coal/40 px-4 py-2 text-sm backdrop-blur">
                    {f}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Plano del club */}
        <div className="absolute top-24 right-5 z-30 hidden w-72 rounded-3xl border border-white/10 bg-coal/60 p-4 backdrop-blur-md sm:right-10 md:block">
          <p className="mb-2 flex justify-between text-[10px] tracking-[0.25em] text-bone/60 uppercase">
            <span>Plano · Palermo</span>
            <span className="text-signal">● Estás acá</span>
          </p>
          <svg viewBox="-1 -1 102 62" className="w-full">
            {zones.map((zone, k) => {
              const [x, y, w, h] = zone.plan;
              const on = k === i;
              return (
                <g key={zone.id} onClick={() => goTo(k)} className="cursor-pointer">
                  <motion.rect x={x} y={y} width={w} height={h} rx={1} animate={{ fill: on ? "rgba(255,59,47,0.6)" : "rgba(239,236,230,0.05)" }} stroke="rgba(239,236,230,0.4)" strokeWidth={0.4} />
                  <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" fontSize={w < 20 ? 2.6 : 3.2} fill="#efece6" opacity={on ? 1 : 0.6} className="pointer-events-none select-none">
                    {zone.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Índice de zonas */}
        <div className="absolute right-5 bottom-8 z-30 flex gap-1.5 sm:right-10">
          {zones.map((zone, k) => (
            <button key={zone.id} onClick={() => goTo(k)} aria-label={zone.name} className="py-2">
              <motion.span animate={{ width: k === i ? 36 : 10, backgroundColor: k === i ? "#ff3b2f" : "rgba(239,236,230,0.35)" }} className="block h-1.5 rounded-full" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Frame({ k, p, zone, active }: { k: number; p: MotionValue<number>; zone: (typeof zones)[number]; active: boolean }) {
  // Entra desde lejos (1.25) y sale "atravesándola" (zoom 1.7 + fundido).
  const scale = useTransform(p, [k - 1, k, k + 1], [1.25, 1, 1.7]);
  const opacity = useTransform(p, [k - 1, k - 0.4, k + 0.45, k + 1], [k === 0 ? 1 : 0, 1, 1, 0]);
  const blur = useTransform(p, [k + 0.4, k + 1], [0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.div style={{ scale, opacity, filter, zIndex: 10 - k }} className="absolute inset-0 will-change-transform">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(zone.img, 2000)} alt={zone.name} className="absolute inset-0 h-full w-full object-cover" />
      {zone.video && (
        <motion.div initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 1.2 }} className="absolute inset-0 mix-blend-screen">
          <AutoVideo id={zone.video} className="absolute inset-0 opacity-50" playing={active} />
        </motion.div>
      )}
    </motion.div>
  );
}

const AMENITIES = [
  ["Toallas incluidas", "Siempre limpias, sin costo extra."],
  ["Lockers inteligentes", "Se abren con la app."],
  ["Café de especialidad", "Antes o después de entrenar."],
  ["Estacionamiento", "2 horas sin cargo con tu clase."],
  ["Zona de recuperación", "Botas de compresión y movilidad."],
  ["Nutricionista", "Los sábados, incluido en Club+."],
];

export function Amenities() {
  return (
    <section className="px-5 py-28 sm:px-10">
      <Kicker>Los detalles</Kicker>
      <h2 className="display mt-4 text-[clamp(3rem,7vw,7rem)]">
        <Lines lines={["Lo que no se ve", <span key="b" className="text-bone/40">en una foto.</span>]} />
      </h2>
      <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {AMENITIES.map(([t, d], i) => (
          <Reveal key={t} delay={(i % 3) * 0.07} className="group bg-coal p-8 transition-colors hover:bg-graphite">
            <p className="display text-5xl text-bone/15 transition-colors group-hover:text-signal">0{i + 1}</p>
            <p className="display mt-6 text-3xl">{t}</p>
            <p className="mt-2 text-bone/60">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function openNow(hours: string) {
  const now = new Date();
  const d = now.getDay();
  const h = now.getHours();
  if (d === 0) return /dom/i.test(hours) && h >= 8 && h < 20;
  if (d === 6) return h >= 8 && h < 18;
  return h >= 6 && h < 22;
}

export function Sedes() {
  const { open } = useBooking();
  const [visit, setVisit] = useState(false);
  return (
    <section className="px-5 py-24 sm:px-10">
      <Kicker>Sedes</Kicker>
      <h2 className="display mt-4 text-[clamp(3rem,7vw,7rem)]">Tres clubes. Un mismo estándar.</h2>
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {sedes.map((s, i) => {
          const on = openNow(s.hours);
          return (
            <Reveal key={s.id} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-[28px] border border-white/10 bg-graphite">
                <div className="grade relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(s.img, 900, 680)} alt={`Sede ${s.name}`} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  <span className={`absolute top-4 left-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs backdrop-blur ${on ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-bone/70"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-emerald-400" : "bg-bone/50"}`} />
                    {on ? "Abierto ahora" : "Cerrado ahora"}
                  </span>
                </div>
                <div className="p-6">
                  <p className="display text-4xl">{s.name}</p>
                  <p className="mt-1 text-bone/60">{s.address}</p>
                  <p className="text-sm text-bone/40">{s.hours} · {s.m2} m²</p>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => open()} className="flex-1 rounded-full bg-signal py-3 text-sm font-semibold text-white">Clase gratis</button>
                    <a href="#" className="rounded-full border border-white/15 px-4 py-3 text-sm hover:bg-white/10">Cómo llegar</a>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-bone p-8 text-coal sm:flex-row sm:items-center sm:p-12">
        <div>
          <p className="display text-5xl">¿Preferís verlo en persona?</p>
          <p className="mt-2 text-coal/60">Un coach te muestra el club en 15 minutos. Sin compromiso.</p>
        </div>
        <AnimatePresence mode="wait">
          {visit ? (
            <motion.p key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="display text-3xl text-signal">
              ¡Te escribimos por WhatsApp!
            </motion.p>
          ) : (
            <motion.button key="btn" exit={{ opacity: 0 }} onClick={() => setVisit(true)} className="rounded-full bg-coal px-8 py-4 font-semibold tracking-wide text-bone uppercase transition-transform hover:scale-105">
              Agendar visita guiada
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
