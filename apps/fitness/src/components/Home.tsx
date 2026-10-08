"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { brand, coaches, crowd, disciplines, img, marquee, paths, plans, stats, testimonials, V, zones } from "@/lib/content";
import AutoVideo from "./AutoVideo";
import { useBooking } from "./Booking";
import { TLink } from "./Transition";
import { Count, ease, Kicker, Lines, LiveNow, Magnetic, Reveal } from "./ui";

/* ---------------------------------- Hero ---------------------------------- */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useBooking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.84]);
  const radius = useTransform(scrollYProgress, [0, 0.7], [0, 40]);
  const titleY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const second = useTransform(scrollYProgress, [0.45, 0.75], [0, 1]);
  const secondY = useTransform(scrollYProgress, [0.45, 0.75], [60, 0]);

  return (
    <section ref={ref} className="relative h-[210vh]">
      <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden">
        <motion.div style={{ scale, borderRadius: radius }} className="grade grain vignette absolute inset-0 overflow-hidden will-change-transform">
          <AutoVideo id={V.ropes} className="absolute inset-0" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-coal via-coal/30 to-coal/40" />
        </motion.div>

        <motion.div style={{ y: titleY, opacity: fade }} className="relative z-10 w-full px-5 pb-24 sm:px-10 sm:pb-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4, duration: 0.8 }} className="mb-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">
              ★ {brand.rating.toLocaleString("es-AR")} · {brand.reviews.toLocaleString("es-AR")} reseñas en Google
            </span>
            <LiveNow className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur" />
          </motion.div>
          <h1 className="display text-[clamp(4.2rem,15vw,15rem)]">
            <Lines immediate delay={2.1} lines={["Entrenar acá", <>se siente <span className="text-signal">distinto.</span></>]} />
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.7, duration: 0.8, ease }} className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-lg text-bone/80">
              Estudio boutique en Palermo, Belgrano y Núñez. <strong className="text-bone">Primera clase gratis</strong>, sin matrícula y sin permanencia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <button onClick={() => open()} className="rounded-full bg-signal px-8 py-4 font-semibold tracking-wide text-white uppercase transition-transform hover:scale-105">
                  Reservá tu clase gratis
                </button>
              </Magnetic>
              <TLink href="/club" className="rounded-full border border-white/25 px-8 py-4 font-semibold tracking-wide uppercase backdrop-blur transition-colors hover:bg-white/10">
                Conocé el club
              </TLink>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: second, y: secondY }} className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-8 text-center">
          <p className="display mx-auto max-w-5xl text-[clamp(2.4rem,7vw,6.5rem)]">
            1.800 m² pensados para que <span className="text-signal">entrenes mejor.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-white/10 py-6">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {[...marquee, ...marquee, ...marquee].map((m, i) => (
          <span key={i} className="display flex items-center gap-12 text-5xl sm:text-7xl">
            <span className={i % 2 ? "outline-text" : ""}>{m}</span>
            <span className="text-signal">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-coal px-5 py-12 sm:px-10">
          <p className="display text-[clamp(2.6rem,6vw,6rem)] whitespace-nowrap">
            <Count to={s.value} decimals={s.value % 1 ? 1 : 0} suffix={s.suffix} />
          </p>
          <p className="mt-2 text-sm text-bone/60">{s.label}</p>
        </div>
      ))}
    </section>
  );
}

/* ---------------------------------- Club (teaser horizontal) ---------------------------------- */

