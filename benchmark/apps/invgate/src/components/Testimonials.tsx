"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/content";
import Button from "./Button";
import { ArrowRight } from "./Icons";
import Notch from "./Notch";

const DURATION = 8; // segundos por testimonio
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Original: 4 tabs con logo + barra de progreso lineal; al completarse pasa al
 * siguiente, la foto de fondo hace crossfade (700ms) y el carrusel es arrastrable.
 * Mejoras: Ken Burns en la foto, cita palabra por palabra y pausa al hover.
 */
export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = inView && !paused;
  const progress = useMotionValue(0);

  const go = (n: number) => setIdx((n + testimonials.length) % testimonials.length);

  useEffect(() => progress.set(0), [idx, progress]);

  // Avanza la barra; al pausar (hover / fuera de pantalla) retoma desde donde quedó.
  useEffect(() => {
    if (!running) return;
    const c = animate(progress, 1, {
      duration: DURATION * (1 - progress.get()),
      ease: "linear",
      onComplete: () => setIdx((i) => (i + 1) % testimonials.length),
    });
    return () => c.stop();
  }, [running, idx, progress]);
  const t = testimonials[idx];

  return (
    <section className="mx-auto max-w-[110rem] px-4 py-8 lg:py-24">
      <div className="relative mx-auto w-full max-w-screen-2xl sm:px-8 lg:px-14 xl:px-16">
        <div ref={ref} className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <Notch>
            <Button variant="dark" arrow>
              See case study
            </Button>
          </Notch>

          <div className="relative overflow-hidden rounded-3xl px-5 py-10 sm:pt-32 sm:pb-24 md:px-12 lg:px-16 lg:py-24">
            <div className="absolute inset-0">
              <AnimatePresence initial={false}>
                <motion.div
                  key={idx}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: DURATION + 1, ease: "linear" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.img} alt="" className="h-full w-full object-cover" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-zinc-950/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col justify-between">
              {/* tabs con progreso */}
              <div className="mb-16 hidden flex-wrap gap-x-6 gap-y-4 sm:flex xl:gap-x-8">
                {testimonials.map((x, i) => (
                  <div key={x.company} className="relative flex max-w-40 flex-1 flex-col justify-between">
                    <button
                      onClick={() => go(i)}
                      className={`mb-4 cursor-pointer text-left text-lg font-bold tracking-tight text-white transition-opacity duration-300 ${
                        i === idx ? "opacity-100" : "opacity-50 hover:opacity-75"
                      }`}
                    >
                      {x.company}
                    </button>
                    <div className="relative h-0.5 w-full overflow-hidden rounded-2xl bg-white/30">
                      {i === idx && (
                        <motion.div className="absolute inset-0 origin-left bg-white" style={{ scaleX: progress }} />
                      )}
                      {i < idx && <div className="absolute inset-0 bg-white/70" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* cita */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(idx + 1);
                  if (info.offset.x > 60) go(idx - 1);
                }}
                className="min-h-[20rem] cursor-grab active:cursor-grabbing sm:min-h-[17rem]"
              >
                <AnimatePresence mode="wait">
                  <motion.div key={idx} exit={{ opacity: 0, x: -40, filter: "blur(6px)" }} transition={{ duration: 0.35 }}>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur"
                    >
                      {t.industry}
                    </motion.span>
                    <blockquote className="max-w-4xl text-2xl leading-snug font-medium text-white select-none sm:text-3xl lg:text-4xl">
                      <motion.span initial="h" animate="s" transition={{ staggerChildren: 0.025 }}>
                        {`“${t.quote}”`.split(" ").map((w, i) => (
                          <motion.span
                            key={i}
                            className="inline-block"
                            variants={{
                              h: { opacity: 0, y: 14, filter: "blur(8px)" },
                              s: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
                            }}
                          >
                            {w}&nbsp;
                          </motion.span>
                        ))}
                      </motion.span>
                    </blockquote>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 text-zinc-200"
                    >
                      <span className="font-semibold text-white">{t.author}</span> - {t.role}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2 sm:hidden">
            <button onClick={() => go(idx - 1)} className="rounded-full border border-zinc-200 bg-zinc-50 p-2 text-zinc-500" aria-label="Previous">
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <button onClick={() => go(idx + 1)} className="rounded-full border border-zinc-200 bg-zinc-50 p-2 text-zinc-500" aria-label="Next">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
