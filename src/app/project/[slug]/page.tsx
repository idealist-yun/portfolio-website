import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { Tag } from "@/components/ui";

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
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${phaseStyle[project.phase]}`}
        >
          {project.phase}
        </span>
        <span className="text-sm text-muted">{project.period}</span>
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-2 text-base text-muted">
        {project.org} · {project.location}
      </p>

      <p className="mt-8 text-lg leading-relaxed text-muted">
        {project.brief}
      </p>

      {project.images && project.images.length > 0 && (
        <div className="mt-8 space-y-4">
          {project.images.map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={src}
                alt={project.title}
                width={1400}
                height={900}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
            My Role
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {project.role}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
            Outcome
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-foreground">
            {project.outcome.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {project.sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {s.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p, j) => (
                <p key={j} className="text-base leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
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
