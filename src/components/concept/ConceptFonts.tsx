import { Instrument_Serif, Caveat, Bricolage_Grotesque, Pixelify_Sans } from "next/font/google";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });
const bric = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bric", weight: ["500", "700", "800"] });
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", weight: ["400", "600"] });

export default function ConceptFonts({ children }: { children: React.ReactNode }) {
  return <div className={`${instrument.variable} ${hand.variable} ${bric.variable} ${pixel.variable}`}>{children}</div>;
}
