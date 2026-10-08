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

const phases = [{ label: "Basic" }, { label: "Data-Driven" }, { label: "AI-Driven" }];

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
          Welcome to the intersection of design, data, and human possibility!
        </h1>
        <p className="mt-7 max-w-xl text-lg font-medium leading-snug text-accent">
          My brother&apos;s developmental disability taught me to ask: how do
          we design services that actually meet human need?
        </p>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
          <p>
            Hi, all. I&apos;m Sangyun Lee – a strategic designer committed to
            bridging business innovation with social impact.
          </p>
          <p>
            Currently I&apos;m studying Integrated Product Design at the
            University of Pennsylvania. Previously, I worked in the Market
            Intelligence Team at Samsung Electronics, developing business
            insights and future strategies, and completed my Master&apos;s in
            Service Design, supported by a dual undergraduate background in
            Business Administration and Data Science. Before graduate school, I
            served as a lieutenant, leading organizational strategy and
            operational readiness.
          </p>
          <p>
            With all these backgrounds, I define myself as a data-driven
            strategic designer.
          </p>
          <p>
            Looking ahead, I aspire to become an AI-driven strategic designer
            &amp; entrepreneur.
          </p>
        </div>
      </section>

      <section className="relative border-t border-border py-14">
        <Eyebrow>Research area</Eyebrow>
        <div className="mt-6" />
        <div className="pointer-events-none absolute left-0 right-0 top-[7.5rem] hidden h-px bg-border sm:block" />
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
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          <p>My past experiences can be distilled into three phases.</p>
          <p>
            And now, I stand at a turning point—because I have begun to see new
            possibilities built upon those capabilities.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-muted">
          <p>
            Since childhood, I have carried a question shaped by my younger
            brother&apos;s developmental disability:{" "}
            <span className="text-foreground">
              &ldquo;How can we meaningfully improve the lives of people with
              disabilities?&rdquo;
            </span>{" "}
            This question led me to explore whether data-driven scientific
            methods and service-design frameworks could be applied to create
            sustainable solutions in disability contexts.
          </p>
          <p>
            The culmination of this inquiry was my graduate thesis,
            &ldquo;Data-driven disability persona augmentation for service
            journey inference,&rdquo; in which I analyzed and simulated the
            daily living performance of people with developmental disabilities
            through a structured, computational approach.
          </p>
          <p>The study followed these steps:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Conducting in-depth interviews with nine caregivers of individuals
              with developmental disabilities
            </li>
            <li>
              Augmenting the dataset to 2,400 profiles using the Vineland
              Adaptive Behavior Scales
            </li>
            <li>
              Deriving five disability personas through multidimensional
              clustering
            </li>
            <li>Training these personas into an AI persona model</li>
            <li>Applying them to 11 ADL/IADL-based daily scenarios</li>
            <li>
              Reproducing and analyzing where and why each persona requires
              support, using computational simulations
            </li>
          </ul>
          <p>
            This research went beyond modeling. It demonstrated the possibility
            of quantifying support needs, understanding behavioral patterns,
            and predicting service requirements across diverse daily contexts.
          </p>
          <p>
            Through this thesis and my earlier projects, I recognized two clear
            possibilities:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Persona definitions can be constructed with precision across
              various domains through data-driven methods.
            </li>
            <li>
              AI personas can be used to pre-validate real-world solutions
              before implementation.
            </li>
          </ul>
          <p>
            These two insights form a framework that extends far beyond the
            disability domain. I now believe they can be applied to any field
            where social innovation, human behavior, and complex service needs
            intersect.
          </p>
          <div className="pt-6">
            <h3 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              My Future
            </h3>
            <p className="mt-4">
              By strengthening this research and my own design framework, I
              envision building a world-class global company dedicated to
              disability innovation—one that stands alongside leaders like
              Samsung and Apple. At the same time, I aspire to create a
              strategic design consulting firm that drives breakthrough
              innovation, much like IDEO.
            </p>
            <p className="mt-5">
              If you&apos;d like to explore my long-term plans in more detail,
              please visit the{" "}
              <Link href="/vision" className="text-accent underline">
                Vision
              </Link>{" "}
              page.
            </p>
          </div>
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
        <p className="mt-8 font-serif text-2xl font-semibold text-foreground">
          See you anon!
        </p>
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
