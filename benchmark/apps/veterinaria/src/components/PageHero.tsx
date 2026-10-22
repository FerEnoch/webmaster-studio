"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Kicker, Lines } from "./ui";

/** Encabezado de páginas internas: entra justo cuando se levanta la cortina. La última línea va en itálica coral. */
export function PageHero({ kicker, title, text, aside }: { kicker: string; title: string[]; text: string; aside?: ReactNode }) {
  return (
    <section className="px-5 pt-40 pb-16 sm:px-10 sm:pt-48">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Kicker>{kicker}</Kicker>
      </motion.div>
      <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="display text-[clamp(3.6rem,11vw,11rem)]">
          <Lines
            immediate
            delay={0.55}
            lines={title.map((t, i) =>
              i === title.length - 1 ? (
                <em key={t} className="text-coral">
                  {t}
                </em>
              ) : (
                t
              ),
            )}
          />
        </h1>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="max-w-md lg:pb-4">
          <p className="text-lg text-ink/70">{text}</p>
          {aside}
        </motion.div>
      </div>
    </section>
  );
}
