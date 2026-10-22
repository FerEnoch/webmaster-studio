"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { img, photos } from "@/lib/content";
import { useBooking } from "./Booking";

const ease = [0.16, 1, 0.3, 1] as const;
type Mode = "explorar" | "blanqueamiento" | "ortodoncia" | "implante";

const SHADES = ["A4", "A3.5", "A3", "A2", "A1", "B1", "BL2", "BL1"];
const NAMES: Record<number, string> = {
  1: "Incisivo central",
  2: "Incisivo lateral",
  3: "Canino",
  4: "Primer premolar",
  5: "Segundo premolar",
  6: "Primer molar",
  7: "Segundo molar",
  8: "Tercer molar (muela de juicio)",
};

type Tooth = { fdi: number; x: number; y: number; rot: number; w: number; h: number; upper: boolean; jitter: [number, number, number] };

/** Arcadas superior e inferior con numeración FDI (vista de frente al paciente). */
function useTeeth() {
  return useMemo(() => {
    const out: Tooth[] = [];
    const size = (n: number) => (n <= 2 ? [31, 44] : n === 3 ? [34, 46] : n <= 5 ? [38, 40] : [46, 44]);
    let seed = 4;
    const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280 - 0.5);
    for (let i = 0; i < 16; i++) {
      const n = i < 8 ? 8 - i : i - 7;
      const quad = i < 8 ? 1 : 2;
      const a = Math.PI + ((i + 0.5) / 16) * Math.PI;
      const [w, h] = size(n);
      out.push({
        fdi: quad * 10 + n,
        x: 300 + 238 * Math.cos(a),
        y: 205 + 150 * Math.sin(a),
        rot: (a * 180) / Math.PI + 90,
        w,
        h,
        upper: true,
        jitter: n <= 3 ? [r() * 14, r() * 10, r() * 26] : [r() * 4, r() * 4, r() * 8],
      });
    }
    for (let i = 0; i < 16; i++) {
      const n = i < 8 ? 8 - i : i - 7;
      const quad = i < 8 ? 4 : 3;
      const a = Math.PI - ((i + 0.5) / 16) * Math.PI;
      const [w, h] = size(n);
      out.push({
        fdi: quad * 10 + n,
        x: 300 + 222 * Math.cos(a),
        y: 225 + 140 * Math.sin(a),
        rot: (a * 180) / Math.PI - 90,
        w: w * 0.92,
        h: h * 0.92,
        upper: false,
        jitter: n <= 3 ? [r() * 14, r() * 10, r() * 26] : [r() * 4, r() * 4, r() * 8],
      });
    }
    return out;
  }, []);
}

