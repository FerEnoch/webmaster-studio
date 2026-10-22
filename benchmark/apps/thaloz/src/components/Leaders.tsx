import { leaders } from "@/lib/content";

function LinkedIn() {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-sm font-bold">
      in
    </span>
  );
}

function TeamPhoto({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="h-full w-full object-cover object-top" />;
}

export function Leaders() {
  return (
    <section className="bg-[#07010f] py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-2xl text-white/90">Thaloz Management Team</p>
          <h2 className="mt-3 text-[clamp(2.3rem,4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Meet the leaders that make it possible
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Get to know some of our talented experts fueling Thaloz&apos;s growth, all with one objective in common:
            propelling Thaloz forward and consistently delivering top-notch solutions with a people-centric focus.
          </p>
        </div>

        <ul className="mt-16 grid justify-items-center gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((person) => (
            <li key={person.name} className="w-full max-w-[316px]">
              <article>
                <div className="h-[320px] overflow-hidden rounded-t-[720px]">
                  <TeamPhoto src={person.image} alt="" />
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{person.name}</h3>
                    <p className="text-sm text-white/65">{person.role}</p>
                  </div>
                  <a href="#" aria-label={`LinkedIn de ${person.name}`} className="shrink-0">
                    <LinkedIn />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
