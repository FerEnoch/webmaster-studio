import { PageHero } from "@/components/PageHero";
import { ServiceStory } from "@/components/Pages";

export const metadata = { title: "Servicios — ALTURA" };

export default function ServiciosPage() {
  return (
    <main>
      <PageHero kicker="Servicios" title={["Más que una tienda:", "una cava a tu medida."]} text="Catas privadas, eventos, regalos empresariales, cursos y asesoría para restaurantes. Todo con el mismo sommelier." />
      <ServiceStory />
    </main>
  );
}
