"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink px-4 pt-20 text-ivory sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-10 border-b border-ivory/10 pb-14 sm:grid-cols-4">
        <div>
          <p className="font-serif text-3xl italic">Umbral</p>
          <p className="mt-3 text-sm text-ivory/50">Casas, departamentos y terrenos para recorrer antes de visitar.</p>
        </div>
        {[
          ["Explorar", [["Propiedades", "/propiedades"], ["Venta", "/propiedades?op=Venta"], ["Alquiler", "/propiedades?op=Alquiler"], ["Terrenos", "/propiedades?type=Terreno"]]],
          ["Servicios", [["Tasaciones", "/#contacto"], ["Recorridos 360", "/#contacto"], ["Administración", "/#contacto"]]],
          ["Contacto", [["Av. Santa Fe 3200, CABA", "#"], ["+54 11 5000 0000", "#"], ["hola@umbral.com.ar", "#"]]],
        ].map(([h, links]) => (
          <div key={h as string}>
            <p className="mb-4 text-xs tracking-[0.2em] text-ivory/40 uppercase">{h as string}</p>
            {(links as string[][]).map(([l, href]) => (
              <Link key={l} href={href} className="block py-1 text-sm text-ivory/80 hover:text-brass">
                {l}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <motion.p style={{ y }} className="pointer-events-none py-4 text-center font-serif text-[26vw] leading-[0.8] italic text-ivory/10 select-none">
        Umbral
      </motion.p>
      <p className="absolute bottom-4 left-4 text-xs text-ivory/40 sm:left-8">© 2026 Umbral Propiedades · Plantilla de demostración</p>
    </footer>
  );
}
