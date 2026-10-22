import type { Metadata } from "next";
import { BookingProvider } from "@/components/Booking";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alba — Salud y estética",
  description: "Medicina estética, odontología, kinesiología, dermatología y depilación láser. Reservá tu turno online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SmoothScroll />
        <BookingProvider>
          <Header />
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
