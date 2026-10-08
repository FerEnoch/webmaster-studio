import { PageHero } from "@/components/PageHero";
import { Compare, Faq, Pricing } from "@/components/Pages";

export const metadata = { title: "Planes de salud — MANADA" };

export default function PlanesPage() {
  return (
    <main>
      <PageHero kicker="Planes de salud" title={["Cuidarlo todo el año,", "en una cuota."]} text="Vacunas, consultas ilimitadas y guardia con 50% off. Sin permanencia: te das de baja en un clic desde el botón de baja." />
      <Pricing />
      <Compare />
      <Faq />
    </main>
  );
}
