"use client";

import { useEffect, useRef } from "react";
import { photos } from "@/lib/content";
import { inViewProgress, trackMotion } from "@/lib/scrollMotion";
import { GreekSeal } from "./GreekSeal";

const WORDS = ["trusted", "passionate", "dedicated", "innovative", "trusted"];

type Shot = { src: string; alt: string; className: string };

// Mismas clases que .hero-company_image-wrapper.is-image-N del original.
// La lista izquierda mide 22vw de ancho → cada foto 1.2 × 22vw de alto (padding-top:120%).
const leftList: Shot[] = [
  { src: photos.heroWoman, alt: "Persona del equipo", className: "w-[22vw]" },
  { src: photos.heroDesk, alt: "Mesa de trabajo", className: "relative left-[58vw] -mt-[46vw] w-[22vw]" },
  { src: photos.heroMeeting, alt: "", className: "relative left-[4vw] -mt-[5vw] w-[20vw]" },
  { src: photos.aboutFriends, alt: "", className: "relative left-[64vw] -mt-[45vw] w-[18vw]" },
];

// Lista derecha: 20vw de ancho → fotos de 24vw de alto, opacidad .75.
const rightList: Shot[] = [
  { src: photos.heroOffice, alt: "", className: "w-[20vw] opacity-75" },
  { src: photos.heroCode, alt: "", className: "relative right-[54vw] -mt-[44vw] w-[18vw] opacity-75" },
];

function Arch({ shot, height }: { shot: Shot; height: string }) {
  return (
    <div className={`relative shrink-0 ${shot.className}`} style={{ height }}>
      <img
        src={shot.src}
        alt={shot.alt}
        className="absolute inset-0 h-full w-full rounded-t-[50vw] object-cover"
      />
    </div>
  );
}

export function Hero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!trigger || !left || !right) return;
    const mobile = window.matchMedia("(max-width: 767px)");

    // "Header Company Windows [Scroll]": while scrolling in view del trigger
    // (empieza al entrar, termina al salir del todo), smoothing 90.
    // Desktop/tablet: izquierda 0 → -85%, derecha 0 → -60%. Mobile: ambas 10% → -85%.
    return trackMotion(
      () => inViewProgress(trigger, true, false),
      (p) => {
        const [l0, l1, r0, r1] = mobile.matches ? [10, -85, 10, -85] : [0, -85, 0, -60];
        left.style.transform = `translate3d(0, ${l0 + (l1 - l0) * p}%, 0)`;
        right.style.transform = `translate3d(0, ${r0 + (r1 - r0) * p}%, 0)`;
      },
      90,
    );
  }, []);

  return (
    <section className="relative h-[300vh] bg-[#0a0a0a] px-[5%]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[58%] h-[78vh] w-[78vh] -translate-x-1/2 rounded-full bg-[#5d00ee] blur-[150px]" />
          <div className="absolute left-1/2 top-[72%] h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-[#865fff] blur-[90px]" />
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1]">
          <div ref={leftRef} className="flex flex-col gap-[26vw] pt-[70vh] will-change-transform">
            {leftList.map((shot) => (
              <Arch key={shot.src} shot={shot} height="26.4vw" />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 z-0">
          <div ref={rightRef} className="flex flex-col items-end gap-[26vw] pt-[70vh] will-change-transform">
            {rightList.map((shot) => (
              <Arch key={shot.src} shot={shot} height="24vw" />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <GreekSeal className="pointer-events-none absolute left-1/2 top-[38%] w-[min(300px,42vw)] -translate-x-1/2 opacity-25" />
          <div className="relative max-w-4xl text-center">
            <h1 className="text-[clamp(3.4rem,7.2vw,5.75rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
              <span className="block">Your</span>
              <span className="relative mx-auto block h-[0.92em] overflow-hidden">
                <span className="invisible block">passionate</span>
                <span className="company-words absolute inset-x-0 top-0">
                  {WORDS.map((word, index) => (
                    <span key={`${word}-${index}`} className="block h-[0.92em]">
                      {word}
                    </span>
                  ))}
                </span>
              </span>
              <span className="block">tech partner</span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">
              We are a top nearshore partner, dedicated to collaborating with businesses on their digital journey,
              offering talent end-to-end solutions.
            </p>
          </div>
        </div>
      </div>
      <div ref={triggerRef} className="pointer-events-none absolute inset-0 -z-10 mt-[100vh]" />
    </section>
  );
}
