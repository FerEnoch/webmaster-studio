"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { floorPlan } from "@/lib/content";

const WALLS = "M20 20 H780 V380 H680 M560 300 V20 M380 20 V280 H20 V20 M380 140 H560 M470 140 V300 H680 V200 H780 M560 200 H680";
const LAYERS = 14;

/**
 * Planta interactiva: los muros se dibujan al entrar, cada ambiente se ilumina al pasar,
 * y el modo "3D" levanta la planta en isométrica apilando capas (extrusión en CSS 3D).
 */
export default function FloorPlan() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [active, setActive] = useState(floorPlan[0].id);
  const [iso, setIso] = useState(false);
  const room = floorPlan.find((r) => r.id === active)!;
  const total = floorPlan.reduce((a, r) => a + r.m2, 0);

  return (
    <section id="unidades" className="relative overflow-hidden bg-[#0a1a4f] px-5 py-28 text-white sm:px-10">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[clamp(2.4rem,5vw,5rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
              Recorré tu
              <br />
              <span className="text-safety italic">futuro hogar.</span>
            </h2>
            <div className="flex rounded-full border border-white/20 p-1 font-mono text-[11px] tracking-widest uppercase">
              {[
                ["Planta", false],
                ["3D", true],
              ].map(([l, v]) => (
                <button
                  key={String(l)}
                  onClick={() => setIso(Boolean(v))}
                  className={`rounded-full px-4 py-2 transition-colors ${iso === v ? "bg-white text-ink" : "text-white/70"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div ref={ref} className="relative aspect-[2/1] w-full" style={{ perspective: 1800 }}>
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
              animate={iso ? { rotateX: 55, rotateZ: -32, scale: 0.82, y: -20 } : { rotateX: 0, rotateZ: 0, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            >
              {/* Losa */}
              <svg viewBox="0 0 800 400" className="absolute inset-0 h-full w-full">
                {floorPlan.map((r) => (
                  <motion.path
                    key={r.id}
                    d={r.d}
                    onMouseEnter={() => setActive(r.id)}
                    onClick={() => setActive(r.id)}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.2 }}
                    className="cursor-pointer transition-[fill] duration-500"
                    fill={active === r.id ? "rgba(255,90,31,0.55)" : "rgba(143,176,255,0.06)"}
                  />
                ))}
              </svg>

              {/* Muros extruidos: la misma línea repetida en Z */}
              {Array.from({ length: LAYERS }, (_, i) => (
                <motion.svg
                  key={i}
                  viewBox="0 0 800 400"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  animate={{ z: iso ? i * 4 : 0, opacity: iso || i === LAYERS - 1 ? 1 : 0 }}
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: iso ? i * 0.02 : 0 }}
                >
                  <motion.path
                    d={WALLS}
                    fill="none"
                    stroke={i === LAYERS - 1 ? "#ffffff" : "#8fb0ff"}
                    strokeOpacity={i === LAYERS - 1 ? 1 : 0.35}
                    strokeWidth={i === LAYERS - 1 ? 6 : 6}
                    strokeLinecap="square"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                  />
                </motion.svg>
              ))}

              {/* Rótulos + cotas */}
              <motion.svg
                viewBox="0 0 800 400"
                className="pointer-events-none absolute inset-0 h-full w-full"
                animate={{ z: iso ? LAYERS * 4 + 2 : 0 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              >
                {floorPlan.map((r, i) => (
                  <motion.text
                    key={r.id}
                    x={r.label[0]}
                    y={r.label[1]}
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.6 + i * 0.07 }}
                    className="fill-white font-mono"
                    fontSize={r.m2 > 8 ? 13 : 10}
                  >
                    {r.m2} m²
                  </motion.text>
                ))}
                <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 0.7 } : {}} transition={{ delay: 2.2 }}>
                  <path d="M20 395 H780 M20 390 V400 M780 390 V400" stroke="#8fb0ff" strokeWidth="1" />
                  <text x="400" y="392" textAnchor="middle" className="fill-[#8fb0ff] font-mono" fontSize="10">
                    7,60 m
                  </text>
                </motion.g>
              </motion.svg>
            </motion.div>
          </div>
        </div>

        <aside className="self-end rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-md">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/50 uppercase">Unidad 7B · 3 ambientes</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <h3 className="text-3xl font-semibold tracking-tight">{room.name}</h3>
              <p className="mt-1 text-6xl font-semibold tracking-[-0.05em] text-safety tabular-nums">
                {room.m2}
                <span className="ml-1 text-2xl text-white/60">m²</span>
              </p>
            </motion.div>
          </AnimatePresence>
          <ul className="mt-8 space-y-1">
            {floorPlan.map((r) => (
              <li key={r.id}>
                <button
                  onMouseEnter={() => setActive(r.id)}
                  onClick={() => setActive(r.id)}
                  className={`flex w-full justify-between border-b border-white/10 py-2 text-left text-sm transition-colors ${
                    active === r.id ? "text-safety" : "text-white/70 hover:text-white"
                  }`}
                >
                  <span>{r.name}</span>
                  <span className="font-mono">{r.m2}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between font-mono text-sm">
            <span className="text-white/50 uppercase">Total cubierto</span>
            <span>{total.toFixed(1)} m²</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
