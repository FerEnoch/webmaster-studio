"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Button from "./Button";
import { WordsReveal, staggerChild, staggerParent } from "./Reveal";

/**
 * Original: bloque negro con dos "eclipses" (círculo con gradiente azul→violeta
 * desenfocado y un círculo negro encima). Mejora: los halos giran y siguen al mouse.
 */
export default function Cta() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 40, damping: 20 });
  const y = useSpring(my, { stiffness: 40, damping: 20 });
  const xSlow = useSpring(mx, { stiffness: 25, damping: 20 });

  return (
    <section className="mx-auto max-w-[110rem] px-4 pb-16">
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left - r.width / 2) / 12);
          my.set((e.clientY - r.top - r.height / 2) / 12);
        }}
        className="relative w-full overflow-hidden rounded-4xl bg-zinc-950"
      >
        <motion.div style={{ x, y }} className="pointer-events-none absolute -right-[30rem] -bottom-[42rem] h-[60rem] w-[60rem]">
          <motion.div
            className="absolute inset-0 rounded-full blur-[35px]"
            style={{ background: "linear-gradient(223deg, #2563EB 27%, #7C3AED 76%)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute top-6 left-10 h-[56rem] w-[56rem] rounded-full bg-zinc-950" />
        </motion.div>
        <motion.div style={{ x: xSlow }} className="pointer-events-none absolute -top-[36rem] right-56 h-[50rem] w-[50rem]">
          <motion.div
            className="absolute inset-0 rounded-full bg-zinc-400 opacity-50 blur-[35px]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute top-0 left-4 h-[49rem] w-[49rem] rounded-full bg-zinc-950" />
        </motion.div>

        <div className="relative mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-center gap-x-16 gap-y-10 px-6 py-14 sm:px-8 sm:py-20 lg:px-16 xl:grid-cols-2">
          <div>
            <h2 className="mb-6 text-center text-4xl font-medium tracking-tight text-balance text-zinc-50 sm:text-5xl xl:text-start">
              <WordsReveal text="Check out InvGate as your ITSM and ITAM solution" />
            </h2>
            <p className="mb-6 text-center text-zinc-300 sm:text-lg xl:text-start">30-day free trial - No credit card needed</p>
            <div className="flex justify-center xl:justify-start">
              <Button variant="glass" arrow>
                Get started
              </Button>
            </div>
          </div>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8"
          >
            {[
              { t: "Clear pricing", p: "No surprises, no hidden fees — just clear, upfront pricing that fits your needs.", c: "View Pricing", icon: "$" },
              { t: "Easy migration", p: "Our team ensures your transition to InvGate is fast, smooth, and hassle-free.", c: "View Customer Experience", icon: "⇄" },
            ].map((k) => (
              <motion.div
                key={k.t}
                variants={staggerChild}
                whileHover={{ y: -6 }}
                className="group rounded-xl border border-zinc-600 bg-zinc-800/70 p-6 backdrop-blur transition-colors duration-500 hover:border-indigo-400/60"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-bold text-white transition-transform duration-500 group-hover:rotate-12">
                  {k.icon}
                </span>
                <h3 className="mb-2 text-lg font-medium text-zinc-50">{k.t}</h3>
                <p className="mb-5 text-zinc-300">{k.p}</p>
                <Button variant="linkLight" arrow>
                  {k.c}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
