"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { heroWalk, photo } from "@/lib/properties";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * "Caminar" la casa con el scroll: cada foto avanza hacia su punto de fuga (la puerta)
 * mientras la siguiente aparece desde un poco más lejos. Con balanceo de pasos y barras de cine.
 */
export default function HeroWalk() {
  const ref = useRef<HTMLElement>(null);
  const steps = heroWalk.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, steps - 1]);
  const p = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.6 });
  const [step, setStep] = useState(0);
  useMotionValueEvent(p, "change", (v) => setStep(Math.min(steps - 1, Math.max(0, Math.round(v)))));

  // Balanceo de "pasos": un pequeño sube y baja en cada transición.
  const bob = useTransform(p, (v) => Math.sin(v * Math.PI * 4) * 6);
  const roll = useTransform(p, (v) => Math.sin(v * Math.PI * 2) * 0.35);
  // Barras de cine que se cierran mientras caminás y se abren al llegar.
  const bars = useTransform(p, (v) => {
    const f = v - Math.floor(v);
    return Math.sin(f * Math.PI) * 7;
  });
  const barTop = useTransform(bars, (b) => `${b}vh`);
  const introOpacity = useTransform(p, [0, 0.35], [1, 0]);
  const introY = useTransform(p, [0, 0.35], [0, -60]);

  return (
    <section ref={ref} style={{ height: `${steps * 110}vh` }} className="relative bg-ink">
      <div className="grain sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ y: bob, rotate: roll }} className="absolute -inset-4">
          {heroWalk.map((s, i) => (
            <Frame key={s.img} i={i} p={p} img={s.img} focus={s.focus} />
          ))}
        </motion.div>

        {/* Viñeta */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,9,7,0.7))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Barras de cine */}
        <motion.div style={{ height: barTop }} className="absolute inset-x-0 top-0 bg-ink" />
        <motion.div style={{ height: barTop }} className="absolute inset-x-0 bottom-0 bg-ink" />

        {/* Intro + buscador */}
        <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-x-0 bottom-0 z-10 px-5 pb-10 text-ivory sm:px-10 sm:pb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 text-xs tracking-[0.3em] uppercase opacity-80"
          >
            Casas · Departamentos · Terrenos
          </motion.p>
          <h1 className="max-w-5xl font-serif text-[clamp(3rem,8vw,8.5rem)] leading-[0.9]">
            {["Recorré tu próxima casa", "antes de visitarla."].map((l, i) => (
              <span key={l} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === 1 ? "italic" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease, delay: 0.4 + i * 0.12 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <SearchBar />
        </motion.div>

        {/* Texto de cada paso */}
        <div className="pointer-events-none absolute top-1/2 left-5 z-10 -translate-y-1/2 text-ivory sm:left-10">
          <AnimatePresence mode="wait">
            {step > 0 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.7, ease }}
              >
                <p className="text-xs tracking-[0.3em] uppercase opacity-80">{heroWalk[step].kicker}</p>
                <p className="mt-3 max-w-xl font-serif text-[clamp(2.4rem,5.5vw,5.5rem)] leading-[0.95]">{heroWalk[step].title}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Huellas: indicador de pasos */}
        <div className="absolute top-1/2 right-5 z-10 flex -translate-y-1/2 flex-col gap-3 sm:right-10">
          {heroWalk.map((s, i) => (
            <motion.span
              key={s.img}
              animate={{ height: i === step ? 36 : 8, opacity: i <= step ? 1 : 0.35 }}
              className="w-1.5 rounded-full bg-ivory"
            />
          ))}
        </div>

        <AnimatePresence>
          {step === steps - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-16 z-10 flex justify-center"
            >
              <Link
                href="/propiedades"
                className="group flex items-center gap-3 rounded-full bg-ivory py-2 pr-2 pl-6 text-ink shadow-2xl"
              >
                Ver todas las propiedades
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-ivory transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Frame({ i, p, img, focus }: { i: number; p: MotionValue<number>; img: string; focus: [number, number] }) {
  // Entra desde 1.25 (lejos) a 1, y sale "atravesándola": zoom a 2.6 hacia la puerta.
  const scale = useTransform(p, [i - 1, i, i + 1], [1.25, 1, 2.6]);
  const opacity = useTransform(p, [i - 1, i - 0.45, i + 0.5, i + 1], [i === 0 ? 1 : 0, 1, 1, 0]);
  const blur = useTransform(p, [i + 0.45, i + 1], [0, 10]);
  const filter = useTransform(blur, (b) => `blur(${b}px) brightness(${1 - b / 40})`);
  return (
    <motion.div
      style={{ scale, opacity, filter, transformOrigin: `${focus[0]}% ${focus[1]}%`, zIndex: 10 - i }}
      className="absolute inset-0 will-change-transform"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo(img, 2200)} alt="" className="h-full w-full object-cover" />
    </motion.div>
  );
}

function SearchBar() {
  const [op, setOp] = useState<"Venta" | "Alquiler">("Venta");
  const [type, setType] = useState("Todas");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8, ease }}
      className="mt-8 flex w-full max-w-3xl flex-col gap-2 rounded-3xl bg-ivory/95 p-2 text-ink shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:rounded-full"
    >
      <div className="relative flex rounded-full bg-sand p-1">
        {(["Venta", "Alquiler"] as const).map((o) => (
          <button key={o} onClick={() => setOp(o)} className="relative z-10 flex-1 rounded-full px-5 py-2.5 text-sm">
            {op === o && (
              <motion.span layoutId="op-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            )}
            <span className={op === o ? "text-ivory" : ""}>{o}</span>
          </button>
        ))}
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="flex-1 rounded-full bg-transparent px-4 py-3 text-sm outline-none"
        aria-label="Tipo de propiedad"
      >
        {["Todas", "Casa", "Departamento", "Loft", "Terreno"].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <Link
        href={`/propiedades?op=${op}${type !== "Todas" ? `&type=${type}` : ""}`}
        className="flex items-center justify-center gap-2 rounded-full bg-brass px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-moss"
      >
        Buscar
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </Link>
    </motion.div>
  );
}
