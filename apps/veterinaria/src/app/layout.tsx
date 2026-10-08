import type { Metadata } from "next";
import { BookingProvider } from "@/components/Booking";
import { Footer, Header } from "@/components/Chrome";
import SmoothScroll from "@/components/SmoothScroll";
import { TransitionProvider } from "@/components/Transition";
import "./globals.css";

export const metadata: Metadata = {
  title: "MANADA — Clínica veterinaria · Guardia 24 h",
  description:
    "Clínica veterinaria en Belgrano y Palermo. Guardia 24 h, consultorio felino, laboratorio propio, cirugía y peluquería. Turnos online en un minuto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap"
          rel="stylesheet"
        />
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
