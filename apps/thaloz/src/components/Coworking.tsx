"use client";

import { useEffect, useRef } from "react";
import { photos } from "@/lib/content";
import { inViewProgress, trackMotion } from "@/lib/scrollMotion";
import { GreekSeal } from "./GreekSeal";

export function Coworking() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // "2 Image Parallax [While Scroll]": acá las fotos son .is-big / .is-square,
    // así que solo aplica el zoom de .image_arc (1 → 1.2). Smoothing 90.
    return trackMotion(
      () => inViewProgress(el, true, true),
      (value) => el.style.setProperty("--p", value.toFixed(4)),
      90,
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#07010f] py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <div ref={ref} className="relative mx-auto aspect-[600/675] w-full max-w-[600px]">
          <GreekSeal className="pointer-events-none absolute right-0 top-0 w-1/2 opacity-50" />
          <div className="absolute left-[7.5%] top-0 h-full w-3/4 overflow-hidden rounded-t-[720px] rounded-b-[8px]">
            <img src={photos.house} alt="Equipo en el espacio de trabajo" className="h-full w-full object-cover will-change-transform" style={{ transform: "scale(calc(1 + var(--p, 0) * 0.2))" }} />
          </div>
          <div className="absolute left-1/2 top-[40.6%] h-[44.4%] w-1/2 overflow-hidden rounded-[80px_8px]">
            <img src={photos.laptop} alt="Persona trabajando con una laptop" className="h-full w-full object-cover will-change-transform" style={{ transform: "scale(calc(1 + var(--p, 0) * 0.2))" }} />
          </div>
          <div className="pointer-events-none absolute bottom-[18%] left-[18%] h-40 w-40 rounded-full bg-brand/50 blur-3xl" />
        </div>

        <div>
          <div className="mb-6 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
              <path d="M4 12 13 4l9 8v10H4V12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M11 22v-6h4v6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Thaloz<span className="font-semibold">House.</span>
          </div>
          <h2 className="max-w-md text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Our co-working and networking hub for techies
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
            In 2023, we inaugurated the Thaloz House, a space for co-working and lodging, tailored for our tech-savvy
            Thaloz community worldwide. Our goal is to simplify remote work, encourage team synergy, and offer a venue
            for hosting events—all in one place.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex rounded-full bg-brand px-6 py-3.5 text-[15px] text-white transition-colors duration-200 hover:bg-[#865fff]"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
