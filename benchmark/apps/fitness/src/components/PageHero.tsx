"use client";

import { motion } from "motion/react";
import { Kicker, Lines } from "./ui";

/** Encabezado de páginas internas: entra justo cuando se levanta la cortina. */
export function PageHero({ kicker, title, text }: { kicker: string; title: string[]; text: string }) {
  return (
    <section className="px-5 pt-36 pb-16 sm:px-10 sm:pt-44">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Kicker>{kicker}</Kicker>
      </motion.div>
      <h1 className="display mt-6 text-[clamp(4rem,13vw,13rem)]">
        <Lines immediate delay={0.55} lines={title.map((t, i) => (i === title.length - 1 ? <span key={t} className="text-signal">{t}</span> : t))} />
      </h1>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-8 max-w-xl text-lg text-bone/70">
        {text}
      </motion.p>
    </section>
  );
}
