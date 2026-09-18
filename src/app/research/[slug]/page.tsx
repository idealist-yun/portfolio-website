import Link from "next/link";
import Image from "next/image";
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

      {item.collaborators && (
        <p className="mt-2 text-sm italic text-muted">{item.collaborators}</p>
      )}

      <p className="mt-8 text-lg leading-relaxed text-muted">
        {item.summary}
      </p>

      {item.images && item.images.length > 0 && (
        <div className="mt-8 space-y-4">
          {item.images.map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={src}
                alt={item.title}
                width={1400}
                height={900}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-8">
        {item.sections.map((s, i) => (
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
        {item.topics.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </div>
  );
}
