"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/** Plano que se dibuja solo + contador; después la cortina sube y revela la obra. */
export default function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const dur = 1700;
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      setN(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1.2, delay, ease: "easeInOut" as const },
  });

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="blueprint-grid fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a1a4f] text-white"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease }}
        >
          <svg viewBox="0 0 200 220" className="w-40 sm:w-52" fill="none" stroke="#8fb0ff" strokeWidth="1.2">
            <motion.path d="M10 210 H190" {...draw(0)} />
            <motion.path d="M50 210 V40 H150 V210" {...draw(0.15)} />
            {Array.from({ length: 8 }, (_, i) => (
              <motion.path key={i} d={`M50 ${190 - i * 20} H150`} {...draw(0.3 + i * 0.06)} strokeOpacity={0.6} />
            ))}
            <motion.path d="M83 210 V40 M117 210 V40" {...draw(0.5)} strokeOpacity={0.4} />
            <motion.path d="M160 210 V20 H40 M60 20 V30" {...draw(0.7)} stroke="#ff5a1f" />
          </svg>
          <div className="mt-10 flex items-baseline gap-3 font-mono">
            <span className="text-5xl tabular-nums">{String(n).padStart(3, "0")}</span>
            <span className="text-xs tracking-[0.25em] text-white/60 uppercase">% · Cargando obra</span>
          </div>
          <span className="absolute bottom-8 font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
            Basalto · Plano A-01 · Esc 1:100
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
