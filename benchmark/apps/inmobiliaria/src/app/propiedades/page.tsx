import { Suspense } from "react";
import Catalog from "@/components/Catalog";
import Footer from "@/components/Footer";

export const metadata = { title: "Propiedades — Umbral" };

export default function PropiedadesPage() {
  return (
    <>
      <Suspense>
        <Catalog />
      </Suspense>
      <Footer />
    </>
  );
}