export function ClubTeaser() {
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
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={section} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-10 flex items-end justify-between px-5 sm:px-10">
          <div>
            <Kicker>El club</Kicker>
            <h2 className="display mt-4 text-[clamp(3rem,8vw,8rem)]">
              Recorrelo <span className="outline-text">antes de venir.</span>
            </h2>
          </div>
          <div className="hidden w-56 sm:block">
            <div className="h-px bg-white/15">
              <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-signal" />
            </div>
            <TLink href="/club" className="mt-4 inline-block text-sm text-bone/70 hover:text-bone">
              Hacé el recorrido completo →
            </TLink>
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 sm:px-10">
          {zones.map((z, i) => (
            <TLink key={z.id} href="/club" className={`group grade relative block h-[58vh] shrink-0 overflow-hidden rounded-[28px] ${i % 2 ? "w-[70vw] sm:w-[30vw]" : "w-[80vw] sm:w-[42vw]"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(z.img, 1400)} alt={z.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/10 to-transparent" />
              <span className="display absolute top-5 right-6 text-6xl text-bone/25">{String(i + 1).padStart(2, "0")}</span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs tracking-[0.25em] text-signal uppercase">{z.kicker.split("— ")[1]}</p>
                <p className="display mt-2 text-5xl">{z.name}</p>
                <p className="mt-2 max-h-0 overflow-hidden text-bone/70 transition-all duration-500 group-hover:max-h-24">{z.text}</p>
              </div>
            </TLink>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------- ¿Primera vez? ---------------------------------- */

export function FirstTime() {
  const [sel, setSel] = useState<string | null>(null);
  const { open } = useBooking();
  const p = paths.find((x) => x.id === sel);
  const d = p ? disciplines.find((x) => x.id === p.discipline)! : null;
  const plan = p ? plans.find((x) => x.id === p.plan)! : null;

  return (
    <section className="px-5 py-32 sm:px-10">
      <Kicker>¿Primera vez?</Kicker>
      <h2 className="display mt-4 max-w-5xl text-[clamp(3rem,7vw,7rem)]">
        <Lines lines={["Contanos qué buscás.", <span key="b" className="text-bone/40">Te decimos por dónde empezar.</span>]} />
      </h2>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {paths.map((x, i) => (
          <Reveal key={x.id} delay={i * 0.08}>
            <button
              onClick={() => setSel(x.id)}
              className={`group flex h-full w-full flex-col justify-between rounded-[28px] border p-8 text-left transition-all duration-500 ${
                sel === x.id ? "border-signal bg-signal text-white" : "border-white/10 bg-graphite hover:border-white/30"
              }`}
            >
              <span className="display text-6xl opacity-30">0{i + 1}</span>
              <span className="mt-16">
                <span className="display block text-4xl">{x.title}</span>
                <span className={`mt-2 block ${sel === x.id ? "text-white/80" : "text-bone/60"}`}>{x.text}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {p && d && plan && (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30, clipPath: "inset(0 0 100% 0 round 28px)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 28px)" }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease }}
            className="mt-6 grid overflow-hidden rounded-[28px] bg-bone text-coal md:grid-cols-2"
          >
            <div className="grade relative min-h-72">
              {d.video ? <AutoVideo id={d.video} className="absolute inset-0" /> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={img(d.img, 1200)} alt="" className="absolute inset-0 h-full w-full object-cover" />}
            </div>
            <div className="p-8 sm:p-12">
              <p className="text-xs tracking-[0.25em] text-signal uppercase">Te recomendamos</p>
              <p className="display mt-3 text-6xl">{d.name}</p>
              <p className="mt-3 text-coal/70">{d.text}</p>
              <div className="mt-6 flex gap-6 text-sm">
                <span><b className="display text-2xl">{d.duration}</b> min</span>
                <span><b className="display text-2xl">{d.kcal}</b> kcal</span>
              </div>
              <p className="mt-6 text-sm text-coal/60">
                Plan sugerido: <b className="text-coal">{plan.name}</b> · desde $ {plan.monthly.toLocaleString("es-AR")}/mes
              </p>
              <button onClick={() => open({ discipline: d.id })} className="mt-8 rounded-full bg-coal px-8 py-4 font-semibold tracking-wide text-bone uppercase transition-transform hover:scale-105">
                Probar {d.short} gratis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------------------------- Disciplinas ---------------------------------- */

export function Disciplines() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <section className="px-5 py-24 sm:px-10">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Disciplinas</Kicker>
          <h2 className="display mt-4 text-[clamp(3rem,7vw,7rem)]">
            <Lines lines={["Seis formas", "de entrenar."]} />
          </h2>
        </div>
        <TLink href="/clases" className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase hover:bg-white/10">
          Ver la grilla completa →
        </TLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {disciplines.map((d, i) => (
          <Reveal key={d.id} delay={(i % 3) * 0.08}>
            <TLink
              href="/clases"
              onMouseEnter={() => setHover(d.id)}
              onMouseLeave={() => setHover(null)}
              className="group grade relative block aspect-[4/5] overflow-hidden rounded-[28px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(d.img, 900, 1100)} alt={d.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
              {d.video && (
                <motion.div initial={false} animate={{ opacity: hover === d.id ? 1 : 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                  <AutoVideo id={d.video} className="absolute inset-0" playing={hover === d.id} />
                </motion.div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-3 flex gap-2 text-xs">
                  <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{d.duration} min</span>
                  <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{d.level}</span>
                </div>
                <p className="display text-5xl">{d.name}</p>
                <span className="mt-3 block h-0.5 w-12 origin-left bg-signal transition-transform duration-500 group-hover:scale-x-[3]" />
              </div>
            </TLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- ¿Cuándo hay menos gente? ---------------------------------- */

export function Crowd() {
  const [hour, setHour] = useState(19);
  const cur = crowd.find((c) => c.hour === hour)!;
  const status = cur.level > 0.75 ? ["Lleno", "text-signal"] : cur.level > 0.45 ? ["Moderado", "text-amber-300"] : ["Tranquilo", "text-emerald-400"];
  const best = [...crowd].sort((a, b) => a.level - b.level).slice(0, 3).map((c) => `${c.hour} h`);

  return (
    <section className="px-5 py-28 sm:px-10">
      <div className="grid gap-12 rounded-[32px] border border-white/10 bg-graphite p-6 sm:p-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Kicker>Sin sorpresas</Kicker>
          <h2 className="display mt-4 text-[clamp(2.8rem,5.5vw,5.5rem)]">¿Cuándo hay menos gente?</h2>
          <p className="mt-4 max-w-sm text-bone/60">Elegí tu horario y mirá cómo está la sala en promedio. Los que recién empiezan suelen preferir media mañana o media tarde.</p>
          <div className="mt-10">
            <p className="text-sm text-bone/50">A las {hour} h está</p>
            <AnimatePresence mode="wait">
              <motion.p key={status[0]} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className={`display text-7xl ${status[1]}`}>
                {status[0]}
              </motion.p>
            </AnimatePresence>
            <p className="mt-4 text-sm text-bone/50">
              Mejores horarios: <span className="text-bone">{best.join(" · ")}</span>
            </p>
          </div>
        </div>
        <div>
          <div className="flex h-64 items-end gap-1.5 sm:gap-2">
            {crowd.map((c, i) => (
              <button key={c.hour} onMouseEnter={() => setHour(c.hour)} onClick={() => setHour(c.hour)} className="group flex h-full flex-1 flex-col justify-end" aria-label={`${c.hour} horas`}>
                <motion.span
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.035, ease }}
                  style={{ height: `${c.level * 100}%`, originY: 1 }}
                  className={`block w-full rounded-t-md transition-colors ${
                    c.hour === hour ? "bg-signal" : c.level > 0.75 ? "bg-white/30" : c.level > 0.45 ? "bg-white/20" : "bg-emerald-400/50"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-bone/40">
            {crowd.filter((_, i) => i % 2 === 0).map((c) => (
              <span key={c.hour}>{c.hour}h</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Coaches (teaser) ---------------------------------- */

export function CoachesTeaser() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <section className="px-5 py-24 sm:px-10">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Coaches</Kicker>
          <h2 className="display mt-4 text-[clamp(3rem,7vw,7rem)]">
            <Lines lines={["Te corrigen.", <span key="x" className="text-signal">De verdad.</span>]} />
          </h2>
        </div>
        <TLink href="/entrenadores" className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase hover:bg-white/10">
          Conocé al equipo →
        </TLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {coaches.slice(0, 3).map((c, i) => (
          <Reveal key={c.id} delay={i * 0.1}>
            <TLink href="/entrenadores" onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)} className="group grade relative block aspect-[3/4] overflow-hidden rounded-[28px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(c.photo, 800, 1060)} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
              <motion.div initial={false} animate={{ opacity: hover === c.id ? 1 : 0 }} className="absolute inset-0">
                <AutoVideo id={c.video} className="absolute inset-0" playing={hover === c.id} />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs tracking-[0.25em] text-signal uppercase">{c.role}</p>
                <p className="display mt-2 text-4xl">{c.name}</p>
              </div>
            </TLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- Testimonios + cierre ---------------------------------- */

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[i];
  return (
    <section className="px-5 py-28 sm:px-10">
      <Kicker>Socios</Kicker>
      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[auto_1fr]">
        <div className="grade relative h-40 w-40 overflow-hidden rounded-full sm:h-56 sm:w-56">
          <AnimatePresence mode="popLayout">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img key={t.img} src={img(t.img, 500, 500)} alt="" initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} className="absolute inset-0 h-full w-full object-cover" />
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.blockquote key={i} initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -20, filter: "blur(8px)" }} transition={{ duration: 0.6 }}>
            <p className="text-[clamp(1.6rem,3.2vw,3rem)] leading-tight font-medium">“{t.quote}”</p>
            <footer className="mt-6 text-bone/60">
              {t.name} · <span className="text-signal">{t.since}</span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { open } = useBooking();
  return (
    <section className="px-5 pb-20 sm:px-10">
      <div className="grade grain vignette relative overflow-hidden rounded-[36px]">
        <AutoVideo id={V.boxing} className="absolute inset-0" />
        <div className="absolute inset-0 z-[2] bg-coal/55" />
        <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 text-center">
          <h2 className="display text-[clamp(3.5rem,11vw,11rem)]">
            <Lines lines={["Tu primera clase", <span key="g" className="text-signal">es gratis.</span>]} />
          </h2>
          <p className="mt-6 max-w-md text-lg text-bone/80">Elegí horario, vení con ropa cómoda y nosotros nos encargamos del resto.</p>
          <Magnetic className="mt-10">
            <button onClick={() => open()} className="rounded-full bg-signal px-10 py-5 text-lg font-semibold tracking-wide text-white uppercase transition-transform hover:scale-105">
              Reservar ahora
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
