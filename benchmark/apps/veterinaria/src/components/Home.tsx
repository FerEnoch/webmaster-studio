"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  benefits,
  brand,
  img,
  marquee,
  moods,
  P,
  plans,
  rooms,
  services,
  SPECIES,
  symptoms,
  testimonials,
  timeline,
  V,
  vets,
  type Level,
  type Species,
} from "@/lib/content";
import AutoVideo from "./AutoVideo";
import { useBooking } from "./Booking";
import { Paw } from "./Paw";
import { TLink } from "./Transition";
import { Count, ease, Kicker, Lines, Magnetic, Reveal } from "./ui";

/* ================================== Hero ================================== */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useBooking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  // La "ventana" del video se abre hasta ocupar toda la pantalla. En celular arranca más abajo (el titular ocupa más líneas).
  const start = useMotionValue(54);
  useEffect(() => {
    const m = () => start.set(window.innerWidth < 768 ? 66 : window.innerWidth < 1024 ? 58 : 54);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, [start]);
  const top = useTransform([p, start], ([v, s]: number[]) => s * (1 - Math.min(1, v / 0.55)));
  const side = useTransform(p, [0, 0.55], [4, 0]);
  const bottom = useTransform(p, [0, 0.55], [4, 0]);
  const round = useTransform(p, [0, 0.55], [40, 0]);
  const clipPath = useTransform([top, side, bottom, round], ([t, s, b, r]) => `inset(${t}% ${s}% ${b}% ${s}% round ${r}px)`);
  const vScale = useTransform(p, [0, 0.55], [1.15, 1]);
  const titleY = useTransform(p, [0, 0.45], ["0%", "-40%"]);
  const titleO = useTransform(p, [0, 0.35], [1, 0]);
  const overO = useTransform(p, [0.55, 0.8], [0, 1]);
  const overY = useTransform(p, [0.55, 0.8], [50, 0]);

  return (
    <section ref={ref} className="relative h-[230vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Titular */}
        <motion.div style={{ y: titleY, opacity: titleO }} className="absolute inset-x-0 top-0 z-10 px-5 pt-28 sm:px-10 sm:pt-36">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="display text-[clamp(3rem,7.4vw,9rem)]">
              <Lines
                immediate
                delay={1.9}
                lines={[
                  "Donde tu mascota",
                  <>
                    viene <em className="text-coral">tranquila.</em>
                  </>,
                ]}
              />
            </h1>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 0.8, ease }} className="max-w-sm lg:pb-3">
              <p className="text-lg text-ink/70">Clínica veterinaria en Belgrano y Palermo. Guardia 24 h, consultorio felino y laboratorio propio.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Magnetic>
                  <button onClick={() => open()} className="rounded-full bg-coral px-7 py-3.5 font-semibold text-white transition-transform hover:scale-105">
                    Sacar turno
                  </button>
                </Magnetic>
                <TLink href="/clinica" className="rounded-full border border-ink/20 px-7 py-3.5 font-semibold transition-colors hover:bg-ink hover:text-cream">
                  Conocé la clínica
                </TLink>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Ventana de video que se abre */}
        <motion.div style={{ clipPath }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }} className="grade grain absolute inset-0 will-change-[clip-path]">
          <motion.div style={{ scale: vScale }} className="absolute inset-0">
            <AutoVideo id={V.ears} className="absolute inset-0" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <motion.div style={{ opacity: overO, y: overY }} className="absolute inset-x-0 bottom-0 px-5 pb-28 text-cream sm:px-10 sm:pb-16">
            <p className="display max-w-4xl text-[clamp(2.6rem,7vw,7rem)]">
              Guardia 24 h. <em className="text-honey">Los 365 días.</em>
            </p>
            <a href={brand.phoneHref} className="mt-6 inline-flex rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink">
              Llamar a la guardia · {brand.phone}
            </a>
          </motion.div>
        </motion.div>

        {/* Chips flotantes sobre el borde de la ventana */}
        <motion.div style={{ opacity: titleO }} className="pointer-events-none absolute inset-x-0 top-[50%] z-20 hidden px-10 md:block">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }} className="flex items-start justify-between">
            <span className="float rounded-full bg-paper px-4 py-2 text-sm shadow-xl" style={{ ["--r" as string]: "-3deg" }}>
              ★ {brand.rating.toLocaleString("es-AR")} · {brand.reviews.toLocaleString("es-AR")} reseñas
            </span>
            <span className="float mt-6 rounded-full bg-sage px-4 py-2 text-sm shadow-xl [animation-delay:1.2s]">🐱 Consultorio solo para gatos</span>
            <span className="float rounded-full bg-honey px-4 py-2 text-sm shadow-xl [animation-delay:.6s]">Resultados en menos de 1 h</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================== Marquee ================================== */

