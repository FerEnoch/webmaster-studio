import { PageHero } from "@/components/PageHero";
import { GuardiaBlock, ServiceStory } from "@/components/Pages";

export const metadata = { title: "Servicios y precios — MANADA" };

export default function ServiciosPage() {
  return (
    <main>
      <PageHero kicker="Servicios" title={["Todo lo que necesita,", "con precio a la vista."]} text="Consultas, vacunas, cirugía, odontología, imágenes, laboratorio, internación y peluquería. Sabés cuánto sale antes de venir." />
      <ServiceStory />
      <GuardiaBlock />
    </main>
  );
}
