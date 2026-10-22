"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand, sedes } from "@/lib/content";
import { useBooking } from "./Booking";
import { TLink } from "./Transition";
import { LiveNow, Magnetic } from "./ui";

const links = [
  ["El club", "/club"],
  ["Clases", "/clases"],
  ["Planes", "/planes"],
  ["Coaches", "/entrenadores"],
] as const;

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: book } = useBooking();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 400 && y > prev && !open);
    setSolid(y > 80);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "bg-coal/80 backdrop-blur-xl" : ""}`}
      >
        <div className="flex items-center justify-between px-5 py-4 sm:px-10">
          <TLink href="/" className="display text-3xl">
            NÚCLEO<span className="text-signal">.</span>
          </TLink>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur md:flex">
            {links.map(([l, h]) => {
              const active = pathname === h;
              return (
                <TLink key={h} href={h} className="relative rounded-full px-5 py-2 text-sm">
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className={`relative ${active ? "text-coal" : "text-bone/80 hover:text-bone"}`}>{l}</span>
                </TLink>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {/* Wrappers: el display interno de LiveNow/Magnetic pisaría al `hidden`. */}
            <span className="hidden lg:block">
              <LiveNow className="text-xs text-bone/60" />
            </span>
            <span className="hidden md:block">
              <Magnetic>
                <button onClick={() => book()} className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
                  Clase gratis
                </button>
              </Magnetic>
            </span>
            <button onClick={() => setOpen((v) => !v)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menú">
              <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-bone" />
              <motion.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-bone" />
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
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-graphite p-6 pb-28 md:hidden"
          >
            {links.map(([l, h], i) => (
              <motion.div key={h} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
                <TLink href={h} onClick={() => setOpen(false)} className="display block border-b border-white/10 py-3 text-6xl">
                  {l}
                </TLink>
              </motion.div>
            ))}
            <LiveNow className="mt-6 text-sm text-bone/60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp flotante */}
      <a
        href="#"
        aria-label="WhatsApp"
        className="fixed right-5 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl transition-transform hover:scale-110 md:bottom-8 md:right-8"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
        </svg>
      </a>
    </>
  );
}

export function Footer() {
  const [baja, setBaja] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-coal px-5 pt-20 pb-28 sm:px-10 md:pb-10">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="display text-6xl">
            NÚCLEO<span className="text-signal">.</span>
          </p>
          <p className="mt-4 max-w-xs text-bone/60">{brand.tagline}</p>
          <p className="mt-6 text-sm text-bone/60">WhatsApp {brand.whatsapp}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {sedes.map((s) => (
            <div key={s.id}>
              <p className="display text-2xl">{s.name}</p>
              <p className="mt-2 text-sm text-bone/60">{s.address}</p>
              <p className="text-sm text-bone/40">{s.hours}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-bone/50">
          <a href="#" className="hover:text-bone">Contrato de adhesión</a>
          <a href="#" className="hover:text-bone">Términos y condiciones</a>
          <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noreferrer" className="hover:text-bone">
            Defensa del Consumidor
          </a>
          <span>© 2026 NÚCLEO Training · Plantilla de demostración</span>
        </div>
        {/* Botón de baja: visible, sin registración previa (Res. 316/2018 y 271/2020). */}
        <button onClick={() => setBaja(true)} className="self-start rounded-full border-2 border-signal px-6 py-3 text-sm font-semibold text-signal transition-colors hover:bg-signal hover:text-white">
          Botón de baja · Dar de baja mi membresía
        </button>
      </div>

      <AnimatePresence>
        {baja && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBaja(false)} className="fixed inset-0 z-[95] flex items-center justify-center bg-coal/80 p-4 backdrop-blur">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-white/10 bg-graphite p-8">
              {done ? (
                <div className="text-center">
                  <p className="display text-4xl">Listo</p>
                  <p className="mt-3 text-bone/70">Recibimos tu baja. Te enviamos el comprobante con el número de trámite por email. No se te van a hacer más débitos.</p>
                  <p className="mt-2 font-mono text-sm text-signal">Trámite N° BJ-{new Date().getFullYear()}-0471</p>
                  <button onClick={() => { setBaja(false); setDone(false); }} className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm">Cerrar</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                  <p className="display text-4xl">Dar de baja</p>
                  <p className="mt-2 text-sm text-bone/60">Sin llamadas ni trámites: completá estos datos y la baja queda hecha.</p>
                  <input required placeholder="DNI" className="mt-6 w-full rounded-2xl border border-white/15 bg-coal px-4 py-3.5 outline-none focus:border-signal" />
                  <input required type="email" placeholder="Email de la membresía" className="mt-3 w-full rounded-2xl border border-white/15 bg-coal px-4 py-3.5 outline-none focus:border-signal" />
                  <button className="mt-6 w-full rounded-full bg-signal py-4 font-semibold text-white">Confirmar baja</button>
                  <p className="mt-3 text-center text-xs text-bone/30">Demo: no se envían datos.</p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
