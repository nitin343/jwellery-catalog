import type { Metadata, Viewport } from "next";
import { Cinzel, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurora Heritage Jewellers | Luxury 22K Gold & Diamond Catalog",
  description: "Bespoke 22K BIS Hallmarked gold jewellery, uncut Polki necklaces, and certified solitaire diamonds with direct WhatsApp ordering.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${playfair.variable} ${outfit.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..900&family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Italiana&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen pb-16 sm:pb-0 relative selection:bg-brand-gold selection:text-neutral-950">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
