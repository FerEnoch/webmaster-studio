"use client";

import { useEffect, useRef } from "react";
import { photos, remotePeople } from "@/lib/content";
import { inViewProgress, trackMotion } from "@/lib/scrollMotion";
import { GreekSeal } from "./GreekSeal";

const titleFaces = remotePeople.slice(0, 3);

export function Remote() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    // "Remote Title [Scroll IN]": una sola vez, cuando el título entra un 15% en la ventana.
    // Arranca en -4.4rem y tras 500ms se abre a -2rem en 500ms easeInOut.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#07010f] py-8 pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2
          ref={titleRef}
          className="remote-title text-[clamp(3rem,6vw,5.2rem)] font-extrabold leading-[0.95] tracking-[-0.045em]"
        >
          <span className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span>Remote</span>
            <span className="inline-flex items-center">
              {titleFaces.map((person, index) => (
                <img
                  key={person.name}
                  src={person.image}
                  alt=""
                  className={`remote-avatar ${index === 1 ? "is-center" : ""}`}
                />
              ))}
            </span>
            <span>teams,</span>
          </span>
          <span className="mt-1 block">always connected</span>
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">
          At Thaloz, we are committed to a remote-first culture, where we acknowledge and appreciate the invaluable
          contributions of every team member. We believe in the flexibility of this approach, which allows us to
          maintain strong connections and collaboration, no matter where we are located.
        </p>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1200px] flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <h3 className="text-2xl font-bold sm:text-3xl">Interested in joining the Thaloz team?</h3>
        <a href="#" className="rounded-full bg-brand px-6 py-3.5 text-[15px] transition-colors duration-200 hover:bg-[#865fff]">
          View open positions
        </a>
      </div>
    </section>
  );
}

export function Impact() {
  const shots = [
    { src: photos.impactA, alt: "Encuentro con estudiantes en el espacio" },
    { src: photos.impactB, alt: "Evento de la comunidad tech" },
    { src: photos.impactC, alt: "Meetup de mujeres en tecnología" },
    { src: photos.impactD, alt: "Reunión en Thaloz House" },
  ];

  return (
    <section className="overflow-hidden bg-white py-20 text-black sm:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-3xl">
          <h2 className="text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Creating impact: our tech community journey
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            We are deeply committed to fostering a positive impact within the tech community. We believe in sharing
            experiences with our colleagues, inspiring others, and nurturing Thaloz House as a vibrant space for
            meaningful exchange and dialogue.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-semibold uppercase tracking-[0.14em] text-black/45">
          <li>Techy por el Día</li>
          <li>CUTI</li>
          <li>Arizona Technology Council</li>
          <li>HR Girls</li>
        </ul>
      </div>

      <div className="impact-marquee mt-12">
        {[0, 1].map((copy) => (
          <div className="impact-track" key={copy} aria-hidden={copy === 1}>
            {shots.map((shot) => (
              <img key={`${copy}-${shot.alt}`} src={shot.src} alt={copy === 0 ? shot.alt : ""} className="impact-shot" />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaArch({
  src,
  alt,
  className,
  lift,
}: {
  src: string;
  alt: string;
  className: string;
  lift: "up" | "down";
}) {
  return (
    <div
      className={`absolute overflow-hidden rounded-t-[720px] rounded-b-[8px] will-change-transform ${className}`}
      style={{
        transform:
          lift === "up"
            ? "translate3d(0, calc((1 - var(--p, 0)) * -15%), 0)"
            : "translate3d(0, calc((1 - var(--p, 0)) * 15%), 0)",
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover will-change-transform"
        style={{ transform: "scale(calc(1 + var(--p, 0) * 0.2))" }}
      />
    </div>
  );
}

export function Cta() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // "2 Image Parallax [While Scroll]": entra → borde superior arriba, smoothing 90.
    return trackMotion(
      () => inViewProgress(el, true, true),
      (value) => el.style.setProperty("--p", value.toFixed(4)),
      90,
    );
  }, []);

  return (
    <section id="contacto" className="relative overflow-hidden bg-[#07010f] py-24">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand/30 blur-[100px]" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <h2 className="max-w-xl text-[clamp(2.3rem,4.4vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Boost your business with our tech consulting services
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Partner with us for strategic consulting, access to top-tier talent, and seamless implementation of complex
            technologies.
          </p>
          <a href="mailto:hello@thaloz.com" className="mt-8 inline-flex rounded-full bg-brand px-6 py-3.5 transition-colors duration-200 hover:bg-[#865fff]">
            Contact Us
          </a>
        </div>

        <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[600px]">
          <div className="pointer-events-none absolute left-[17%] top-[17%] h-[65%] w-[65%] rounded-full bg-brand/45 blur-[80px]" />
          <GreekSeal className="pointer-events-none absolute right-0 top-0 w-1/2 opacity-40" />
          <CtaArch
            src={photos.house}
            alt=""
            lift="up"
            className="left-[7.5%] top-0 h-[75%] w-1/2"
          />
          <CtaArch
            src={photos.laptop}
            alt=""
            lift="down"
            className="left-[42.5%] top-[25.2%] h-[75%] w-1/2"
          />
        </div>
      </div>
    </section>
  );
}
