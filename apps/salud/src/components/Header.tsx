"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useBooking } from "./Booking";

const links = [
  ["Tratamientos", "#tratamientos"],
  ["Odontología", "#odontologia"],
  ["Láser", "#laser"],
  ["Kinesiología", "#kinesiologia"],
  ["Equipo", "#equipo"],
];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: book } = useBooking();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 400 && y > prev && !open);
    setSolid(y > window.innerHeight * 4.6);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 py-2.5 backdrop-blur-xl transition-colors duration-500 ${
            solid ? "border-ink/10 bg-porcelain/80 text-ink" : "border-white/10 bg-white/5 text-porcelain"
          }`}
        >
          <a href="#" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
              <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 19c4-6 18-6 22 0" fill="none" stroke="#6fd3c2" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="16" cy="12" r="3" fill="#f3a78c" />
            </svg>
            <span className="font-serif text-2xl leading-none">Alba</span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(([l, h]) => (
              <a key={h} href={h} className="rounded-full px-4 py-2 text-sm opacity-80 transition hover:bg-current/10 hover:opacity-100">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => book()}
              className={`hidden rounded-full px-5 py-2.5 text-sm font-medium sm:block ${solid ? "bg-deep text-porcelain" : "bg-mint text-deep"}`}
            >
              Sacar turno
            </button>
            <button onClick={() => setOpen((v) => !v)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden" aria-label="Menú">
              <motion.span animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} className="h-px w-5 bg-current" />
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(150% at 92% 5%)" }}
            exit={{ clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-deep p-6 pb-24 text-porcelain lg:hidden"
          >
            {links.map(([l, h], i) => (
              <motion.a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="border-b border-white/10 py-4 font-serif text-4xl"
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
