import { PageHeader, Card, SectionHeading } from "@/components/ui";
import {
  visionIntro,
  visionOrigin,
  levels,
  coreSkills,
  phases,
  impact,
} from "@/data/vision";

export default function VisionPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader eyebrow="Vision" title={visionIntro} />

      <section className="mb-16 max-w-3xl">
        <p className="text-xl leading-relaxed text-foreground/80">
          {visionOrigin}
        </p>
      </section>

      <section className="mb-16">
        <SectionHeading>Three levels</SectionHeading>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {levels.map((l) => (
            <div key={l.level}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
                {l.level}
              </p>
              <p className="mt-2 font-serif text-xl font-semibold leading-snug tracking-tight text-foreground">
                {l.title}
              </p>
              <p className="mt-2 text-base leading-relaxed text-muted">
                {l.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading>Core capabilities</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Built on what I&apos;ve developed so far, and what I&apos;ll continue
          to build through graduate study, my future practice will deliver
          three core capabilities across disability, healthcare, consumer
          experience, robotics, military systems, and public service design.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {coreSkills.map((s) => (
            <Card key={s.n}>
              <p className="font-serif text-2xl font-semibold text-accent">
                {s.n}
              </p>
              <p className="mt-2 font-medium text-foreground">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading>Long-term roadmap</SectionHeading>
        <div className="mt-8 space-y-8">
          {phases.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
                {p.label}
              </p>
              <p className="mt-1 font-serif text-xl font-semibold text-foreground">
                {p.title}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                {p.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading>Anticipated impact</SectionHeading>
        <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-base leading-relaxed text-muted">
          {impact.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
