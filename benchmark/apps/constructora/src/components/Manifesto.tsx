"use client";

import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/content";

const TEXT =
  "Cada edificio existe dos veces. Primero en un modelo digital donde probamos cada viga, cada caño y cada rayo de sol. Después, en la ciudad, ladrillo por ladrillo, exactamente como lo viste.";

/** Las palabras se "encienden" a medida que scrolleás (lectura guiada). */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = TEXT.split(" ");

  return (
    <section className="relative bg-concrete px-5 pt-32 pb-20 sm:px-10 sm:pt-44">
      <div className="mb-10 flex items-center gap-4 font-mono text-xs tracking-[0.2em] text-ink/50 uppercase">
        <span className="h-px w-10 bg-ink/30" /> Manifiesto
      </div>
      <p ref={ref} className="max-w-6xl text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.05] font-medium tracking-[-0.035em]">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>

      <div className="mt-28 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Stat key={s.label} {...s} delay={i * 0.12} />
        ))}
      </div>

      <Tapes />
    </section>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [6, 0]);
  const special = /dos|digital|exactamente/.test(children);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${special ? "text-safety" : ""}`}>
      {children}
    </motion.span>
  );
}

function Stat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2.2, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, value, delay]);
  return (
    <div ref={ref} className="group relative overflow-hidden bg-concrete p-6 sm:p-10">
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-safety transition-transform duration-700 group-hover:scale-x-100" />
      <div className="text-[clamp(3rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums">
        {v}
        <span className="text-safety">{suffix}</span>
      </div>
      <div className="mt-3 font-mono text-[11px] tracking-[0.15em] text-ink/60 uppercase">{label}</div>
    </div>
  );
}

/** Dos cintas de obra cruzadas que corren en sentidos opuestos y se inclinan con el scroll. */
function Tapes() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotA = useTransform(scrollYProgress, [0, 1], [-6, -2]);
  const rotB = useTransform(scrollYProgress, [0, 1], [4, 7]);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const xr = useTransform(scrollYProgress, [0, 1], ["-25%", "0%"]);
  const text = "PRECAUCIÓN · OBRA EN CONSTRUCCIÓN · BASALTO · ";
  return (
    <div ref={ref} className="relative -mx-5 mt-32 h-56 overflow-hidden sm:-mx-10">
      <motion.div style={{ rotate: rotB, x: xr }} className="hazard absolute top-16 left-[-10%] w-[140%] py-1">
        <div className="bg-ink py-2 font-mono text-sm tracking-[0.3em] whitespace-nowrap text-safety">{text.repeat(8)}</div>
      </motion.div>
      <motion.div style={{ rotate: rotA, x }} className="absolute top-20 left-[-10%] w-[140%] bg-safety py-3 shadow-2xl">
        <div className="font-mono text-sm font-medium tracking-[0.3em] whitespace-nowrap text-ink">{text.repeat(8)}</div>
      </motion.div>
    </div>
  );
}