export default function Dental() {
  const teeth = useTeeth();
  const [mode, setMode] = useState<Mode>("explorar");
  const [hover, setHover] = useState<Tooth | null>(null);
  const [shade, setShade] = useState(1);
  const [aligned, setAligned] = useState(false);
  const [implant, setImplant] = useState<number | null>(null);
  const [phase, setPhase] = useState(0);
  const { open } = useBooking();

  // Color del diente según el tono VITA elegido (de amarillento a blanco brillante).
  const toothColor = (t: number) => {
    const a = [232, 212, 160];
    const b = [252, 252, 247];
    const k = mode === "blanqueamiento" ? t / (SHADES.length - 1) : 0.55;
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
  };

  const startImplant = (fdi: number) => {
    setImplant(fdi);
    setPhase(0);
    [1, 2, 3].forEach((p) => setTimeout(() => setPhase(p), p * 1100));
  };

  const msgs: Record<Mode, string> = {
    explorar: hover ? `Pieza ${hover.fdi} · ${NAMES[hover.fdi % 10]}` : "Pasá el mouse por cada pieza.",
    blanqueamiento: `Tono ${SHADES[shade]} — mové el deslizador para ver hasta dónde puede aclarar.`,
    ortodoncia: aligned ? "Con alineadores: 12 a 18 meses, sin brackets visibles." : "Así se ven las piezas desalineadas.",
    implante: implant
      ? ["Extracción de la pieza dañada", "Colocación del implante de titanio", "Pilar de conexión", "Corona definitiva de cerámica"][phase]
      : "Tocá una pieza para ver cómo se reemplaza.",
  };

  return (
    <section id="odontologia" className="px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs tracking-[0.25em] text-deep/60 uppercase">Odontología</p>
            <h2 className="mt-2 font-serif text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.9]">
              Mirá tu tratamiento
              <br />
              <span className="italic text-deep/60">antes de empezarlo.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-ink/70">
              Escaneamos tu boca en 3D y te mostramos el resultado esperado en la primera consulta. Probá cómo funciona:
            </p>
            <div className="mt-8 grid grid-cols-2 gap-2">
              {(["explorar", "blanqueamiento", "ortodoncia", "implante"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setImplant(null);
                    setAligned(false);
                  }}
                  className={`relative rounded-2xl border px-4 py-3 text-left capitalize transition-colors ${
                    mode === m ? "border-deep bg-deep text-porcelain" : "border-ink/15 hover:border-deep"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="mt-8 hidden overflow-hidden rounded-3xl lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(photos.dentalChair, 900, 500)} alt="Consultorio odontológico" className="h-56 w-full object-cover" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_50%_45%,#3a1f24_0%,#1c1012_70%)] p-4 sm:p-8">
            {/* Encía */}
            <svg viewBox="0 0 600 430" className="w-full">
              <defs>
                <radialGradient id="gum" cx="50%" cy="50%" r="60%">
                  <stop offset="0" stopColor="#c7646d" />
                  <stop offset="1" stopColor="#8e3b45" />
                </radialGradient>
                <linearGradient id="enamel" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
                  <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M52 210 C 60 30, 540 30, 548 210 C 520 120, 80 120, 52 210 Z" fill="url(#gum)" opacity="0.85" />
              <path d="M70 222 C 80 400, 520 400, 530 222 C 500 320, 100 320, 70 222 Z" fill="url(#gum)" opacity="0.85" />

              {/* Arco de ortodoncia */}
              <AnimatePresence>
                {mode === "ortodoncia" && aligned && (
                  <>
                    <motion.path
                      d="M68 215 C 75 50, 525 50, 532 215"
                      fill="none"
                      stroke="#d9e2e8"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                    />
                    <motion.path
                      d="M84 228 C 95 385, 505 385, 516 228"
                      fill="none"
                      stroke="#d9e2e8"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, delay: 0.9 }}
                    />
                  </>
                )}
              </AnimatePresence>

              {teeth.map((t) => {
                const misaligned = mode === "ortodoncia" && !aligned;
                const [jx, jy, jr] = misaligned ? t.jitter : [0, 0, 0];
                const isImplant = mode === "implante" && implant === t.fdi;
                const hovered = hover?.fdi === t.fdi;
                return (
                  <motion.g
                    key={t.fdi}
                    animate={{ x: t.x + jx, y: t.y + jy, rotate: t.rot + jr }}
                    transition={{ type: "spring", stiffness: 70, damping: 14 }}
                    onMouseEnter={() => setHover(t)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => mode === "implante" && startImplant(t.fdi)}
                    style={{ cursor: mode === "implante" ? "pointer" : "default" }}
                  >
                    {isImplant ? (
                      <ImplantSteps w={t.w} h={t.h} phase={phase} />
                    ) : (
                      <>
                        <motion.rect
                          x={-t.w / 2}
                          y={-t.h / 2}
                          width={t.w}
                          height={t.h}
                          rx={t.w * 0.28}
                          animate={{ fill: toothColor(shade), scale: hovered ? 1.12 : 1 }}
                          transition={{ duration: 0.5 }}
                          stroke={hovered ? "#6fd3c2" : "#00000025"}
                          strokeWidth={hovered ? 2.5 : 1}
                        />
                        <rect x={-t.w / 2 + 3} y={-t.h / 2 + 2} width={t.w - 6} height={t.h * 0.45} rx={t.w * 0.3} fill="url(#enamel)" pointerEvents="none" />
                        {mode === "ortodoncia" && aligned && (
                          <motion.rect
                            x={-5}
                            y={-4}
                            width={10}
                            height={8}
                            rx={1.5}
                            fill="#b8c4cc"
                            stroke="#7f8b93"
                            strokeWidth={0.8}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + (t.fdi % 10) * 0.05 }}
                          />
                        )}
                      </>
                    )}
                  </motion.g>
                );
              })}
            </svg>

            <div className="mt-2 flex flex-col gap-4 rounded-2xl bg-white/5 p-4 text-porcelain sm:flex-row sm:items-center sm:justify-between">
              <AnimatePresence mode="wait">
                <motion.p key={msgs[mode]} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm">
                  {msgs[mode]}
                </motion.p>
              </AnimatePresence>
              {mode === "blanqueamiento" && (
                <input type="range" min={0} max={SHADES.length - 1} value={shade} onChange={(e) => setShade(Number(e.target.value))} className="w-full sm:w-56" aria-label="Tono" />
              )}
              {mode === "ortodoncia" && (
                <button onClick={() => setAligned((v) => !v)} className="shrink-0 rounded-full bg-mint px-4 py-2 text-sm text-deep">
                  {aligned ? "Ver antes" : "Alinear"}
                </button>
              )}
              {mode !== "explorar" && mode !== "ortodoncia" && mode !== "blanqueamiento" && (
                <button onClick={() => open({ specialty: "odontologia" })} className="shrink-0 rounded-full bg-mint px-4 py-2 text-sm text-deep">
                  Consultar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImplantSteps({ w, h, phase }: { w: number; h: number; phase: number }) {
  return (
    <g>
      {/* Implante (tornillo) */}
      <motion.g initial={{ y: 30, opacity: 0 }} animate={{ y: phase >= 1 ? 0 : 30, opacity: phase >= 1 ? 1 : 0 }} transition={{ duration: 0.8, ease }}>
        <rect x={-6} y={-4} width={12} height={h * 0.8} rx={3} fill="#9aa6ae" />
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={k} x={-8} y={k * 5} width={16} height={2} rx={1} fill="#7c878f" />
        ))}
      </motion.g>
      {/* Pilar */}
      <motion.rect
        x={-5}
        y={-10}
        width={10}
        height={8}
        rx={2}
        fill="#c3ccd2"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      {/* Corona */}
      <motion.rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={w * 0.38}
        fill="#fbfbf7"
        stroke="#6fd3c2"
        strokeWidth={2}
        initial={{ y: -h / 2 - 50, opacity: 0 }}
        animate={{ y: phase >= 3 ? -h / 2 : -h / 2 - 50, opacity: phase >= 3 ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
      />
      {phase === 0 && (
        <motion.circle r={w * 0.6} fill="none" stroke="#f3a78c" strokeWidth={2} strokeDasharray="4 3" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
      )}
    </g>
  );
}
