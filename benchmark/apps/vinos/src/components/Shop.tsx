"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { brand, DAYS_AHEAD, img, trips, wines, type Trip } from "@/lib/content";
import { Bottle, Glass } from "./Icons";

type Ctx = {
  cart: Record<string, number>;
  count: number;
  add: (id: string, qty?: number) => void;
  openCart: () => void;
  bookTrip: (id?: string) => void;
};
const ShopCtx = createContext<Ctx>({ cart: {}, count: 0, add: () => {}, openCart: () => {}, bookTrip: () => {} });
export const useShop = () => useContext(ShopCtx);

const ease = [0.16, 1, 0.3, 1] as const;
const FREE_SHIPPING = 6;
const money = (n: number) => `$ ${Math.round(n).toLocaleString("es-AR")}`;
const WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Próximas fechas para un viaje. La vendimia solo sale de febrero a abril. */
function tripDates(t: Trip) {
  const now = new Date();
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (t.season && !(start.getMonth() >= 1 && start.getMonth() <= 3)) {
    start = new Date(start.getMonth() > 3 ? start.getFullYear() + 1 : start.getFullYear(), 1, 1);
  }
  return Array.from({ length: DAYS_AHEAD }, (_, k) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + k));
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  const add = (id: string, qty = 1) => {
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + qty) }));
    if (qty > 0) {
      setToast(id);
      setTimeout(() => setToast((t) => (t === id ? null : t)), 2200);
    }
  };
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const anyOpen = cartOpen || !!trip;

  useEffect(() => {
    document.documentElement.style.overflow = anyOpen ? "hidden" : "";
  }, [anyOpen]);

  const toastWine = wines.find((w) => w.id === toast);

  return (
    <ShopCtx.Provider value={{ cart, count, add, openCart: () => setCartOpen(true), bookTrip: (id) => setTrip(trips.find((t) => t.id === id) ?? trips[0]) }}>
      {children}

      {/* Aviso al agregar al carrito */}
      <AnimatePresence>
        {toastWine && !cartOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-24 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full bg-paper py-2 pr-5 pl-3 text-sm text-night shadow-2xl md:bottom-8"
          >
            <Bottle wine={toastWine} className="h-12 w-4" />
            <span>
              <strong>{toastWine.name}</strong> en el carrito · Ver
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} add={add} clear={() => setCart({})} />
      <TripDrawer trip={trip} onClose={() => setTrip(null)} />
      <AgeGate />
    </ShopCtx.Provider>
  );
}

/* ================================== Carrito ================================== */

