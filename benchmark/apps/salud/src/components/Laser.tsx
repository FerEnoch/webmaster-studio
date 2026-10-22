"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useBooking } from "./Booking";

/** Zonas para láser sobre la silueta (viewBox 0 0 200 440). */
const ZONES = [
  { id: "rostro", name: "Rostro", price: 14000, rect: [72, 20, 56, 48] },
  { id: "axilas", name: "Axilas", price: 12000, rect: [50, 100, 100, 34] },
  { id: "brazos", name: "Brazos", price: 26000, rect: [24, 136, 152, 110] },
  { id: "abdomen", name: "Abdomen", price: 15000, rect: [64, 150, 72, 50] },
  { id: "cavado", name: "Cavado", price: 16000, rect: [70, 200, 60, 28] },
  { id: "medias", name: "Medias piernas", price: 28000, rect: [56, 330, 88, 100] },
  { id: "muslos", name: "Muslos", price: 30000, rect: [56, 228, 88, 100] },
];

const PHOTOTYPES = ["#f6dccb", "#ecc4a4", "#d6a47c", "#b47a52", "#8a5634", "#5a3620"];
const HAIR = [
  { name: "Negro", c: "#1b1410", ok: true },
  { name: "Castaño", c: "#5a3a22", ok: true },
  { name: "Rubio", c: "#c9a25a", ok: true },
  { name: "Canoso", c: "#d9d9d9", ok: false },
];

const BODY = [
  "M100 12a28 30 0 1 1 0 60a28 30 0 1 1 0-60Z",
  "M88 66h24v26H88Z",
  "M70 92Q100 84 130 92L144 104Q152 160 140 216Q100 232 60 216Q48 160 56 104Z",
  "M57 100Q40 120 37 170Q34 212 28 246Q27 257 36 257Q45 251 47 238Q55 200 59 170Q63 140 68 118Z",
  "M143 100Q160 120 163 170Q166 212 172 246Q173 257 164 257Q155 251 153 238Q145 200 141 170Q137 140 132 118Z",
  "M64 212Q58 300 69 360Q72 400 67 426Q75 433 87 428Q87 400 91 360Q99 300 100 226Z",
  "M136 212Q142 300 131 360Q128 400 133 426Q125 433 113 428Q113 400 109 360Q101 300 100 226Z",
];

