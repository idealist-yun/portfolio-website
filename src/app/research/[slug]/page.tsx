import Link from "next/link";
import { notFound } from "next/navigation";
import { research } from "@/data/research";
import { Tag } from "@/components/ui";

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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/research"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← All research
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[item.status]}`}
        >
          {item.status}
        </span>
        {(item.venue || item.date) && (
          <span className="text-sm text-muted">
            {[item.venue, item.date].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        {item.title}
      </h1>

      <p className="mt-8 text-lg leading-relaxed text-muted">
        {item.summary}
      </p>

      {item.bullets && (
        <ul className="mt-8 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          View publication →
        </a>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        {item.topics.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </div>
  );
}
