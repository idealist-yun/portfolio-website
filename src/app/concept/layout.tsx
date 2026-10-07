import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Caveat } from "next/font/google";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-c" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

export const metadata: Metadata = {
  title: "Concept — Yun Lee",
  robots: { index: false, follow: false },
};

export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${instrument.variable} ${mono.variable} ${hand.variable}`}>
      {children}
    </div>
  );
}
