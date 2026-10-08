import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Caveat, Bricolage_Grotesque, Pixelify_Sans } from "next/font/google";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-c" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });
const bric = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bric", weight: ["500", "700", "800"] });
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Concept — Yun Lee",
  robots: { index: false, follow: false },
};

export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${instrument.variable} ${mono.variable} ${hand.variable} ${bric.variable} ${pixel.variable}`}>
      {children}
    </div>
  );
}
