import Link from "next/link";
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
        {project.summary}
      </p>

      <ul className="mt-8 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted">
        {project.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-2">
        {project.domains.map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
      </div>
    </div>
  );
}
