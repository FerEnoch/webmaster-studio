"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand } from "@/lib/content";
import { Glass } from "./Icons";
import { useShop } from "./Shop";
import { TLink } from "./Transition";
import { Magnetic } from "./ui";

const links = [
  ["La cava", "/vinos"],
  ["Viajes", "/viajes"],
  ["Servicios", "/servicios"],
  ["Club", "/club"],
] as const;

const STRIP = ["Envío gratis desde 6 botellas a todo el país", "Viajes con traslado incluido desde tu hotel", "Beber con moderación · Prohibida su venta a menores de 18 años"];

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openCart, bookTrip } = useShop();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 400 && y > prev && !open);
    setSolid(y > 60);
  });

  return (
    <>
      <motion.header animate={{ y: hidden ? "-110%" : "0%" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-x-0 top-0 z-50">
        {/* Franja con mensajes que pasan */}
        <div className="overflow-hidden bg-wine py-2 text-[11px] tracking-wide text-paper/80">
          <div className="marquee flex w-max gap-16 whitespace-nowrap [--marquee-duration:50s]">
            {[...STRIP, ...STRIP, ...STRIP, ...STRIP].map((t, i) => (
              <span key={i} className="flex items-center gap-16">
                {t}
                <Glass className="h-3 w-3 text-brass" />
              </span>
            ))}
          </div>
        </div>
        <div className={`flex items-center justify-between px-5 py-3.5 transition-colors duration-500 sm:px-10 ${solid ? "bg-night/85 shadow-[0_1px_0_rgba(243,236,224,0.08)] backdrop-blur-xl" : ""}`}>
          <TLink href="/" className="display flex items-center gap-2 text-[1.9rem] tracking-[0.18em]">
            <Glass className="h-6 w-6 text-brass" />
            ALTURA
          </TLink>
          <nav className="hidden items-center gap-1 rounded-full border border-paper/10 bg-paper/5 p-1 backdrop-blur md:flex">
            {links.map(([l, h]) => {
              const active = pathname === h;
              return (
                <TLink key={h} href={h} className="relative rounded-full px-5 py-2 text-sm">
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className={`relative ${active ? "text-night" : "text-paper/75 hover:text-paper"}`}>{l}</span>
                </TLink>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden lg:block">
              <Magnetic>
                <button onClick={() => bookTrip()} className="rounded-full border border-brass/60 px-5 py-2.5 text-sm text-brass transition-colors hover:bg-brass hover:text-night">
                  Reservar viaje
                </button>
              </Magnetic>
            </span>
            <button onClick={openCart} className="relative flex h-11 items-center gap-2 rounded-full bg-paper px-4 text-sm font-semibold text-night" aria-label="Abrir carrito">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 7h14l-1.5 12h-11L5 7Z M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="hidden sm:inline">Cava</span>
              <AnimatePresence mode="popLayout">
                <motion.span key={count} initial={{ scale: 0.4, y: -8 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="flex h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1 text-xs text-paper">
                  {count}
                </motion.span>
              </AnimatePresence>
            </button>
            <button onClick={() => setOpen((v) => !v)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menú">
              <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-paper" />
              <motion.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-paper" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-wine p-6 pb-28 md:hidden"
          >
            {links.map(([l, h], i) => (
              <motion.div key={h} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
                <TLink href={h} onClick={() => setOpen(false)} className="display block border-b border-paper/15 py-3 text-6xl italic">
                  {l}
                </TLink>
              </motion.div>
            ))}
            <p className="mt-6 text-sm text-paper/60">{brand.address}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra fija en celular */}
      <div className="fixed inset-x-3 bottom-3 z-40 flex gap-2 md:hidden">
        <TLink href="/vinos" className="flex-1 rounded-full border border-paper/20 bg-night/80 py-3.5 text-center text-sm font-semibold backdrop-blur">
          Tienda
        </TLink>
        <button onClick={() => bookTrip()} className="flex-1 rounded-full bg-brass py-3.5 text-sm font-semibold text-night shadow-[0_20px_40px_-12px_rgba(193,154,91,0.6)]">
          Reservar viaje
        </button>
      </div>

      <a href="#" aria-label="WhatsApp" className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl transition-transform hover:scale-110 md:right-8 md:bottom-8">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
        </svg>
      </a>
    </>
  );
}

export function Footer() {
  const [modal, setModal] = useState<null | "baja" | "arrepentimiento">(null);
  const [done, setDone] = useState(false);
  const close = () => {
    setModal(null);
    setDone(false);
  };
  return (
    <footer className="relative overflow-hidden border-t border-paper/10 bg-smoke px-5 pt-20 pb-28 sm:px-10 md:pb-10">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="display flex items-center gap-3 text-6xl tracking-[0.14em]">
            <Glass className="h-10 w-10 text-brass" />
            ALTURA
          </p>
          <p className="mt-4 max-w-xs text-paper/60">{brand.tagline}</p>
          <p className="mt-6 text-sm text-paper/60">
            {brand.address}
            <br />
            {brand.hours}
            <br />
            WhatsApp {brand.whatsapp}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="label mb-4 text-brass">Explorar</p>
          {links.map(([l, h]) => (
            <TLink key={h} href={h} className="block text-paper/70 hover:text-paper">
              {l}
            </TLink>
          ))}
        </div>
        <div className="space-y-2 text-sm text-paper/50">
          <p className="label mb-4 text-brass">Legales</p>
          <p>Agencia de viajes: {brand.evt}</p>
          <a href="#" className="block hover:text-paper">
            Términos y condiciones
          </a>
          <a href="#" className="block hover:text-paper">
            Privacidad (Ley 25.326)
          </a>
          <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noreferrer" className="block hover:text-paper">
            Defensa del Consumidor
          </a>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-6 border-t border-paper/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="label text-paper/70">Beber con moderación · Prohibida su venta a menores de 18 años · Ley 24.788</p>
        <div className="flex flex-wrap gap-3">
          {/* Botones visibles y sin registración previa (Res. 424/2020 y Res. 316/2018). */}
          <button onClick={() => setModal("arrepentimiento")} className="rounded-full border-2 border-brass px-5 py-2.5 text-sm font-semibold text-brass transition-colors hover:bg-brass hover:text-night">
            Botón de arrepentimiento
          </button>
          <button onClick={() => setModal("baja")} className="rounded-full border-2 border-brass px-5 py-2.5 text-sm font-semibold text-brass transition-colors hover:bg-brass hover:text-night">
            Botón de baja del Club
          </button>
        </div>
      </div>
      <p className="mt-6 text-xs text-paper/30">© 2026 ALTURA · Plantilla de demostración. Marcas y vinos ficticios.</p>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[95] flex items-center justify-center bg-night/80 p-4 backdrop-blur">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-[32px] bg-paper p-8 text-night">
              {done ? (
                <div className="text-center">
                  <p className="display text-4xl">Listo</p>
                  <p className="mt-3 text-night/70">{modal === "baja" ? "Tu suscripción quedó dada de baja. No habrá más envíos ni débitos." : "Recibimos tu pedido de arrepentimiento. Coordinamos el retiro sin costo y el reintegro total."} Te enviamos el comprobante por email.</p>
                  <p className="mt-2 font-mono text-sm text-wine">Trámite N° {modal === "baja" ? "BJ" : "AR"}-{new Date().getFullYear()}-0412</p>
                  <button onClick={close} className="mt-6 rounded-full border border-night/20 px-6 py-3 text-sm">
                    Cerrar
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(true);
                  }}
                >
                  <p className="display text-4xl">{modal === "baja" ? "Dar de baja el Club" : "Me arrepiento de mi compra"}</p>
                  <p className="mt-2 text-sm text-night/60">{modal === "baja" ? "Sin llamadas ni trámites: completá y la baja queda hecha." : "Tenés 10 días corridos desde que recibiste el pedido."}</p>
                  <input required placeholder={modal === "baja" ? "DNI del titular" : "N° de pedido"} className="mt-6 w-full rounded-2xl border border-night/15 bg-white px-4 py-3.5 outline-none focus:border-wine" />
                  <input required type="email" placeholder="Email" className="mt-3 w-full rounded-2xl border border-night/15 bg-white px-4 py-3.5 outline-none focus:border-wine" />
                  <button className="mt-6 w-full rounded-full bg-wine py-4 font-semibold text-paper">Confirmar</button>
                  <p className="mt-3 text-center text-xs text-night/40">Demo: no se envían datos.</p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
