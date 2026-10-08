"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { coaches, DAYS, disciplines, faqs, img, periods, plans, schedule, sedes, type Coach } from "@/lib/content";
import AutoVideo from "./AutoVideo";
import { useBooking } from "./Booking";
import { ease, Kicker, Lines, Reveal } from "./ui";

/* ================================== CLASES ================================== */

export function Schedule() {
  const today = (new Date().getDay() + 6) % 7;
  const [day, setDay] = useState(Math.min(today, 5));
  const [disc, setDisc] = useState("todas");
  const [sede, setSede] = useState("todas");
  const { open, booked } = useBooking();
  const tabs = useRef<HTMLDivElement>(null);

  // En mobile las pestañas scrollean: centramos el día elegido.
  useEffect(() => {
    const el = tabs.current;
    const btn = el?.children[day] as HTMLElement | undefined;
    if (el && btn) el.scrollTo({ left: btn.offsetLeft - el.clientWidth / 2 + btn.offsetWidth / 2, behavior: "smooth" });
  }, [day]);

  const list = useMemo(
    () =>
      schedule
        .filter((s) => s.day === day && (disc === "todas" || s.discipline === disc) && (sede === "todas" || s.sede === sede))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [day, disc, sede],
  );

  return (
    <section className="px-5 pb-24 sm:px-10">
      {/* Días */}
      <div ref={tabs} className="no-scrollbar relative -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {DAYS.map((d, i) => (
          <button key={d} onClick={() => setDay(i)} className="relative shrink-0 rounded-full px-6 py-3">
            {i === day && <motion.span layoutId="day-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className={`display relative text-2xl ${i === day ? "text-coal" : "text-bone/60"}`}>
              {d}
              {i === today && <span className="ml-2 align-middle text-[10px] tracking-widest text-signal">HOY</span>}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="sticky top-20 z-30 -mx-1 mb-8 flex flex-wrap items-center gap-2 rounded-3xl bg-coal/85 p-1 backdrop-blur-xl">
        {[{ id: "todas", short: "Todas" }, ...disciplines].map((d) => (
          <button key={d.id} onClick={() => setDisc(d.id)} className={`rounded-full border px-4 py-2 text-sm transition-colors ${disc === d.id ? "border-signal bg-signal text-white" : "border-white/15 hover:border-white/40"}`}>
            {d.short}
          </button>
        ))}
        <select value={sede} onChange={(e) => setSede(e.target.value)} className="ml-auto rounded-full border border-white/15 bg-coal px-4 py-2 text-sm outline-none" aria-label="Sede">
          <option value="todas">Todas las sedes</option>
          {sedes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <motion.div layout className="divide-y divide-white/10 border-y border-white/10">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((s, i) => {
            const d = disciplines.find((x) => x.id === s.discipline)!;
            const c = coaches.find((x) => x.id === s.coach)!;
            const place = sedes.find((x) => x.id === s.sede)!;
            const mine = booked.includes(s.id);
            const taken = s.booked + (mine ? 1 : 0);
            const full = taken >= s.capacity;
            const free = s.capacity - taken;
            return (
              <motion.div
                layout
                key={s.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.45, delay: i * 0.03, ease }}
                className="group grid grid-cols-[72px_1fr] items-center gap-4 py-5 sm:grid-cols-[110px_1.4fr_1fr_1fr_auto] sm:gap-6"
              >
                <p className="display text-3xl sm:text-4xl">{s.time}</p>
                <div>
                  <p className="flex items-center gap-2 text-lg font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </p>
                  <p className="text-sm text-bone/50">
                    {d.duration} min · {place.name}
                  </p>
                </div>
                <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(c.photo, 96, 96)} alt="" className="h-9 w-9 rounded-full object-cover grayscale" />
                  <span className="text-sm text-bone/70">{c.name}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(taken / s.capacity) * 100}%` }}
                      transition={{ duration: 1, ease }}
                      className={`h-full rounded-full ${full ? "bg-white/40" : free <= 3 ? "bg-signal" : "bg-emerald-400"}`}
                    />
                  </div>
                  <p className={`mt-1 text-xs ${full ? "text-bone/40" : free <= 3 ? "text-signal" : "text-bone/50"}`}>
                    {full ? "Completa" : free <= 3 ? `¡Quedan ${free} lugares!` : `${free} de ${s.capacity} lugares libres`}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  {mine ? (
                    <span className="inline-block rounded-full bg-emerald-400/15 px-5 py-2.5 text-sm text-emerald-300">Reservado ✓</span>
                  ) : (
                    <button
                      onClick={() => open({ slotId: s.id })}
                      disabled={full}
                      className="w-full rounded-full bg-bone px-6 py-2.5 text-sm font-semibold text-coal transition-all hover:bg-signal hover:text-white disabled:bg-white/10 disabled:text-bone/40 sm:w-auto"
                    >
                      {full ? "Lista de espera" : "Reservar"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {list.length === 0 && <p className="py-16 text-center text-bone/50">No hay clases con esos filtros este día.</p>}
      </motion.div>
    </section>
  );
}

export function DisciplineDetails() {
  const [openId, setOpenId] = useState<string | null>(disciplines[0].id);
  const { open } = useBooking();
  return (
    <section className="px-5 py-24 sm:px-10">
      <Kicker>Disciplinas</Kicker>
      <h2 className="display mt-4 text-[clamp(3rem,7vw,7rem)]">
        <Lines lines={["Qué vas a encontrar", <span key="x" className="text-bone/40">en cada clase.</span>]} />
      </h2>
      <div className="mt-12 border-t border-white/10">
        {disciplines.map((d) => {
          const on = openId === d.id;
          return (
            <div key={d.id} className="border-b border-white/10">
              <button onClick={() => setOpenId(on ? null : d.id)} className="group flex w-full items-center justify-between py-6 text-left">
                <span className="display text-[clamp(2.5rem,6vw,5.5rem)] transition-colors group-hover:text-signal">{d.name}</span>
                <motion.span animate={{ rotate: on ? 45 : 0 }} className="display text-5xl text-signal">
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
                    <div className="grid gap-8 pb-10 md:grid-cols-2">
                      <div className="grade relative aspect-video overflow-hidden rounded-[24px]">
                        {d.video ? (
                          <AutoVideo id={d.video} className="absolute inset-0" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img(d.img, 1200, 680)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-xl text-bone/80">{d.text}</p>
                        <div className="mt-8 grid grid-cols-3 gap-3">
                          {[
                            [d.duration, "minutos"],
                            [d.kcal, "kcal aprox."],
                            [d.level, "nivel"],
                          ].map(([v, l]) => (
                            <div key={String(l)} className="rounded-2xl border border-white/10 p-4">
                              <p className="display text-2xl">{v}</p>
                              <p className="text-xs text-bone/50">{l}</p>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => open({ discipline: d.id })} className="mt-8 self-start rounded-full bg-signal px-7 py-3.5 text-sm font-semibold tracking-wide text-white uppercase">
                          Probar {d.short} gratis
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
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
  const per = periods.find((p) => p.id === period)!;
  const { open } = useBooking();
  return (
    <section className="px-5 pb-24 sm:px-10">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex rounded-full border border-white/15 p-1">
          {periods.map((p) => (
            <button key={p.id} onClick={() => setPeriod(p.id)} className="relative rounded-full px-5 py-2.5 text-sm">
              {p.id === period && <motion.span layoutId="period-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className={`relative ${p.id === period ? "text-coal" : "text-bone/70"}`}>
                {p.label}
                {p.discount > 0 && <span className="ml-1.5 text-signal">−{p.discount * 100}%</span>}
              </span>
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 text-sm text-bone/70">
          <span className="text-signal">✓</span> Sin matrícula · sin permanencia · baja en 1 clic
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((pl, i) => {
          const monthly = pl.monthly * (1 - per.discount);
          return (
            <Reveal key={pl.id} delay={i * 0.1}>
              <div className={`relative flex h-full flex-col rounded-[32px] p-8 ${pl.highlight ? "bg-bone text-coal" : "border border-white/10 bg-graphite"}`}>
                {pl.highlight && <span className="absolute -top-3 left-8 rounded-full bg-signal px-4 py-1 text-xs font-semibold tracking-wide text-white uppercase">El más elegido</span>}
                <p className="display text-5xl">{pl.name}</p>
                <p className={`mt-2 ${pl.highlight ? "text-coal/60" : "text-bone/60"}`}>{pl.pitch}</p>
                <p className="display mt-8 text-6xl">
                  $ <Price value={monthly} />
                </p>
                <p className={`text-sm ${pl.highlight ? "text-coal/50" : "text-bone/50"}`}>
                  por mes{per.months > 1 ? ` · pagás $ ${Math.round(monthly * per.months).toLocaleString("es-AR")} cada ${per.months} meses` : ""}
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {pl.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="text-signal">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => open()} className={`mt-10 rounded-full py-4 font-semibold tracking-wide uppercase transition-transform hover:scale-[1.02] ${pl.highlight ? "bg-coal text-bone" : "bg-signal text-white"}`}>
                  Empezar con clase gratis
                </button>
              </div>
            </Reveal>
          );
        })}
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
          <h2 className="display mt-4 text-[clamp(3rem,6vw,6rem)]">Sin letra chica.</h2>
        </div>
        <div className="border-t border-white/10">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-white/10">
              <button onClick={() => setO(o === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl">
                {f.q}
                <motion.span animate={{ rotate: o === i ? 45 : 0 }} className="text-3xl text-signal">
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {o === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden pr-10 text-bone/70">
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

/* ================================== COACHES ================================== */

export function Coaches() {
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<Coach | null>(null);
  const { open } = useBooking();
  return (
    <section className="px-5 pb-24 sm:px-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coaches.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 0.08}>
            <button onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)} onClick={() => setSel(c)} className="group grade relative block aspect-[3/4] w-full overflow-hidden rounded-[28px] text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(c.photo, 800, 1060)} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
              <motion.div initial={false} animate={{ opacity: hover === c.id ? 1 : 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                <AutoVideo id={c.video} className="absolute inset-0" playing={hover === c.id} />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs tracking-[0.25em] text-signal uppercase">{c.role}</p>
                <p className="display mt-2 text-5xl">{c.name}</p>
                <p className="mt-2 max-h-0 overflow-hidden text-bone/70 italic transition-all duration-500 group-hover:max-h-20">“{c.quote}”</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)} data-lenis-prevent="" className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-coal/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              onClick={(e) => e.stopPropagation()}
              className="grid w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-graphite md:grid-cols-2"
            >
              <div className="grade relative aspect-[4/5] md:aspect-auto">
                <AutoVideo id={sel.video} className="absolute inset-0" />
              </div>
              <div className="p-8 sm:p-10">
                <button onClick={() => setSel(null)} className="float-right h-10 w-10 rounded-full border border-white/15" aria-label="Cerrar">
                  ✕
                </button>
                <p className="text-xs tracking-[0.25em] text-signal uppercase">{sel.role}</p>
                <p className="display mt-3 text-6xl">{sel.name}</p>
                <p className="mt-6 text-2xl italic text-bone/80">“{sel.quote}”</p>
                <p className="mt-8 text-sm text-bone/50">Certificaciones</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {sel.certs.map((c) => (
                    <li key={c} className="rounded-full border border-white/15 px-3 py-1.5 text-sm">
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-bone/50">Da clases de</p>
                <p className="mt-1">{sel.disciplines.map((d) => disciplines.find((x) => x.id === d)!.name).join(" · ")}</p>
                <button
                  onClick={() => {
                    const d = sel.disciplines[0];
                    setSel(null);
                    open({ discipline: d });
                  }}
                  className="mt-10 w-full rounded-full bg-signal py-4 font-semibold tracking-wide text-white uppercase"
                >
                  Entrenar con {sel.name.split(" ")[0]}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
