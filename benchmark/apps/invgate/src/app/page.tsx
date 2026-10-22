import Header from "@/components/Header";
import Hero from "@/components/Hero";
import News from "@/components/News";
import Logos from "@/components/Logos";
import UseCases from "@/components/UseCases";
import Products from "@/components/Products";
import Bento from "@/components/Bento";
import Testimonials from "@/components/Testimonials";
import Resources from "@/components/Resources";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <News />
        <Logos />
        <UseCases />
        <Products />
        <Bento />
        <Testimonials />
        <Resources />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
