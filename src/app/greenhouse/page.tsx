import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui";
import GreenhouseScene from "@/components/GreenhouseScene";
import GreenhouseSceneToBe from "@/components/GreenhouseSceneToBe";

export const metadata: Metadata = {
  title: "The Greenhouse — Ian Lee",
  description:
    "A stylized 3D model of Gregory College House's Greenhouse, built from site observations, photos and a sensory and social map.",
};

export default function GreenhousePage() {
  return (
    <div>
      <header className="px-6 pb-8 pt-12 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>IPD5280 · Design for Contemporary Accessibility</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            The Greenhouse, as it is today.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/75">
            A stylized model of the Gregory College House Greenhouse and the
            rooms around it, built from my site visits, photos and sensory and
            social map.
          </p>
        </div>
      </header>
      <div className="px-6 pb-3">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>As-Is</Eyebrow>
        </div>
      </div>
      <section className="relative h-[72vh] min-h-[420px] w-full overflow-hidden border-y border-border">
        <GreenhouseScene />
        <p className="pointer-events-none absolute bottom-4 left-6 text-xs text-muted">
          Drag to rotate · scroll to zoom · tap a red dot for a photo · not to scale
        </p>
      </section>
      <div className="px-6 pb-3 pt-12">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>To-Be</Eyebrow>
          <p className="mt-2 max-w-xl text-sm text-foreground/70">
            The redesign. Starts as a copy of the As-Is model.
          </p>
        </div>
      </div>
      <section className="relative h-[72vh] min-h-[420px] w-full overflow-hidden border-y border-border">
        <GreenhouseSceneToBe />
        <p className="pointer-events-none absolute bottom-4 left-6 text-xs text-muted">
          Drag to rotate · scroll to zoom · tap a red dot for a photo · not to scale
        </p>
      </section>
    </div>
  );
}
