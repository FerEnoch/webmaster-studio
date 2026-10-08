"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { img, photos } from "@/lib/content";
import { useBooking } from "./Booking";

type P = [number, number];

/** IK de dos huesos: dada la cadera y el pie, ubica la rodilla (bend = lado hacia donde dobla). */
function knee(hip: P, foot: P, l1: number, l2: number, bend = 1): P {
  const dx = foot[0] - hip[0];
  const dy = foot[1] - hip[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const base = Math.atan2(dy, dx);
  const ang = base - a * bend;
  return [hip[0] + Math.cos(ang) * l1, hip[1] + Math.sin(ang) * l1];
}

type Pose = { head: P; shoulder: P; hip: P; knee: P; foot: P; elbow: P; hand: P; muscle: P; effort: number; extra?: "chair" };

const EXERCISES: { id: string; name: string; muscle: string; period: number; pose: (c: number) => Pose }[] = [
  {
    id: "puente",
    name: "Puente de glúteos",
    muscle: "Glúteos e isquiotibiales",
    period: 3.2,
    pose: (c) => {
      const up = (1 - Math.cos(c * Math.PI * 2)) / 2;
      const shoulder: P = [78, 186];
      const hip: P = [140, 188 - up * 42];
      const foot: P = [196, 196];
      return {
        head: [56, 184],
        shoulder,
        hip,
        knee: knee(hip, foot, 56, 50, 1),
        foot,
        elbow: [104, 194],
        hand: [128, 196],
        muscle: [hip[0] - 4, hip[1] + 6],
        effort: up,
      };
    },
  },
  {
    id: "rodilla",
    name: "Extensión de rodilla",
    muscle: "Cuádriceps",
    period: 3,
    pose: (c) => {
      const ext = (1 - Math.cos(c * Math.PI * 2)) / 2;
      const th = ext * (Math.PI / 2) * 0.95;
      const hip: P = [130, 132];
      const k: P = [182, 132];
      return {
        head: [124, 62],
        shoulder: [127, 82],
        hip,
        knee: k,
        foot: [k[0] + Math.sin(th) * 52, k[1] + Math.cos(th) * 52],
        elbow: [146, 112],
        hand: [166, 126],
        muscle: [158, 128],
        effort: ext,
        extra: "chair",
      };
    },
  },
  {
    id: "sentadilla",
    name: "Sentadilla",
    muscle: "Cuádriceps y glúteos",
    period: 3.4,
    pose: (c) => {
      const d = (1 - Math.cos(c * Math.PI * 2)) / 2;
      const foot: P = [158, 198];
      const hip: P = [150 - d * 26, 96 + d * 50];
      const lean = d * 0.55;
      const shoulder: P = [hip[0] + Math.sin(lean) * 58, hip[1] - Math.cos(lean) * 58];
      return {
        head: [shoulder[0] + Math.sin(lean) * 20, shoulder[1] - Math.cos(lean) * 20],
        shoulder,
        hip,
        knee: knee(hip, foot, 54, 52, -1),
        foot,
        elbow: [shoulder[0] + 22 + d * 8, shoulder[1] + 18 - d * 16],
        hand: [shoulder[0] + 44 + d * 16, shoulder[1] + 22 - d * 22],
        muscle: [hip[0] + 18, hip[1] + 4],
        effort: d,
      };
    },
  },
];

const PLAN = [
  { w: "Semana 1–2", t: "Control del dolor", d: "Fisioterapia, movilidad suave y educación." },
  { w: "Semana 3–4", t: "Movilidad", d: "Rango completo y activación muscular." },
  { w: "Semana 5–6", t: "Fuerza", d: "Carga progresiva y estabilidad." },
  { w: "Semana 7+", t: "Vuelta a tu vida", d: "Deporte, trabajo, sin dolor." },
];

export default function Physio() {
  const [ex, setEx] = useState(0);
  const [time, setTime] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const planIn = useInView(planRef, { once: true, margin: "-100px" });
  const { open } = useBooking();

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      setTime((t) => t + (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  useEffect(() => setTime(0), [ex]);

  const e = EXERCISES[ex];
  const cycle = time / e.period;
  const p = e.pose(cycle % 1);
  const reps = Math.floor(cycle + 0.5);
  const bone = "stroke-deep";

  return (
    <section id="kinesiologia" className="bg-mist px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.25em] text-deep/60 uppercase">Kinesiología</p>
            <h2 className="mt-2 font-serif text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.9]">
              Tu rutina,
              <br />
              <span className="italic text-deep/60">también en casa.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-ink/70">
              Cada paciente recibe su plan con ejercicios animados en el celular, para hacerlos bien entre sesión y sesión.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {EXERCISES.map((x, i) => (
                <button key={x.id} onClick={() => setEx(i)} className="relative rounded-full px-5 py-2.5 text-sm">
                  {ex === i && <motion.span layoutId="ex-pill" className="absolute inset-0 rounded-full bg-deep" />}
                  <span className={`relative ${ex === i ? "text-porcelain" : ""}`}>{x.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 hidden overflow-hidden rounded-3xl lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(photos.physioMat, 900, 460)} alt="Paciente haciendo ejercicios" className="h-52 w-full object-cover" />
            </div>
          </div>

          {/* "Celular" con el ejercicio */}
          <div ref={ref} className="mx-auto w-full max-w-[380px] rounded-[44px] bg-deep p-3 shadow-[0_40px_80px_-20px_rgba(12,43,40,0.5)]">
            <div className="overflow-hidden rounded-[34px] bg-porcelain">
              <div className="flex items-center justify-between px-6 pt-6">
                <div>
                  <p className="text-xs text-ink/50">Ejercicio {ex + 1} de 3</p>
                  <AnimatePresence mode="wait">
                    <motion.p key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="font-serif text-2xl">
                      {e.name}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink/50">Reps</p>
                  <motion.p key={reps} initial={{ scale: 1.4, color: "#6fd3c2" }} animate={{ scale: 1, color: "#0f1a19" }} className="font-serif text-3xl tabular-nums">
                    {Math.min(reps, 12)}/12
                  </motion.p>
                </div>
              </div>
              <svg viewBox="0 0 300 220" className="w-full">
                <line x1="20" y1="200" x2="280" y2="200" className="stroke-ink/15" strokeWidth="2" />
                {p.extra === "chair" && (
                  <g className="stroke-ink/25" strokeWidth="4" strokeLinecap="round" fill="none">
                    <path d="M100 140 H160 M110 140 V198 M152 140 V198 M100 140 V80" />
                  </g>
                )}
                {/* músculo trabajando */}
                <circle cx={p.muscle[0]} cy={p.muscle[1]} r={10 + p.effort * 10} fill="#f3a78c" opacity={0.15 + p.effort * 0.45} />
                <g className={bone} strokeWidth="9" strokeLinecap="round" fill="none">
                  <path d={`M${p.shoulder.join(" ")} L${p.elbow.join(" ")} L${p.hand.join(" ")}`} strokeOpacity={0.55} />
                  <path d={`M${p.hip.join(" ")} L${p.knee.join(" ")} L${p.foot.join(" ")}`} />
                  <path d={`M${p.hip.join(" ")} L${p.shoulder.join(" ")}`} />
                </g>
                <circle cx={p.head[0]} cy={p.head[1]} r="13" className="fill-deep" />
                {[p.knee, p.hip, p.elbow].map((j, i) => (
                  <circle key={i} cx={j[0]} cy={j[1]} r="3.5" fill="#6fd3c2" />
                ))}
              </svg>
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">{e.muscle}</span>
                  <span className="rounded-full bg-mint/30 px-3 py-1 text-xs text-deep">{p.effort > 0.6 ? "Sostené" : p.effort < 0.2 ? "Respirá" : "Subí lento"}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-deep transition-[width] duration-100" style={{ width: `${(Math.min(reps, 12) / 12) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan de recuperación */}
        <div ref={planRef} className="relative mt-24">
          <div className="absolute top-[22px] right-0 left-0 hidden h-0.5 bg-ink/10 md:block" />
          <motion.div
            className="absolute top-[22px] left-0 hidden h-0.5 origin-left bg-deep md:block"
            initial={{ scaleX: 0 }}
            animate={planIn ? { scaleX: 1 } : {}}
            transition={{ duration: 2.4, ease: "easeInOut" }}
            style={{ right: 0 }}
          />
          <div className="grid gap-8 md:grid-cols-4">
            {PLAN.map((s, i) => (
              <motion.div key={s.w} initial={{ opacity: 0, y: 20 }} animate={planIn ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.5 }}>
                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-deep font-serif text-xl text-porcelain">{i + 1}</span>
                <p className="mt-4 text-xs tracking-[0.2em] text-ink/50 uppercase">{s.w}</p>
                <p className="mt-1 font-serif text-3xl">{s.t}</p>
                <p className="mt-2 text-ink/60">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <button onClick={() => open({ specialty: "kinesiologia" })} className="rounded-full bg-deep px-7 py-4 text-porcelain">
              Empezar mi plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
