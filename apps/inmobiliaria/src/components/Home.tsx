"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { properties } from "@/lib/properties";
import MapView from "./MapView";
import PropertyCard from "./PropertyCard";
import Tour from "./Tour";

const Lot3D = dynamic(() => import("./Lot3D"), {
  ssr: false,
  loading: () => <div className="aspect-[4/3] w-full animate-pulse rounded-[28px] bg-sand" />,
});

const ease = [0.16, 1, 0.3, 1] as const;

export function Featured() {
  const track = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);
  const x = useMotionValue(0);
  const progress = useTransform(x, (v) => (limit ? -v / limit : 0));
  useEffect(() => {
    const m = () => setLimit(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth + 64));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  return (
    <section className="overflow-hidden py-28">
      <div className="mb-10 flex items-end justify-between px-4 sm:px-8">
        <div>
          <p className="text-xs tracking-[0.25em] text-brass uppercase">Selección</p>
          <h2 className="mt-2 font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            Propiedades <span className="italic">destacadas</span>
          </h2>
        </div>
        <div className="hidden w-40 sm:block">
          <div className="h-px bg-ink/15">
            <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-ink" />
          </div>
          <p className="mt-2 text-xs text-ink/50">Arrastrá →</p>
        </div>
      </div>
      <motion.div
        ref={track}
        drag="x"
        dragConstraints={{ left: -limit, right: 0 }}
        dragElastic={0.06}
        style={{ x }}
        className="flex w-max cursor-grab gap-6 px-4 active:cursor-grabbing sm:px-8"
      >
        {properties.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.9, ease }}
            className="w-[80vw] sm:w-[420px]"
          >
            <PropertyCard p={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function TryTour() {
  const casa = properties[0];
  return (
    <section className="bg-ink px-4 py-28 text-ivory sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            Probalo ahora:
            <br />
            <span className="italic text-brass">caminá la casa.</span>
          </h2>
          <p className="max-w-md text-lg text-ivory/70 lg:justify-self-end">
            Tocá las puertas para pasar de un ambiente a otro, arrastrá para mirar alrededor y seguí tu ubicación en el plano. O dejá que te
            guiemos con el recorrido automático.
          </p>
        </div>
        <Tour rooms={casa.tour!} plan={casa.plan} title={casa.title} />
        <div className="mt-6 flex justify-end">
          <Link href={`/propiedades/${casa.slug}`} className="rounded-full border border-ivory/20 px-6 py-3 text-sm hover:bg-ivory hover:text-ink">
            Ver la ficha completa →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandSection() {
  const lote = properties.find((p) => p.lot)!;
  return (
    <section className="px-4 py-28 sm:px-8">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs tracking-[0.25em] text-brass uppercase">Terrenos en 3D</p>
          <h2 className="mt-2 font-serif text-[clamp(2.6rem,5vw,5rem)] leading-[0.9]">
            Antes de comprar un lote, <span className="italic">mirá dónde da el sol.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-ink/70">
            Cada terreno tiene su modelo 3D con medidas reales, orientación, retiros y el volumen que podés construir. Mové la hora y la
            estación para ver las sombras.
          </p>
          <ul className="mt-8 space-y-3 text-ink/80">
            {["Asoleamiento real según la orientación", "Volumen edificable según el código", "Medidas, calle y norte siempre a la vista"].map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-3">
                <span className="text-brass">✦</span>
                {t}
              </motion.li>
            ))}
          </ul>
          <Link href={`/propiedades/${lote.slug}`} className="mt-10 inline-flex rounded-full bg-ink px-6 py-3.5 text-sm text-ivory">
            Ver {lote.title}
          </Link>
        </div>
        <Lot3D lot={lote.lot!} compact />
      </div>
    </section>
  );
}

export function MapSection() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <section className="px-4 pb-28 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-10 font-serif text-[clamp(2.6rem,5vw,5rem)] leading-[0.9]">
          Dónde <span className="italic">estamos</span>
        </h2>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <MapView items={properties} active={hover} onHover={setHover} className="h-[60vh] min-h-[420px]" />
          <ul className="space-y-1">
            {properties.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/propiedades/${p.slug}`}
                  onMouseEnter={() => setHover(p.slug)}
                  onMouseLeave={() => setHover(null)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-colors ${hover === p.slug ? "bg-ink text-ivory" : "hover:bg-sand"}`}
                >
                  <span>
                    <span className="block font-serif text-xl leading-tight">{p.title}</span>
                    <span className="text-xs opacity-60">
                      {p.barrio} · {p.op}
                    </span>
                  </span>
                  <span>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Tasador instantáneo: estimación orientativa por barrio, tipo y metros. */
const USD_M2: Record<string, number> = {
  "Palermo": 3100,
  "Belgrano": 2800,
  "Nordelta": 2400,
  "San Isidro": 2600,
  "Caballito": 2100,
  "Pilar": 1500,
};

export function Valuation() {
  const [barrio, setBarrio] = useState("Palermo");
  const [type, setType] = useState<"Departamento" | "Casa" | "Terreno">("Departamento");
  const [m2, setM2] = useState(85);
  const base = USD_M2[barrio] * (type === "Casa" ? 0.9 : type === "Terreno" ? 0.28 : 1) * m2;
  const [shown, setShown] = useState(base);
  useEffect(() => {
    const c = animate(shown, base, { duration: 0.7, ease: "easeOut", onUpdate: setShown });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  return (
    <section id="contacto" className="bg-moss px-4 py-28 text-ivory sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.25em] text-brass uppercase">Tasación online</p>
          <h2 className="mt-2 font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            ¿Cuánto vale <span className="italic">tu propiedad?</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-ivory/70">Una estimación al instante. Después un tasador del equipo la confirma en persona, sin costo.</p>
        </div>
        <div className="rounded-[28px] bg-ivory p-6 text-ink sm:p-10">
          <div className="flex flex-wrap gap-2">
            {(["Departamento", "Casa", "Terreno"] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className="relative rounded-full px-4 py-2 text-sm">
                {type === t && <motion.span layoutId="val-type" className="absolute inset-0 rounded-full bg-ink" />}
                <span className={`relative ${type === t ? "text-ivory" : ""}`}>{t}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.keys(USD_M2).map((b) => (
              <button
                key={b}
                onClick={() => setBarrio(b)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${barrio === b ? "border-brass bg-brass text-white" : "border-ink/15 hover:border-ink/40"}`}
              >
                {b}
              </button>
            ))}
          </div>
          <label className="mt-8 block">
            <span className="flex justify-between text-sm">
              <span className="text-ink/60">Superficie</span>
              <span className="tabular-nums">{m2} m²</span>
            </span>
            <input type="range" min={type === "Terreno" ? 200 : 30} max={type === "Terreno" ? 2000 : 500} value={m2} onChange={(e) => setM2(Number(e.target.value))} className="mt-2 w-full" />
          </label>
          <div className="mt-8 border-t border-ink/10 pt-6">
            <p className="text-xs tracking-[0.2em] text-ink/50 uppercase">Valor estimado</p>
            <AnimatePresence mode="wait">
              <motion.p key={type + barrio} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-serif text-[clamp(2.6rem,6vw,4.5rem)] leading-none tabular-nums">
                US$ {Math.round((shown * 0.93) / 1000)}K – {Math.round((shown * 1.07) / 1000)}K
              </motion.p>
            </AnimatePresence>
            <button className="mt-6 w-full rounded-full bg-ink py-4 text-ivory sm:w-auto sm:px-10">Pedir tasación presencial</button>
            <p className="mt-3 text-xs text-ink/40">Valores de referencia de ejemplo para la demo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
