"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { img, quiz, recommend, regions, seasons, testimonials, trips, V, wines, type QuizAnswers, type Wine } from "@/lib/content";
import AutoVideo from "./AutoVideo";
import { Bottle, FillGlass, Glass } from "./Icons";
import { useShop } from "./Shop";
import { TLink } from "./Transition";
import { ease, Kicker, Lines, Magnetic, Reveal } from "./ui";

const money = (n: number) => `$ ${Math.round(n).toLocaleString("es-AR")}`;

/* ================================== Hero: ventana en arco + altímetro ================================== */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { bookTrip } = useShop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  // El arco de bodega se abre hasta llenar la pantalla. En celular arranca más abajo.
  const start = useMotionValue(42);
  const sideStart = useMotionValue(30);
  useEffect(() => {
    const m = () => {
      start.set(window.innerWidth < 768 ? 40 : 42);
      sideStart.set(window.innerWidth < 768 ? 10 : 30);
    };
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, [start, sideStart]);
  const clipPath = useTransform([p, start, sideStart], ([v, s, sd]: number[]) => {
    const k = 1 - Math.min(1, v / 0.6);
    const side = sd * k; // % a cada lado
    const top = s * k;
    const r = 999 * k;
    return `inset(${top}% ${side}% ${4 * k}% ${side}% round ${r}px ${r}px ${28 * k}px ${28 * k}px)`;
  });
  const titleY = useTransform(p, [0, 0.5], ["0%", "-30%"]);
  const titleO = useTransform(p, [0, 0.35], [1, 0]);
  const meters = useTransform(p, [0, 0.9], [750, 1500]);
  const [m, setM] = useState(750);
  useMotionValueEvent(meters, "change", (v) => setM(Math.round(v / 10) * 10));
  const overO = useTransform(p, [0.6, 0.85], [0, 1]);
  const overY = useTransform(p, [0.6, 0.85], [40, 0]);

  return (
    <section ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1.2 }} className="grade grain absolute inset-0">
          <AutoVideo id={V.aerial} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-night/30" />
          <motion.div style={{ opacity: overO, y: overY }} className="absolute inset-x-0 bottom-0 px-5 pb-28 sm:px-10 sm:pb-16">
            <p className="display max-w-4xl text-[clamp(2.8rem,7vw,7rem)]">
              {m.toLocaleString("es-AR")} metros <em className="text-brass">más cerca del sol.</em>
            </p>
            <p className="mt-4 max-w-md text-paper/75">Sol intenso de día, frío de noche y agua de deshielo: por eso el vino de Mendoza sabe distinto.</p>
          </motion.div>
        </motion.div>

        {/* En celular el texto inferior cae sobre el video: degradé para que se lea */}
        <motion.div style={{ opacity: titleO }} className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-1/2 bg-gradient-to-t from-night via-night/70 to-transparent md:hidden" />

        {/* Titular partido a los lados del arco */}
        <motion.div style={{ y: titleY, opacity: titleO }} className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-5 pt-32 pb-24 sm:px-10 md:pb-10">
          <h1 className="display text-[clamp(3rem,6.8vw,8rem)]">
            <Lines immediate delay={1.9} lines={["El vino", <em key="b" className="text-brass">se hace en altura.</em>]} />
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.8, ease }} className="pointer-events-auto flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xs text-paper/70">Boutique de vinos de productores chicos y viajes por las bodegas de Mendoza.</p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <TLink href="/vinos" className="block rounded-full bg-paper px-7 py-3.5 font-semibold text-night transition-transform hover:scale-105">
                  Entrar a la cava
                </TLink>
              </Magnetic>
              <button onClick={() => bookTrip()} className="rounded-full border border-paper/25 px-7 py-3.5 font-semibold backdrop-blur transition-colors hover:bg-paper/10">
                Reservar un viaje
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Altímetro lateral */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }} className="absolute top-1/2 right-5 z-20 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex">
          <span className="label text-brass">Altitud</span>
          <span className="display text-5xl tabular-nums">{m.toLocaleString("es-AR")}</span>
          <span className="label text-paper/50">m s. n. m.</span>
          <div className="mt-2 h-40 w-px bg-paper/20">
            <motion.div style={{ scaleY: p }} className="h-full w-px origin-bottom bg-brass" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Varietals() {
  const list = ["Malbec", "Cabernet Franc", "Chardonnay", "Bonarda", "Semillón", "Sauvignon Blanc", "Syrah", "Espumante"];
  return (
    <div className="overflow-hidden border-y border-paper/10 py-6">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {[...list, ...list, ...list].map((v, i) => (
          <span key={i} className={`display flex items-center gap-12 text-5xl sm:text-7xl ${i % 2 ? "text-paper/30 italic" : ""}`}>
            {v}
            <Glass className="h-6 w-6 text-brass" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================== La subida: Maipú → Luján → Uco ================================== */

const RIDGES = [
  { d: "M0 260 L60 190 L110 220 L170 120 L230 200 L300 90 L360 170 L420 60 L500 160 L560 100 L640 180 L720 80 L800 170 L800 400 L0 400Z", fill: "#3a2b31", speed: 30, snow: true },
  { d: "M0 300 L80 230 L150 270 L240 190 L330 260 L420 180 L520 250 L610 200 L700 260 L800 210 L800 400 L0 400Z", fill: "#2a1d22", speed: 70 },
  { d: "M0 340 L120 290 L220 320 L340 270 L460 320 L580 280 L700 330 L800 300 L800 400 L0 400Z", fill: "#1d1317", speed: 120 },
];

export function Climb() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const [i, setI] = useState(0);
  useMotionValueEvent(p, "change", (v) => setI(Math.min(2, Math.max(0, Math.round(v * 2)))));
  const alt = useTransform(p, [0, 0.5, 1], [750, 950, 1400]);
  const [a, setA] = useState(750);
  useMotionValueEvent(alt, "change", (v) => setA(Math.round(v / 10) * 10));
  const needle = useTransform(alt, [500, 1600], ["90%", "5%"]);
  const sky = useTransform(p, [0, 0.5, 1], ["#2b1a22", "#5a1f2b", "#b5532f"]);
  const sun = useTransform(p, [0, 1], [260, 70]);
  const r = regions[i];
  const { add } = useShop();
  const wine = wines.find((w) => w.region === r.id && w.pick) ?? wines.find((w) => w.region === r.id)!;

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Cielo y cordillera en capas (parallax 2D) */}
        <motion.div style={{ backgroundColor: sky }} className="absolute inset-0" />
        <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
          <motion.circle cx="600" r="40" fill="#e9b44c" opacity=".8" style={{ cy: sun }} />
          {RIDGES.map((rg, k) => (
            <Ridge key={k} p={p} {...rg} />
          ))}
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-night/80 via-night/30 to-transparent" />

        <div className="relative z-10 grid h-full items-center gap-8 px-5 pt-24 sm:px-10 lg:grid-cols-[auto_1fr_auto]">
          {/* Altímetro */}
          <div className="hidden h-[60vh] items-stretch gap-4 lg:flex">
            <div className="relative w-px bg-paper/20">
              {[500, 750, 1000, 1250, 1500].map((h) => (
                <span key={h} className="absolute -left-1 flex items-center gap-2 text-[10px] text-paper/40" style={{ top: `${90 - ((h - 500) / 1100) * 85}%` }}>
                  <span className="h-px w-2 bg-paper/40" />
                  {h}
                </span>
              ))}
              <motion.span style={{ top: needle }} className="absolute -left-2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-brass bg-night" />
            </div>
          </div>

          <div className="max-w-xl">
            <Kicker>La subida</Kicker>
            <p className="display mt-4 text-[clamp(4rem,10vw,9rem)] tabular-nums">
              {a.toLocaleString("es-AR")}
              <span className="text-[0.35em] text-brass"> m</span>
            </p>
            <AnimatePresence mode="wait">
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease }}>
                <p className="display text-5xl italic">{r.name}</p>
                <p className="mt-4 text-lg text-paper/75">{r.text}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-paper/20 px-4 py-2 text-sm">{r.climate}</span>
                  <span className="rounded-full border border-paper/20 px-4 py-2 text-sm">{r.grape}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vino de la zona */}
          <AnimatePresence mode="wait">
            <motion.div key={wine.id} initial={{ opacity: 0, y: 40, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.7, ease }} className="hidden items-end gap-5 md:flex">
              <Bottle wine={wine} className="h-[52vh] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
              <div className="mb-10 w-48">
                <p className="label text-brass">De esta zona</p>
                <p className="display mt-2 text-3xl">{wine.name}</p>
                <p className="text-sm text-paper/60">{wine.varietal}</p>
                <p className="display mt-3 text-2xl">{money(wine.price)}</p>
                <button onClick={() => add(wine.id)} className="mt-4 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-night">
                  Sumar a la cava
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Paradas */}
        <div className="absolute inset-x-5 bottom-24 z-10 flex items-center gap-3 sm:inset-x-10 md:bottom-8">
          {regions.map((rg, k) => (
            <div key={rg.id} className="flex flex-1 items-center gap-3">
              <motion.span animate={{ backgroundColor: k <= i ? "#c19a5b" : "rgba(243,236,224,0.2)", scale: k === i ? 1.3 : 1 }} className="h-3 w-3 shrink-0 rounded-full" />
              <span className={`text-xs whitespace-nowrap ${k === i ? "text-paper" : "text-paper/40"}`}>
                {rg.name}
                <span className="hidden sm:inline"> · {rg.altitude.toLocaleString("es-AR")} m</span>
              </span>
              {k < 2 && <span className="h-px flex-1 bg-paper/15" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ridge({ p, d, fill, speed, snow }: { p: ReturnType<typeof useSpring>; d: string; fill: string; speed: number; snow?: boolean }) {
  // Las capas cercanas bajan más rápido: sensación de estar subiendo.
  const y = useTransform(p, [0, 1], [0, speed]);
  return (
    <motion.g style={{ y }}>
      <path d={d} fill={fill} />
      {snow && <path d="M170 120 L185 146 L160 150Z M300 90 L318 122 L288 124Z M420 60 L440 100 L404 98Z M720 80 L738 112 L704 114Z" fill="#f3ece0" opacity=".85" />}
    </motion.g>
  );
}

/* ================================== Sommelier virtual ================================== */

export function Sommelier() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const step = quiz.findIndex((q) => !answers[q.id]);
  const done = step === -1;
  const pick: Wine | null = done ? recommend(answers) : null;
  const { add } = useShop();
  const level = done ? 0.72 : (Object.keys(answers).length / quiz.length) * 0.45;
  const color = pick?.liquid ?? "#5a1426";

  return (
    <section className="px-3 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-[40px] bg-wine px-5 py-16 sm:px-12 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Kicker>Sommelier virtual</Kicker>
            <h2 className="display mt-4 text-[clamp(3rem,6.5vw,6.5rem)]">
              <Lines lines={["Tres preguntas.", <em key="b" className="text-brass">Tu vino ideal.</em>]} />
            </h2>
            <div className="mt-10 min-h-[18rem]">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div key={quiz[step].id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease }}>
                    <p className="label text-paper/50">
                      Pregunta {step + 1} de {quiz.length}
                    </p>
                    <p className="display mt-3 text-4xl">{quiz[step].q}</p>
                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      {quiz[step].options.map((o) => (
                        <button key={o.id} onClick={() => setAnswers((a) => ({ ...a, [quiz[step].id]: o.id }))} className="flex items-center gap-3 rounded-2xl border border-paper/15 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-brass hover:bg-paper/5">
                          <span className="w-8 text-center text-xl text-brass">{o.icon}</span>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  pick && (
                    <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.6 }}>
                      <p className="label text-brass">Te recomendamos</p>
                      <p className="display mt-3 text-6xl">{pick.name}</p>
                      <p className="mt-1 text-paper/70">
                        {pick.varietal} · {pick.producer} · {pick.altitude.toLocaleString("es-AR")} m
                      </p>
                      <p className="mt-4 max-w-md text-lg text-paper/80">{pick.text}</p>
                      <p className="mt-3 text-sm text-paper/60">Va bien con: {pick.pairing.join(", ")}</p>
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button onClick={() => add(pick.id)} className="rounded-full bg-paper px-7 py-3.5 font-semibold text-night transition-transform hover:scale-105">
                          Sumar a la cava · {money(pick.price)}
                        </button>
                        <button onClick={() => setAnswers({})} className="px-4 py-3 text-sm underline underline-offset-4 opacity-70">
                          Probar de nuevo
                        </button>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="relative flex items-end justify-center">
            <FillGlass color={color} level={level} className="h-[46vh] max-h-[460px] w-auto text-paper" />
            <AnimatePresence>
              {pick && (
                <motion.div key={pick.id} initial={{ opacity: 0, x: 40, rotate: 10 }} animate={{ opacity: 1, x: 0, rotate: -6 }} exit={{ opacity: 0 }} transition={{ delay: 0.9, duration: 0.8, ease }} className="absolute right-[8%] bottom-0">
                  <Bottle wine={pick} className="h-[40vh] max-h-[380px] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================== Selección ================================== */

export function WineCard({ w, i = 0 }: { w: Wine; i?: number }) {
  const { add } = useShop();
  return (
    <Reveal delay={(i % 4) * 0.06}>
      <div className="group relative flex h-full flex-col rounded-[32px] bg-paper p-6 text-night">
        <div className="relative flex h-72 items-end justify-center">
          <span className="absolute bottom-2 h-6 w-32 rounded-[50%] bg-night/15 blur-md transition-all duration-700 group-hover:w-24 group-hover:opacity-60" />
          <Bottle wine={w} className="relative h-64 w-auto transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-4 group-hover:-rotate-6" />
          {w.pick && <span className="absolute top-0 left-0 rounded-full bg-wine px-3 py-1 text-[10px] tracking-widest text-paper uppercase">Elegido del sommelier</span>}
        </div>
        <p className="label mt-4 text-wine/70">
          {w.producer} · {w.altitude.toLocaleString("es-AR")} m
        </p>
        <p className="display mt-1 text-3xl">{w.name}</p>
        <p className="text-sm text-night/60">
          {w.varietal} {w.year}
        </p>
        {/* Notas: aparecen al pasar el mouse */}
        <div className="mt-3 grid max-h-0 grid-cols-2 gap-x-4 gap-y-1.5 overflow-hidden text-[11px] text-night/60 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
          {Object.entries(w.notes).map(([k, v]) => (
            <span key={k} className="flex items-center gap-2 capitalize">
              <span className="w-12">{k}</span>
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`h-1.5 w-2.5 rounded-full ${n <= v ? "bg-wine" : "bg-night/10"}`} />
                ))}
              </span>
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="display text-3xl">{money(w.price)}</p>
          <button onClick={() => add(w.id)} className="rounded-full bg-night px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:scale-105">
            Sumar
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export function Selection() {
  const picks = wines.filter((w) => w.pick);
  return (
    <section className="px-5 py-28 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>La selección</Kicker>
          <h2 className="display mt-4 text-[clamp(3rem,6.5vw,6.5rem)]">
            <Lines lines={["Productores chicos,", <em key="b" className="text-brass">vinos enormes.</em>]} />
          </h2>
        </div>
        <TLink href="/vinos" className="rounded-full border border-paper/20 px-6 py-3 text-sm font-semibold hover:bg-paper hover:text-night">
          Ver los {wines.length} vinos →
        </TLink>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((w, i) => (
          <WineCard key={w.id} w={w} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ================================== Viajes (teaser) ================================== */

export function TripsTeaser() {
  const [hover, setHover] = useState<string | null>(null);
  const { bookTrip } = useShop();
  return (
    <section className="px-5 py-28 sm:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Kicker>Viajes</Kicker>
          <h2 className="display mt-4 text-[clamp(3rem,6vw,6rem)]">
            <Lines lines={["Mendoza se toma", <em key="b" className="text-brass">en la bodega.</em>]} />
          </h2>
          <p className="mt-6 max-w-sm text-paper/70">Días completos, bici, cabalgata o cosecha. Siempre con traslado desde tu hotel, guía sommelier y grupos chicos.</p>
          <TLink href="/viajes" className="mt-8 inline-block rounded-full bg-brass px-7 py-3.5 font-semibold text-night">
            Ver itinerarios
          </TLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {trips.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 0.1} y={i % 2 ? 90 : 40}>
              <button onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)} onClick={() => bookTrip(t.id)} className={`group block w-full text-left ${i % 2 ? "sm:mt-20" : ""}`}>
                <div className="arch grade relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(t.img, 800, 1060)} alt={t.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                  {t.video && (
                    <motion.div initial={false} animate={{ opacity: hover === t.id ? 1 : 0 }} className="absolute inset-0">
                      <AutoVideo id={t.video} className="absolute inset-0" playing={hover === t.id} />
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent" />
                  <span className="absolute top-[18%] left-1/2 -translate-x-1/2 rounded-full bg-night/60 px-4 py-1.5 text-xs backdrop-blur">
                    {t.hours} · USD {t.price}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="label text-brass">{t.kicker}</p>
                    <p className="display mt-2 text-4xl">{t.name}</p>
                    <p className="mt-2 text-sm text-paper/70 opacity-0 transition-opacity group-hover:opacity-100">Reservar →</p>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================== Calendario de la vid ================================== */

const SEASON_OF_MONTH = [2, 3, 3, 3, 4, 0, 0, 0, 1, 1, 1, 2]; // ene..dic → índice de seasons

export function VineCalendar() {
  const [now, setNow] = useState<number | null>(null);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const k = SEASON_OF_MONTH[new Date().getMonth()];
    setNow(k);
    setSel(k);
  }, []);
  const s = seasons[sel];
  return (
    <section className="px-5 py-24 sm:px-10">
      <Kicker>Cuándo venir</Kicker>
      <h2 className="display mt-4 text-[clamp(3rem,6vw,6rem)]">
        El año de <em className="text-brass">la vid.</em>
      </h2>
      <div className="mt-12 grid grid-cols-5 gap-1 overflow-hidden rounded-full bg-paper/5 p-1">
        {seasons.map((x, k) => (
          <button key={x.name} onClick={() => setSel(k)} className="relative rounded-full py-3 text-center">
            {k === sel && <motion.span layoutId="season" className="absolute inset-0 rounded-full" style={{ backgroundColor: x.tone }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
            <span className="relative block text-[11px] text-paper/60 sm:text-xs">{x.months}</span>
            <span className="display relative block text-lg sm:text-2xl">{x.name}</span>
            {now === k && <span className="label relative block text-[9px] text-brass">Ahora</span>}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="mt-10 grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <p className="display max-w-3xl text-3xl text-paper/90 sm:text-4xl">{s.text}</p>
          {s.name === "Vendimia" && (
            <TLink href="/viajes" className="rounded-full border border-brass px-6 py-3 text-sm text-brass">
              Ver viaje de vendimia →
            </TLink>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/* ================================== Club (teaser) ================================== */

export function ClubTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const box = wines.filter((w) => w.pick).slice(0, 4).concat(wines[5], wines[10]);
  return (
    <section className="px-3 py-10 sm:px-6">
      <div className="grid items-center gap-10 overflow-hidden rounded-[40px] bg-paper px-6 py-16 text-night sm:px-12 lg:grid-cols-2">
        <div>
          <Kicker className="text-night">El Club ALTURA</Kicker>
          <h2 className="display mt-4 text-[clamp(3rem,6vw,6rem)]">
            Seis vinos nuevos, <em className="text-wine">cada mes.</em>
          </h2>
          <p className="mt-6 max-w-md text-night/70">Elegidos por nuestro sommelier entre bodegas chicas de Mendoza. Con ficha de cata, catas mensuales y descuentos. Sin permanencia.</p>
          <TLink href="/club" className="mt-8 inline-block rounded-full bg-wine px-8 py-4 font-semibold text-paper transition-transform hover:scale-105">
            Conocer el Club
          </TLink>
        </div>
        {/* La caja: las botellas suben al entrar en pantalla */}
        <div ref={ref} className="relative mx-auto h-[26rem] w-full max-w-md">
          <div className="absolute inset-x-0 bottom-0 flex h-[22rem] items-end justify-center gap-2 overflow-hidden px-6">
            {box.map((w, k) => (
              <motion.div key={w.id + k} initial={{ y: "100%" }} animate={{ y: inView ? `${[18, 6, 0, 10, 4, 14][k]}%` : "100%" }} transition={{ delay: 0.2 + k * 0.1, type: "spring", stiffness: 120, damping: 16 }}>
                <Bottle wine={w} className="h-80 w-auto" />
              </motion.div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-28 rounded-b-[24px] bg-[linear-gradient(180deg,#8b5a36,#6b4226)] shadow-[inset_0_6px_0_rgba(0,0,0,0.15)]">
            <p className="display pt-8 text-center text-3xl tracking-[0.3em] text-paper/80">ALTURA</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================== Reseñas + cierre ================================== */

export function Voices() {
  return (
    <section className="overflow-hidden py-24">
      <div className="marquee flex w-max gap-4">
        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
          <figure key={i} className="w-[24rem] shrink-0 rounded-[28px] border border-paper/10 p-7">
            <blockquote className="display text-2xl leading-snug italic">“{t.text}”</blockquote>
            <figcaption className="mt-4 text-sm text-paper/50">
              {t.name} · {t.from}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 px-5 text-xs text-paper/30 sm:px-10">Reseñas de demostración.</p>
    </section>
  );
}

export function FinalCta() {
  const { bookTrip } = useShop();
  return (
    <section className="relative h-[90vh] overflow-hidden">
      <div className="grade absolute inset-0">
        <AutoVideo id={V.stream} className="absolute inset-0" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/60 to-transparent" />
      <div className="relative flex h-full flex-col justify-center px-5 sm:px-10">
        <h2 className="display text-[clamp(3.5rem,10vw,10rem)]">
          <Lines lines={["Brindemos", <em key="b" className="text-brass">en Mendoza.</em>]} />
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <button onClick={() => bookTrip()} className="rounded-full bg-brass px-8 py-4 font-semibold text-night transition-transform hover:scale-105">
            Reservar un viaje
          </button>
          <TLink href="/vinos" className="rounded-full border border-paper/30 px-8 py-4 font-semibold backdrop-blur hover:bg-paper/10">
            Comprar vinos
          </TLink>
        </div>
      </div>
    </section>
  );
}