function CartDrawer({ open, onClose, cart, add, clear }: { open: boolean; onClose: () => void; cart: Record<string, number>; add: (id: string, q?: number) => void; clear: () => void }) {
  const [step, setStep] = useState<"cart" | "datos" | "listo">("cart");
  const [pickup, setPickup] = useState(false);
  const items = wines.filter((w) => (cart[w.id] ?? 0) > 0);
  const bottles = items.reduce((a, w) => a + cart[w.id], 0);
  const subtotal = items.reduce((a, w) => a + w.price * cart[w.id], 0);
  const shipping = pickup || bottles >= FREE_SHIPPING || bottles === 0 ? 0 : 6900;
  const progress = Math.min(1, bottles / FREE_SHIPPING);

  useEffect(() => {
    if (open) setStep("cart");
  }, [open]);

  return (
    <Drawer open={open} onClose={onClose} title={step === "listo" ? "¡Salud!" : "Tu cava"} kicker={step === "listo" ? "Pedido confirmado" : `${bottles} ${bottles === 1 ? "botella" : "botellas"}`}>
      <AnimatePresence mode="wait">
        {step === "cart" && (
          <Step key="cart">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <Glass className="mx-auto h-16 w-16 text-brass" />
                <p className="display mt-6 text-3xl">Tu cava está vacía</p>
                <p className="mt-2 text-paper/60">Probá el sommelier virtual o recorré la tienda.</p>
              </div>
            ) : (
              <>
                {/* Barra de envío gratis */}
                <div className="mb-6 rounded-2xl bg-paper/5 p-4">
                  <p className="text-sm text-paper/80">{bottles >= FREE_SHIPPING ? "¡Tenés envío gratis!" : `Sumá ${FREE_SHIPPING - bottles} ${FREE_SHIPPING - bottles === 1 ? "botella" : "botellas"} más y el envío es gratis`}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper/10">
                    <motion.div animate={{ width: `${progress * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} className="h-full rounded-full bg-brass" />
                  </div>
                </div>
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((w) => (
                      <motion.li key={w.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex items-center gap-4 rounded-2xl bg-paper/5 p-3">
                        <Bottle wine={w} className="h-20 w-6 shrink-0" />
                        <div className="flex-1">
                          <p className="display text-2xl">{w.name}</p>
                          <p className="text-xs text-paper/50">
                            {w.varietal} · {w.producer}
                          </p>
                          <p className="mt-1 text-sm">{money(w.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-paper/15 px-2 py-1">
                          <button onClick={() => add(w.id, -1)} className="h-7 w-7 rounded-full hover:bg-paper/10" aria-label="Quitar uno">
                            −
                          </button>
                          <span className="w-5 text-center tabular-nums">{cart[w.id]}</span>
                          <button onClick={() => add(w.id, 1)} className="h-7 w-7 rounded-full hover:bg-paper/10" aria-label="Sumar uno">
                            +
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="mt-6 flex gap-2 rounded-full bg-paper/5 p-1 text-sm">
                  {[
                    [false, "Envío a domicilio"],
                    [true, "Retiro en boutique"],
                  ].map(([v, l]) => (
                    <button key={String(v)} onClick={() => setPickup(v as boolean)} className={`flex-1 rounded-full py-2.5 transition-colors ${pickup === v ? "bg-paper text-night" : "text-paper/70"}`}>
                      {l as string}
                    </button>
                  ))}
                </div>
                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between text-paper/70">
                    <dt>Subtotal</dt>
                    <dd>{money(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-paper/70">
                    <dt>Envío</dt>
                    <dd>{shipping ? money(shipping) : "Gratis"}</dd>
                  </div>
                  <div className="display flex justify-between pt-2 text-3xl">
                    <dt>Total</dt>
                    <dd>{money(subtotal + shipping)}</dd>
                  </div>
                </dl>
                <button onClick={() => setStep("datos")} className="mt-6 w-full rounded-full bg-brass py-4 font-semibold text-night transition-transform hover:scale-[1.02]">
                  Finalizar compra
                </button>
                <p className="mt-3 text-center text-xs text-paper/40">Precios finales con IVA. Se verifica la mayoría de edad al entregar.</p>
              </>
            )}
          </Step>
        )}

        {step === "datos" && (
          <Step key="datos">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("listo");
              }}
            >
              <p className="mb-4 text-sm text-paper/60">Datos para {pickup ? "el retiro" : "el envío"}</p>
              <Field label="Nombre y apellido" />
              <Field label="WhatsApp" type="tel" />
              {!pickup && <Field label="Dirección de entrega" />}
              <label className="mt-2 flex items-start gap-3 text-sm text-paper/70">
                <input required type="checkbox" className="mt-1 accent-[#c19a5b]" />
                Confirmo que soy mayor de 18 años.
              </label>
              <button className="mt-6 w-full rounded-full bg-brass py-4 font-semibold text-night">Pagar {money(subtotal + shipping)}</button>
              <p className="mt-3 text-center text-xs text-paper/40">Demo: no se procesan pagos ni se envían datos.</p>
            </form>
            <button onClick={() => setStep("cart")} className="mt-3 w-full text-sm text-paper/50 hover:text-paper">
              ← Volver a la cava
            </button>
          </Step>
        )}

        {step === "listo" && (
          <Step key="listo">
            <div className="text-center">
              <div className="relative mx-auto mt-4 flex h-56 items-end justify-center gap-1">
                {items.slice(0, 6).map((w, i) => (
                  <motion.div key={w.id} initial={{ y: -260, rotate: i % 2 ? 12 : -12 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 160, damping: 14 }}>
                    <Bottle wine={w} className="h-48 w-14" />
                  </motion.div>
                ))}
              </div>
              <p className="display mt-6 text-4xl">Pedido N° ALT-{(subtotal % 99991).toString().padStart(5, "0")}</p>
              <p className="mt-2 text-paper/60">{pickup ? "Te avisamos por WhatsApp cuando esté listo para retirar." : "Te mandamos el seguimiento por WhatsApp. Llega en 24 a 72 h."}</p>
              <button
                onClick={() => {
                  clear();
                  onClose();
                }}
                className="mt-8 rounded-full border border-paper/20 px-6 py-3 text-sm"
              >
                Cerrar
              </button>
            </div>
          </Step>
        )}
      </AnimatePresence>
    </Drawer>
  );
}

/* ================================== Reserva de viajes ================================== */

function TripDrawer({ trip, onClose }: { trip: Trip | null; onClose: () => void }) {
  const [step, setStep] = useState<"fecha" | "datos" | "listo">("fecha");
  const [date, setDate] = useState<Date | null>(null);
  const [people, setPeople] = useState(2);
  const [hotel, setHotel] = useState("");
  const [name, setName] = useState("");
  const dates = useMemo(() => (trip ? tripDates(trip) : []), [trip]);

  useEffect(() => {
    if (!trip) return;
    setStep("fecha");
    setDate(null);
    setPeople(Math.max(2, trip.min));
  }, [trip]);

  return (
    <Drawer open={!!trip} onClose={onClose} title={step === "listo" ? "¡Nos vemos en Mendoza!" : trip?.name ?? ""} kicker={step === "listo" ? "Reserva confirmada" : `${trip?.hours} · USD ${trip?.price} por persona`}>
      {trip && (
        <AnimatePresence mode="wait">
          {step === "fecha" && (
            <Step key="fecha">
              <div className="grade relative mb-6 h-36 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(trip.img, 900, 400)} alt="" className="h-full w-full object-cover" />
              </div>
              {trip.season && <p className="mb-4 rounded-2xl bg-brass/15 p-3 text-sm text-brass">La vendimia sale de febrero a abril: ya podés reservar la próxima temporada.</p>}
              <p className="mb-3 text-sm text-paper/60">Elegí el día</p>
              <div className="grid grid-cols-7 gap-1.5">
                {dates.map((d) => {
                  const on = date?.toDateString() === d.toDateString();
                  const full = (d.getDate() * 7 + trip.id.length) % 9 === 0;
                  return (
                    <button
                      key={d.toISOString()}
                      disabled={full}
                      onClick={() => setDate(d)}
                      className={`relative rounded-xl py-2 text-center transition-colors disabled:opacity-25 ${on ? "text-night" : "bg-paper/5 hover:bg-paper/10"}`}
                    >
                      {on && <motion.span layoutId="trip-day" className="absolute inset-0 rounded-xl bg-brass" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                      <span className="relative block text-[10px] opacity-70">{WEEK[d.getDay()]}</span>
                      <span className="display relative block text-xl">{d.getDate()}</span>
                      <span className="relative block text-[10px] opacity-60">{MONTH[d.getMonth()]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-paper/5 p-4">
                <span className="text-sm text-paper/70">Personas</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPeople((p) => Math.max(trip.min, p - 1))} className="h-9 w-9 rounded-full border border-paper/20">
                    −
                  </button>
                  <span className="display w-6 text-center text-2xl tabular-nums">{people}</span>
                  <button onClick={() => setPeople((p) => Math.min(12, p + 1))} className="h-9 w-9 rounded-full border border-paper/20">
                    +
                  </button>
                </div>
              </div>
              <label className="mt-4 block">
                <span className="text-sm text-paper/60">¿Dónde te alojás? (para buscarte)</span>
                <input value={hotel} onChange={(e) => setHotel(e.target.value)} placeholder="Hotel o dirección" className={input} />
              </label>
              <div className="display mt-6 flex justify-between text-3xl">
                <span>Total</span>
                <span>USD {trip.price * people}</span>
              </div>
              <button disabled={!date} onClick={() => setStep("datos")} className="mt-6 w-full rounded-full bg-brass py-4 font-semibold text-night disabled:bg-paper/10 disabled:text-paper/30">
                Continuar
              </button>
              <p className="mt-3 text-center text-xs text-paper/40">Cancelación sin cargo hasta 48 h antes. Traslado incluido: no manejes.</p>
            </Step>
          )}

          {step === "datos" && (
            <Step key="datos">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("listo");
                }}
              >
                <label className="mb-4 block">
                  <span className="text-sm text-paper/60">Nombre del titular</span>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={input} />
                </label>
                <Field label="Email o WhatsApp" />
                <label className="mt-2 flex items-start gap-3 text-sm text-paper/70">
                  <input required type="checkbox" className="mt-1 accent-[#c19a5b]" />
                  Todos los que toman vino en el viaje son mayores de 18 años.
                </label>
                <button className="mt-6 w-full rounded-full bg-brass py-4 font-semibold text-night">Confirmar reserva · USD {trip.price * people}</button>
                <p className="mt-3 text-center text-xs text-paper/40">Demo: no se procesan pagos ni se envían datos.</p>
              </form>
              <button onClick={() => setStep("fecha")} className="mt-3 w-full text-sm text-paper/50 hover:text-paper">
                ← Cambiar fecha
              </button>
            </Step>
          )}

          {step === "listo" && date && (
            <Step key="listo">
              {/* Voucher tipo pase de embarque */}
              <motion.div initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.9, ease }} style={{ transformPerspective: 900 }} className="overflow-hidden rounded-[28px] bg-paper text-night">
                <div className="flex items-center justify-between bg-wine px-6 py-4 text-paper">
                  <span className="display flex items-center gap-2 text-2xl">
                    <Glass className="h-5 w-5 text-brass" /> ALTURA
                  </span>
                  <span className="label text-brass">Wine pass</span>
                </div>
                <div className="grid grid-cols-2 gap-4 p-6">
                  <div className="col-span-2">
                    <p className="label text-night/50">Experiencia</p>
                    <p className="display text-3xl">{trip.name}</p>
                  </div>
                  <div>
                    <p className="label text-night/50">Fecha</p>
                    <p className="display text-2xl">
                      {WEEK[date.getDay()]} {date.getDate()} {MONTH[date.getMonth()]}
                    </p>
                  </div>
                  <div>
                    <p className="label text-night/50">Pick-up</p>
                    <p className="display text-2xl">{trip.stops[0].time} h</p>
                  </div>
                  <div>
                    <p className="label text-night/50">Pasajeros</p>
                    <p className="display text-2xl">{people}</p>
                  </div>
                  <div>
                    <p className="label text-night/50">Titular</p>
                    <p className="display truncate text-2xl">{name || "—"}</p>
                  </div>
                </div>
                <div className="relative border-t border-dashed border-night/20 px-6 py-5">
                  <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-smoke" />
                  <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-smoke" />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-[3px]">
                      {Array.from({ length: 26 }, (_, i) => (
                        <span key={i} className="h-10 bg-night" style={{ width: (i * 5) % 3 === 0 ? 3 : 1.5 }} />
                      ))}
                    </div>
                    <span className="font-mono text-sm tracking-widest">ALT-{date.getDate()}{trip.id.toUpperCase().slice(0, 3)}</span>
                  </div>
                  <p className="mt-3 text-xs text-night/50">Te buscamos en: {hotel || "tu hotel (te lo pedimos por WhatsApp)"}</p>
                </div>
              </motion.div>
              <button onClick={onClose} className="mx-auto mt-8 block rounded-full border border-paper/20 px-6 py-3 text-sm">
                Cerrar
              </button>
            </Step>
          )}
        </AnimatePresence>
      )}
    </Drawer>
  );
}

/* ================================== Aviso de edad (Ley 24.788) ================================== */

function AgeGate() {
  const [state, setState] = useState<"unknown" | "ask" | "ok" | "no">("unknown");
  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem("altura-18") === "1";
    } catch {}
    setState(ok ? "ok" : "ask");
  }, []);
  const accept = () => {
    try {
      localStorage.setItem("altura-18", "1");
    } catch {}
    setState("ok");
  };
  return (
    <AnimatePresence>
      {(state === "ask" || state === "no") && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }} className="fixed inset-0 z-[150] flex items-center justify-center bg-night/95 p-6 backdrop-blur-md">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.6, duration: 0.8, ease }} className="max-w-md text-center">
            <Glass className="mx-auto h-14 w-14 text-brass" />
            {state === "ask" ? (
              <>
                <p className="display mt-6 text-5xl">
                  ¿Sos mayor de <em className="text-brass">18 años?</em>
                </p>
                <p className="mt-4 text-paper/60">Para entrar a ALTURA tenés que tener la edad legal para consumir alcohol.</p>
                <div className="mt-8 flex justify-center gap-3">
                  <button onClick={accept} className="rounded-full bg-brass px-8 py-3.5 font-semibold text-night">
                    Sí, soy mayor
                  </button>
                  <button onClick={() => setState("no")} className="rounded-full border border-paper/20 px-8 py-3.5">
                    No
                  </button>
                </div>
              </>
            ) : (
              <p className="display mt-6 text-4xl">Te esperamos cuando cumplas 18. ¡Salud con jugo de uva!</p>
            )}
            <p className="label mt-10 text-paper/40">Beber con moderación · Prohibida su venta a menores de 18 años</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================================== Piezas comunes ================================== */

const input = "mt-1 w-full rounded-2xl border border-paper/15 bg-night px-4 py-3.5 outline-none placeholder:text-paper/30 focus:border-brass";

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="mb-4 block">
      <span className="text-sm text-paper/60">{label}</span>
      <input required type={type} className={input} />
    </label>
  );
}

function Step({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  );
}

function Drawer({ open, onClose, title, kicker, children }: { open: boolean; onClose: () => void; title: string; kicker: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[90] bg-night/70 backdrop-blur-sm" />
          <motion.aside data-lenis-prevent="" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.6, ease }} className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-lg flex-col bg-smoke sm:rounded-l-[32px]">
            <div className="flex items-start justify-between p-6">
              <div>
                <p className="label text-brass">{kicker}</p>
                <p className="display mt-2 text-4xl">{title}</p>
              </div>
              <button onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/15 hover:bg-paper/10" aria-label="Cerrar">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-8">{children}</div>
            <p className="label border-t border-paper/10 px-6 py-3 text-center text-[9px] text-paper/40">Beber con moderación · Prohibida su venta a menores de 18 años · {brand.name}</p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
