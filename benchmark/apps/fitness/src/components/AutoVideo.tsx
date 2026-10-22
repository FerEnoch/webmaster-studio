"use client";

import { useEffect, useRef, useState } from "react";
import { poster, video } from "@/lib/content";

/**
 * Video de fondo silenciado en loop: solo se reproduce cuando está en pantalla
 * (ahorra datos y batería) y muestra el póster mientras carga.
 */
export default function AutoVideo({
  id,
  className = "",
  playing = true,
  rate = 1,
}: {
  id: number;
  className?: string;
  /** Permite pausarlo desde afuera (por ejemplo, en un hover). */
  playing?: boolean;
  rate?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.playbackRate = rate;
    if (visible && playing) el.play().catch(() => {});
    else el.pause();
  }, [visible, playing, rate]);

  return (
    <div className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster(id)}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <video
        ref={ref}
        src={visible ? video(id) : undefined}
        muted
        loop
        playsInline
        preload="none"
        onCanPlay={() => setReady(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
