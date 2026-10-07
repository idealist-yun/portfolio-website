import Link from "next/link";
import Body from "@/components/Body";
import { notFound } from "next/navigation";
import { research } from "@/data/research";
import { Tag } from "@/components/ui";
import LabEmbed from "@/components/LabEmbed";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return research.map((r) => ({ slug: r.slug }));
}

const statusStyle: Record<string, string> = {
  Published: "bg-accent text-white",
  "In Progress": "bg-warm text-white",
  Planned: "bg-border text-muted",
};

export default async function ResearchDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = research.find((r) => r.slug === slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/research"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← All research
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${statusStyle[item.status]}`}
        >
          {item.status}
        </span>
        {(item.venue || item.date) && (
          <span className="text-sm text-muted">
            {[item.venue, item.date].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>

      <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
        {item.title}
      </h1>

      {item.collaborators && (
        <p className="mt-3 text-sm italic text-muted">{item.collaborators}</p>
      )}

      {item.fromOriginal && (
        <p className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-warm">
          The Brief:
        </p>
      )}
      <p
        className={`${item.fromOriginal ? "mt-2" : "mt-9"} max-w-3xl text-xl leading-relaxed text-foreground/80`}
      >
        {item.summary}
      </p>

      {item.demo && <LabEmbed href={item.demo.href} />}

      <div className="mt-16 space-y-16">
        {item.sections.map((s, i) => (
          <Reveal key={i} delay={Math.min(i, 4) * 60}>
            <h2 className="font-serif text-sm font-bold uppercase tracking-[0.16em] text-accent">
              {s.heading}
            </h2>
            <div className="mt-4 h-px w-10 bg-accent" />
            <Body items={s.body} alt={item.title} />
          </Reveal>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-2">
        {item.topics.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

    </div>
  );
}
