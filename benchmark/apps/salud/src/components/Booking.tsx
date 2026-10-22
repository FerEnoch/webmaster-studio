"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { img, pros, specialties, type SpecialtyId } from "@/lib/content";

type Prefill = { specialty?: SpecialtyId; pro?: string; treatment?: string };
const Ctx = createContext<{ open: (p?: Prefill) => void }>({ open: () => {} });
export const useBooking = () => useContext(Ctx);

const ease = [0.16, 1, 0.3, 1] as const;
const STEPS = ["Especialidad", "Profesional", "Día y hora", "Tus datos", "Listo"];

/** Turnos ocupados "simulados" pero estables por profesional y día. */
function taken(proId: string, day: number, h: string) {
  const seed = (proId.charCodeAt(0) * 31 + day * 17 + h.charCodeAt(1) * 7 + h.charCodeAt(3)) % 10;
  return seed < 4;
}
const HOURS = ["08:15", "09:00", "09:45", "10:30", "11:15", "12:00", "14:30", "15:15", "16:00", "16:45", "17:30", "18:15"];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [spec, setSpec] = useState<SpecialtyId | null>(null);
  const [pro, setPro] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | undefined>();
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", cover: "Particular" });

  const open = (p: Prefill = {}) => {
    setSpec(p.specialty ?? null);
    setPro(p.pro ?? null);
    setTreatment(p.treatment);
    setHour(null);
    setDay(0);
    const proObj = pros.find((x) => x.id === p.pro);
    if (proObj) setSpec(proObj.specialty);
    setStep(p.pro ? 2 : p.specialty ? 1 : 0);
    setOpen(true);
  };

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push(new Date(d));
    }
    return out;
  }, []);

  const proObj = pros.find((x) => x.id === pro);
  const specObj = specialties.find((x) => x.id === spec);
  const date = days[day];

  const calendarUrl = useMemo(() => {
    if (!proObj || !hour) return "#";
    const [hh, mm] = hour.split(":").map(Number);
    const start = new Date(date);
    start.setHours(hh, mm, 0, 0);
    const end = new Date(start.getTime() + 45 * 60000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: `Turno ${proObj.title} — Alba`,
      dates: `${f(start)}/${f(end)}`,
      details: `${proObj.name} · ${treatment ?? specObj?.name ?? ""}`,
      location: "Alba Salud y Estética",
    });
    return `https://calendar.google.com/calendar/render?${q.toString()}`;
  }, [proObj, hour, date, treatment, specObj]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}

      {/* Botón flotante */}
      <motion.button
        onClick={() => open()}
        initial={{ y: 100 }}
        animate={{ y: isOpen ? 100 : 0 }}
        transition={{ delay: isOpen ? 0 : 1.5, type: "spring", stiffness: 200, damping: 22 }}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full bg-deep py-2 pr-2 pl-5 text-porcelain shadow-[0_20px_50px_-10px_rgba(12,43,40,0.6)] sm:right-8 sm:bottom-8"
      >
        <span className="text-sm font-medium">Reservar turno</span>
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-mint text-deep">
          <span className="pulse-ring absolute inset-0 rounded-full bg-mint" />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-deep/40 backdrop-blur-sm"
            />
            <motion.aside
              data-lenis-prevent=""
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease }}
              className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-xl flex-col bg-porcelain shadow-2xl"
            >
              {/* Encabezado + progreso */}
              <div className="border-b border-ink/10 p-6">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-3xl">Reservá tu turno</p>
                  <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5" aria-label="Cerrar">
                    ✕
                  </button>
                </div>
                <div className="mt-5 flex gap-1.5">
                  {STEPS.map((s, i) => (
                    <button
                      key={s}
                      disabled={i > step || step === 4}
                      onClick={() => go(i)}
                      className="flex-1 text-left"
                      aria-label={s}
                    >
                      <span className="block h-1 overflow-hidden rounded-full bg-ink/10">
                        <motion.span className="block h-full bg-deep" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
                      </span>
                      <span className={`mt-1.5 hidden text-[11px] sm:block ${i === step ? "text-ink" : "text-ink/40"}`}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -40 }}
                    transition={{ duration: 0.35, ease }}
                    className="p-6"
                  >
                    {step === 0 && (
                      <div className="grid gap-3">
                        {specialties.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSpec(s.id);
                              setPro(null);
                              go(1);
                            }}
                            className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-white/60 p-5 text-left transition-colors hover:border-deep"
                          >
                            <span className="flex items-center gap-4">
                              <span className="h-10 w-10 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, #fff, ${s.color})` }} />
                              <span className="text-lg">{s.name}</span>
                            </span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid gap-3">
                        <p className="mb-1 text-sm text-ink/60">{specObj?.name}</p>
                        {pros
                          .filter((p) => !spec || p.specialty === spec)
                          .map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setPro(p.id);
                                go(2);
                              }}
                              className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/60 p-4 text-left transition-colors hover:border-deep"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img(p.photo, 160, 160)} alt="" className="h-16 w-16 rounded-full object-cover" />
                              <span className="flex-1">
                                <span className="block text-lg">{p.name}</span>
                                <span className="block text-sm text-ink/60">
                                  {p.title} · ★ {p.rating}
                                </span>
                              </span>
                              <span className="rounded-full bg-mint/25 px-3 py-1 text-xs text-deep">{p.next}</span>
                            </button>
                          ))}
                        <button onClick={() => go(0)} className="mt-2 text-sm text-ink/60 underline-offset-4 hover:underline">
                          ← Cambiar especialidad
                        </button>
                      </div>
                    )}

                    {step === 2 && proObj && (
                      <div>
                        <div className="mb-5 flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img(proObj.photo, 120, 120)} alt="" className="h-12 w-12 rounded-full object-cover" />
                          <div>
                            <p>{proObj.name}</p>
                            <p className="text-sm text-ink/60">{treatment ?? proObj.title}</p>
                          </div>
                        </div>
                        <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
                          {days.map((d, i) => {
                            const free = HOURS.filter((h) => !taken(proObj.id, i, h)).length;
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  setDay(i);
                                  setHour(null);
                                }}
                                className={`flex w-[72px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors ${
                                  i === day ? "border-deep bg-deep text-porcelain" : "border-ink/10 bg-white/60"
                                }`}
                              >
                                <span className="text-[11px] uppercase opacity-60">{d.toLocaleDateString("es-AR", { weekday: "short" })}</span>
                                <span className="font-serif text-3xl leading-none">{d.getDate()}</span>
                                <span className="mt-1 flex gap-0.5">
                                  {Array.from({ length: Math.min(4, Math.ceil(free / 2)) }, (_, k) => (
                                    <span key={k} className={`h-1 w-1 rounded-full ${i === day ? "bg-mint" : "bg-deep/50"}`} />
                                  ))}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {HOURS.map((h, k) => {
                            const busy = taken(proObj.id, day, h);
                            return (
                              <motion.button
                                key={`${day}-${h}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: k * 0.025 }}
                                disabled={busy}
                                onClick={() => setHour(h)}
                                className={`rounded-full border py-2.5 text-sm transition-colors ${
                                  busy
                                    ? "cursor-not-allowed border-transparent bg-ink/5 text-ink/25 line-through"
                                    : hour === h
                                      ? "border-deep bg-deep text-porcelain"
                                      : "border-ink/15 hover:border-deep"
                                }`}
                              >
                                {h}
                              </motion.button>
                            );
                          })}
                        </div>
                        <button
                          disabled={!hour}
                          onClick={() => go(3)}
                          className="mt-6 w-full rounded-full bg-deep py-4 text-porcelain transition-opacity disabled:opacity-30"
                        >
                          {hour ? `Continuar · ${date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })} ${hour}` : "Elegí un horario"}
                        </button>
                      </div>
                    )}

                    {step === 3 && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          go(4);
                        }}
                        className="space-y-5"
                      >
                        {[
                          ["name", "Nombre y apellido", "text"],
                          ["phone", "Celular (te enviamos el recordatorio)", "tel"],
                        ].map(([k, label, type]) => (
                          <label key={k} className="block">
                            <span className="text-sm text-ink/60">{label}</span>
                            <input
                              required
                              type={type}
                              value={form[k as "name" | "phone"]}
                              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                              className="mt-1 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 py-3.5 outline-none focus:border-deep"
                            />
                          </label>
                        ))}
                        <div>
                          <span className="text-sm text-ink/60">Cobertura</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {["Particular", "Prepaga", "Obra social"].map((c) => (
                              <button
                                type="button"
                                key={c}
                                onClick={() => setForm({ ...form, cover: c })}
                                className={`rounded-full border px-4 py-2 text-sm ${form.cover === c ? "border-deep bg-deep text-porcelain" : "border-ink/15"}`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button className="w-full rounded-full bg-deep py-4 text-porcelain">Confirmar turno</button>
                        <p className="text-xs text-ink/40">Demo: los datos no se envían a ningún lado.</p>
                      </form>
                    )}

                    {step === 4 && proObj && hour && (
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 14 }}
                          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint text-4xl text-deep"
                        >
                          ✓
                        </motion.div>
                        <p className="mt-5 font-serif text-4xl">¡Turno confirmado!</p>
                        <p className="mt-1 text-ink/60">Te llega el recordatorio por WhatsApp 24 h antes.</p>

                        {/* Ticket */}
                        <motion.div
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.7, ease }}
                          className="relative mx-auto mt-8 max-w-sm overflow-hidden rounded-3xl bg-deep text-left text-porcelain"
                        >
                          <div className="p-6">
                            <p className="text-xs tracking-[0.2em] text-mint uppercase">{specObj?.name}</p>
                            <p className="mt-2 font-serif text-3xl">{date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p>
                            <p className="font-serif text-5xl text-mint">{hour}</p>
                            <p className="mt-3 text-sm text-porcelain/70">
                              {proObj.name} · {form.cover}
                            </p>
                          </div>
                          <div className="relative border-t border-dashed border-porcelain/25 p-6">
                            <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-porcelain" />
                            <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-porcelain" />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-porcelain/60">Código</span>
                              <span className="font-mono tracking-widest">ALB-{(proObj.id.length * 731 + day * 97).toString(36).toUpperCase()}</span>
                            </div>
                          </div>
                        </motion.div>
                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                          <a href={calendarUrl} target="_blank" rel="noreferrer" className="rounded-full border border-ink/15 px-5 py-3 text-sm hover:bg-ink/5">
                            Agregar a Google Calendar
                          </a>
                          <button onClick={() => setOpen(false)} className="rounded-full bg-deep px-5 py-3 text-sm text-porcelain">
                            Listo
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
