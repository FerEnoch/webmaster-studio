import type { Metadata } from "next";
import { BookingProvider } from "@/components/Booking";
import { Footer, Header } from "@/components/Chrome";
import SmoothScroll from "@/components/SmoothScroll";
import { TransitionProvider } from "@/components/Transition";
import "./globals.css";

export const metadata: Metadata = {
  title: "NÚCLEO — Entrenar acá se siente distinto",
  description: "Estudio de entrenamiento boutique en Palermo, Belgrano y Núñez. Fuerza, HIIT, cycling, pilates reformer y boxeo. Primera clase gratis, sin permanencia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <SmoothScroll />
        <TransitionProvider>
          <BookingProvider>
            <Header />
            {children}
            <Footer />
          </BookingProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
