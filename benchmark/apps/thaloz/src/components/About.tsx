import { photos } from "@/lib/content";

const frame = "w-full object-cover rounded-[16px_80px]";

export function About() {
  return (
    <section className="relative bg-[linear-gradient(180deg,#3a0d86_0%,#1a0633_38%,#07010f_100%)] pb-8 pt-16 sm:pt-24">
      <div className="mx-auto grid max-w-[1280px] items-start gap-x-16 gap-y-10 px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-[clamp(2.4rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em]">About us</h2>
          <img
            src={photos.aboutTeam}
            alt="Equipo reunido al aire libre"
            className={`${frame} mt-10 aspect-square`}
          />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-8">
            <img
              src={photos.aboutColumns}
              alt="Columnas clásicas"
              className={`${frame} mt-[50%] aspect-square`}
            />
            <img
              src={photos.aboutFriends}
              alt="Tres personas sonriendo"
              className={`${frame} mt-[25%] aspect-square`}
            />
          </div>
          <p className="mt-16 max-w-lg text-lg leading-relaxed text-white/90">
            We are a diverse team of{" "}
            <strong className="font-bold text-white">+100 passionate and talented experts</strong>. At Thaloz, we
            offer more than just a service. We become your dedicated tech partner, guiding you through every stage of
            your talent needs, from start to finish.
          </p>
        </div>
      </div>
      <div className="greek-rule mt-16 opacity-80" />
    </section>
  );
}
