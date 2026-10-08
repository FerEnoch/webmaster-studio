import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome";
import { ShopProvider } from "@/components/Shop";
import SmoothScroll from "@/components/SmoothScroll";
import { TransitionProvider } from "@/components/Transition";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALTURA — Vinos & Viajes · Mendoza",
  description: "Boutique de vinos de altura en Mendoza. Tienda online con envíos a todo el país, viajes por el Valle de Uco, Luján y Maipú, catas privadas y club de vinos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SmoothScroll />
        <TransitionProvider>
          <ShopProvider>
            <Header />
            {children}
            <Footer />
          </ShopProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
