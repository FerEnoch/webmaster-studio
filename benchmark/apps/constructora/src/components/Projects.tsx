"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/content";

/**
 * Galería horizontal anclada: el scroll vertical desplaza las obras hacia el costado.
 * Cada foto tiene parallax interno y la barra de avance de obra se completa al entrar.
 */
export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const shown = useInView(section, { once: true, amount: 0.05 });

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -distance]), { stiffness: 120, damping: 30, mass: 0.3 });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="proyectos"
      ref={section}
      className="relative bg-ink text-white"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-10 flex items-end justify-between px-5 sm:px-10">
          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-white/50 uppercase">Proyectos · 2022 — 2028</p>
            <h2 className="text-[clamp(2.6rem,6vw,6rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
              Obras que <span className="text-safety italic">hablan</span>
              <br /> por nosotros.
            </h2>
          </div>
          <div className="hidden w-48 sm:block">
            <div className="h-px bg-white/20">
              <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-safety" />
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Arrastrá el scroll →</p>
          </div>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 px-5 sm:px-10">
          {projects.map((p, i) => (
            <Card key={p.name} p={p} i={i} shown={shown} />
          ))}
          <a
            href="#contacto"
            className="group flex h-[52vh] w-[70vw] shrink-0 flex-col justify-between rounded-3xl border border-white/15 p-8 transition-colors duration-500 hover:bg-safety sm:w-[30vw]"
          >
            <span className="font-mono text-xs tracking-[0.2em] text-white/60 uppercase group-hover:text-ink">¿Tenés un terreno?</span>
            <span className="text-5xl leading-[0.95] font-semibold tracking-tight group-hover:text-ink">
              Tu proyecto puede ser el próximo →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Card({ p, i, shown }: { p: (typeof projects)[number]; i: number; shown: boolean }) {
  return (
    <motion.article
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={shown ? { clipPath: "inset(0% 0 0 0)" } : {}}
      transition={{ duration: 1.1, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] }}
      className={`group relative h-[52vh] w-[78vw] shrink-0 overflow-hidden rounded-3xl sm:w-[34vw] ${i % 2 ? "sm:mt-16" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.img}
        alt={p.name}
        className="absolute inset-0 h-full w-full scale-110 object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
      <div className="absolute top-5 left-5 flex gap-2">
        <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase backdrop-blur">
          {p.status}
        </span>
      </div>
      <span className="absolute top-5 right-5 font-mono text-xs text-white/70">{String(i + 1).padStart(2, "0")}</span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-mono text-[11px] tracking-[0.15em] text-white/60 uppercase">
          {p.type} · {p.year}
        </p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{p.name}</h3>
        <p className="text-white/70">{p.place}</p>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between font-mono text-[10px] tracking-[0.15em] text-white/60 uppercase">
            <span>Avance de obra</span>
            <span>{p.progress}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={{ width: 0 }}
              animate={shown ? { width: `${p.progress}%` } : {}}
              transition={{ duration: 1.6, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full ${p.progress === 100 ? "bg-emerald-400" : "bg-safety"}`}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
