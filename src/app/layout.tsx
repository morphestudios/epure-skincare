import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ÉPURE Skincare",
    template: "%s · ÉPURE Skincare",
  },
  description:
    "ÉPURE — clinical minimalism with warm sensory luxury. Edited skincare rituals, priced in ZAR.",
  metadataBase: new URL("https://epure.studio"),
  openGraph: {
    title: "ÉPURE Skincare",
    description:
      "Quiet formulas for considered skin. A Cape Town skincare house.",
    type: "website",
    locale: "en_ZA",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col overflow-x-hidden antialiased">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-espresso focus:px-4 focus:py-2 focus:text-ivory"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
