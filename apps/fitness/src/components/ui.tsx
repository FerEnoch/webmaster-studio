"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const ease = [0.16, 1, 0.3, 1] as const;

/** Bloque que aparece al entrar en pantalla (sube y se desenfoca menos). */
export function Reveal({ children, delay = 0, className = "", y = 40 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Titular que entra línea por línea desde abajo de una máscara. */
export function Lines({ lines, className = "", delay = 0, immediate = false }: { lines: ReactNode[]; className?: string; delay?: number; immediate?: boolean }) {
  // El observer va en el contenedor: la línea enmascarada al 100% nunca "intersecta".
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const show = immediate || inView;
  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((l, i) => (
        // pt/-mt: la máscara deja lugar a los acentos de mayúsculas (Í, Á) sin cambiar el interlineado.
        <span key={i} className="-mt-[0.14em] block overflow-hidden pt-[0.14em] pb-[0.04em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: show ? "0%" : "110%" }}
            transition={{ duration: 1, ease, delay: delay + i * 0.09 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Número que cuenta hasta su valor al entrar en pantalla. */
export function Count({ to, decimals = 0, suffix = "", className = "" }: { to: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease, onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {v.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** "Abierto ahora · N entrenando": el número fluctúa como si fuera en vivo. */
export function LiveNow({ className = "" }: { className?: string }) {
  const [n, setN] = useState(34);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.max(18, Math.min(52, v + Math.round((Math.random() - 0.5) * 4)))), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="pulse-dot absolute inset-0 rounded-full bg-emerald-400" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      Abierto ahora ·{" "}
      <motion.span key={n} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block tabular-nums">
        {n}
      </motion.span>{" "}
      entrenando
    </span>
  );
}

/** Botón que se "pega" al cursor (solo en dispositivos con mouse). */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
      onMouseMove={(e) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.35 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-xs tracking-[0.3em] text-bone/60 uppercase ${className}`}>
      <span className="h-px w-8 bg-signal" />
      {children}
    </p>
  );
}
