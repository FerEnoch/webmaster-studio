"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { process } from "@/lib/content";

/** Proceso: título fijo a la izquierda, línea que se "hormigona" con el scroll y pasos que se activan. */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(process.length - 1, Math.floor(v * process.length))));

  return (
    <section id="proceso" className="bg-concrete px-5 py-28 sm:px-10">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-ink/50 uppercase">Cómo trabajamos</p>
          <h2 className="text-[clamp(2.6rem,5.5vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
            Del terreno
            <br />a la <span className="text-safety italic">llave.</span>
          </h2>
          <div className="mt-10 font-mono text-[120px] leading-none font-medium tracking-tighter text-ink/10 tabular-nums sm:text-[180px]">
            <motion.span key={active} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
              {process[active].n}
            </motion.span>
          </div>
        </div>

        <div ref={ref} className="relative pl-10 sm:pl-16">
          <div className="absolute top-0 bottom-0 left-3 w-px bg-ink/15 sm:left-5" />
          <motion.div style={{ scaleY: scrollYProgress }} className="absolute top-0 bottom-0 left-3 w-px origin-top bg-safety sm:left-5" />
          {process.map((s, i) => (
            <div key={s.n} className="relative pb-24 last:pb-0">
              <motion.span
                animate={{ scale: i <= active ? 1 : 0.6, backgroundColor: i <= active ? "#ff5a1f" : "#d9d4cb" }}
                className="absolute top-2 -left-[33px] h-4 w-4 rounded-full ring-8 ring-concrete sm:-left-[51px]"
              />
              <motion.div animate={{ opacity: i === active ? 1 : 0.35, x: i === active ? 0 : -8 }} transition={{ duration: 0.5 }}>
                <p className="font-mono text-xs tracking-[0.2em] text-ink/50 uppercase">Paso {s.n}</p>
                <h3 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-lg text-ink/70">{s.text}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
