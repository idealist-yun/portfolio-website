"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { projects, allPhases, type Phase } from "@/data/projects";
import { research } from "@/data/research";
import { phaseGroups, projectGroup, thesisCard } from "@/data/projectMeta";
import { Tag, Card } from "@/components/ui";

const phaseStyle: Record<Phase, string> = {
  Basic: "bg-border text-muted",
  "Data-Driven": "bg-accent-soft text-accent",
  "AI-Driven": "bg-accent text-white",
};

function isPhase(value: string | null): value is Phase {
  return !!value && (allPhases as readonly string[]).includes(value);
}

type Entry = {
  key: string;
  href: string;
  group: string;
  phase: Phase;
  title: string;
  meta: string;
  period?: string;
  brief: string;
  image?: string;
};

const thesis = research.find((r) => r.slug === "disability-persona-augmentation")!;

const entries: Entry[] = [
  ...projects.map((p) => ({
    key: p.slug,
    href: `/project/${p.slug}`,
    group: projectGroup[p.slug],
    phase: p.phase,
    title: p.title,
    meta: `${p.org} · ${p.location}`,
    period: p.period,
    brief: p.brief,
    image: p.images?.[0],
  })),
  {
    key: "thesis",
    href: thesisCard.href,
    group: thesisCard.group,
    phase: "AI-Driven" as Phase,
    title: thesis.title,
    meta: [thesis.venue, thesis.date].filter(Boolean).join(" · "),
    brief: thesis.summary,
    image: thesis.images?.[0],
  },
];

export default function ProjectGrid() {
  const searchParams = useSearchParams();
  const requestedPhase = searchParams.get("phase");
  const [phase, setPhase] = useState<Phase>(
    isPhase(requestedPhase) ? requestedPhase : "Basic"
  );
  const [group, setGroup] = useState<string>("all");

  useEffect(() => {
    if (isPhase(requestedPhase)) setPhase(requestedPhase);
  }, [requestedPhase]);

  const groups = phaseGroups[phase];
  const inPhase = useMemo(
    () => entries.filter((e) => e.phase === phase),
    [phase]
  );
  const showChips = phase !== "AI-Driven";

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {allPhases.map((p) => (
          <button
            key={p}
            onClick={() => {
              setPhase(p);
              setGroup("all");
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

      {showChips && (
        <div className="mb-10 flex flex-wrap gap-2">
          <Tag active={group === "all"} onClick={() => setGroup("all")}>
            ALL ({inPhase.length})
          </Tag>
          {groups.map((g) => (
            <Tag key={g.key} active={group === g.key} onClick={() => setGroup(g.key)}>
              {g.chip} ({inPhase.filter((e) => e.group === g.key).length})
            </Tag>
          ))}
        </div>
      )}

      <div className="space-y-14">
        {groups.map((g) => {
          const items = inPhase.filter(
            (e) => e.group === g.key && (group === "all" || group === g.key)
          );
          if (items.length === 0) return null;
          return (
            <section key={g.key}>
              <h2 className="font-serif text-sm font-bold uppercase tracking-[0.16em] text-accent">
                {g.title}
              </h2>
              <div className="mt-4 h-px w-10 bg-accent" />
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {items.map((p) => (
                  <Link key={p.key} href={p.href} className="group block">
                    <Card>
                      {p.image && (
                        <div className="-mx-6 -mt-6 mb-4 aspect-[16/9] overflow-hidden rounded-t-2xl border-b border-border">
                          <Image
                            src={p.image}
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
                        {p.period && (
                          <span className="text-xs text-muted">{p.period}</span>
                        )}
                      </div>
                      <h3 className="mt-3 font-serif text-xl font-semibold leading-snug tracking-tight text-foreground group-hover:text-accent">
                        {p.title} <span className="text-accent">→</span>
                      </h3>
                      <p className="mt-1 text-sm text-muted">{p.meta}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {p.brief}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
