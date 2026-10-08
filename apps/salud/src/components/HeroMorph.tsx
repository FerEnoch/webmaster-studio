"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { heroStages } from "@/lib/content";
import { useBooking } from "./Booking";

const ParticleMorph = dynamic(() => import("./ParticleMorph"), { ssr: false });
const ease = [0.16, 1, 0.3, 1] as const;

/** Hero: el modelo de partículas cambia de forma con el scroll (cuerpo → rostro → diente → columna → piel). */
export default function HeroMorph() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [onScreen, setOnScreen] = useState(true);
  const { open } = useBooking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    setStage(Math.min(heroStages.length - 1, Math.round(v * (heroStages.length - 1))));
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const s = heroStages[stage];

  return (
    <section ref={ref} className="relative h-[520vh] bg-deep text-porcelain">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,#164a44_0%,#0c2b28_55%,#071a18_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="absolute inset-0 md:left-[30%]">
          <ParticleMorph progress={progress} active={onScreen} />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/20 to-transparent md:via-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 sm:px-10 md:justify-center md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div key={stage} className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="mb-4 text-xs tracking-[0.25em] text-mint uppercase"
              >
                {s.kicker}
              </motion.p>
              <h1 className="font-serif text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.92]">
                {s.title.split(" ").map((w, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-1 align-top">
                    <motion.span
                      className={`inline-block ${i === s.title.split(" ").length - 1 ? "italic text-mint" : ""}`}
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-110%" }}
                      transition={{ duration: 0.7, ease, delay: i * 0.06 }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-6 max-w-md text-lg text-porcelain/75"
              >
                {s.text}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => open()} className="rounded-full bg-mint px-6 py-3.5 font-medium text-deep transition-transform hover:scale-[1.03]">
              Reservar turno
            </button>
            <a href="#test" className="rounded-full border border-white/25 px-6 py-3.5 text-porcelain transition-colors hover:bg-white/10">
              Encontrá tu tratamiento en 30 s
            </a>
          </div>
        </div>

        {/* Indicador de etapas */}
        <div className="absolute top-1/2 right-5 z-10 hidden -translate-y-1/2 flex-col gap-4 sm:flex sm:right-10">
          {heroStages.map((h, i) => (
            <div key={h.shape} className="flex items-center justify-end gap-3">
              <motion.span animate={{ opacity: i === stage ? 1 : 0, x: i === stage ? 0 : 8 }} className="text-xs text-porcelain/70">
                {h.kicker.split(" ")[0]}
              </motion.span>
              <motion.span animate={{ height: i === stage ? 28 : 8, backgroundColor: i === stage ? "#6fd3c2" : "rgba(246,244,240,0.35)" }} className="w-1.5 rounded-full" />
            </div>
          ))}
        </div>

        <motion.p
          animate={{ opacity: stage === 0 ? 0.7 : 0 }}
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-xs tracking-[0.25em] uppercase md:block"
        >
          Scrolleá · mové el mouse sobre las partículas
        </motion.p>
      </div>
    </section>
  );
}