export default function Laser() {
  const [sel, setSel] = useState<string[]>(["axilas", "medias"]);
  const [photo, setPhoto] = useState(2);
  const [hair, setHair] = useState(1);
  const { open } = useBooking();

  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const sessions = 6 + (photo >= 3 ? 2 : 0) + (hair === 2 ? 2 : 0);
  const perSession = ZONES.filter((z) => sel.includes(z.id)).reduce((a, z) => a + z.price, 0);
  const discount = sel.length >= 3 ? 0.25 : sel.length === 2 ? 0.1 : 0;
  const total = perSession * sessions * (1 - discount);
  const [shown, setShown] = useState(total);
  useEffect(() => {
    const c = animate(shown, total, { duration: 0.6, ease: "easeOut", onUpdate: setShown });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <section id="laser" className="relative overflow-hidden bg-[#1a1510] px-4 py-28 text-porcelain sm:px-8">
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[#f6c76f]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.25em] text-[#f6c76f] uppercase">Depilación láser</p>
        <h2 className="mt-2 mb-14 font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
          Armá tu plan
          <br />
          <span className="italic text-[#f6c76f]">y sabé cuánto sale.</span>
        </h2>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(240px,320px)_1fr_minmax(280px,360px)]">
          {/* Silueta con zonas */}
          <div className="relative mx-auto w-full max-w-[300px]">
            <svg viewBox="0 0 200 440" className="w-full">
              <defs>
                <clipPath id="silhouette">
                  {BODY.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </clipPath>
                <linearGradient id="beam" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff6b4a" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#ffb36b" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#ff6b4a" stopOpacity="0" />
                </linearGradient>
              </defs>
              {BODY.map((d, i) => (
                <path key={i} d={d} fill={PHOTOTYPES[photo]} opacity={0.9} />
              ))}
              <g clipPath="url(#silhouette)">
                {ZONES.map((z) => {
                  const on = sel.includes(z.id);
                  const [x, y, w, h] = z.rect;
                  return (
                    <g key={z.id} onClick={() => toggle(z.id)} className="cursor-pointer">
                      <motion.rect x={x} y={y} width={w} height={h} animate={{ fill: on ? "rgba(246,199,111,0.55)" : "rgba(0,0,0,0)" }} />
                      {on && (
                        <motion.rect
                          x={x}
                          width={w}
                          height={14}
                          fill="url(#beam)"
                          initial={{ y }}
                          animate={{ y: [y, y + h - 14, y] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          pointerEvents="none"
                        />
                      )}
                    </g>
                  );
                })}
              </g>
              {BODY.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#f6c76f" strokeOpacity={0.35} strokeWidth={0.8} pointerEvents="none" />
              ))}
            </svg>
          </div>

          {/* Opciones */}
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm text-porcelain/60">Zonas (tocá la silueta o la lista)</p>
              <div className="flex flex-wrap gap-2">
                {ZONES.map((z) => {
                  const on = sel.includes(z.id);
                  return (
                    <button
                      key={z.id}
                      onClick={() => toggle(z.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-[#f6c76f] bg-[#f6c76f] text-[#1a1510]" : "border-white/20 hover:border-white/50"}`}
                    >
                      {z.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-porcelain/60">Tu tono de piel (fototipo)</p>
              <div className="flex gap-2">
                {PHOTOTYPES.map((c, i) => (
                  <button key={c} onClick={() => setPhoto(i)} className="relative flex flex-col items-center gap-1" aria-label={`Fototipo ${i + 1}`}>
                    <motion.span animate={{ scale: photo === i ? 1.15 : 1 }} className={`h-11 w-11 rounded-full border-2 ${photo === i ? "border-[#f6c76f]" : "border-transparent"}`} style={{ background: c }} />
                    <span className="text-[11px] text-porcelain/60">{["I", "II", "III", "IV", "V", "VI"][i]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-porcelain/60">Color del vello</p>
              <div className="flex flex-wrap gap-2">
                {HAIR.map((h, i) => (
                  <button key={h.name} onClick={() => setHair(i)} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${hair === i ? "border-[#f6c76f]" : "border-white/20"}`}>
                    <span className="h-3 w-3 rounded-full" style={{ background: h.c }} />
                    {h.name}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {!HAIR[hair].ok && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 text-sm text-[#ffb36b]">
                    El láser actúa sobre el pigmento: en vello canoso no es efectivo. Te recomendamos una consulta para ver alternativas.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Resultado */}
          <div className="rounded-[28px] bg-porcelain p-7 text-ink lg:sticky lg:top-28">
            <p className="text-xs tracking-[0.2em] text-ink/50 uppercase">Tu plan estimado</p>
            <div className="mt-4 flex items-end gap-3">
              <motion.span key={sessions} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-serif text-7xl leading-none">
                {sessions}
              </motion.span>
              <span className="pb-2 text-ink/60">sesiones, cada 4 a 6 semanas</span>
            </div>
            <div className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Por sesión</span>
                <span className="tabular-nums">$ {perSession.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Descuento por combo</span>
                <span className="text-deep">{discount ? `−${discount * 100}%` : "—"}</span>
              </div>
            </div>
            <p className="mt-5 text-xs tracking-[0.2em] text-ink/50 uppercase">Total del tratamiento</p>
            <p className="font-serif text-5xl tabular-nums">$ {Math.round(shown).toLocaleString("es-AR")}</p>
            <p className="text-sm text-ink/50">o 6 cuotas de $ {Math.round(shown / 6).toLocaleString("es-AR")}</p>
            <button
              disabled={!sel.length}
              onClick={() => open({ specialty: "depilacion", treatment: `Láser: ${ZONES.filter((z) => sel.includes(z.id)).map((z) => z.name).join(", ")}` })}
              className="mt-6 w-full rounded-full bg-[#1a1510] py-4 text-porcelain disabled:opacity-30"
            >
              Reservar evaluación gratis
            </button>
            <p className="mt-3 text-xs text-ink/40">Precios de ejemplo para la demo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
