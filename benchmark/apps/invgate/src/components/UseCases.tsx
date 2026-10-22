"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useCases, useCasesImg } from "@/lib/content";
import Button from "./Button";
import { ArrowUpRight, useCaseIcons } from "./Icons";
import Notch from "./Notch";
import { staggerChild, staggerParent, WordsReveal } from "./Reveal";

/**
 * Original: bloque con foto de fondo, muesca con "See all Solutions" y 5 cards
 * que entran con opacity 0 / translateY(24px) escalonadas (GSAP).
 * Mejoras: zoom de la foto con el scroll, spotlight que sigue al mouse y
 * el ícono que se ilumina al hover.
 */
export default function UseCases() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="mx-auto max-w-[110rem] px-4 py-12">
      <div ref={ref} className="relative mx-auto max-w-screen-2xl">
        <Notch>
          <Button variant="dark" arrow>
            See all Solutions
          </Button>
        </Notch>

        <div className="relative w-full overflow-hidden rounded-4xl px-4 py-14 sm:px-8 sm:py-22 lg:px-14 xl:px-16">
          <motion.div style={{ scale, y }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={useCasesImg} alt="" className="h-full w-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(232,238,255,0.92)_0%,rgba(97,114,243,0.55)_45%,rgba(9,9,11,0.35)_100%)]" />

          <div className="relative z-10 flex flex-col gap-y-16 sm:gap-y-36">
            <div className="sm:max-w-[26rem]">
              <h2 className="mb-6 text-center text-4xl leading-tight font-medium tracking-tight text-zinc-950 sm:text-left">
                <WordsReveal text="What is priority one right now?" />
              </h2>
              <p className="mb-8 text-center text-zinc-800 sm:mb-0 sm:text-left">
                Learn how our solutions can revolutionize the way you manage IT service and assets.
              </p>
              <div className="mt-6 flex justify-center sm:justify-start">
                <Button variant="glass" arrow>
                  See all Use Cases
                </Button>
              </div>
            </div>

            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5"
            >
              {useCases.map((uc, i) => {
                const Icon = useCaseIcons[i];
                return (
                  <motion.a
                    key={uc}
                    href="#"
                    variants={staggerChild}
                    whileHover={{ y: -6 }}
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                    }}
                    className="spotlight group flex h-full min-h-40 flex-col items-start gap-3 rounded-[12px] border border-white/10 bg-zinc-950/55 p-4 text-zinc-50 shadow-[0_4px_8px_rgba(16,24,40,0.1)] backdrop-blur-md transition-colors duration-300 hover:border-white/30 hover:bg-zinc-950/70"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-indigo-200 transition-all duration-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(129,140,248,0.8)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="mt-auto flex w-full items-start justify-between gap-2">
                      <span className="text-left text-base leading-[1.6] font-semibold">{uc}</span>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </span>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
