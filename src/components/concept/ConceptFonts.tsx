import { Instrument_Serif, JetBrains_Mono, Caveat, Bricolage_Grotesque, Pixelify_Sans, DM_Serif_Display } from "next/font/google";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-c" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });
const bric = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bric", weight: ["500", "700", "800"] });
const dm = DM_Serif_Display({ subsets: ["latin"], variable: "--font-dm", weight: "400", style: ["normal", "italic"] });
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", weight: ["400", "600"] });

export default function ConceptFonts({ children }: { children: React.ReactNode }) {
  return <div className={`${instrument.variable} ${mono.variable} ${hand.variable} ${bric.variable} ${pixel.variable} ${dm.variable}`}>{children}</div>;
}
