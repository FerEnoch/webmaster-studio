"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { menu } from "@/lib/content";
import { Chevron, Globe, Logo } from "./Icons";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Header del original: arriba ocupa todo el ancho del hero; al scrollear se
 * convierte en una píldora flotante con blur. El mega-menú entra con
 * rotateX(-10deg) scale(.9) → 0/1 (keyframe "scaleIn" del original).
 */
export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    // Mejora: se esconde al bajar rápido y vuelve al subir.
    setHidden(y > 900 && y > prev + 4 && open === null && !mobile);
    if (y < prev - 4) setHidden(false);
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center md:px-4">
      <motion.header
        onMouseLeave={() => setOpen(null)}
        animate={{
          maxWidth: scrolled ? 960 : 1760,
          y: hidden ? -110 : scrolled ? 12 : 16,
          borderRadius: scrolled ? 999 : 20,
        }}
        transition={{ duration: 0.6, ease }}
        className={`pointer-events-auto relative w-full border transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled
            ? "border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(16,24,40,0.12)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex min-h-14 items-center justify-between px-4 py-2 sm:px-6 md:px-3 md:pl-5">
          <a href="#" className="text-zinc-950" aria-label="InvGate">
            <Logo />
          </a>

          <nav className="ml-6 hidden w-full lg:block">
            <ul className="flex gap-x-0.5">
              {menu.map((m, i) => (
                <li key={m.label} onMouseEnter={() => setOpen(i)}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-950/5 ${
                      open === i ? "bg-zinc-950/10" : ""
                    }`}
                  >
                    {m.label}
                    <Chevron className={`h-4 w-4 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
                  </button>
                </li>
              ))}
              <li onMouseEnter={() => setOpen(null)}>
                <a href="#" className="flex rounded-full px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-950/5">
                  Pricing
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <button className="hidden h-8 w-8 items-center justify-center rounded-full text-zinc-800 hover:bg-zinc-950/5 md:flex" aria-label="Language">
              <Globe className="h-5 w-5" />
            </button>
            <a
              href="#"
              className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 sm:inline-flex"
            >
              Contact Us
            </a>
            <a
              href="#"
              className="relative isolate inline-flex overflow-hidden rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white"
            >
              <span className="absolute top-1/2 left-1 -z-10 h-[80%] w-[60%] -translate-y-1/2">
                <span className="block h-full w-full animate-gradient-move rounded-full bg-violet-400 opacity-60 blur-md" />
              </span>
              Free Trial
            </a>
            <button
              onClick={() => setMobile((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
              aria-label="Menu"
            >
              <motion.span animate={mobile ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-0.5 w-5 bg-zinc-950" />
              <motion.span animate={mobile ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="h-0.5 w-5 bg-zinc-950" />
            </button>
          </div>
        </div>

        {/* Mega menú */}
        <div className="absolute inset-x-0 top-full hidden justify-center pt-3 lg:flex" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait">
            {open !== null && (
              <motion.div
                key={open}
                initial={{ opacity: 0, rotateX: -10, scale: 0.92, y: -6 }}
                animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
                exit={{ opacity: 0, rotateX: -10, scale: 0.95 }}
                transition={{ duration: 0.28, ease }}
                style={{ transformOrigin: "top center" }}
                className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white/95 p-3 shadow-[0_24px_60px_rgba(16,24,40,0.18)] backdrop-blur-xl"
              >
                <div className="grid grid-cols-2 gap-2">
                  {menu[open].columns.map((col, ci) => (
                    <div key={col.heading} className="rounded-2xl p-3">
                      <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">{col.heading}</p>
                      {col.items.map((it, ii) => (
                        <motion.a
                          key={it.title}
                          href="#"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + (ci * 3 + ii) * 0.035, duration: 0.3 }}
                          className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-zinc-100"
                        >
                          <span
                            className="mt-0.5 h-8 w-8 shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                            style={{ background: `linear-gradient(135deg, ${it.tone}, ${it.tone}55)` }}
                          />
                          <span>
                            <span className="block text-sm font-semibold text-zinc-900">{it.title}</span>
                            <span className="block text-sm text-zinc-500">{it.text}</span>
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  ))}
                  {menu[open].columns.length === 1 && (
                    <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#e8eeff,#6172f3_60%,#09090b)] p-5 text-white">
                      <p className="text-xs font-semibold tracking-wider uppercase opacity-80">Featured</p>
                      <p className="mt-2 text-lg font-semibold">ENVISION’26 recap</p>
                      <p className="mt-1 text-sm opacity-80">AI, IT’s new mandate, and the human edge.</p>
                      <span className="absolute -right-6 -bottom-6 h-28 w-28 animate-spin-slow rounded-full border border-dashed border-white/40" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Menú mobile */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease }}
            className="pointer-events-auto fixed inset-x-3 top-20 rounded-3xl border border-zinc-200 bg-white p-4 shadow-2xl lg:hidden"
          >
            {menu.map((m, i) => (
              <motion.a
                key={m.label}
                href="#"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center justify-between border-b border-zinc-100 px-2 py-3.5 text-base font-medium"
              >
                {m.label}
                <Chevron className="h-4 w-4 -rotate-90" />
              </motion.a>
            ))}
            <a href="#" className="block px-2 py-3.5 text-base font-medium">
              Pricing
            </a>
            <a href="#" className="mt-2 block rounded-full border border-zinc-200 py-3 text-center font-semibold">
              Contact Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
