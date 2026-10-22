"use client";

import { useEffect, useRef } from "react";
import { photos } from "@/lib/content";
import { inViewProgress, trackMotion } from "@/lib/scrollMotion";

function Portrait({
  src,
  name,
  role,
  side,
}: {
  src: string;
  name: string;
  role: string;
  side: "left" | "right";
}) {
  const fromAbove = side === "left";
  return (
    <figure
      className={`relative w-[90%] will-change-transform ${side === "right" ? "mt-[25%]" : ""}`}
      style={{
        transform: fromAbove
          ? "translate3d(0, calc((1 - var(--p, 0)) * -15%), 0)"
          : "translate3d(0, calc((1 - var(--p, 0)) * 15%), 0)",
      }}
    >
      <img src={src} alt="" className="aspect-[296/615] w-full rounded-[28px] object-cover" />
      <figcaption
        className={`absolute w-[95%] rounded-2xl border border-white/15 bg-[radial-gradient(circle,rgba(73,73,73,0.3),rgba(73,73,73,0.5))] px-[5%] py-[5%] shadow-[0_2px_1rem_rgba(0,0,0,0.5)] backdrop-blur-xl will-change-transform ${
          side === "right" ? "-right-[5%] -top-[5%]" : "-left-[5%] bottom-[5%]"
        }`}
        style={{
          transform: fromAbove
            ? "translate3d(0, calc((1 - var(--p, 0)) * -100%), 0)"
            : "translate3d(0, calc((1 - var(--p, 0)) * 100%), 0)",
        }}
      >
        <div className="text-[15px] font-bold leading-tight">{name}</div>
        <div className="text-xs text-white/80">{role}</div>
      </figcaption>
    </figure>
  );
}

export function HowWeStarted() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // "beggining [Scrolling]": empieza al entrar, termina cuando el borde superior
    // llega arriba de la ventana; smoothing 85.
    return trackMotion(
      () => inViewProgress(el, true, true),
      (value) => el.style.setProperty("--p", value.toFixed(4)),
      85,
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#07010f] py-20 sm:py-28">
      <div className="pointer-events-none absolute right-[18%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/40 blur-[90px]" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 px-6 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div className="max-w-xl">
          <h2 className="text-[clamp(2.4rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em]">How we started</h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-white/85">
            <p>
              Both of our founders are technology enthusiasts with backgrounds in business and administration. They
              founded Thaloz with a firm belief in the transformative power of technology for businesses.
            </p>
            <p>
              Focused on assembling teams with Latin American talent, Thaloz has expanded its scope to deliver a range
              of solutions—providing top nearshore talent to multiple clients, including Fortune 500 companies.
            </p>
          </div>
        </div>

        <div ref={ref} className="relative mx-auto grid w-full max-w-[600px] grid-cols-2 pl-[15%]">
          <Portrait src={photos.founderA} name="Sebastián Martínez" role="CEO & Co-Founder" side="left" />
          <Portrait src={photos.founderB} name="Pablo García" role="CIO & Co-Founder" side="right" />
        </div>
      </div>
    </section>
  );
}
