"use client";

import { motion } from "motion/react";
import { news } from "@/lib/content";
import { ArrowUpRight } from "./Icons";
import { staggerChild, staggerParent } from "./Reveal";

/** Original: 4 cards, la imagen hace scale(1.1) en 500ms al hover. Mejora: entrada escalonada y flecha. */
export default function News() {
  return (
    <section className="py-12 lg:pt-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-8 lg:px-14 xl:px-16">
        <h2 className="sr-only">InvGate News</h2>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {news.map((n) => (
            <motion.a
              key={n.title}
              variants={staggerChild}
              href="#"
              className="group relative flex h-56 w-full flex-col overflow-hidden rounded-2xl sm:h-72 md:h-[25rem]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={n.img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70 transition-opacity duration-500 group-hover:opacity-90" />
              <span className="absolute top-4 right-4 z-10 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-zinc-950 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <div className="relative z-10 mt-auto p-5">
                <h3 className="text-lg leading-snug font-medium text-white transition-transform duration-500 group-hover:-translate-y-1 md:text-xl">
                  {n.title}
                </h3>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
