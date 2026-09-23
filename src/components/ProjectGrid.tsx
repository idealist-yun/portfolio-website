"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { projects, allDomains, allPhases, type Domain, type Phase } from "@/data/projects";
import { Tag, Card } from "@/components/ui";

const phaseStyle: Record<Phase, string> = {
  Basic: "bg-border text-muted",
  "Data-Driven": "bg-accent-soft text-accent",
  "AI-Driven": "bg-accent text-white",
};

function isPhase(value: string | null): value is Phase {
  return !!value && (allPhases as readonly string[]).includes(value);
}

export default function ProjectGrid() {
  const searchParams = useSearchParams();
  const requestedPhase = searchParams.get("phase");
  const [phase, setPhase] = useState<Phase>(
    isPhase(requestedPhase) ? requestedPhase : "Basic"
  );
  const [domain, setDomain] = useState<Domain | "All">("All");

  // Deep link from Home's phase cards (/project?phase=AI-Driven): follow the
  // URL if it changes (e.g. navigating here again from another phase card).
  useEffect(() => {
    if (isPhase(requestedPhase)) setPhase(requestedPhase);
  }, [requestedPhase]);

  const inPhase = useMemo(
    () => projects.filter((p) => p.phase === phase),
    [phase]
  );
  const filtered = useMemo(
    () => inPhase.filter((p) => domain === "All" || p.domains.includes(domain)),
    [inPhase, domain]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {allPhases.map((p) => (
          <button
            key={p}
            onClick={() => {
              setPhase(p);
              setDomain("All");
            }}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              phase === p
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Tag active={domain === "All"} onClick={() => setDomain("All")}>
          All ({inPhase.length})
        </Tag>
        {allDomains
          .filter((d) => inPhase.some((p) => p.domains.includes(d)))
          .map((d) => (
            <Tag key={d} active={domain === d} onClick={() => setDomain(d)}>
              {d} ({inPhase.filter((p) => p.domains.includes(d)).length})
            </Tag>
          ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((p) => (
          <Link key={p.slug} href={`/project/${p.slug}`} className="group block">
            <Card>
              {p.images && p.images[0] && (
                <div className="-mx-6 -mt-6 mb-4 aspect-[16/9] overflow-hidden rounded-t-2xl border-b border-border">
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${phaseStyle[p.phase]}`}
                >
                  {p.phase}
                </span>
                <span className="text-xs text-muted">{p.period}</span>
              </div>
              <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-accent">
                {p.title} <span className="text-accent">→</span>
              </h3>
              <p className="mt-1 text-sm text-muted">
                {p.org} · {p.location}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {p.brief}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.domains.map((d) => (
                  <Tag key={d}>{d}</Tag>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
