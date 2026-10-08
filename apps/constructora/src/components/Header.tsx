"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

const links = [
  { label: "Obra", href: "#obra" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Unidades", href: "#unidades" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 200 && y > prev && !open);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference sm:px-10"
      >
        <a href="#" className="flex items-center gap-2 text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
            <path d="M3 21V9l9-6 9 6v12h-6v-7H9v7H3Z" />
          </svg>
          <span className="text-lg font-semibold tracking-[0.18em]">BASALTO</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group relative font-mono text-xs tracking-[0.18em] text-white uppercase">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Menú"
        >
          <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-white" />
          <motion.span animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-white" />
        </button>
      </motion.header>

      <a
        href="#contacto"
        className="group fixed right-5 bottom-20 z-40 hidden items-center gap-3 overflow-hidden rounded-full bg-ink py-2 pr-2 pl-5 text-sm font-medium text-white shadow-2xl sm:right-10 lg:flex"
      >
        <span className="relative">Hablemos de tu proyecto</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-safety transition-transform duration-500 group-hover:rotate-[-45deg]">
          →
        </span>
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 95% 4%)" }}
            animate={{ clipPath: "circle(150% at 95% 4%)" }}
            exit={{ clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink p-6 pb-16 text-white md:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="border-b border-white/10 py-4 text-4xl font-semibold tracking-tight"
              >
                <span className="mr-3 font-mono text-xs text-safety">0{i + 1}</span>
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
