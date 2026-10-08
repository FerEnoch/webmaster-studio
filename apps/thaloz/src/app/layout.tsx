import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "About us | Thaloz",
  description:
    "We are a top nearshore partner, dedicated to collaborating with businesses on their digital journey, offering talent end-to-end solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
