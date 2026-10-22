"use client";

import { AnimatePresence, animate, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { brand, faqs, img, P, periods, plans, rooms, sedes, services, SPECIES, vets, type Vet } from "@/lib/content";
import AutoVideo from "./AutoVideo";
import { useBooking } from "./Booking";
import { Paw } from "./Paw";
import { ease, Kicker, Lines, Reveal } from "./ui";

/* ================================== LA CLÍNICA: recorrido ================================== */

export function Tour() {
  const ref = useRef<HTMLElement>(null);
  const n = rooms.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, n - 1]);
  const p = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.5 });
  const [i, setI] = useState(0);
  useMotionValueEvent(p, "change", (v) => setI(Math.min(n - 1, Math.max(0, Math.round(v)))));
  const r = rooms[i];

  const goTo = (k: number) => {
    const el = ref.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + ((el.offsetHeight - window.innerHeight) * k) / (n - 1), behavior: "smooth" });
  };

  return (
    <section ref={ref} style={{ height: `${n * 90}vh` }} className="relative px-3 sm:px-6">
      <div className="sticky top-3 h-[calc(100svh-1.5rem)] overflow-hidden rounded-[40px] text-cream">
        <div className="grade grain absolute inset-0">
          {rooms.map((room, k) => (
            <Frame key={room.id} k={k} p={p} room={room} active={k === i} />
          ))}
          <div className="absolute inset-0 z-[20] bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[20] h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
        </div>

        <div className="relative z-30 flex h-full flex-col justify-end px-6 pb-24 sm:px-12 md:justify-center md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div key={r.id} className="max-w-xl">
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="label text-honey">
                {r.kicker}
              </motion.p>
              <h2 className="display mt-3 text-[clamp(3rem,8vw,7.5rem)]">
                <span className="block overflow-hidden pt-[0.1em] pb-[0.08em]">
                  <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "-110%" }} transition={{ duration: 0.7, ease }}>
                    {r.name}
                  </motion.span>
                </span>
              </h2>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="mt-4 max-w-md text-lg text-cream/85">
                {r.text}
              </motion.p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {r.facts.map((f, k) => (
                  <motion.li key={f} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 + k * 0.07 }} className="rounded-full bg-cream/15 px-4 py-2 text-sm backdrop-blur">
                    {f}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Plano de la sede */}
        <div className="absolute top-6 right-6 z-30 hidden w-72 rounded-3xl bg-cream/90 p-4 text-ink backdrop-blur-md md:block">
          <p className="label mb-2 flex justify-between text-[10px] text-ink/60">
            <span>Plano · Belgrano</span>
            <span className="text-coral">● Estás acá</span>
          </p>
          <svg viewBox="-1 -1 102 62" className="w-full">
            {rooms.map((room, k) => {
              const [x, y, w, h] = room.plan;
              const on = k === i;
              return (
                <g key={room.id} onClick={() => goTo(k)} className="cursor-pointer">
                  <motion.rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={2.5} animate={{ fill: on ? "#e8553d" : "rgba(22,37,31,0.06)" }} />
                  <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" fontSize={3} fill={on ? "#fff" : "#16251f"} opacity={on ? 1 : 0.6} className="pointer-events-none select-none">
                    {room.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Huellitas índice */}
        <div className="absolute right-6 bottom-6 z-30 hidden gap-1 sm:right-12 sm:flex">
          {rooms.map((room, k) => (
            <button key={room.id} onClick={() => goTo(k)} aria-label={room.name} className="p-1">
              <motion.span animate={{ scale: k === i ? 1.35 : 1, opacity: k <= i ? 1 : 0.35 }} className={`block ${k === i ? "text-coral" : "text-cream"}`}>
                <Paw className={`h-4 w-4 ${k % 2 ? "rotate-12" : "-rotate-12"}`} />
              </motion.span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Frame({ k, p, room, active }: { k: number; p: MotionValue<number>; room: (typeof rooms)[number]; active: boolean }) {
  // Cada sala entra desde lejos y se "atraviesa" con un zoom suave al pasar a la siguiente.
  const scale = useTransform(p, [k - 1, k, k + 1], [1.2, 1, 1.45]);
  const opacity = useTransform(p, [k - 1, k - 0.4, k + 0.45, k + 1], [k === 0 ? 1 : 0, 1, 1, 0]);
  return (
    <motion.div style={{ scale, opacity, zIndex: 10 - k }} className="absolute inset-0 will-change-transform">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(room.img, 2000)} alt={room.name} className="absolute inset-0 h-full w-full object-cover" />
      {"video" in room && room.video && (
        <motion.div initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 1.2 }} className="absolute inset-0">
          <AutoVideo id={room.video} className="absolute inset-0" playing={active} />
        </motion.div>
      )}
    </motion.div>
  );
}

export function Separated() {
  return (
    <section className="px-5 py-28 sm:px-10">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Kicker>Pensado para ellos</Kicker>
          <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">
            <Lines lines={["Dos clínicas", <em key="b" className="text-coral">en una.</em>]} />
          </h2>
          <p className="mt-6 max-w-md text-ink/70">Los gatos se estresan con el olor y el ruido de los perros. Por eso tienen su propia entrada, sala de espera, consultorio y boxes de internación.</p>
          <ul className="mt-8 space-y-3">
            {["Entrada y sala de espera felina", "Consultorio con escondites y feromonas", "Boxes de internación separados", "Turnos de gatos en horarios tranquilos"].map((t, k) => (
              <motion.li key={t} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.1 }} className="flex items-center gap-3">
                <Paw className="h-5 w-5 text-coral" /> {t}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "🐶 Lado perros", src: P.teamDog, y: 0 },
            { label: "🐱 Lado gatos", src: P.kittenExam, y: 60 },
          ].map((c) => (
            <Reveal key={c.label} y={80 + c.y}>
              <div className="grade relative aspect-[3/4] overflow-hidden rounded-[32px]" style={{ marginTop: c.y }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(c.src, 800, 1060)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute bottom-4 left-4 rounded-full bg-cream px-4 py-2 text-sm font-medium">{c.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function isOpen(always: boolean) {
  if (always) return true;
  const d = new Date();
  return d.getDay() !== 0 && d.getHours() >= 8 && d.getHours() < 21;
}

export function Sedes() {
  const { open } = useBooking();
  const [now, setNow] = useState<boolean[] | null>(null);
  useEffect(() => setNow(sedes.map((s) => isOpen(s.always))), []);
  return (
    <section className="px-5 pb-28 sm:px-10">
      <Kicker>Sedes</Kicker>
      <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">Dos sedes, el mismo cuidado.</h2>
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {sedes.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.1}>
            <div className="group overflow-hidden rounded-[32px] bg-paper">
              <div className="grade relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(s.img, 1200, 680)} alt={`Sede ${s.name}`} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                {now && (
                  <span className={`absolute top-4 left-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${now[i] ? "bg-emerald-100 text-emerald-800" : "bg-cream text-ink/60"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${now[i] ? "bg-emerald-500" : "bg-ink/40"}`} />
                    {s.always ? "Guardia abierta ahora" : now[i] ? "Abierto ahora" : "Cerrado ahora"}
                  </span>
                )}
              </div>
              <div className="p-7">
                <p className="display text-4xl">{s.name}</p>
                <p className="mt-1 text-ink/60">{s.address}</p>
                <p className="text-sm text-ink/40">
                  {s.hours} · {s.m2} m²
                </p>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => open()} className="flex-1 rounded-full bg-ink py-3 text-sm font-semibold text-cream">
                    Sacar turno
                  </button>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer" className="rounded-full border border-ink/15 px-5 py-3 text-sm hover:bg-ink/5">
                    Cómo llegar
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================================== SERVICIOS: scroll narrativo ================================== */

export function ServiceStory() {
  const [active, setActive] = useState(0);
  const { open } = useBooking();
  const s = services[active];
  return (
    <section className="px-5 pb-24 sm:px-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Imagen fija que cambia según el servicio que estás leyendo */}
        <div className="hidden lg:block">
          <div className="sticky top-28 h-[calc(100vh-9rem)] overflow-hidden rounded-[40px]">
            <AnimatePresence initial={false}>
              <motion.div key={s.id} initial={{ clipPath: "inset(100% 0 0 0 round 40px)" }} animate={{ clipPath: "inset(0% 0 0 0 round 40px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} className="grade absolute inset-0">
                {s.video ? (
                  <AutoVideo id={s.video} className="absolute inset-0" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(s.img, 1400, 1600)} alt={s.name} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="display absolute bottom-6 left-7 text-5xl text-cream">
                  <em>{String(active + 1).padStart(2, "0")}</em> / {String(services.length).padStart(2, "0")}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div>
          {services.map((x, i) => (
            <motion.article key={x.id} onViewportEnter={() => setActive(i)} viewport={{ margin: "-45% 0px -45% 0px" }} className="flex min-h-[70vh] flex-col justify-center border-b border-ink/10 py-12">
              <div className="grade mb-6 aspect-video overflow-hidden rounded-[28px] lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(x.img, 1000, 560)} alt={x.name} className="h-full w-full object-cover" />
              </div>
              <motion.p animate={{ color: active === i ? "#e8553d" : "rgba(22,37,31,0.4)" }} className="label">
                {String(i + 1).padStart(2, "0")} · {x.minutes >= 60 * 24 ? "por día" : x.minutes >= 60 ? `${x.minutes / 60} h` : `${x.minutes} min`}
              </motion.p>
              <motion.h2 animate={{ opacity: active === i ? 1 : 0.35 }} className="display mt-3 text-[clamp(2.6rem,5vw,4.5rem)]">
                {x.name}
              </motion.h2>
              <p className="mt-4 max-w-lg text-lg text-ink/70">{x.text}</p>
              <ul className="mt-6 space-y-2">
                {x.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-ink/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage/50 text-[10px]">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <p className="display text-4xl">
                  <span className="text-base text-ink/50">desde </span>$ {x.from.toLocaleString("es-AR")}
                </p>
                {x.id !== "internacion" && (
                  <button onClick={() => open({ service: x.id })} className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105">
                    Sacar turno
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuardiaBlock() {
  const rows = [
    ["Consulta de guardia", "$ 42.000", "$ 63.000"],
    ["Con cualquier plan Manada", "$ 21.000", "$ 31.500"],
    ["Internación (por día)", "$ 98.000", "$ 98.000"],
  ];
  return (
    <section className="px-3 pb-10 sm:px-6">
      <div className="relative grid gap-10 overflow-hidden rounded-[40px] bg-ink px-6 py-16 text-cream sm:px-12 lg:grid-cols-2">
        <div>
          <p className="label flex items-center gap-2 text-coral">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inset-0 rounded-full bg-coral" />
              <span className="relative h-2 w-2 rounded-full bg-coral" />
            </span>
            Guardia 24 h · Belgrano
          </p>
          <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">
            Sin turno. <em className="text-honey">Siempre abierta.</em>
          </h2>
          <p className="mt-6 max-w-md text-cream/70">Siempre hay dos veterinarios de guardia, quirófano listo y laboratorio. Si podés, avisanos en camino y te esperamos preparados.</p>
          <a href={brand.phoneHref} className="mt-8 inline-flex rounded-full bg-coral px-8 py-4 font-semibold text-white">
            Llamar · {brand.phone}
          </a>
        </div>
        <div className="self-end">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-cream/50">
                <th className="pb-3 font-normal" />
                <th className="pb-3 font-normal">8 a 22 h</th>
                <th className="pb-3 font-normal">Noche, domingo y feriado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b, c]) => (
                <tr key={a} className="border-t border-cream/10">
                  <td className="py-4 pr-4">{a}</td>
                  <td className="display py-4 text-2xl">{b}</td>
                  <td className="display py-4 text-2xl text-honey">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-cream/40">Precios finales con IVA. Valores de demostración.</p>
        </div>
      </div>
    </section>
  );
}

/* ================================== PLANES ================================== */

function Price({ value }: { value: number }) {
  const [v, setV] = useState(value);
  const last = useRef(value);
  useEffect(() => {
    const c = animate(last.current, value, { duration: 0.7, ease, onUpdate: setV });
    last.current = value;
    return () => c.stop();
  }, [value]);
  return <span className="tabular-nums">{Math.round(v).toLocaleString("es-AR")}</span>;
}

export function Pricing() {
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("mensual");
  const per = periods.find((x) => x.id === period)!;
  const { open } = useBooking();
  return (
    <section className="px-5 pb-20 sm:px-10">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <div className="flex rounded-full bg-paper p-1">
          {periods.map((x) => (
            <button key={x.id} onClick={() => setPeriod(x.id)} className="relative rounded-full px-6 py-2.5 text-sm">
              {x.id === period && <motion.span layoutId="period-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className={`relative ${x.id === period ? "text-cream" : "text-ink/70"}`}>
                {x.label}
                {x.discount > 0 && <span className="ml-1.5 text-coral">−{x.discount * 100}%</span>}
              </span>
            </button>
          ))}
        </div>
        <p className="text-sm text-ink/70">✓ Sin permanencia · ✓ Sin carencia para consultas · ✓ Baja en un clic</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((pl, i) => {
          const hi = "highlight" in pl && pl.highlight;
          const monthly = pl.monthly * (1 - per.discount);
          return (
            <Reveal key={pl.id} delay={i * 0.1}>
              <div className={`relative flex h-full flex-col rounded-[36px] p-8 ${hi ? "bg-ink text-cream" : "bg-paper"}`}>
                {hi && <span className="absolute -top-3 left-8 rounded-full bg-coral px-4 py-1 text-xs font-semibold text-white">El más elegido</span>}
                <div className="flex items-center gap-4">
                  <div className="grade h-16 w-16 overflow-hidden rounded-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(pl.img, 200, 200)} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="display text-4xl">{pl.name}</p>
                    <p className="text-sm opacity-60">{pl.age}</p>
                  </div>
                </div>
                <p className="mt-4 opacity-70">{pl.pitch}</p>
                <p className="display mt-8 text-6xl">
                  $ <Price value={monthly} />
                </p>
                <p className="text-sm opacity-50">por mes{per.months > 1 ? ` · $ ${Math.round(monthly * 12).toLocaleString("es-AR")} al año` : ""}</p>
                <ul className="mt-8 flex-1 space-y-3">
                  {pl.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Paw className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => open({ service: "consulta" })} className={`mt-10 rounded-full py-4 font-semibold transition-transform hover:scale-[1.02] ${hi ? "bg-coral text-white" : "bg-ink text-cream"}`}>
                  Empezar con una consulta
                </button>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

const COMPARE: [string, string, string, string][] = [
  ["Consultas en horario", "Ilimitadas", "Ilimitadas", "Ilimitadas"],
  ["Vacunas del calendario", "✓", "✓", "✓"],
  ["Análisis de sangre", "—", "1 por año", "2 por año"],
  ["Limpieza dental", "—", "1 por año", "1 por año"],
  ["Descuento en guardia", "50%", "50%", "50%"],
  ["Descuento en cirugías", "30%", "20%", "20%"],
  ["Baños de peluquería", "—", "2 por año", "—"],
  ["Visita a domicilio", "—", "—", "1 por año"],
];

export function Compare() {
  return (
    <section className="px-5 py-20 sm:px-10">
      <Kicker>Comparativa</Kicker>
      <h2 className="display mt-4 text-[clamp(2.6rem,5vw,5rem)]">Qué incluye cada plan.</h2>
      <div className="mt-10 overflow-x-auto rounded-[32px] bg-paper">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="p-5 font-normal text-ink/50" />
              {plans.map((pl) => (
                <th key={pl.id} className="display p-5 text-2xl font-normal">
                  {pl.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((row, k) => (
              <motion.tr key={row[0]} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: k * 0.05 }} className="border-b border-ink/5 last:border-0">
                {row.map((c, j) => (
                  <td key={j} className={`p-5 ${j === 0 ? "text-ink/70" : j === 2 ? "bg-sage/20 font-medium" : ""}`}>
                    {c}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Faq() {
  const [o, setO] = useState<number | null>(0);
  return (
    <section className="px-5 py-24 sm:px-10">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Kicker>Preguntas</Kicker>
          <h2 className="display mt-4 text-[clamp(2.8rem,6vw,6rem)]">
            Sin letra <em className="text-coral">chica.</em>
          </h2>
        </div>
        <div className="border-t border-ink/10">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-ink/10">
              <button onClick={() => setO(o === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl">
                {f.q}
                <motion.span animate={{ rotate: o === i ? 45 : 0 }} className="text-3xl text-coral">
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {o === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden pr-10 text-ink/70">
                    <span className="block pb-6">{f.a}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================== EQUIPO ================================== */

export function Team() {
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<Vet | null>(null);
  const { open } = useBooking();
  return (
    <section className="px-5 pb-24 sm:px-10">
      <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {vets.map((v, i) => (
          <Reveal key={v.id} delay={(i % 3) * 0.08} y={i % 3 === 1 ? 90 : 40}>
            <button onMouseEnter={() => setHover(v.id)} onMouseLeave={() => setHover(null)} onClick={() => setSel(v)} className={`group block w-full text-left ${i % 3 === 1 ? "lg:mt-16" : ""}`}>
              <div className="grade relative aspect-[4/5] overflow-hidden rounded-[36px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(v.photo, 800, 1000)} alt={v.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                <motion.div initial={false} animate={{ opacity: hover === v.id ? 1 : 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                  <AutoVideo id={v.video} className="absolute inset-0" playing={hover === v.id} />
                </motion.div>
                <span className="absolute top-4 left-4 flex gap-1">
                  {v.species.map((s) => (
                    <span key={s} className="rounded-full bg-cream/90 px-2.5 py-1 text-sm">
                      {s === "perro" ? "🐶" : s === "gato" ? "🐱" : "🐰"}
                    </span>
                  ))}
                </span>
              </div>
              <p className="label mt-5 text-coral">{v.role}</p>
              <p className="display mt-2 text-4xl">{v.name}</p>
              <p className="mt-2 text-ink/60 italic">“{v.quote}”</p>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)} data-lenis-prevent="" className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-md">
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              onClick={(e) => e.stopPropagation()}
              className="grid w-full max-w-4xl overflow-hidden rounded-[36px] bg-paper md:grid-cols-2"
            >
              <div className="grade relative aspect-[4/5] md:aspect-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(sel.photo, 900, 1100)} alt={sel.name} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-8 sm:p-10">
                <button onClick={() => setSel(null)} className="float-right h-10 w-10 rounded-full border border-ink/15" aria-label="Cerrar">
                  ✕
                </button>
                <p className="label text-coral">{sel.role}</p>
                <p className="display mt-3 text-5xl">{sel.name}</p>
                <p className="mt-6 text-2xl text-ink/80 italic">“{sel.quote}”</p>
                <p className="mt-8 text-sm text-ink/50">Formación</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {sel.certs.map((c) => (
                    <li key={c} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-ink/50">Atiende</p>
                <p className="mt-1">
                  {sel.species.map((s) => SPECIES.find((x) => x.id === s)!.plural).join(" · ")} — {sel.services.map((s) => services.find((x) => x.id === s)!.short).join(", ")}
                </p>
                <button
                  onClick={() => {
                    const v = sel;
                    setSel(null);
                    open({ species: v.species[0], service: v.services[0] });
                  }}
                  className="mt-10 w-full rounded-full bg-coral py-4 font-semibold text-white"
                >
                  Sacar turno con {sel.name.split(" ").slice(0, 2).join(" ")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Values() {
  const items = [
    ["Tiempo", "Turnos de 30 minutos. Nadie te apura en la consulta."],
    ["Calma", "Premios, manejo suave y sin forcejeos innecesarios."],
    ["Claridad", "Te explicamos todo y te lo dejamos por escrito."],
    ["Seguimiento", "Te escribimos para ver cómo sigue. Siempre."],
  ];
  return (
    <section className="px-3 pb-10 sm:px-6">
      <div className="grid gap-px overflow-hidden rounded-[40px] bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.08} className="group bg-paper p-8 transition-colors hover:bg-sage/30">
            <Paw className={`h-8 w-8 text-coral transition-transform duration-500 group-hover:scale-125 ${i % 2 ? "rotate-12" : "-rotate-12"}`} />
            <p className="display mt-8 text-4xl">{t}</p>
            <p className="mt-2 text-ink/60">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

