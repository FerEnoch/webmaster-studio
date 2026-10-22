"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/** Loader: la aguja del tacómetro sube a fondo y la cortina se abre. */
export function Loader() {
  const [rpm, setRpm] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / 1600);
      // sube, "corta" un instante y llega al tope
      const e = t < 0.7 ? (t / 0.7) * 0.85 : 0.85 + Math.sin(((t - 0.7) / 0.3) * Math.PI) * 0.1 + ((t - 0.7) / 0.3) * 0.05;
      setRpm(e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 200);
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  const angle = -120 + rpm * 240;
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night"
        >
          <svg viewBox="0 0 200 140" className="w-64">
            {Array.from({ length: 9 }, (_, i) => {
              const a = ((-120 + i * 30 - 90) * Math.PI) / 180;
              return (
                <g key={i}>
                  <line
                    x1={100 + Math.cos(a) * 70}
                    y1={100 + Math.sin(a) * 70}
                    x2={100 + Math.cos(a) * 82}
                    y2={100 + Math.sin(a) * 82}
                    stroke={i >= 7 ? "#ff4d2e" : "#f2f2ee"}
                    strokeWidth="2"
                  />
                  <text x={100 + Math.cos(a) * 58} y={100 + Math.sin(a) * 58 + 3} fill="#f2f2ee" fontSize="8" textAnchor="middle" opacity="0.6">
                    {i}
                  </text>
                </g>
              );
            })}
            <line x1="100" y1="100" x2="100" y2="30" stroke="#d7ff3a" strokeWidth="3" strokeLinecap="round" transform={`rotate(${angle} 100 100)`} />
            <circle cx="100" cy="100" r="6" fill="#d7ff3a" />
          </svg>
          <p className="mt-2 font-display text-4xl tabular-nums">{Math.round(rpm * 8000).toLocaleString("es-AR")}</p>
          <p className="text-xs tracking-[0.3em] text-chalk/50 uppercase">rpm · encendiendo motores</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const links = [
  ["Stock", "#stock"],
  ["Modelos", "#modelos"],
  ["Financiación", "#financiacion"],
  ["Test drive", "#test-drive"],
];

export function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 300 && y > prev && !open);
  });
  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference sm:px-10"
      >
        <a href="#" className="font-display text-lg font-bold tracking-tight text-white">
          APEX<span className="text-volt">/</span>MOTORS
        </a>
        <nav className="hidden gap-8 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="group relative text-sm text-white">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <button onClick={() => setOpen((v) => !v)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menú">
          <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-white" />
          <motion.span animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-white" />
        </button>
      </motion.header>

      <a
        href="#test-drive"
        className="group fixed right-5 bottom-5 z-40 flex items-center gap-3 rounded-full bg-volt py-2 pr-2 pl-5 text-sm font-semibold text-night shadow-[0_10px_40px_-10px_rgba(215,255,58,0.6)] sm:right-10 sm:bottom-8"
      >
        Agendar test drive
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-night text-volt transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 95% 4%)" }}
            animate={{ clipPath: "circle(150% at 95% 4%)" }}
            exit={{ clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-carbon p-6 pb-24 md:hidden"
          >
            {links.map(([l, h], i) => (
              <motion.a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="border-b border-white/10 py-4 font-display text-4xl"
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
