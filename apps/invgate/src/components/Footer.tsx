import { footer } from "@/lib/content";
import { Logo } from "./Icons";
import { Reveal } from "./Reveal";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-screen-2xl gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.3fr_3fr] lg:px-16">
        <Reveal>
          <Logo className="text-zinc-950" />
          <p className="mt-4 max-w-xs text-sm text-zinc-600">The IT Management platform for an AI-enabled world.</p>
          <form className="mt-6 flex max-w-sm gap-2" action="#">
            <input
              type="email"
              placeholder="Your work email"
              className="min-w-0 flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
            <button type="button" className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
              Subscribe
            </button>
          </form>
        </Reveal>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footer.map((col, i) => (
            <Reveal key={col.heading} delay={i * 0.06}>
              <p className="mb-4 text-sm font-semibold text-zinc-950">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="group relative text-sm text-zinc-600 transition-colors hover:text-zinc-950">
                      {l}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-zinc-950 transition-transform duration-300 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-screen-2xl flex-col justify-between gap-2 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-8 lg:px-16">
          <span>© 2026 InvGate. Réplica de estudio.</span>
          <span className="flex gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
