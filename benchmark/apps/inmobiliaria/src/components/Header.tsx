"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useFavorites } from "./Favorites";

const links = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Venta", href: "/propiedades?op=Venta" },
  { label: "Alquiler", href: "/propiedades?op=Alquiler" },
  { label: "Terrenos", href: "/propiedades?type=Terreno" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { favs } = useFavorites();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 300 && y > prev && !open);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <div className="flex w-full max-w-6xl items-center justify-between rounded-full border border-white/40 bg-ivory/75 py-2 pr-2 pl-5 shadow-[0_10px_40px_-10px_rgba(20,19,15,0.25)] backdrop-blur-xl">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl leading-none italic">Umbral</span>
            <span className="text-[10px] font-medium tracking-[0.25em] text-ink/50 uppercase">Propiedades</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/propiedades?favs=1"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Favoritos"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z" />
              </svg>
              <AnimatePresence>
                {favs.length > 0 && (
                  <motion.span
                    key={favs.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1 text-[10px] font-semibold text-white"
                  >
                    {favs.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link
              href="/#contacto"
              className="hidden rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-moss sm:block"
            >
              Tasá tu propiedad
            </Link>
            <button onClick={() => setOpen((v) => !v)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menú">
              <motion.span animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-ink" />
              <motion.span animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-ink" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-4 top-20 z-40 rounded-3xl bg-ivory p-4 shadow-2xl md:hidden"
          >
            {links.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block border-b border-ink/10 px-2 py-3.5 font-serif text-3xl">
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
