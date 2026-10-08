"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { story, V } from "@/lib/content";
import AutoVideo from "./AutoVideo";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // El video arranca a pantalla completa y se encoge hasta ser una tarjeta.
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.78]);
  const radius = useTransform(scrollYProgress, [0, 0.6], [0, 36]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const secondY = useTransform(scrollYProgress, [0.45, 0.7], [60, 0]);
  const dim = useTransform(scrollYProgress, [0, 0.6], [0.35, 0.6]);

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div style={{ scale, borderRadius: radius }} className="grain absolute inset-0 overflow-hidden will-change-transform">
          <AutoVideo id={V.hero} className="absolute inset-0" />
          <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-night" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/80 to-transparent" />
        </motion.div>

        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 px-5 text-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 2, duration: 1.4, ease }}
            className="mb-4 text-xs uppercase sm:text-sm"
          >
            0 km · Usados seleccionados · Eléctricos
          </motion.p>
          <h1 className="font-display text-[clamp(4rem,17vw,16rem)] leading-[0.85] font-extrabold tracking-[-0.04em]">
            {"APEX".split("").map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%", skewY: 8 }}
                  animate={{ y: "0%", skewY: 0 }}
                  transition={{ duration: 1.1, delay: 1.8 + i * 0.08, ease }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.9 }}
            className="mx-auto mt-6 max-w-md text-lg text-chalk/80"
          >
            Autos de alta gama que se sienten antes de manejarlos.
          </motion.p>
        </motion.div>

        <motion.div style={{ opacity: secondOpacity, y: secondY }} className="pointer-events-none absolute inset-x-0 bottom-[16%] z-10 px-8 text-center">
          <p className="mx-auto max-w-4xl font-display text-[clamp(1.8rem,4.5vw,4rem)] leading-[1.02] font-semibold">
            Más de <span className="text-volt">120 unidades</span> listas para salir a la ruta.
          </p>
        </motion.div>

        <motion.div style={{ opacity: titleOpacity }} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-chalk/60 uppercase">
            Scroll
            <span className="h-10 w-px bg-gradient-to-b from-chalk/60 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function Ticker() {
  const words = ["0 KM", "USADOS CERTIFICADOS", "FINANCIACIÓN EN PESOS", "TOMAMOS TU USADO", "TEST DRIVE EN RUTA", "ENTREGA INMEDIATA"];
  return (
    <div className="relative -rotate-2 overflow-hidden border-y border-white/10 bg-volt py-4 text-night">
      <div className="marquee flex w-max gap-10 font-display text-2xl font-bold whitespace-nowrap sm:text-4xl" style={{ ["--marquee-duration" as string]: "26s" }}>
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            {w} <span className="text-night/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Tres capítulos con video que cambian con el scroll (texto a la izquierda, video a la derecha). */
export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(story.length - 1, Math.floor(v * story.length))));
  const s = story[i];

  return (
    <section ref={ref} className="relative" style={{ height: `${story.length * 100}vh` }}>
      <div className="sticky top-0 grid h-[100svh] items-center gap-10 px-5 py-24 sm:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10 order-2 lg:order-1">
          <div className="mb-8 flex gap-2">
            {story.map((_, k) => (
              <span key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.span className="block h-full bg-volt" animate={{ width: k < i ? "100%" : k === i ? "100%" : "0%" }} transition={{ duration: 0.6 }} />
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={i}>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm tracking-[0.25em] text-volt uppercase">
                {s.kicker}
              </motion.p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4.6rem)] leading-[0.98] font-bold">
                {s.title.split(" ").map((w, k) => (
                  <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-top">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-110%" }}
                      transition={{ duration: 0.6, delay: k * 0.04, ease }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.25 }} className="mt-6 max-w-md text-lg text-chalk/70">
                {s.text}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative order-1 h-[40vh] overflow-hidden rounded-[28px] lg:order-2 lg:h-[72vh]">
          {story.map((c, k) => (
            <motion.div
              key={c.video}
              className="absolute inset-0"
              initial={false}
              animate={{ clipPath: k <= i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", scale: k === i ? 1 : 1.08 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              style={{ zIndex: k }}
            >
              <AutoVideo id={c.video} className="grain h-full w-full" playing={k === i} />
            </motion.div>
          ))}
          <span className="absolute right-5 bottom-3 z-10 font-display text-[7rem] leading-none font-extrabold text-chalk/15">0{i + 1}</span>
        </div>
      </div>
    </section>
  );
}
