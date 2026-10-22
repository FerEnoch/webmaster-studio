"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand, sedes } from "@/lib/content";
import { useBooking } from "./Booking";
import { Paw } from "./Paw";
import { TLink } from "./Transition";
import { GuardiaNow, Magnetic } from "./ui";

const links = [
  ["La clínica", "/clinica"],
  ["Servicios", "/servicios"],
  ["Planes", "/planes"],
  ["Equipo", "/equipo"],
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
    setSolid(y > 60);
  });

  return (
    <>
      <motion.header animate={{ y: hidden ? "-110%" : "0%" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-x-0 top-0 z-50">
        {/* Franja de guardia: siempre a mano */}
        <a href={brand.phoneHref} className="flex items-center justify-center gap-3 bg-ink px-4 py-2 text-xs text-cream/80 transition-colors hover:text-cream">
          {/* Wrapper: el inline-flex interno de GuardiaNow pisaría al `hidden`. */}
          <span className="hidden sm:block">
            <GuardiaNow short className="whitespace-nowrap" />
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap sm:hidden">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Guardia 24 h abierta ·
          </span>
          <span className="hidden md:inline">· Belgrano · Av. Cabildo 2450 ·</span>
          <span className="font-semibold whitespace-nowrap text-coral">Llamar {brand.phone}</span>
        </a>
        <div className={`flex items-center justify-between px-5 py-3.5 transition-colors duration-500 sm:px-10 ${solid ? "bg-cream/85 shadow-[0_1px_0_rgba(22,37,31,0.08)] backdrop-blur-xl" : ""}`}>
          <TLink href="/" className="display flex items-center gap-1.5 text-3xl">
            <Paw className="h-6 w-6 -rotate-12 text-coral" />
            manada
          </TLink>
          <nav className="hidden items-center gap-1 rounded-full border border-ink/10 bg-paper/70 p-1 backdrop-blur md:flex">
            {links.map(([l, h]) => {
              const active = pathname === h;
              return (
                <TLink key={h} href={h} className="relative rounded-full px-5 py-2 text-sm">
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className={`relative ${active ? "text-cream" : "text-ink/75 hover:text-ink"}`}>{l}</span>
                </TLink>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden md:block">
              <Magnetic>
                <button onClick={() => book()} className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
                  Sacar turno
                </button>
              </Magnetic>
            </span>
            <button onClick={() => setOpen((v) => !v)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menú">
              <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-ink" />
              <motion.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 bg-ink" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-sage p-6 pb-28 md:hidden"
          >
            {links.map(([l, h], i) => (
              <motion.div key={h} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
                <TLink href={h} onClick={() => setOpen(false)} className="display block border-b border-ink/15 py-3 text-6xl">
                  {l}
                </TLink>
              </motion.div>
            ))}
            <GuardiaNow className="mt-6 text-sm text-ink/70" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp flotante */}
      <a
        href="#"
        aria-label="WhatsApp"
        className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl transition-transform hover:scale-110 md:right-8 md:bottom-8"
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
    <footer className="relative overflow-hidden rounded-t-[40px] bg-ink px-5 pt-20 pb-28 text-cream sm:px-10 md:pb-10">
      <Paw className="pointer-events-none absolute -right-16 -bottom-20 h-[26rem] w-[26rem] rotate-12 text-cream/[0.04]" />
      <div className="relative grid gap-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="display flex items-center gap-2 text-6xl">
            <Paw className="h-10 w-10 -rotate-12 text-coral" />
            manada
          </p>
          <p className="mt-4 max-w-xs text-cream/60">{brand.tagline}</p>
          <a href={brand.phoneHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white">
            Guardia 24 h · {brand.phone}
          </a>
          <p className="mt-3 text-sm text-cream/50">WhatsApp turnos {brand.whatsapp}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {sedes.map((s) => (
            <div key={s.id}>
              <p className="display text-3xl">{s.name}</p>
              <p className="mt-2 text-sm text-cream/60">{s.address}</p>
              <p className="text-sm text-cream/40">{s.hours}</p>
            </div>
          ))}
          <div className="text-sm text-cream/50 sm:col-span-2">
            <p>Dirección técnica: {brand.director}</p>
            <p>Habilitación municipal N° 0000/00 (demo) · Colegio de Veterinarios</p>
          </div>
        </div>
      </div>

      <div className="relative mt-16 flex flex-col gap-6 border-t border-cream/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/50">
          <a href="#" className="hover:text-cream">
            Contrato de planes
          </a>
          <a href="#" className="hover:text-cream">
            Privacidad (Ley 25.326)
          </a>
          <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noreferrer" className="hover:text-cream">
            Defensa del Consumidor
          </a>
          <span>© 2026 MANADA · Plantilla de demostración</span>
        </div>
        {/* Botón de baja de planes: visible y sin registración previa (Res. 316/2018 y 271/2020). */}
        <button onClick={() => setBaja(true)} className="self-start rounded-full border-2 border-coral px-6 py-3 text-sm font-semibold text-coral transition-colors hover:bg-coral hover:text-white">
          Botón de baja · Dar de baja mi plan
        </button>
      </div>

      <AnimatePresence>
        {baja && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBaja(false)} className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/70 p-4 backdrop-blur">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-[32px] bg-paper p-8 text-ink">
              {done ? (
                <div className="text-center">
                  <p className="display text-4xl">Listo</p>
                  <p className="mt-3 text-ink/70">Recibimos tu baja. Te enviamos el comprobante con el número de trámite por email. No se harán más débitos.</p>
                  <p className="mt-2 font-mono text-sm text-coral">Trámite N° BJ-{new Date().getFullYear()}-0318</p>
                  <button
                    onClick={() => {
                      setBaja(false);
                      setDone(false);
                    }}
                    className="mt-6 rounded-full border border-ink/20 px-6 py-3 text-sm"
                  >
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
                  <p className="display text-4xl">Dar de baja</p>
                  <p className="mt-2 text-sm text-ink/60">Sin llamadas ni trámites: completá estos datos y la baja queda hecha.</p>
                  <input required placeholder="DNI del titular" className="mt-6 w-full rounded-2xl border border-ink/15 bg-cream px-4 py-3.5 outline-none focus:border-coral" />
                  <input required type="email" placeholder="Email del plan" className="mt-3 w-full rounded-2xl border border-ink/15 bg-cream px-4 py-3.5 outline-none focus:border-coral" />
                  <button className="mt-6 w-full rounded-full bg-coral py-4 font-semibold text-white">Confirmar baja</button>
                  <p className="mt-3 text-center text-xs text-ink/40">Demo: no se envían datos.</p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
