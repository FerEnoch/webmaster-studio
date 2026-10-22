"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { img, pros, specialties, zones } from "@/lib/content";
import { useBooking } from "./Booking";

const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Test: "Encontrá tu tratamiento en 30 segundos"                      */
/* ------------------------------------------------------------------ */

const QUIZ: { area: string; icon: string; options: { label: string; treatment: string; pro: string; note: string }[] }[] = [
  {
    area: "Rostro",
    icon: "◐",
    options: [
      { label: "Arrugas y líneas de expresión", treatment: "Toxina botulínica", pro: "valeria", note: "1 sesión · resultados en 7 días" },
      { label: "Volumen y labios", treatment: "Ácido hialurónico", pro: "valeria", note: "1 sesión · dura 9 a 12 meses" },
      { label: "Manchas o acné", treatment: "Peeling químico", pro: "ana", note: "3 a 4 sesiones" },
    ],
  },
  {
    area: "Sonrisa",
    icon: "◡",
    options: [
      { label: "Dientes más blancos", treatment: "Blanqueamiento LED", pro: "lucia", note: "1 a 2 sesiones · hasta 8 tonos" },
      { label: "Dientes torcidos", treatment: "Ortodoncia invisible", pro: "lucia", note: "Planificación 3D sin cargo" },
      { label: "Me falta una pieza", treatment: "Implante dental", pro: "tomas", note: "Cirugía guiada, carga inmediata" },
    ],
  },
  {
    area: "Cuerpo",
    icon: "◇",
    options: [
      { label: "Flacidez", treatment: "Radiofrecuencia corporal", pro: "valeria", note: "6 a 10 sesiones" },
      { label: "Arañitas y várices", treatment: "Escleroterapia", pro: "ana", note: "2 a 4 sesiones" },
      { label: "Control de lunares", treatment: "Dermatoscopía digital", pro: "ana", note: "Mapeo corporal completo" },
    ],
  },
  {
    area: "Dolor o lesión",
    icon: "✚",
    options: [
      { label: "Rodilla", treatment: "Rehabilitación de rodilla", pro: "martin", note: "Plan + rutina en casa" },
      { label: "Espalda o cuello", treatment: "RPG / reeducación postural", pro: "martin", note: "10 sesiones" },
      { label: "Lesión deportiva", treatment: "Kinesiología deportiva", pro: "martin", note: "Vuelta al deporte guiada" },
    ],
  },
  {
    area: "Vello no deseado",
    icon: "✧",
    options: [
      { label: "Piernas", treatment: "Láser piernas completas", pro: "julian", note: "6 a 8 sesiones" },
      { label: "Axilas", treatment: "Láser axilas", pro: "julian", note: "6 a 8 sesiones · 10 min" },
      { label: "Rostro", treatment: "Láser facial", pro: "julian", note: "8 a 10 sesiones" },
    ],
  },
];

