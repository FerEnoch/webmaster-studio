import { logos } from "@/lib/content";
import { ArrowUpRight } from "./Icons";
import Marquee from "./Marquee";
import { Reveal } from "./Reveal";

const fonts = [
  "font-black tracking-tighter",
  "font-serif italic font-bold",
  "font-extrabold uppercase tracking-widest text-base",
  "font-semibold lowercase",
  "font-mono font-bold",
];

export default function Logos() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:flex sm:items-center sm:gap-x-6 sm:px-8 md:px-12 lg:px-16">
      <Reveal className="mb-6 shrink-0 sm:mb-0 sm:w-56">
        <p className="text-xl leading-snug text-zinc-950">Global leaders trust InvGate</p>
        <a href="#" className="group mt-2 inline-flex items-center gap-1 text-sm text-indigo-600">
          Read case studies <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </Reveal>
      <Marquee duration={40} gap="gap-14" className="min-w-0 flex-1">
        {logos.map((l, i) => (
          <span
            key={l}
            className={`flex h-12 items-center text-xl whitespace-nowrap text-zinc-400 grayscale transition-colors duration-300 hover:text-zinc-950 ${fonts[i % fonts.length]}`}
          >
            {l}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