export function Marquee() {
  return (
    <div className="relative z-10 -my-4 -rotate-2 overflow-hidden bg-sage py-5">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {[...marquee, ...marquee, ...marquee].map((m, i) => (
          <span key={i} className="display flex items-center gap-10 text-4xl italic sm:text-6xl">
            {m}
            <Paw className={`h-8 w-8 text-ink/70 ${i % 2 ? "rotate-12" : "-rotate-12"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================== Beneficios (bento animado) ================================== */

export function Benefits() {
  return (
    <section className="px-5 pt-36 pb-24 sm:px-10">
      <Kicker>Por qué Manada</Kicker>
      <h2 className="display mt-4 max-w-5xl text-[clamp(2.8rem,6.5vw,6.5rem)]">
        <Lines lines={["Pensamos cada detalle", <em key="b">desde su lado.</em>]} />
      </h2>
      <div className="mt-14 grid gap-4 md:grid-cols-6">
        {benefits.map((b, i) => (
          <Reveal key={b.id} delay={(i % 3) * 0.08} className={i === 0 || i === 4 ? "md:col-span-4" : "md:col-span-2"}>
            <div className="group flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[32px] bg-paper p-7 transition-transform duration-500 hover:-translate-y-1">
              <BenefitArt id={b.id} />
              <div className="mt-6">
                <p className="display text-3xl">{b.title}</p>
                <p className="mt-2 text-ink/60">{b.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BenefitArt({ id }: { id: (typeof benefits)[number]["id"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setTick((v) => v + 1), 1600);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div ref={ref} className="relative h-44 w-full">
      {id === "especies" && (
        <div className="grade absolute inset-0 overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(P.waiting, 1200, 500)} alt="Sala de espera" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/20" />
          <motion.span initial={{ scaleY: 0 }} animate={{ scaleY: inView ? 1 : 0 }} transition={{ duration: 0.9, ease }} className="absolute inset-y-4 left-1/2 w-0.5 origin-top bg-cream" />
          <motion.span animate={{ x: inView ? "-120%" : "-50%" }} transition={{ duration: 1, ease, delay: 0.3 }} className="absolute top-1/2 left-1/2 -translate-y-1/2 rounded-full bg-paper px-4 py-2 text-sm font-medium shadow-lg">
            🐶 Perros
          </motion.span>
          <motion.span animate={{ x: inView ? "20%" : "-50%" }} transition={{ duration: 1, ease, delay: 0.3 }} className="absolute top-1/2 left-1/2 -translate-y-1/2 rounded-full bg-paper px-4 py-2 text-sm font-medium shadow-lg">
            🐱 Gatos
          </motion.span>
        </div>
      )}

      {id === "turno" && (
        <div className="grid h-full grid-cols-7 content-center gap-1.5">
          {Array.from({ length: 14 }, (_, k) => (
            <span key={k} className="relative flex aspect-square items-center justify-center rounded-lg bg-cream text-xs text-ink/50">
              {tick % 14 === k && <motion.span layoutId="cal-pick" className="absolute inset-0 rounded-lg bg-coral" transition={{ type: "spring", stiffness: 300, damping: 26 }} />}
              <span className={`relative ${tick % 14 === k ? "text-white" : ""}`}>{k + 8}</span>
            </span>
          ))}
          <AnimatePresence mode="wait">
            <motion.span key={tick} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="col-span-7 mt-2 text-sm text-ink/60">
              ✓ Turno confirmado · {["10:30", "16:00", "11:00", "18:30"][tick % 4]} h
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      {id === "guardia" && (
        <div className="flex h-full items-center justify-center">
          <div className="relative h-36 w-36 rounded-full border-4 border-ink">
            {Array.from({ length: 12 }, (_, k) => (
              <span key={k} className="absolute top-1/2 left-1/2 h-1.5 w-0.5 bg-ink/40" style={{ transform: `rotate(${k * 30}deg) translateY(-62px)` }} />
            ))}
            <span className="absolute top-1/2 left-1/2 h-11 w-1 origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_24s_linear_infinite] rounded-full bg-ink" />
            <span className="absolute top-1/2 left-1/2 h-14 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_2s_linear_infinite] rounded-full bg-coral" />
            <span className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral" />
          </div>
          <span className="ml-5 text-sm text-ink/60">
            <span className="display block text-4xl text-ink">24/7</span>
            siempre abierto
          </span>
        </div>
      )}

      {id === "whatsapp" && (
        <div className="flex h-full items-end justify-center">
          <div className="h-full w-56 overflow-hidden rounded-t-[28px] border-x-4 border-t-4 border-ink bg-[#efe7dc] p-3">
            {[
              ["💉 Vacuna aplicada: séxtuple", 0],
              ["📄 Resultados del laboratorio listos", 1],
              ["⏰ Recordatorio: refuerzo en 15 días", 2],
            ].map(([t, k]) => (
              <motion.p
                key={t as string}
                animate={{ opacity: tick % 4 > (k as number) ? 1 : 0, y: tick % 4 > (k as number) ? 0 : 10 }}
                className="mb-2 rounded-xl rounded-tl-sm bg-white px-3 py-2 text-xs shadow-sm"
              >
                {t}
              </motion.p>
            ))}
          </div>
        </div>
      )}

      {id === "calma" && (
        <div className="flex h-full flex-col justify-center">
          <svg viewBox="0 0 600 120" className="w-full">
            <motion.path
              d="M0 60 H140 l20 -40 l20 80 l20 -60 l20 20 H300 C340 60 340 40 380 40 S420 80 460 80 S520 50 600 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-coral"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: inView ? 1 : 0 }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
          </svg>
          <div className="mt-3 flex justify-between text-xs text-ink/50">
            <span>Al llegar</span>
            <span>Con premios, tiempo y manejo suave</span>
          </div>
        </div>
      )}

      {id === "precios" && (
        <div className="flex h-full flex-col justify-center">
          <span className="text-sm text-ink/50">Consulta desde</span>
          <span className="display text-6xl">
            $ <Count to={services[0].from} />
          </span>
          <span className="mt-2 inline-flex w-fit rounded-full bg-sage/40 px-3 py-1 text-xs">Precio final · sin sorpresas</span>
        </div>
      )}
    </div>
  );
}

/* ================================== Triage ================================== */

export function Triage() {
  const [species, setSpecies] = useState<Species | null>(null);
  const [symptom, setSymptom] = useState<string | null>(null);
  const [result, setResult] = useState<Level | null>(null);
  const { open } = useBooking();
  const step = !species ? 0 : !symptom ? 1 : !result ? 2 : 3;
  const reset = () => {
    setSpecies(null);
    setSymptom(null);
    setResult(null);
  };
  const list = symptoms.filter((s) => !s.species || (species && s.species.includes(species)));

  return (
    <section id="triage" className="px-3 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-[40px] bg-ink px-5 py-16 text-cream sm:px-12 sm:py-24">
        <Paw className="pointer-events-none absolute -top-10 -right-10 h-72 w-72 rotate-[20deg] text-cream/[0.04]" />
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="label flex items-center gap-3 text-cream/60">
              <span className="h-2 w-2 rounded-full bg-coral" />
              ¿Está bien tu mascota?
            </p>
            <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">
              <Lines lines={["Contanos qué le pasa.", <em key="x" className="text-honey">Te decimos qué hacer.</em>]} />
            </h2>
            <p className="mt-6 max-w-md text-cream/60">Tres preguntas y te orientamos: si hay que venir ya, si conviene un turno hoy o si puede esperar a un control.</p>
            <div className="mt-8 flex gap-2">
              {[0, 1, 2].map((k) => (
                <motion.span key={k} animate={{ width: step === k ? 40 : 10, backgroundColor: step >= k ? "#e8553d" : "rgba(246,241,231,0.25)" }} className="block h-2 rounded-full" />
              ))}
            </div>
            <p className="mt-10 max-w-sm text-xs text-cream/40">Orientativo: no reemplaza la consulta veterinaria. Ante cualquier duda, llamá a la guardia.</p>
          </div>

          <div className="min-h-[26rem]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <Q key="q0" title="¿A quién le pasa algo?">
                  <div className="grid grid-cols-3 gap-3">
                    {SPECIES.map((s) => (
                      <button key={s.id} onClick={() => setSpecies(s.id)} className="rounded-3xl border border-cream/15 p-6 text-center transition-all hover:-translate-y-1 hover:border-coral hover:bg-cream/5">
                        <span className="block text-5xl">{s.id === "perro" ? "🐶" : s.id === "gato" ? "🐱" : "🐰"}</span>
                        <span className="mt-3 block">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </Q>
              )}
              {step === 1 && (
                <Q key="q1" title="¿Qué notás?">
                  <div className="space-y-2">
                    {list.map((s, i) => (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => {
                          setSymptom(s.id);
                          if (s.level !== "ask") setResult(s.level);
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-cream/15 px-5 py-3.5 text-left transition-colors hover:border-coral hover:bg-cream/5"
                      >
                        {s.text}
                        <span className="text-cream/30">→</span>
                      </motion.button>
                    ))}
                  </div>
                  <BackBtn onClick={() => setSpecies(null)} />
                </Q>
              )}
              {step === 2 && (
                <Q key="q2" title="¿Y cómo lo ves de ánimo?">
                  <div className="space-y-2">
                    {moods.map((m) => (
                      <button key={m.id} onClick={() => setResult(m.level)} className="flex w-full items-center justify-between rounded-2xl border border-cream/15 px-5 py-4 text-left transition-colors hover:border-coral hover:bg-cream/5">
                        {m.text}
                        <span className="text-cream/30">→</span>
                      </button>
                    ))}
                  </div>
                  <BackBtn onClick={() => setSymptom(null)} />
                </Q>
              )}
              {step === 3 && result && (
                <motion.div key="r" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
                  <TriageResult level={result} onBook={() => open({ species: species!, service: "consulta", today: result === "amarillo" })} onReset={reset} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Q({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease }}>
      <p className="display mb-6 text-4xl">{title}</p>
      {children}
    </motion.div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-4 text-sm text-cream/50 hover:text-cream">
      ← Volver
    </button>
  );
}

function TriageResult({ level, onBook, onReset }: { level: Level; onBook: () => void; onReset: () => void }) {
  const cfg = {
    rojo: { bg: "bg-coral", title: "Vení ya a la guardia.", text: "Por lo que contás, no conviene esperar. Llamanos en camino y te recibimos preparados." },
    amarillo: { bg: "bg-honey text-ink", title: "Que lo vean hoy.", text: "No parece una emergencia, pero conviene que lo revisemos hoy. Tenemos turnos en el día." },
    verde: { bg: "bg-sage text-ink", title: "Puede esperar a un turno.", text: "Sacá un turno de consulta cuando te quede cómodo. Si algo cambia, volvé a hacer el test o llamanos." },
  }[level];
  return (
    <div className={`rounded-[32px] p-8 sm:p-10 ${cfg.bg}`}>
      <div className="flex items-center gap-3">
        {(["rojo", "amarillo", "verde"] as Level[]).map((l) => (
          <span key={l} className={`h-4 w-4 rounded-full border-2 border-current ${l === level ? "bg-current" : "opacity-30"}`} />
        ))}
      </div>
      <p className="display mt-6 text-5xl sm:text-6xl">{cfg.title}</p>
      <p className="mt-4 max-w-md text-lg opacity-80">{cfg.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {level === "rojo" ? (
          <>
            <a href={brand.phoneHref} className="rounded-full bg-ink px-7 py-4 font-semibold text-cream">
              Llamar ahora · {brand.phone}
            </a>
            <a href="https://maps.google.com/?q=Av.+Cabildo+2450+CABA" target="_blank" rel="noreferrer" className="rounded-full border-2 border-current px-7 py-4 font-semibold">
              Cómo llegar
            </a>
          </>
        ) : (
          <button onClick={onBook} className="rounded-full bg-ink px-7 py-4 font-semibold text-cream">
            {level === "amarillo" ? "Ver turnos de hoy" : "Sacar turno"}
          </button>
        )}
        <button onClick={onReset} className="px-4 py-4 text-sm underline underline-offset-4 opacity-70">
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}

/* ================================== La clínica (scroll horizontal) ================================== */

export function ClinicTeaser() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const paws = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const [lit, setLit] = useState(0);
  useEffect(() => paws.on("change", (v) => setLit(Math.round(v))), [paws]);

  return (
    <section ref={section} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-10 flex items-end justify-between gap-6 px-5 sm:px-10">
          <div>
            <Kicker>La clínica</Kicker>
            <h2 className="display mt-4 text-[clamp(2.8rem,7vw,7rem)]">
              Pasá, <em className="text-coral">conocela.</em>
            </h2>
          </div>
          <div className="hidden text-right sm:block">
            {/* Huellitas que avanzan con el recorrido */}
            <div className="flex justify-end gap-1.5">
              {rooms.map((r, k) => (
                <Paw key={r.id} className={`h-5 w-5 transition-all duration-500 ${k % 2 ? "translate-y-1.5 rotate-12" : "-rotate-12"} ${k < lit ? "text-coral" : "text-ink/15"}`} />
              ))}
            </div>
            <TLink href="/clinica" className="mt-4 inline-block text-sm text-ink/70 underline-offset-4 hover:underline">
              Hacé el recorrido completo →
            </TLink>
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 sm:px-10">
          {rooms.map((r, i) => (
            <TLink key={r.id} href="/clinica" className={`group grade relative block h-[56vh] shrink-0 overflow-hidden rounded-[36px] ${i % 2 ? "w-[72vw] sm:w-[28vw]" : "w-[82vw] sm:w-[40vw]"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(r.img, 1400)} alt={r.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <span className="display absolute top-5 left-6 rounded-full bg-cream/90 px-3 py-1 text-xl italic">{String(i + 1).padStart(2, "0")}</span>
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                <p className="display text-4xl sm:text-5xl">{r.name}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.facts.map((f) => (
                    <span key={f} className="rounded-full bg-cream/15 px-3 py-1 text-xs backdrop-blur">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </TLink>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ================================== Libreta de salud ================================== */

const fmtAge = (m: number) => (m < 12 ? `${m} ${m === 1 ? "mes" : "meses"}` : `${Math.floor(m / 12)} ${Math.floor(m / 12) === 1 ? "año" : "años"}${m % 12 && m < 36 ? ` y ${m % 12} m` : ""}`);
/** Hitos equiespaciados; la edad se interpola por tramos entre hito e hito (si no, los primeros meses se amontonan). */
const posIn = (months: number[], m: number) => {
  const pts = [0, ...months, 180];
  const k = pts.findIndex((x, j) => j > 0 && m <= x);
  if (k <= 0) return 1;
  const t = (m - pts[k - 1]) / (pts[k] - pts[k - 1]);
  return (k - 1 + t) / (pts.length - 1);
};

export function HealthBook() {
  const [species, setSpecies] = useState<"perro" | "gato">("perro");
  const [name, setName] = useState("");
  const [age, setAge] = useState(4);
  const { open } = useBooking();
  const items = timeline[species];
  const next = items.find((m) => m.month > age) ?? items[items.length - 1];
  const due = items.filter((m) => m.month <= age);
  const plan = age < 12 ? plans[0] : age < 84 ? plans[1] : plans[2];
  const months = items.map((m) => m.month);
  const pos = (m: number) => posIn(months, m);
  const marker = useSpring(pos(age), { stiffness: 160, damping: 22 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => marker.set(pos(age)), [age, species, marker]);
  const left = useTransform(marker, (v) => `${v * 100}%`);
  const who = name.trim() || (species === "perro" ? "tu perro" : "tu gato");
  const nextSvc = useMemo(() => services.find((s) => s.id === next.service)!, [next]);

  return (
    <section className="px-5 py-28 sm:px-10">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Kicker>Libreta de salud</Kicker>
          <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">
            <Lines lines={["¿Qué le toca", <em key="b" className="text-coral">a {who}?</em>]} />
          </h2>
          <p className="mt-6 max-w-md text-ink/60">Movete por su edad y armamos su línea de vacunas y controles. Te decimos qué ya debería tener y qué viene.</p>

          <div className="mt-10 space-y-6 rounded-[32px] bg-paper p-6 sm:p-8">
            <div className="flex rounded-full bg-cream p-1">
              {(["perro", "gato"] as const).map((s) => (
                <button key={s} onClick={() => setSpecies(s)} className="relative flex-1 rounded-full py-2.5 text-sm">
                  {species === s && <motion.span layoutId="hb-sp" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className={`relative ${species === s ? "text-cream" : ""}`}>{s === "perro" ? "🐶 Perro" : "🐱 Gato"}</span>
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-sm text-ink/60">Nombre</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Ramón" className="mt-1 w-full rounded-2xl border border-ink/15 bg-cream px-4 py-3 outline-none focus:border-coral" />
            </label>
            <label className="block">
              <span className="flex justify-between text-sm text-ink/60">
                Edad <strong className="display text-2xl text-ink">{fmtAge(age)}</strong>
              </span>
              <input type="range" min={1} max={180} value={age} onChange={(e) => setAge(Number(e.target.value))} className="mt-3 w-full accent-[#e8553d]" aria-label="Edad en meses" />
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {/* Línea de tiempo horizontal (desktop) */}
          <div className="relative hidden h-64 md:block">
            <div className="absolute top-1/2 right-0 left-0 h-1 rounded-full bg-ink/10" />
            <motion.div style={{ width: left }} className="absolute top-1/2 left-0 h-1 rounded-full bg-coral" />
            {items.map((m, k) => {
              const done = m.month <= age;
              const isNext = m === next && m.month > age;
              return (
                <div key={m.title} className="absolute top-1/2" style={{ left: `${pos(m.month) * 100}%` }}>
                  <motion.span
                    animate={{ scale: isNext ? 1.3 : 1, backgroundColor: done ? "#a9bfa0" : isNext ? "#e8553d" : "#fffaf1" }}
                    className="absolute -top-3 -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink/20 text-[10px]"
                  >
                    {done ? "✓" : ""}
                    {isNext && <span className="pulse-dot absolute inset-0 rounded-full bg-coral" />}
                  </motion.span>
                  <div className={`absolute w-32 -translate-x-1/2 text-center text-xs ${k % 2 ? "top-6" : "bottom-6"}`}>
                    <p className={`font-semibold ${isNext ? "text-coral" : done ? "text-ink/50" : "text-ink"}`}>{m.title}</p>
                    <p className="text-ink/40">{fmtAge(Math.round(m.month))}</p>
                  </div>
                </div>
              );
            })}
            <motion.div style={{ left }} className="absolute top-1/2 -translate-x-1/2 -translate-y-full">
              <span className="flex flex-col items-center">
                <span className="rounded-full bg-ink px-3 py-1 text-xs whitespace-nowrap text-cream">{name.trim() || "Hoy"}</span>
                <Paw className="mt-1 h-6 w-6 text-ink" />
                {/* "Palito" que baja hasta la línea, por encima de las etiquetas de los hitos */}
                <span className="h-[3.6rem] w-px bg-ink/30" />
              </span>
            </motion.div>
          </div>

          {/* Lista vertical (mobile) */}
          <ul className="space-y-2 md:hidden">
            {items.map((m) => {
              const done = m.month <= age;
              const isNext = m === next && m.month > age;
              return (
                <li key={m.title} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${isNext ? "bg-coral text-white" : done ? "bg-sage/30" : "bg-paper"}`}>
                  <span className="w-6 text-center">{done ? "✓" : isNext ? "●" : "○"}</span>
                  <span className="flex-1 font-medium">{m.title}</span>
                  <span className="text-xs opacity-70">{fmtAge(Math.round(m.month))}</span>
                </li>
              );
            })}
          </ul>

          <AnimatePresence mode="wait">
            <motion.div key={`${species}-${next.title}-${plan.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }} className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-ink p-6 text-cream">
                <p className="label text-sage">{next.month > age ? "Lo próximo" : "Al día"}</p>
                <p className="display mt-2 text-3xl">{next.month > age ? next.title : "Chequeo de rutina"}</p>
                <p className="mt-1 text-cream/60">{next.month > age ? `${next.text} · a los ${fmtAge(Math.round(next.month))}` : "Sigue su plan senior: control cada 6 meses."}</p>
                <button onClick={() => open({ species, service: nextSvc.id })} className="mt-5 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white">
                  Reservar {nextSvc.short.toLowerCase()}
                </button>
              </div>
              <div className="rounded-[28px] bg-sage/40 p-6">
                <p className="label text-ink/60">Plan recomendado</p>
                <p className="display mt-2 text-3xl">Plan {plan.name}</p>
                <p className="mt-1 text-ink/60">
                  {plan.pitch} {due.length > 0 && `Ya debería tener ${due.length} de ${items.length} hitos.`}
                </p>
                <TLink href="/planes" className="mt-5 inline-block rounded-full border border-ink/25 px-5 py-2.5 text-sm font-semibold">
                  Desde $ {plan.monthly.toLocaleString("es-AR")}/mes →
                </TLink>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-xs text-ink/40">Calendario orientativo. El plan definitivo lo arma tu veterinario según su historia.</p>
        </div>
      </div>
    </section>
  );
}

/* ================================== Especies ================================== */

const SPECIES_MEDIA: Record<Species, { video: number; text: string }> = {
  perro: { video: V.labrador, text: "De cachorros a abuelos: vacunas, cirugía, odontología y mucho mimo." },
  gato: { video: V.catBelly, text: "Consultorio y sala de espera exclusivos, con manejo Cat Friendly." },
  exotico: { video: V.bunny, text: "Conejos, hurones, cobayos, aves y tortugas, con especialista." },
};

export function SpeciesBand() {
  const { open } = useBooking();
  return (
    <section className="px-5 py-24 sm:px-10">
      <div className="grid gap-10 md:grid-cols-3">
        {SPECIES.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.1}>
            <button onClick={() => open({ species: s.id })} className="group block w-full text-left">
              <div className="grade relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full transition-[border-radius] duration-700 group-hover:rounded-[40px]">
                <AutoVideo id={SPECIES_MEDIA[s.id].video} className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-110" />
              </div>
              <p className="display mt-6 text-center text-5xl">
                <em>{s.plural}</em>
              </p>
              <p className="mx-auto mt-2 max-w-xs text-center text-ink/60">{SPECIES_MEDIA[s.id].text}</p>
              <p className="mt-3 text-center text-sm font-semibold text-coral opacity-0 transition-opacity group-hover:opacity-100">Sacar turno →</p>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================================== Servicios ================================== */

export function ServicesGrid() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <section className="px-5 py-24 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Servicios</Kicker>
          <h2 className="display mt-4 text-[clamp(2.8rem,6.5vw,6.5rem)]">
            <Lines lines={["Todo en un mismo lugar,", <em key="b" className="text-coral">sin derivaciones.</em>]} />
          </h2>
        </div>
        <TLink href="/servicios" className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold hover:bg-ink hover:text-cream">
          Ver servicios y precios →
        </TLink>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={(i % 4) * 0.06}>
            <TLink href="/servicios" className="group block" onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}>
              <div className="grade relative aspect-[4/5] overflow-hidden rounded-[32px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(s.img, 800, 1000)} alt={s.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                {s.video && (
                  <motion.div initial={false} animate={{ opacity: hover === s.id ? 1 : 0 }} className="absolute inset-0">
                    <AutoVideo id={s.video} className="absolute inset-0" playing={hover === s.id} />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold">desde $ {s.from.toLocaleString("es-AR")}</span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                  <p className="display text-3xl">{s.name}</p>
                  <p className="mt-1 max-h-0 overflow-hidden text-sm text-cream/75 transition-all duration-500 group-hover:max-h-24">{s.text}</p>
                </div>
              </div>
            </TLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================================== Planes (teaser) ================================== */

export function PlansTeaser() {
  return (
    <section className="px-3 py-10 sm:px-6">
      <div className="rounded-[40px] bg-sage/45 px-5 py-20 sm:px-12">
        <div className="text-center">
          <Kicker className="justify-center">Planes de salud</Kicker>
          <h2 className="display mx-auto mt-4 max-w-4xl text-[clamp(2.8rem,6vw,6rem)]">
            Prevenir sale <em className="text-coral">mucho menos</em> que curar.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink/70">Una cuota mensual con vacunas, consultas ilimitadas y guardia con descuento. Sin permanencia.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {plans.map((pl, i) => (
            <Reveal key={pl.id} delay={i * 0.1}>
              <div className={`relative h-full rounded-[32px] p-8 text-center ${"highlight" in pl && pl.highlight ? "bg-ink text-cream md:-translate-y-4" : "bg-paper"}`}>
                <div className="grade mx-auto h-28 w-28 overflow-hidden rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(pl.img, 300, 300)} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="display mt-5 text-4xl">{pl.name}</p>
                <p className="text-sm opacity-60">{pl.age}</p>
                <p className="display mt-5 text-5xl">
                  $ <Count to={pl.monthly} />
                </p>
                <p className="text-sm opacity-60">por mes</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <TLink href="/planes" className="inline-block rounded-full bg-ink px-8 py-4 font-semibold text-cream transition-transform hover:scale-105">
            Comparar planes
          </TLink>
        </div>
      </div>
    </section>
  );
}

/* ================================== Equipo (teaser) ================================== */

export function TeamTeaser() {
  return (
    <section className="px-5 py-28 sm:px-10">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="grade relative aspect-[5/4] overflow-hidden rounded-[40px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(P.teamDog2, 1400, 1120)} alt="Equipo veterinario con un paciente" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </Reveal>
        <div>
          <Kicker>El equipo</Kicker>
          <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">
            <Lines lines={["Especialistas", <em key="b">que también tienen mascotas.</em>]} />
          </h2>
          <div className="mt-10 flex -space-x-4">
            {vets.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="grade h-20 w-20 overflow-hidden rounded-full border-4 border-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(v.photo, 200, 200)} alt={v.name} className="h-full w-full object-cover" />
              </motion.div>
            ))}
          </div>
          <p className="mt-6 max-w-md text-ink/60">Clínica general, medicina felina, cirugía, odontología, imágenes y exóticos. Cada uno en lo suyo.</p>
          <TLink href="/equipo" className="mt-8 inline-block rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold hover:bg-ink hover:text-cream">
            Conocé al equipo →
          </TLink>
        </div>
      </div>
    </section>
  );
}

/* ================================== Reseñas ================================== */

export function Reviews() {
  const rows = [testimonials.slice(0, 3), testimonials.slice(3)];
  return (
    <section className="overflow-hidden py-24">
      <div className="px-5 sm:px-10">
        <Kicker>Reseñas</Kicker>
        <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">
          ★ {brand.rating.toLocaleString("es-AR")} <em className="text-ink/40">en {brand.reviews.toLocaleString("es-AR")} reseñas</em>
        </h2>
      </div>
      <div className="mt-12 space-y-4">
        {rows.map((row, r) => (
          <div key={r} className={`${r ? "marquee-rev" : "marquee"} flex w-max gap-4`}>
            {[...row, ...row, ...row, ...row].map((t, i) => (
              <figure key={i} className="w-[22rem] shrink-0 rounded-[28px] bg-paper p-6">
                <p className="text-honey">★★★★★</p>
                <blockquote className="mt-3 text-ink/80">“{t.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-2 text-sm text-ink/50">
                  <span>{t.species === "perro" ? "🐶" : t.species === "gato" ? "🐱" : "🐰"}</span>
                  {t.name} · {t.pet}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-6 px-5 text-xs text-ink/40 sm:px-10">Reseñas de demostración.</p>
    </section>
  );
}

/* ================================== CTA final ================================== */

export function FinalCta() {
  const { open } = useBooking();
  return (
    <section className="px-3 pb-10 sm:px-6">
      <div className="grid items-center gap-10 overflow-hidden rounded-[40px] bg-coral px-6 py-16 text-white sm:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="display text-[clamp(3rem,8vw,8rem)]">
            <Lines lines={["¿Lo traés", <em key="b">hoy?</em>]} />
          </h2>
          <p className="mt-6 max-w-md text-white/85">Turnos en el día para consulta y vacunas. Y si no puede esperar, la guardia está abierta ahora.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => open()} className="rounded-full bg-ink px-8 py-4 font-semibold text-cream transition-transform hover:scale-105">
              Sacar turno
            </button>
            <a href={brand.phoneHref} className="rounded-full border-2 border-white px-8 py-4 font-semibold">
              Guardia · {brand.phone}
            </a>
          </div>
        </div>
        {/* Video en forma "blob" que respira */}
        <motion.div
          animate={{ borderRadius: ["58% 42% 55% 45% / 45% 55% 45% 55%", "42% 58% 45% 55% / 55% 45% 55% 45%", "58% 42% 55% 45% / 45% 55% 45% 55%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="grade relative mx-auto aspect-square w-full max-w-md overflow-hidden"
        >
          <AutoVideo id={V.lick} className="absolute inset-0" />
        </motion.div>
      </div>
    </section>
  );
}
