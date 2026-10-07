import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { relatedFor } from "@/data/projectMeta";
import Reveal from "@/components/Reveal";
import Body from "@/components/Body";

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
  const related = relatedFor(slug)
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is (typeof projects)[number] => !!p);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
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

      <p className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-warm">
        The Brief:
      </p>
      <p className="mt-2 max-w-3xl text-xl leading-relaxed text-foreground/80">
        {project.brief}
      </p>

      <div className="mt-10 grid gap-8 border-y border-border py-8 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
            My Role:
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {project.role}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warm">
            Outcome:
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
            <Body items={s.body} alt={project.title} />
          </Reveal>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-20 border-t border-border pt-10">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Want to check more?
          </h2>
          <p className="mt-2 text-base text-muted">Discover my other projects.</p>
          <ul className="mt-6 space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/project/${r.slug}`}
                  className="text-base text-accent hover:underline"
                >
                  {r.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
