import type { Metadata } from "next";
import ConceptFonts from "@/components/concept/ConceptFonts";

export const metadata: Metadata = {
  title: "Concept — Ian Lee",
  robots: { index: false, follow: false },
};

export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return <ConceptFonts>{children}</ConceptFonts>;
}
