"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects, allDomains, allPhases, type Domain, type Phase } from "@/data/projects";
import { Tag, Card } from "@/components/ui";

const phaseStyle: Record<Phase, string> = {
  Basic: "bg-border text-muted",
  "Data-Driven": "bg-accent-soft text-accent",
  "AI-Driven": "bg-accent text-white",
};

export default function ProjectGrid() {
  const [domain, setDomain] = useState<Domain | "All">("All");

  const filtered = useMemo(
    () =>
      projects.filter((p) => domain === "All" || p.domains.includes(domain)),
    [domain]
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        <Tag active={domain === "All"} onClick={() => setDomain("All")}>
          All domains
        </Tag>
        {allDomains.map((d) => (
          <Tag key={d} active={domain === d} onClick={() => setDomain(d)}>
            {d}
          </Tag>
        ))}
      </div>

      <div className="space-y-16">
        {allPhases.map((phase) => {
          const items = filtered.filter((p) => p.phase === phase);
          if (items.length === 0) return null;
          return (
            <div key={phase}>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {phase}
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/project/${p.slug}`}
                    className="group block"
                  >
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
        })}
      </div>
    </div>
  );
}
