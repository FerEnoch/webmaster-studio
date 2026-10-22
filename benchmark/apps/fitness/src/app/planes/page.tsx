import { PageHero } from "@/components/PageHero";
import { Faq, Pricing } from "@/components/Pages";

export const metadata = { title: "Planes — NÚCLEO" };

export default function PlanesPage() {
  return (
    <main>
      <PageHero kicker="Planes" title={["Precio claro.", "Sin permanencia."]} text="Sin matrícula, sin contratos eternos. Si te vas, te vas en un clic desde el botón de baja." />
      <Pricing />
      <Faq />
    </main>
  );
}