export function Quiz() {
  const [area, setArea] = useState<number | null>(null);
  const [opt, setOpt] = useState<number | null>(null);
  const { open } = useBooking();
  const step = area === null ? 0 : opt === null ? 1 : 2;
  const choice = area !== null && opt !== null ? QUIZ[area].options[opt] : null;
  const pro = choice ? pros.find((p) => p.id === choice.pro)! : null;

  return (
    <section id="test" className="px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            Encontrá tu tratamiento
            <br />
            <span className="italic text-deep/60">en 30 segundos.</span>
          </h2>
          <div className="flex items-center gap-2 text-sm text-ink/60">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} animate={{ width: i === step ? 32 : 8, backgroundColor: i <= step ? "#0c2b28" : "#0f1a1922" }} className="h-2 rounded-full" />
            ))}
            <span className="ml-2">Paso {step + 1} de 3</span>
          </div>
        </div>

        <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-mist p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="a" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease }}>
                <p className="mb-6 text-xl">¿Qué te gustaría mejorar?</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {QUIZ.map((q, i) => (
                    <motion.button
                      key={q.area}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -6 }}
                      onClick={() => setArea(i)}
                      className="flex aspect-square flex-col justify-between rounded-3xl bg-porcelain p-5 text-left shadow-sm transition-shadow hover:shadow-xl"
                    >
                      <span className="text-4xl text-deep/70">{q.icon}</span>
                      <span className="font-serif text-2xl leading-tight">{q.area}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 1 && area !== null && (
              <motion.div key="b" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease }}>
                <button onClick={() => setArea(null)} className="mb-4 text-sm text-ink/60">
                  ← {QUIZ[area].area}
                </button>
                <p className="mb-6 text-xl">¿Qué te preocupa más?</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {QUIZ[area].options.map((o, i) => (
                    <motion.button
                      key={o.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      onClick={() => setOpt(i)}
                      className="group flex items-center justify-between rounded-3xl bg-porcelain p-6 text-left text-lg shadow-sm transition-all hover:bg-deep hover:text-porcelain"
                    >
                      {o.label}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 2 && choice && pro && (
              <motion.div key="c" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm tracking-[0.2em] text-deep/60 uppercase">Te recomendamos</p>
                  <p className="mt-2 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none">{choice.treatment}</p>
                  <p className="mt-3 text-lg text-ink/70">{choice.note}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button onClick={() => open({ pro: pro.id, treatment: choice.treatment })} className="rounded-full bg-deep px-6 py-3.5 text-porcelain">
                      Reservar con {pro.name.split(" ").slice(0, 2).join(" ")}
                    </button>
                    <button
                      onClick={() => {
                        setArea(null);
                        setOpt(null);
                      }}
                      className="rounded-full border border-ink/15 px-6 py-3.5"
                    >
                      Empezar de nuevo
                    </button>
                  </div>
                </div>
                <motion.div initial={{ rotate: 6, y: 30, opacity: 0 }} animate={{ rotate: -3, y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 14 }} className="w-64 rounded-3xl bg-porcelain p-3 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(pro.photo, 500, 560)} alt={pro.name} className="aspect-[5/5.6] w-full rounded-2xl object-cover" />
                  <p className="mt-3 px-1 font-serif text-xl">{pro.name}</p>
                  <p className="px-1 pb-1 text-sm text-ink/60">
                    {pro.title} · ★ {pro.rating}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mapa del cuerpo                                                     */
/* ------------------------------------------------------------------ */

const BODY = [
  "M100 12a28 30 0 1 1 0 60a28 30 0 1 1 0-60Z",
  "M88 66h24v26H88Z",
  "M70 92Q100 84 130 92L144 104Q152 160 140 216Q100 232 60 216Q48 160 56 104Z",
  "M57 100Q40 120 37 170Q34 212 28 246Q27 257 36 257Q45 251 47 238Q55 200 59 170Q63 140 68 118Z",
  "M143 100Q160 120 163 170Q166 212 172 246Q173 257 164 257Q155 251 153 238Q145 200 141 170Q137 140 132 118Z",
  "M64 212Q58 300 69 360Q72 400 67 426Q75 433 87 428Q87 400 91 360Q99 300 100 226Z",
  "M136 212Q142 300 131 360Q128 400 133 426Q125 433 113 428Q113 400 109 360Q101 300 100 226Z",
];

export function BodyMap() {
  const [active, setActive] = useState(zones[0].id);
  const zone = zones.find((z) => z.id === active)!;
  const { open } = useBooking();

  return (
    <section id="tratamientos" className="bg-deep px-4 py-28 text-porcelain sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-14 font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
          Tocá la zona,
          <br />
          <span className="italic text-mint">te mostramos qué hacer.</span>
        </h2>
        <div className="grid items-center gap-10 md:grid-cols-[minmax(240px,340px)_1fr]">
          <div className="relative mx-auto w-full max-w-[300px]">
            <svg viewBox="0 0 200 440" className="w-full">
              <defs>
                <linearGradient id="bodyg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#1b5a53" />
                  <stop offset="1" stopColor="#123f3a" />
                </linearGradient>
              </defs>
              {BODY.map((d, i) => (
                <path key={i} d={d} fill="url(#bodyg)" stroke="#6fd3c2" strokeOpacity={0.35} strokeWidth={0.8} />
              ))}
              {/* línea de escaneo */}
              <motion.rect x={0} width={200} height={2} fill="#6fd3c2" opacity={0.5} animate={{ y: [10, 430, 10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            </svg>
            {zones.map((z) => {
              const on = z.id === active;
              return (
                <button
                  key={z.id}
                  onMouseEnter={() => setActive(z.id)}
                  onClick={() => setActive(z.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(z.x / 200) * 100}%`, top: `${(z.y / 440) * 100}%` }}
                  aria-label={z.name}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className={`pulse-ring absolute inset-0 rounded-full ${on ? "bg-peach" : "bg-mint/60"}`} />
                    <motion.span animate={{ scale: on ? 1.3 : 1 }} className={`relative h-3.5 w-3.5 rounded-full border-2 border-porcelain ${on ? "bg-peach" : "bg-mint"}`} />
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div key={zone.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease }}>
                <p className="text-sm tracking-[0.2em] text-mint uppercase">Zona</p>
                <p className="mb-6 font-serif text-5xl">{zone.name}</p>
                <div className="space-y-3">
                  {zone.treatments.map((t, i) => {
                    const sp = specialties.find((s) => s.id === t.specialty)!;
                    return (
                      <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="group grid grid-cols-[1fr_auto] items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
                      >
                        <div>
                          <p className="flex items-center gap-2 text-xs text-porcelain/60">
                            <span className="h-2 w-2 rounded-full" style={{ background: sp.color }} />
                            {sp.name}
                          </p>
                          <p className="mt-1 text-xl">{t.name}</p>
                          <p className="mt-1 text-sm text-porcelain/60">
                            {t.sessions} · {t.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-porcelain/50">desde</p>
                          <p className="font-serif text-2xl">$ {t.from.toLocaleString("es-AR")}</p>
                          <button onClick={() => open({ specialty: t.specialty, treatment: t.name })} className="mt-2 rounded-full bg-mint px-4 py-1.5 text-sm text-deep opacity-90 transition-opacity group-hover:opacity-100">
                            Reservar
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
