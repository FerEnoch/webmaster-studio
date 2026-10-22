"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cars, EV_PHOTO, img, reel, testimonials, V, video } from "@/lib/content";
import AutoVideo from "./AutoVideo";

const ease = [0.16, 1, 0.3, 1] as const;

function useTween(value: number) {
  const [v, setV] = useState(value);
  const last = useRef(value);
  useEffect(() => {
    const c = animate(last.current, value, { duration: 0.6, ease: "easeOut", onUpdate: setV });
    last.current = value;
    return () => c.stop();
  }, [value]);
  return v;
}

/* ---------------------------------- Reel de videos ---------------------------------- */

export function Reel() {
  const track = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const x = useMotionValue(0);
  useEffect(() => {
    const m = () => setLimit(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth + 80));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  return (
    <section className="overflow-hidden py-28">
      <div className="mb-10 flex items-end justify-between px-5 sm:px-10">
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-bold">
          Viví la <span className="text-volt">experiencia</span>
        </h2>
        <p className="hidden text-sm text-chalk/50 sm:block">Arrastrá · pasá el mouse · tocá para ver</p>
      </div>
      <motion.div
        ref={track}
        drag="x"
        dragConstraints={{ left: -limit, right: 0 }}
        dragElastic={0.05}
        style={{ x }}
        className="flex w-max cursor-grab gap-5 px-5 active:cursor-grabbing sm:px-10"
      >
        {reel.map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.08, ease }}
            onMouseEnter={() => setHover(r.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => setOpen(r.id)}
            className={`group relative shrink-0 overflow-hidden rounded-[28px] text-left ${i % 3 === 0 ? "h-[60vh] w-[78vw] sm:w-[34vw]" : "h-[48vh] w-[64vw] self-end sm:w-[26vw]"}`}
          >
            <AutoVideo id={r.id} className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105" playing={hover === r.id || i === 0} />
            <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 rounded-full bg-night/60 px-3 py-1 text-xs backdrop-blur">{r.tag}</span>
            <span className="absolute top-4 right-4 flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-volt text-night opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
              ▶
            </span>
            <p className="absolute bottom-5 left-5 font-display text-2xl font-bold">{r.title}</p>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-night/95 p-4 backdrop-blur"
          >
            <motion.video
              key={open}
              src={video(open)}
              controls
              autoPlay
              playsInline
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-6xl rounded-3xl"
            />
            <button className="absolute top-6 right-6 h-12 w-12 rounded-full border border-white/20">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------------------------- Financiación ---------------------------------- */

export function Finance() {
  const [carId, setCarId] = useState("m4");
  const car = cars.find((c) => c.id === carId)!;
  const [down, setDown] = useState(40);
  const [months, setMonths] = useState(36);
  const [trade, setTrade] = useState(0);
  const rate = 0.09 / 12;
  const loan = Math.max(0, car.price * (1 - down / 100) - trade);
  const fee = (loan * rate) / (1 - Math.pow(1 + rate, -months));
  const shown = useTween(fee);

  // Toma de usado
  const [year, setYear] = useState(2019);
  const [km, setKm] = useState(60000);
  const [segment, setSegment] = useState<"Compacto" | "Sedán" | "SUV" | "Premium">("Sedán");
  const base = { Compacto: 14000, Sedán: 20000, SUV: 28000, Premium: 45000 }[segment];
  const usedValue = Math.max(3000, base * Math.pow(0.9, 2025 - year) * (1 - Math.min(0.4, km / 400000)));
  const usedShown = useTween(usedValue);

  return (
    <section id="financiacion" className="px-5 py-28 sm:px-10">
      <h2 className="mb-12 font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-bold">
        Hacé los números
        <br />
        <span className="outline-text">antes de venir.</span>
      </h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-carbon p-6 sm:p-10">
          <p className="mb-6 text-sm tracking-[0.2em] text-volt uppercase">Financiación</p>
          <select value={carId} onChange={(e) => setCarId(e.target.value)} className="mb-8 w-full rounded-2xl border border-white/15 bg-night px-4 py-3.5 outline-none">
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} {c.model} — US$ {c.price.toLocaleString("es-AR")}
              </option>
            ))}
          </select>
          <Slider label="Anticipo" value={down} min={20} max={80} step={5} unit="%" onChange={setDown} />
          <div className="mt-6">
            <p className="mb-2 text-sm text-chalk/60">Plazo</p>
            <div className="flex gap-2">
              {[12, 24, 36, 48, 60].map((m) => (
                <button key={m} onClick={() => setMonths(m)} className={`flex-1 rounded-full border py-2.5 text-sm ${months === m ? "border-volt bg-volt text-night" : "border-white/15"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-6 flex items-center justify-between gap-4 text-sm">
            <span className="text-chalk/60">Usar mi usado como parte de pago</span>
            <button onClick={() => setTrade(trade ? 0 : Math.round(usedValue))} className={`relative h-7 w-12 rounded-full transition-colors ${trade ? "bg-volt" : "bg-white/15"}`} aria-pressed={!!trade}>
              <motion.span layout className={`absolute top-1 h-5 w-5 rounded-full bg-night ${trade ? "right-1" : "left-1"}`} />
            </button>
          </label>
          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-sm text-chalk/60">Cuota estimada</p>
            <p className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none font-bold text-volt tabular-nums">US$ {Math.round(shown).toLocaleString("es-AR")}</p>
            <p className="mt-2 text-sm text-chalk/50">
              {months} cuotas · tasa 9% anual · financiás US$ {Math.round(loan).toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 p-6 sm:p-10">
          <AutoVideo id={V.closeup} className="absolute inset-0 opacity-25" />
          <div className="relative">
            <p className="mb-6 text-sm tracking-[0.2em] text-volt uppercase">Tomamos tu usado</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {(["Compacto", "Sedán", "SUV", "Premium"] as const).map((s) => (
                <button key={s} onClick={() => setSegment(s)} className="relative rounded-full px-4 py-2 text-sm">
                  {segment === s && <motion.span layoutId="seg" className="absolute inset-0 rounded-full bg-chalk" />}
                  <span className={`relative ${segment === s ? "text-night" : ""}`}>{s}</span>
                </button>
              ))}
            </div>
            <Slider label="Año" value={year} min={2008} max={2024} step={1} unit="" onChange={setYear} />
            <div className="mt-6">
              <Slider label="Kilómetros" value={km} min={0} max={250000} step={5000} unit=" km" onChange={setKm} />
            </div>
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-sm text-chalk/60">Te lo tomamos por aprox.</p>
              <p className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-none font-bold tabular-nums">
                US$ {Math.round((usedShown * 0.92) / 100) / 10}K – {Math.round((usedShown * 1.08) / 100) / 10}K
              </p>
              <p className="mt-2 text-xs text-chalk/40">Valores de ejemplo. La cotización final se hace con peritaje en el salón.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm">
        <span className="text-chalk/60">{label}</span>
        <span className="tabular-nums">
          {value.toLocaleString("es-AR")}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full" />
    </label>
  );
}

/* ---------------------------------- Eléctricos ---------------------------------- */

export function Electric() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [daily, setDaily] = useState(45);
  const range = 600;
  const days = Math.floor(range / daily);
  const saving = Math.round(daily * 30 * (0.11 - 0.025));
  return (
    <section className="px-5 py-28 sm:px-10">
      <div ref={ref} className="grid items-center gap-12 overflow-hidden rounded-[32px] bg-carbon lg:grid-cols-2">
        <div className="relative h-[50vh] lg:h-full lg:min-h-[560px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(EV_PHOTO, 1200, 1000)} alt="Auto eléctrico cargando" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-carbon/90" />
          {/* batería */}
          <div className="absolute bottom-8 left-8 w-48 rounded-xl border-2 border-chalk/80 p-1.5">
            <span className="absolute top-1/2 -right-2.5 h-5 w-1.5 -translate-y-1/2 rounded-r bg-chalk/80" />
            <motion.div
              className="h-8 rounded-md bg-gradient-to-r from-volt to-[#7dff9b]"
              initial={{ width: "8%" }}
              animate={inView ? { width: ["8%", "100%"] } : {}}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-night mix-blend-difference" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}>
              ⚡ Cargando
            </motion.span>
          </div>
        </div>
        <div className="p-6 sm:p-12">
          <p className="text-sm tracking-[0.2em] text-volt uppercase">Eléctricos</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-[0.95] font-bold">¿Te alcanza la batería? Spoiler: sí.</h2>
          <div className="mt-10">
            <Slider label="Kilómetros por día" value={daily} min={10} max={200} step={5} unit=" km" onChange={setDaily} />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 p-5">
              <p className="font-display text-5xl font-bold text-volt">{days}</p>
              <p className="mt-1 text-sm text-chalk/60">días sin cargar</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-5">
              <p className="font-display text-5xl font-bold">US$ {saving}</p>
              <p className="mt-1 text-sm text-chalk/60">de ahorro por mes vs. nafta</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-chalk/40">Estimación con 600 km de autonomía y costos de referencia.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Test drive ---------------------------------- */

const ROUTE = "M30 220 C 120 220, 140 90, 250 100 S 400 220, 500 150 S 640 40, 760 80";

export function TestDrive() {
  const [carId, setCarId] = useState("mustang");
  const [route, setRoute] = useState<"Ciudad" | "Autopista" | "Ruta con curvas">("Ruta con curvas");
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 6) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push(new Date(d));
    }
    return out;
  }, []);
  const car = cars.find((c) => c.id === carId)!;
  const progress = useMotionValue(0);
  const path = useRef<SVGPathElement>(null);
  const carX = useTransform(progress, (p) => path.current?.getPointAtLength(p * path.current.getTotalLength()).x ?? 30);
  const carY = useTransform(progress, (p) => path.current?.getPointAtLength(p * path.current.getTotalLength()).y ?? 220);

  useEffect(() => {
    const c = animate(progress, [0, 1], { duration: 6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" });
    return () => c.stop();
  }, [progress, route]);

  return (
    <section id="test-drive" className="px-5 py-28 sm:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-bold">
            Manejalo
            <br />
            <span className="text-volt">antes de decidir.</span>
          </h2>
          <div className="relative mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-carbon">
            <AutoVideo id={route === "Ciudad" ? V.city : route === "Autopista" ? V.aerial : V.dawn} className="absolute inset-0 opacity-30" />
            <svg viewBox="0 0 800 280" className="relative w-full">
              <path d={ROUTE} fill="none" stroke="rgba(242,242,238,0.15)" strokeWidth="18" strokeLinecap="round" />
              <motion.path
                key={route}
                ref={path}
                d={ROUTE}
                fill="none"
                stroke="#d7ff3a"
                strokeWidth="3"
                strokeDasharray="10 10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              <circle cx="30" cy="220" r="8" fill="#f2f2ee" />
              <circle cx="760" cy="80" r="8" fill="#ff4d2e" />
              <motion.g style={{ x: carX, y: carY }}>
                <circle r="16" fill="#d7ff3a" opacity="0.25" />
                <circle r="8" fill="#d7ff3a" />
              </motion.g>
            </svg>
            <div className="relative flex flex-wrap gap-2 p-5">
              {(["Ciudad", "Autopista", "Ruta con curvas"] as const).map((r) => (
                <button key={r} onClick={() => setRoute(r)} className={`rounded-full border px-4 py-2 text-sm ${route === r ? "border-volt bg-volt text-night" : "border-white/15 bg-night/50"}`}>
                  {r}
                </button>
              ))}
              <span className="ml-auto self-center text-sm text-chalk/60">{route === "Ruta con curvas" ? "45 min · 38 km" : route === "Autopista" ? "30 min · 32 km" : "25 min · 12 km"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-carbon p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center justify-center py-10 text-center">
                <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-volt text-4xl text-night">
                  ✓
                </motion.div>
                <p className="mt-6 font-display text-3xl font-bold">¡Te esperamos!</p>
                <p className="mt-2 text-chalk/60">
                  {car.brand} {car.model} · {route}
                  <br />
                  {days[day].toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} a las {hour}
                </p>
                <button onClick={() => setDone(false)} className="mt-6 rounded-full border border-white/15 px-5 py-2.5 text-sm">
                  Agendar otro
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }}>
                <p className="mb-3 text-sm text-chalk/60">Auto</p>
                <select value={carId} onChange={(e) => setCarId(e.target.value)} className="w-full rounded-2xl border border-white/15 bg-night px-4 py-3.5 outline-none">
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brand} {c.model}
                    </option>
                  ))}
                </select>
                <AnimatePresence mode="wait">
                  <motion.div key={car.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="mt-4 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(car.img, 700, 320)} alt="" className="h-36 w-full object-cover" />
                  </motion.div>
                </AnimatePresence>
                <p className="mt-6 mb-3 text-sm text-chalk/60">Día</p>
                <div className="grid grid-cols-6 gap-2">
                  {days.map((d, i) => (
                    <button key={i} onClick={() => setDay(i)} className={`rounded-xl border py-2 text-center ${i === day ? "border-volt bg-volt text-night" : "border-white/15"}`}>
                      <span className="block text-[10px] uppercase opacity-70">{d.toLocaleDateString("es-AR", { weekday: "short" })}</span>
                      <span className="font-display text-lg font-bold">{d.getDate()}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-6 mb-3 text-sm text-chalk/60">Horario</p>
                <div className="grid grid-cols-4 gap-2">
                  {["10:00", "11:30", "13:00", "15:00", "16:30", "18:00", "19:00", "20:00"].map((h) => (
                    <button key={h} onClick={() => setHour(h)} className={`rounded-full border py-2 text-sm ${hour === h ? "border-chalk bg-chalk text-night" : "border-white/15"}`}>
                      {h}
                    </button>
                  ))}
                </div>
                <button disabled={!hour} onClick={() => setDone(true)} className="mt-8 w-full rounded-full bg-volt py-4 font-semibold text-night disabled:opacity-30">
                  {hour ? "Confirmar test drive" : "Elegí un horario"}
                </button>
                <p className="mt-3 text-center text-xs text-chalk/40">Demo: no se envían datos.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Cierre ---------------------------------- */

export function Closing() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const spacing = useTransform(scrollYProgress, [0, 1], ["0.4em", "-0.03em"]);
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <footer ref={ref} className="relative overflow-hidden">
      <AutoVideo id={V.parking} className="absolute inset-0" />
      <div className="absolute inset-0 bg-night/75" />
      <div className="relative px-5 pt-28 sm:px-10">
        <div className="min-h-[220px] max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.blockquote key={t} initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -20, filter: "blur(8px)" }} transition={{ duration: 0.6 }}>
              <p className="font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.1] font-semibold">“{testimonials[t].quote}”</p>
              <footer className="mt-5 text-chalk/60">
                {testimonials[t].name} · <span className="text-volt">{testimonials[t].car}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-16 grid gap-8 border-t border-white/10 py-12 text-sm sm:grid-cols-4">
          {[
            ["Salón Norte", "Av. del Libertador 15200, San Isidro"],
            ["Salón Centro", "Av. Figueroa Alcorta 3100, CABA"],
            ["Horarios", "Lun a sáb 9 a 20 h"],
            ["WhatsApp", "+54 11 7000 0000"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-chalk/50">{k}</p>
              <p className="mt-1">{v}</p>
            </div>
          ))}
        </div>
        <motion.p style={{ letterSpacing: spacing }} className="pb-4 text-center font-display text-[19vw] leading-[0.8] font-extrabold text-chalk/90 select-none">
          APEX
        </motion.p>
        <p className="pb-6 text-center text-xs text-chalk/40">© 2026 Apex Motors · Plantilla de demostración · Videos: Mixkit · Fotos: Unsplash</p>
      </div>
    </footer>
  );
}
