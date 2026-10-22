import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import PropertyDetail from "@/components/PropertyDetail";
import { properties } from "@/lib/properties";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = properties.find((x) => x.slug === slug);
  return { title: p ? `${p.title} — Umbral` : "Propiedad — Umbral" };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = properties.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <PropertyDetail p={p} />
      <Footer />
    </>
  );
}
