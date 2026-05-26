import "./globals.css";
import { Inter, Calistoga } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Calistoga({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "ANNA Reception — AI receptionist for dental, beauty, gastropubs & trades",
  description: "Stop losing revenue to missed calls. ANNA Reception answers, books, and follows up 24/7.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
