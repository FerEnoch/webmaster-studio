"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { beforeAfter } from "@/lib/content";

/** Comparador arrastrable: la obra hoy vs. el render que la anticipó. */
export default function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(50);
  const smooth = useSpring(pos, { stiffness: 300, damping: 35 });
  const clip = useTransform(smooth, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(smooth, (v) => `${v}%`);
  const [drag, setDrag] = useState(false);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="bg-concrete px-5 py-28 sm:px-10">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <h2 className="text-[clamp(2.4rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
          Del render
          <br />a la <span className="text-safety italic">realidad.</span>
        </h2>
        <p className="max-w-sm text-ink/70">
          Modelamos cada proyecto con precisión fotorrealista antes de excavar. Deslizá para comparar la obra en curso con el render
          de entrega.
        </p>
      </div>

      <div
        ref={box}
        onPointerDown={(e) => {
          setDrag(true);
          move(e.clientX);
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => (drag || e.pointerType === "mouse") && move(e.clientX)}
        onPointerUp={() => setDrag(false)}
        className="relative aspect-[4/5] cursor-ew-resize touch-pan-y overflow-hidden rounded-3xl select-none sm:aspect-[21/9]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeAfter.render} alt="Render del proyecto terminado" className="absolute inset-0 h-full w-full object-cover" />
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeAfter.obra} alt="Obra en construcción" className="h-full w-full object-cover grayscale-[30%]" />
          <div className="blueprint-grid absolute inset-0 opacity-40 mix-blend-screen" />
        </motion.div>

        <span className="absolute top-5 left-5 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white uppercase backdrop-blur">
          Obra · Semana 32
        </span>
        <span className="absolute top-5 right-5 rounded-full bg-white/85 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ink uppercase backdrop-blur">
          Render de entrega
        </span>

        <motion.div style={{ left }} className="absolute inset-y-0 w-px -translate-x-1/2 bg-white">
          <motion.div
            animate={{ scale: drag ? 0.9 : 1 }}
            className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-safety font-mono text-white shadow-2xl"
          >
            ‹ ›
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
