import Link from "next/link";
import Image from "next/image";
import { profile } from "@/data/profile";
import { Eyebrow } from "@/components/ui";
import { research } from "@/data/research";
import { projects } from "@/data/projects";

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
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <Eyebrow>{profile.affiliation}</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
          At the intersection of design, data, and human possibility.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          I&apos;m {profile.name} ({profile.handle}) — a strategic designer
          committed to bridging business innovation with social impact. I
          define myself as a data-driven strategic designer, and I&apos;m
          working toward becoming an AI-driven strategic designer &amp;
          entrepreneur.
        </p>
      </section>

      <section className="border-t border-border py-14">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Featured Work
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {featuredWork.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent"
            >
              {item.image ? (
                <div className="aspect-[16/10] overflow-hidden border-b border-border">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] border-b border-border bg-accent-soft" />
              )}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
                  {item.tag}
                </p>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-accent">
                  {item.title} <span className="text-accent">→</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 border-t border-border py-14 sm:grid-cols-3">
        {[
          { label: "Basic", body: "Design thinking, internalized through consulting and service-design engagements across retail, public sector, and finance." },
          { label: "Data-Driven", body: "Quantitative persona modeling and behavioral analysis — extracting actionable insight from real usage and assessment data." },
          { label: "AI-Driven", body: "AI personas and simulation environments to pre-validate service strategies before they reach the real world." },
        ].map((phase) => (
          <Link
            key={phase.label}
            href={`/project?phase=${encodeURIComponent(phase.label)}`}
            className="group block"
          >
            <p className="font-serif text-xl font-semibold text-accent">
              {phase.label} <span className="group-hover:underline">→</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {phase.body}
            </p>
          </Link>
        ))}
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
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          About Me
        </h2>
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
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Where to go next
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {entryPoints.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <p className="font-serif text-lg font-semibold text-foreground group-hover:text-accent">
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
