import { PageHero } from "@/components/PageHero";
import { CellarBanner, Store } from "@/components/Pages";

export const metadata = { title: "La cava — ALTURA" };

export default function VinosPage() {
  return (
    <main>
      <PageHero kicker="La cava" title={["Vinos de altura,", "de bodegas chicas."]} text="Una selección de productores de Maipú, Luján de Cuyo y el Valle de Uco. Envío gratis desde 6 botellas a todo el país." />
      <Store />
      <CellarBanner />
    </main>
  );
}
