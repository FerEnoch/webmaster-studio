"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { coaches, DAYS, disciplines, img, schedule, sedes, type Slot } from "@/lib/content";

type Prefill = { slotId?: string; discipline?: string };
const Ctx = createContext<{ open: (p?: Prefill) => void; booked: string[] }>({ open: () => {}, booked: [] });
export const useBooking = () => useContext(Ctx);

const ease = [0.16, 1, 0.3, 1] as const;

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [step, setStep] = useState<"elegir" | "datos" | "listo">("elegir");
  const [disc, setDisc] = useState<string>("todas");
  const [sede, setSede] = useState<string>("todas");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [booked, setBooked] = useState<string[]>([]);

  const open = (p: Prefill = {}) => {
    const s = p.slotId ? schedule.find((x) => x.id === p.slotId) ?? null : null;
    setSlot(s);
    setDisc(p.discipline ?? s?.discipline ?? "todas");
    setSede("todas");
    setStep(s ? "datos" : "elegir");
    setOpen(true);
  };

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const options = useMemo(
    () =>
      schedule
        .filter((s) => (disc === "todas" || s.discipline === disc) && (sede === "todas" || s.sede === sede) && s.booked < s.capacity)
        .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
        .slice(0, 8),
    [disc, sede],
  );

  const d = slot ? disciplines.find((x) => x.id === slot.discipline)! : null;
  const coach = slot ? coaches.find((x) => x.id === slot.coach)! : null;
  const place = slot ? sedes.find((x) => x.id === slot.sede)! : null;

  return (
    <Ctx.Provider value={{ open, booked }}>
      {children}

      {/* CTA fijo en celular */}
      <motion.button
        onClick={() => open()}
        initial={{ y: 120 }}
        animate={{ y: isOpen ? 120 : 0 }}
        transition={{ delay: isOpen ? 0 : 2.4, type: "spring", stiffness: 220, damping: 24 }}
        className="fixed inset-x-4 bottom-4 z-40 rounded-full bg-signal py-4 text-sm font-semibold tracking-wide text-white uppercase shadow-[0_20px_50px_-10px_rgba(255,59,47,0.6)] md:hidden"
      >
        Reservá tu clase gratis
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[90] bg-coal/70 backdrop-blur-sm" />
            <motion.aside
              data-lenis-prevent=""
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease }}
              className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-lg flex-col border-l border-white/10 bg-graphite"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <p className="text-xs tracking-[0.25em] text-signal uppercase">Primera clase gratis</p>
                  <p className="display mt-1 text-4xl">Reservá tu lugar</p>
                </div>
                <button onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 hover:bg-white/10" aria-label="Cerrar">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {step === "elegir" && (
                    <motion.div key="elegir" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                      <p className="mb-3 text-sm text-bone/60">¿Qué querés probar?</p>
                      <div className="flex flex-wrap gap-2">
                        {[{ id: "todas", short: "Todas" }, ...disciplines].map((x) => (
                          <Chip key={x.id} on={disc === x.id} onClick={() => setDisc(x.id)}>
                            {x.short}
                          </Chip>
                        ))}
                      </div>
                      <p className="mt-6 mb-3 text-sm text-bone/60">¿En qué sede?</p>
                      <div className="flex flex-wrap gap-2">
                        {[{ id: "todas", name: "Cualquiera" }, ...sedes].map((x) => (
                          <Chip key={x.id} on={sede === x.id} onClick={() => setSede(x.id)}>
                            {x.name}
                          </Chip>
                        ))}
                      </div>
                      <p className="mt-8 mb-3 text-sm text-bone/60">Próximos lugares libres</p>
                      <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {options.map((s, i) => {
                            const dd = disciplines.find((x) => x.id === s.discipline)!;
                            const free = s.capacity - s.booked;
                            return (
                              <motion.button
                                layout
                                key={s.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => {
                                  setSlot(s);
                                  setStep("datos");
                                }}
                                className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 p-4 text-left transition-colors hover:border-signal"
                              >
                                <span className="w-16 text-center">
                                  <span className="block text-xs text-bone/50">{DAYS[s.day].slice(0, 3)}</span>
                                  <span className="display block text-2xl">{s.time}</span>
                                </span>
                                <span className="flex-1">
                                  <span className="block font-medium">{dd.name}</span>
                                  <span className="text-sm text-bone/50">{sedes.find((x) => x.id === s.sede)!.name} · {coaches.find((c) => c.id === s.coach)!.name.split(" ")[0]}</span>
                                </span>
                                <span className={`text-xs ${free <= 3 ? "text-signal" : "text-bone/50"}`}>{free <= 3 ? `¡Quedan ${free}!` : `${free} libres`}</span>
                              </motion.button>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {step === "datos" && slot && d && (
                    <motion.form
                      key="datos"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35 }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setBooked((b) => [...b, slot.id]);
                        setStep("listo");
                      }}
                    >
                      <div className="relative mb-6 overflow-hidden rounded-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img(d.img, 900, 400)} alt="" className="h-40 w-full object-cover [filter:contrast(1.12)_saturate(0.72)_brightness(0.8)]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-coal/90 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <p className="display text-3xl">{d.name}</p>
                          <p className="text-sm text-bone/70">
                            {DAYS[slot.day]} {slot.time} · {place!.name} · {coach!.name}
                          </p>
                        </div>
                      </div>
                      {[
                        ["name", "Nombre", "text", "Cómo te llamás"],
                        ["phone", "WhatsApp", "tel", "Te confirmamos por acá"],
                      ].map(([k, label, type, ph]) => (
                        <label key={k} className="mb-4 block">
                          <span className="text-sm text-bone/60">{label}</span>
                          <input
                            required
                            type={type}
                            placeholder={ph}
                            value={form[k as "name" | "phone"]}
                            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                            className="mt-1 w-full rounded-2xl border border-white/15 bg-coal px-4 py-3.5 outline-none placeholder:text-bone/30 focus:border-signal"
                          />
                        </label>
                      ))}
                      <button className="mt-2 w-full rounded-full bg-signal py-4 font-semibold tracking-wide text-white uppercase">Confirmar mi clase gratis</button>
                      <button type="button" onClick={() => setStep("elegir")} className="mt-3 w-full text-sm text-bone/50 hover:text-bone">
                        ← Elegir otro horario
                      </button>
                      <p className="mt-4 text-center text-xs text-bone/30">Demo: los datos no se envían.</p>
                    </motion.form>
                  )}

                  {step === "listo" && slot && d && (
                    <motion.div key="listo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      <p className="display mt-4 text-5xl">¡Te esperamos!</p>
                      <p className="mt-2 text-bone/60">Te mandamos la confirmación por WhatsApp.</p>
                      {/* Ticket que "se imprime" */}
                      <div className="relative mx-auto mt-8 max-w-sm overflow-hidden">
                        <motion.div
                          initial={{ y: "-100%" }}
                          animate={{ y: "0%" }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                          className="rounded-3xl bg-bone text-left text-coal"
                        >
                          <div className="p-6">
                            <p className="text-xs tracking-[0.25em] text-signal uppercase">Pase de prueba</p>
                            <p className="display mt-2 text-5xl">{d.name}</p>
                            <p className="display mt-3 text-3xl text-coal/70">
                              {DAYS[slot.day]} · {slot.time}
                            </p>
                            <p className="mt-2 text-sm text-coal/60">
                              {place!.name} — {place!.address}
                              <br />
                              Coach: {coach!.name}
                            </p>
                          </div>
                          <div className="relative border-t border-dashed border-coal/25 p-6">
                            <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-graphite" />
                            <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-graphite" />
                            <div className="flex items-center justify-between">
                              <div className="flex gap-[3px]">
                                {Array.from({ length: 22 }, (_, i) => (
                                  <span key={i} className="h-10 bg-coal" style={{ width: (i * 7) % 3 === 0 ? 3 : 1.5 }} />
                                ))}
                              </div>
                              <span className="font-mono text-sm tracking-widest">NUC-{slot.id.replace(/[^0-9]/g, "").slice(0, 5)}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      <p className="mt-6 text-sm text-bone/60">Traé ropa cómoda y una botella. Las toallas las ponemos nosotros.</p>
                      <button onClick={() => setOpen(false)} className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm">
                        Listo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-signal bg-signal text-white" : "border-white/15 hover:border-white/40"}`}>
      {children}
    </button>
  );
}
