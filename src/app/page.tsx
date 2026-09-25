import Link from "next/link";
import Image from "next/image";
import { profile } from "@/data/profile";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { research } from "@/data/research";
import { projects } from "@/data/projects";

const phaseStyle: Record<string, string> = {
  Basic: "bg-border text-muted",
  "Data-Driven": "bg-accent-soft text-accent",
  "AI-Driven": "bg-accent text-white",
};

const phases = [
  {
    label: "Basic",
    body: "Design thinking, internalized through consulting and service-design engagements across retail, public sector, and finance.",
  },
  {
    label: "Data-Driven",
    body: "Quantitative persona modeling and behavioral analysis — extracting actionable insight from real usage and assessment data.",
  },
  {
    label: "AI-Driven",
    body: "AI personas and simulation environments to pre-validate service strategies before they reach the real world.",
  },
];

const featuredWork = [
  {
    tag: "Disability Service Design",
    ...(() => {
      const r = research.find(
        (r) => r.slug === "disability-persona-augmentation"
      )!;
      return {
        href: `/research/${r.slug}`,
        title: r.title,
        body: r.summary,
        image: r.images?.[0],
      };
    })(),
  },
  {
    tag: "Simulation",
    ...(() => {
      const r = research.find((r) => r.slug === "idd-agent-simulation")!;
      return {
        href: `/research/${r.slug}`,
        title: r.title,
        body: r.summary,
        image: r.images?.[0],
      };
    })(),
  },
  {
    tag: "Human-Robot Interaction",
    ...(() => {
      const p = projects.find((p) => p.slug === "vip-concierge-robot")!;
      return {
        href: `/project/${p.slug}`,
        title: p.title,
        body: p.brief,
        image: p.images?.[0],
      };
    })(),
  },
];

const entryPoints = [
  {
    href: "/research",
    label: "Research",
    body: "Published work and an ongoing research pipeline on disability, simulation, and AI agents — for labs and collaborators.",
  },
  {
    href: "/project",
    label: "Project",
    body: "Case studies across retail, healthcare, public sector, and military — evidence of applied strategic design work.",
  },
  {
    href: "/resume",
    label: "Resume & Contact",
    body: "Full career history, downloadable resume, and how to reach me.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24">
        <Eyebrow>{profile.affiliation}</Eyebrow>
        <h1 className="mt-5 max-w-4xl font-serif text-6xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-7xl">
          At the intersection of design, data, and human possibility.
        </h1>
        <p className="mt-7 max-w-xl text-lg font-medium leading-snug text-accent">
          My brother&apos;s developmental disability taught me to ask: how do
          we design services that actually meet human need?
        </p>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          I&apos;m {profile.name} ({profile.handle}) — a strategic designer
          working from data-driven service design toward AI-driven
          simulation &amp; entrepreneurship.
        </p>
      </section>

      <section className="relative border-t border-border py-14">
        <div className="pointer-events-none absolute left-0 right-0 top-20 hidden h-px bg-border sm:block" />
        <div className="grid gap-10 sm:grid-cols-3">
          {phases.map((phase, i) => (
            <Link
              key={phase.label}
              href={`/project?phase=${encodeURIComponent(phase.label)}`}
              className="group relative block"
            >
              <span
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full font-serif text-sm font-bold ${phaseStyle[phase.label]}`}
              >
                0{i + 1}
              </span>
              <p className="mt-5 font-serif text-xl font-semibold text-foreground group-hover:text-accent">
                {phase.label}{" "}
                <span className="text-accent group-hover:underline">→</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {phase.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted">
          <p>
            Since childhood, I have carried a question shaped by my younger
            brother&apos;s developmental disability:{" "}
            <span className="text-foreground">
              &ldquo;How can we meaningfully improve the lives of people with
              disabilities?&rdquo;
            </span>{" "}
            That question led me to explore whether data-driven scientific
            methods and service-design frameworks could create sustainable
            solutions in disability contexts.
          </p>
          <p>
            The culmination of this inquiry so far was my graduate thesis on
            data-driven disability persona augmentation — analyzing and
            simulating the daily-living performance of people with
            developmental disabilities through a structured, computational
            approach. I&apos;m now extending that work into an AI-agent
            simulation testbed at Penn, and applying the same
            persona-and-simulation framework beyond disability, to any field
            where social innovation, human behavior, and complex service
            needs intersect.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <SectionHeading>Featured Work</SectionHeading>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {featuredWork.map((item, i) => {
            const featured = i === 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group block overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent ${
                  featured ? "sm:row-span-2 sm:flex sm:flex-col" : ""
                }`}
              >
                {item.image ? (
                  <div
                    className={`overflow-hidden border-b border-border ${
                      featured ? "aspect-[4/3] sm:flex-1" : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={featured ? 1200 : 800}
                      height={featured ? 900 : 500}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`border-b border-border bg-accent-soft ${
                      featured ? "aspect-[4/3] sm:flex-1" : "aspect-[16/10]"
                    }`}
                  />
                )}
                <div className={featured ? "p-8" : "p-6"}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
                    {item.tag}
                  </p>
                  <p
                    className={`mt-2 font-serif font-semibold leading-snug tracking-tight text-foreground group-hover:text-accent ${
                      featured ? "text-2xl sm:text-3xl" : "text-xl"
                    }`}
                  >
                    {item.title} <span className="text-accent">→</span>
                  </p>
                  <p
                    className={`mt-2 leading-relaxed text-muted ${
                      featured ? "text-base" : "text-sm"
                    }`}
                  >
                    {item.body}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border py-14">
        <SectionHeading>About Me</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Beyond my work, I enjoy traveling, playing the piano, running, and
          reading — moments that help me reset, think clearly, and stay
          creative. I also love meeting new people and connecting with
          others, so I genuinely look forward to the day our paths cross.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <Image
            src="/images/about-collage.png"
            alt="Snapshots of Yun traveling, surfing, playing piano, and running a marathon"
            width={1520}
            height={744}
            className="w-full h-auto"
          />
        </div>
      </section>

      <section className="border-t border-border py-14">
        <SectionHeading>Where to go next</SectionHeading>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {entryPoints.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <p className="font-serif text-xl font-semibold tracking-tight text-foreground group-hover:text-accent">
                {e.label} →
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {e.body}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
