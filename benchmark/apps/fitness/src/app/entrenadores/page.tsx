import { PageHero } from "@/components/PageHero";
import { Coaches } from "@/components/Pages";

export const metadata = { title: "Coaches — NÚCLEO" };

export default function EntrenadoresPage() {
  return (
    <main>
      <PageHero kicker="El equipo" title={["Gente que", "sabe."]} text="Coaches certificados que te miran, te corrigen y se acuerdan de tu nombre. Pasá el mouse para verlos en acción." />
      <Coaches />
    </main>
  );
}
