"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { resources } from "@/lib/content";
import { ArrowRight } from "./Icons";
import { Reveal, staggerChild, staggerParent, WordsReveal } from "./Reveal";

/** Original: carrusel embla de cards de 320px con flechas (la izquierda deshabilitada al inicio). */
export default function Resources() {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(update, []);

  const move = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * 340 * 2, behavior: "smooth" });

  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-8 lg:px-14 xl:px-16">
        <div className="mb-12">
          <h2 className="mb-6 text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl">
            <WordsReveal text="Don't miss out our ITSM content" />
          </h2>
          <Reveal>
            <p className="mb-6 text-zinc-800">Learn more about our products, industry and IT culture.</p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <a href="#" className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800">
                  Resources Hub
                </a>
                <a href="#" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-100">
                  Ticket Volume Podcast
                </a>
              </div>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <Arrow onClick={() => move(-1)} disabled={edge.start} flip />
                <Arrow onClick={() => move(1)} disabled={edge.end} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <motion.div
        ref={track}
        onScroll={update}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 py-4 sm:px-8 lg:px-14 xl:px-[max(4rem,calc((100vw_-_1536px)/2_+_4rem))]"
      >
        {resources.map((r, i) => (
          <motion.a
            key={r.title}
            href="#"
            variants={staggerChild}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow duration-500 hover:shadow-[0_24px_50px_-12px_rgba(16,24,40,0.25)] sm:w-[320px]"
          >
            <div
              className="relative h-44 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${r.tone[0]}, ${r.tone[1]})` }}
            >
              <motion.span
                className="absolute -right-10 -bottom-16 h-48 w-48 rounded-full border-[18px] border-white/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="absolute top-6 left-6 h-16 w-12 rounded-md bg-white/90 shadow-xl transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110" />
              <span className="absolute top-9 left-14 h-16 w-12 rounded-md bg-white/50 transition-transform duration-700 group-hover:translate-x-3 group-hover:rotate-6" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="mb-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">{r.kind}</span>
              <p className="flex-1 text-lg leading-snug font-medium text-zinc-950">{r.title}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>

      <div className="mt-6 flex justify-center gap-3 sm:hidden">
        <Arrow onClick={() => move(-1)} disabled={edge.start} flip />
        <Arrow onClick={() => move(1)} disabled={edge.end} />
      </div>
    </section>
  );
}

function Arrow({ onClick, disabled, flip = false }: { onClick: () => void; disabled: boolean; flip?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={flip ? "Previous" : "Next"}
      className="rounded-full border border-zinc-200 bg-zinc-50 p-2 text-zinc-500 transition hover:bg-zinc-200 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-zinc-50"
    >
      <ArrowRight className={`h-5 w-5 ${flip ? "rotate-180" : ""}`} />
    </button>
  );
}
