"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { brand, img, sedes, services, slotsFor, SPECIES, vets, type Slot, type Species } from "@/lib/content";
import { Paw } from "./Paw";

type Prefill = { service?: string; species?: Species; today?: boolean };
type Step = "mascota" | "servicio" | "horario" | "datos" | "listo";
const Ctx = createContext<{ open: (p?: Prefill) => void }>({ open: () => {} });
export const useBooking = () => useContext(Ctx);

const ease = [0.16, 1, 0.3, 1] as const;
const STEPS: Step[] = ["mascota", "servicio", "horario", "datos"];
const WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Próximos 6 días (sin domingos: la guardia no necesita turno). */
function nextDays() {
  const out: { i: number; label: string; num: number; date: Date }[] = [];
  const d = new Date();
  for (let k = 0; out.length < 6; k++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
    if (x.getDay() === 0) continue;
    out.push({ i: k, label: k === 0 ? "Hoy" : k === 1 ? "Mañana" : WEEK[x.getDay()], num: x.getDate(), date: x });
  }
  return out;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("mascota");
  const [species, setSpecies] = useState<Species | null>(null);
  const [pet, setPet] = useState("");
  const [service, setService] = useState<string | null>(null);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [sede, setSede] = useState<string>(sedes[0].id);
  const [form, setForm] = useState({ name: "", phone: "" });
  const days = useMemo(nextDays, []);

  const open = (p: Prefill = {}) => {
    setSpecies(p.species ?? null);
    setService(p.service ?? null);
    setSlot(null);
    setDay(0);
    setStep(p.species ? (p.service ? "horario" : "servicio") : "mascota");
    setOpen(true);
  };

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const now = new Date();
  const slots = useMemo(() => {
    if (!service) return [];
    const list = slotsFor(service, days[day]?.i ?? 0);
    // Hoy: solo horarios que todavía no pasaron.
    if (days[day]?.i !== 0) return list;
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return list.filter((s) => s.time > hhmm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, day, days]);

  const svc = services.find((s) => s.id === service);
  const vet = slot ? vets.find((v) => v.id === slot.vet) : null;
  const sp = SPECIES.find((s) => s.id === species);
  const stepIdx = STEPS.indexOf(step);
  const petName = pet.trim() || (sp ? `tu ${sp.name.toLowerCase()}` : "tu mascota");

  return (
    <Ctx.Provider value={{ open }}>
      {children}

      {/* Barra fija en celular: turno + guardia */}
      <motion.div
        initial={{ y: 120 }}
        animate={{ y: isOpen ? 120 : 0 }}
        transition={{ delay: isOpen ? 0 : 2.4, type: "spring", stiffness: 220, damping: 24 }}
        className="fixed inset-x-3 bottom-3 z-40 flex gap-2 md:hidden"
      >
        <a href={brand.phoneHref} className="flex items-center gap-2 rounded-full border-2 border-coral bg-cream px-5 py-3.5 text-sm font-semibold text-coral">
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot absolute inset-0 rounded-full bg-coral" />
            <span className="relative h-2 w-2 rounded-full bg-coral" />
          </span>
          Guardia
        </a>
        <button onClick={() => open()} className="flex-1 rounded-full bg-ink py-3.5 text-sm font-semibold text-cream shadow-[0_20px_40px_-12px_rgba(22,37,31,0.6)]">
          Sacar turno
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm" />
            <motion.aside
              data-lenis-prevent=""
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease }}
              className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-lg flex-col bg-paper sm:rounded-l-[32px]"
            >
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="label text-coral">Turno online</p>
                    <p className="display mt-1 text-4xl">
                      {step === "listo" ? (
                        <>
                          ¡Listo, <em>{petName}</em>!
                        </>
                      ) : (
                        "Sacá tu turno"
                      )}
                    </p>
                  </div>
                  <button onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 hover:bg-ink/5" aria-label="Cerrar">
                    ✕
                  </button>
                </div>
                {step !== "listo" && (
                  <>
                    {/* Progreso con huellitas */}
                    <div className="mt-5 flex items-center gap-2">
                      {STEPS.map((s, i) => (
                        <motion.span key={s} animate={{ opacity: i <= stepIdx ? 1 : 0.25, scale: i === stepIdx ? 1.15 : 1 }} className="text-coral">
                          <Paw className={`h-5 w-5 ${i % 2 ? "rotate-12" : "-rotate-12"}`} />
                        </motion.span>
                      ))}
                      <span className="ml-2 text-xs text-ink/50">
                        Paso {stepIdx + 1} de {STEPS.length}
                      </span>
                    </div>
                    <a href={brand.phoneHref} className="mt-4 flex items-center gap-3 rounded-2xl bg-coral/10 px-4 py-3 text-sm text-coral">
                      <span className="text-lg">⚠</span>
                      <span>
                        <strong>¿Es una urgencia?</strong> No saques turno: llamá a la guardia al {brand.phone}.
                      </span>
                    </a>
                  </>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <AnimatePresence mode="wait">
                  {step === "mascota" && (
                    <StepWrap key="mascota">
                      <p className="mb-3 text-sm text-ink/60">¿A quién traés?</p>
                      <div className="grid grid-cols-3 gap-2">
                        {SPECIES.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSpecies(s.id)}
                            className={`rounded-3xl border-2 p-4 text-center transition-all ${species === s.id ? "border-coral bg-coral/10" : "border-ink/10 hover:border-ink/30"}`}
                          >
                            <span className="block text-3xl">{s.id === "perro" ? "🐶" : s.id === "gato" ? "🐱" : "🐰"}</span>
                            <span className="mt-1 block text-sm font-medium">{s.name}</span>
                          </button>
                        ))}
                      </div>
                      <label className="mt-6 block">
                        <span className="text-sm text-ink/60">¿Cómo se llama? (opcional)</span>
                        <input value={pet} onChange={(e) => setPet(e.target.value)} placeholder="Ej: Lola" className={input} />
                      </label>
                      <Next disabled={!species} onClick={() => setStep("servicio")} />
                    </StepWrap>
                  )}

                  {step === "servicio" && (
                    <StepWrap key="servicio">
                      <p className="mb-3 text-sm text-ink/60">¿Qué necesita {petName}?</p>
                      <div className="space-y-2">
                        {services
                          .filter((s) => s.id !== "internacion")
                          .map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setService(s.id);
                                setSlot(null);
                                setStep("horario");
                              }}
                              className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-colors hover:border-coral ${service === s.id ? "border-coral" : "border-ink/10"}`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img(s.img, 160, 160)} alt="" className="h-14 w-14 rounded-xl object-cover" />
                              <span className="flex-1">
                                <span className="block font-medium">{s.name}</span>
                                <span className="text-sm text-ink/50">
                                  {s.minutes >= 60 ? `${s.minutes / 60} h` : `${s.minutes} min`} · desde $ {s.from.toLocaleString("es-AR")}
                                </span>
                              </span>
                              <span className="text-ink/30">→</span>
                            </button>
                          ))}
                      </div>
                      <Back onClick={() => setStep("mascota")} />
                    </StepWrap>
                  )}

                  {step === "horario" && svc && (
                    <StepWrap key="horario">
                      <p className="mb-3 text-sm text-ink/60">
                        {svc.name} para {petName}. ¿Dónde y cuándo?
                      </p>
                      <div className="mb-4 flex gap-2">
                        {sedes.map((s) => (
                          <button key={s.id} onClick={() => setSede(s.id)} className={`flex-1 rounded-full border px-4 py-2.5 text-sm transition-colors ${sede === s.id ? "border-ink bg-ink text-cream" : "border-ink/15"}`}>
                            {s.name}
                          </button>
                        ))}
                      </div>
                      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6">
                        {days.map((d, k) => (
                          <button
                            key={d.i}
                            onClick={() => {
                              setDay(k);
                              setSlot(null);
                            }}
                            className={`relative w-16 shrink-0 rounded-2xl py-3 text-center ${k === day ? "text-cream" : "border border-ink/10"}`}
                          >
                            {k === day && <motion.span layoutId="day-bg" className="absolute inset-0 rounded-2xl bg-coral" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                            <span className="relative block text-xs opacity-80">{d.label}</span>
                            <span className="display relative block text-2xl">{d.num}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                          {slots.map((s, i) => (
                            <motion.button
                              layout
                              key={s.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: i * 0.02 }}
                              onClick={() => setSlot(s)}
                              className={`rounded-xl border py-2.5 text-sm tabular-nums transition-colors ${slot?.id === s.id ? "border-ink bg-ink text-cream" : "border-ink/15 hover:border-ink/40"}`}
                            >
                              {s.time}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </div>
                      {slots.length === 0 && <p className="mt-4 rounded-2xl bg-ink/5 p-4 text-sm text-ink/60">No quedan turnos este día. Probá mañana o, si no puede esperar, vení a la guardia.</p>}
                      <AnimatePresence>
                        {slot && vet && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 flex items-center gap-3 rounded-2xl bg-sage/25 p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img(vet.photo, 120, 120)} alt="" className="h-12 w-12 rounded-full object-cover" />
                            <span className="text-sm">
                              Te atiende <strong>{vet.name}</strong>
                              <span className="block text-ink/60">{vet.role}</span>
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Next disabled={!slot} onClick={() => setStep("datos")} />
                      <Back onClick={() => setStep("servicio")} />
                    </StepWrap>
                  )}

                  {step === "datos" && svc && slot && (
                    <StepWrap key="datos">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setStep("listo");
                        }}
                      >
                        <p className="mb-4 text-sm text-ink/60">Último paso: ¿a quién le confirmamos?</p>
                        {[
                          ["name", "Tu nombre", "text", "Cómo te llamás"],
                          ["phone", "WhatsApp", "tel", "Te confirmamos por acá"],
                        ].map(([k, label, type, ph]) => (
                          <label key={k} className="mb-4 block">
                            <span className="text-sm text-ink/60">{label}</span>
                            <input required type={type} placeholder={ph} value={form[k as "name" | "phone"]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={input} />
                          </label>
                        ))}
                        <button className="mt-2 w-full rounded-full bg-coral py-4 font-semibold text-white transition-transform hover:scale-[1.02]">Confirmar turno</button>
                        <p className="mt-3 text-center text-xs text-ink/40">Usamos tus datos solo para este turno (Ley 25.326). Demo: no se envían.</p>
                      </form>
                      <Back onClick={() => setStep("horario")} />
                    </StepWrap>
                  )}

                  {step === "listo" && svc && slot && (
                    <motion.div key="listo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 text-center">
                      <p className="text-ink/60">Te mandamos la confirmación y un recordatorio por WhatsApp.</p>
                      {/* Carnet de turno que "se imprime" y recibe un sello */}
                      <div className="relative mx-auto mt-8 max-w-sm overflow-hidden rounded-[28px]">
                        <motion.div initial={{ y: "-100%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="relative rounded-[28px] bg-ink text-left text-cream">
                          <div className="p-6">
                            <p className="label text-sage">Carnet de turno · {sedes.find((s) => s.id === sede)!.name}</p>
                            <p className="display mt-3 text-5xl">
                              <em>{pet.trim() || sp?.name}</em>
                            </p>
                            <p className="mt-1 text-cream/60">{svc.name}</p>
                            <p className="display mt-5 text-3xl">
                              {days[day].label} {days[day].num} · {slot.time}
                            </p>
                            <p className="mt-1 text-sm text-cream/60">con {vet?.name}</p>
                          </div>
                          <div className="relative border-t border-dashed border-cream/20 p-6">
                            <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-paper" />
                            <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-paper" />
                            <p className="text-sm text-cream/60">Llegá 10 minutos antes. Traé su libreta sanitaria si la tenés.</p>
                            <p className="mt-3 font-mono text-sm tracking-widest text-sage">MAN-{slot.id.replace(/[^0-9]/g, "").slice(0, 6)}</p>
                          </div>
                          <motion.span
                            initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
                            animate={{ scale: 1, opacity: 1, rotate: -14 }}
                            transition={{ delay: 1.3, type: "spring", stiffness: 300, damping: 14 }}
                            className="absolute top-5 right-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-coral text-coral"
                          >
                            <Paw className="h-10 w-10" />
                          </motion.span>
                        </motion.div>
                      </div>
                      <button onClick={() => setOpen(false)} className="mt-8 rounded-full border border-ink/20 px-6 py-3 text-sm">
                        Cerrar
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

const input = "mt-1 w-full rounded-2xl border border-ink/15 bg-cream px-4 py-3.5 outline-none placeholder:text-ink/30 focus:border-coral";

function StepWrap({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  );
}

function Next({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button disabled={disabled} onClick={onClick} className="mt-6 w-full rounded-full bg-ink py-4 font-semibold text-cream transition-all disabled:bg-ink/10 disabled:text-ink/30">
      Continuar
    </button>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-3 w-full text-sm text-ink/50 hover:text-ink">
      ← Volver
    </button>
  );
}
