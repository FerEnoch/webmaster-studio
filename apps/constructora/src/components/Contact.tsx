"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[i];
  return (
    <section className="bg-graphite px-5 py-28 text-white sm:px-10">
      <p className="mb-10 font-mono text-xs tracking-[0.2em] text-white/50 uppercase">Lo que dicen</p>
      <div className="min-h-[16rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote key={i} initial="h" animate="s" exit="x" className="max-w-5xl">
            <p className="text-[clamp(1.8rem,3.8vw,3.6rem)] leading-[1.08] font-medium tracking-[-0.03em]">
              {`“${t.quote}”`.split(" ").map((w, k) => (
                <motion.span
                  key={k}
                  className="mr-[0.25em] inline-block"
                  variants={{
                    h: { opacity: 0, y: 20, filter: "blur(6px)" },
                    s: { opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: k * 0.025, duration: 0.5 } },
                    x: { opacity: 0, y: -10, transition: { duration: 0.25 } },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </p>
            <motion.footer variants={{ h: { opacity: 0 }, s: { opacity: 1, transition: { delay: 0.6 } }, x: { opacity: 0 } }} className="mt-8">
              <span className="font-semibold">{t.name}</span> <span className="text-white/50">— {t.role}</span>
            </motion.footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="mt-10 flex gap-2">
        {testimonials.map((_, k) => (
          <button key={k} onClick={() => setI(k)} className="h-1 w-12 overflow-hidden rounded-full bg-white/15" aria-label={`Testimonio ${k + 1}`}>
            {k === i && (
              <motion.span className="block h-full bg-safety" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contacto" className="relative overflow-hidden bg-safety px-5 py-28 text-ink sm:px-10">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.2em] uppercase opacity-70">Contacto</p>
          <h2 className="text-[clamp(3rem,7vw,7.5rem)] leading-[0.86] font-semibold tracking-[-0.06em]">
            Empecemos
            <br />a construir.
          </h2>
          <div className="mt-10 space-y-2 font-mono text-sm">
            <p>Av. del Libertador 5800, CABA</p>
            <p>+54 11 4000 0000</p>
            <p>hola@basalto.com.ar</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-6 self-end"
        >
          {[
            ["Nombre", "text"],
            ["Email", "email"],
            ["¿Qué querés construir?", "text"],
          ].map(([label, type]) => (
            <label key={label} className="group block">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-70">{label}</span>
              <input
                type={type}
                className="mt-2 w-full border-b-2 border-ink/30 bg-transparent py-3 text-2xl outline-none transition-colors placeholder:text-ink/40 focus:border-ink"
              />
            </label>
          ))}
          <button className="group mt-6 inline-flex items-center gap-4 rounded-full bg-ink py-3 pr-3 pl-7 text-lg font-medium text-white">
            {sent ? "¡Gracias! Te contactamos pronto" : "Enviar consulta"}
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
              →
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const letter = useTransform(scrollYProgress, [0, 1], ["0.3em", "-0.02em"]);
  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink px-5 pt-20 text-white sm:px-10">
      <div className="grid gap-10 border-b border-white/10 pb-16 font-mono text-xs tracking-[0.15em] uppercase sm:grid-cols-4">
        {[
          ["Navegar", ["Obra", "Proyectos", "Unidades", "Proceso"]],
          ["Servicios", ["Desarrollo", "Construcción", "BIM & Render", "Postventa"]],
          ["Social", ["Instagram", "LinkedIn", "YouTube"]],
        ].map(([h, items]) => (
          <div key={String(h)}>
            <p className="mb-4 text-white/40">{h}</p>
            {(items as string[]).map((it) => (
              <a key={it} href="#" className="block py-1 text-white/80 transition-colors hover:text-safety">
                {it}
              </a>
            ))}
          </div>
        ))}
        <p className="text-white/40 normal-case tracking-normal sm:text-right">
          © 2026 Basalto Constructora. Plantilla de demostración.
        </p>
      </div>
      <motion.div
        style={{ y, letterSpacing: letter }}
        className="pointer-events-none py-6 text-center text-[24vw] leading-[0.8] font-semibold text-transparent select-none [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]"
      >
        BASALTO
      </motion.div>
    </footer>
  );
}
