import "./globals.css";
import { Inter, Calistoga, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyDemoCTA } from "@/components/layout/StickyDemoCTA";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Calistoga({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANNA Reception — AI receptionist for dental, beauty, gastropubs & trades",
  description: "Stop losing revenue to missed calls. ANNA Reception answers, books, and follows up 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyDemoCTA />
      </body>
    </html>
  );
}
