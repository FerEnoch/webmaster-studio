import BeforeAfter from "@/components/BeforeAfter";
import BuildSection from "@/components/BuildSection";
import { Contact, Footer, Testimonials } from "@/components/Contact";
import FloorPlan from "@/components/FloorPlan";
import Header from "@/components/Header";
import Manifesto from "@/components/Manifesto";
import Preloader from "@/components/Preloader";
import Process from "@/components/Process";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <BuildSection />
        <Manifesto />
        <Projects />
        <BeforeAfter />
        <FloorPlan />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
