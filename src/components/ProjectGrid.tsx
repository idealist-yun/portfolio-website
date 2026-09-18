"use client";

import { useMemo, useState } from "react";
import { projects, allDomains, allPhases, type Domain, type Phase } from "@/data/projects";
import { Tag, Card } from "@/components/ui";

const phaseStyle: Record<Phase, string> = {
  Basic: "bg-border text-muted",
  "Data-Driven": "bg-accent-soft text-accent",
  "AI-Driven": "bg-accent text-white",
};

export default function ProjectGrid() {
  const [domain, setDomain] = useState<Domain | "All">("All");
  const [phase, setPhase] = useState<Phase | "All">("All");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (domain === "All" || p.domains.includes(domain)) &&
          (phase === "All" || p.phase === phase)
      ),
    [domain, phase]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Tag active={phase === "All"} onClick={() => setPhase("All")}>
          All stages
        </Tag>
        {allPhases.map((p) => (
          <Tag key={p} active={phase === p} onClick={() => setPhase(p)}>
            {p}
          </Tag>
        ))}
      </div>
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

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((p) => (
          <Card key={p.slug}>
            <div className="flex items-start justify-between gap-3">
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${phaseStyle[p.phase]}`}
              >
                {p.phase}
              </span>
              <span className="text-xs text-muted">{p.period}</span>
            </div>
            <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-foreground">
              {p.title}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {p.org} · {p.location}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {p.summary}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
              {p.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.domains.map((d) => (
                <Tag key={d}>{d}</Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
