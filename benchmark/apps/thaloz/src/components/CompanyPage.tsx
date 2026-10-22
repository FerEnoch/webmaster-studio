import { About } from "@/components/About";
import { Coworking } from "@/components/Coworking";
import { Cta, Impact, Remote } from "@/components/Remote";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowWeStarted } from "@/components/HowWeStarted";
import { Leaders } from "@/components/Leaders";

export function CompanyPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <HowWeStarted />
        <Coworking />
        <Leaders />
        <Remote />
        <Impact />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
