import Footer from "@/components/Footer";
import HeroWalk from "@/components/HeroWalk";
import { Featured, LandSection, MapSection, TryTour, Valuation } from "@/components/Home";

export default function Page() {
  return (
    <>
      <main>
        <HeroWalk />
        <Featured />
        <TryTour />
        <LandSection />
        <MapSection />
        <Valuation />
      </main>
      <Footer />
    </>
  );
}
