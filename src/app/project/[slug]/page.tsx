import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { Tag } from "@/components/ui";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const phaseStyle: Record<string, string> = {
  Basic: "bg-border text-muted",
  "Data-Driven": "bg-accent-soft text-accent",
  "AI-Driven": "bg-accent text-white",
};

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/project"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← All projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${phaseStyle[project.phase]}`}
        >
          {project.phase}
        </span>
        <span className="text-sm text-muted">{project.period}</span>
      </div>

      <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
        {project.title}
      </h1>
      <p className="mt-3 text-base text-muted">
        {project.org} · {project.location}
      </p>

      <p className="mt-9 max-w-2xl text-xl leading-relaxed text-foreground/80">
        {project.brief}
      </p>

      <div className="mt-10 grid gap-8 border-y border-border py-8 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
            My Role
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {project.role}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
            Outcome
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-foreground">
            {project.outcome.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 space-y-16">
        {project.sections.map((s, i) => (
          <Reveal key={i} delay={Math.min(i, 4) * 60}>
            <h2 className="font-serif text-sm font-bold uppercase tracking-[0.16em] text-accent">
              {s.heading}
            </h2>
            <div className="mt-4 h-px w-10 bg-accent" />
            <div className="mt-5 space-y-5">
              {s.body.map((item, j) =>
                typeof item === "string" ? (
                  <p
                    key={j}
                    className="max-w-2xl text-[17px] leading-[1.7] text-foreground/80"
                  >
                    {item}
                  </p>
                ) : (
                  <div
                    key={j}
                    className="overflow-hidden rounded-2xl border border-border shadow-[0_1px_3px_rgba(28,30,33,0.06)]"
                  >
                    <Image
                      src={item.img}
                      alt={project.title}
                      width={1400}
                      height={900}
                      className="h-auto w-full"
                    />
                  </div>
                )
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-2">
        {project.domains.map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
      </div>

      {project.note && (
        <div className="mt-10 rounded-xl border border-warm/40 bg-warm/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
            Editorial note (for review)
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {project.note}
          </p>
        </div>
      )}
    </div>
  );
}
