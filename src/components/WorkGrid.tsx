"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { projects } from "@/data/projects";
import { research } from "@/data/research";
import { roles, hiddenProjects, shortLabel, type RoleKey } from "@/data/workRoles";

type Entry = {
  key: string;
  href: string;
  title: string;
  org: string;
  period?: string;
  image?: string;
};

const byKey = new Map<string, Entry>();
for (const p of projects) {
  if (hiddenProjects.includes(p.slug)) continue;
  byKey.set(p.slug, {
    key: p.slug,
    href: `/project/${p.slug}`,
    title: shortLabel[p.slug] ?? p.title,
    org: p.org,
    period: p.period,
    image: p.images?.[0],
  });
}
for (const r of research) {
  const key = `research:${r.slug}`;
  if (!shortLabel[key]) continue;
  byKey.set(key, {
    key,
    href: `/research/${r.slug}`,
    title: shortLabel[key],
    org: r.venue ?? "Research",
    image: r.images?.[0],
  });
}

type Item = { e: Entry; aspect: number };

// Uneven heights give the ragged, masonry feel: the hero is tallest.
const ASPECTS = [4 / 3, 1, 3 / 4, 16 / 10];

function columns(items: Item[], n: number): Item[][] {
  const cols: Item[][] = Array.from({ length: n }, () => []);
  const heights = new Array(n).fill(0);
  for (const it of items) {
    let c = 0;
    for (let i = 1; i < n; i++) if (heights[i] < heights[c]) c = i;
    cols[c].push(it);
    heights[c] += 1 / it.aspect;
  }
  return cols;
}

// Cover palette: paper, ink, red and navy from the site tokens. A project keeps its colour everywhere.
const covers = [
  { bg: "bg-surface", fg: "text-foreground", sub: "text-muted" },
  { bg: "bg-foreground", fg: "text-background", sub: "text-background/60" },
  { bg: "bg-accent-soft", fg: "text-foreground", sub: "text-accent" },
  { bg: "bg-warm", fg: "text-background", sub: "text-background/65" },
  { bg: "bg-accent", fg: "text-white", sub: "text-white/75" },
  { bg: "bg-border", fg: "text-foreground", sub: "text-muted" },
];

function coverOf(key: string) {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return covers[h % covers.length];
}

function Tile({ it, big }: { it: Item; big: boolean }) {
  const { e } = it;
  const c = coverOf(e.key);
  return (
    <Link
      href={e.href}
      className={`group relative block w-full overflow-hidden rounded-lg ${c.bg}`}
      style={{ aspectRatio: it.aspect }}
    >
      {e.image && (
        <Image
          src={e.image}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className={`relative flex h-full flex-col justify-between p-4 transition-colors duration-500 md:p-5 ${c.fg} group-hover:text-white`}
      >
        <span
          className={`font-mono text-[11px] uppercase tracking-wider transition-colors duration-500 ${c.sub} group-hover:text-white/80`}
        >
          {e.period ?? "Research"}
        </span>
        <h3
          className={`font-serif leading-[1.05] ${
            big ? "text-3xl md:text-5xl" : "text-xl md:text-[28px]"
          }`}
        >
          {e.title}
        </h3>
      </div>
    </Link>
  );
}

export default function WorkGrid() {
  const params = useSearchParams();
  const asked = params.get("role");
  const [role, setRole] = useState<RoleKey | "all">(
    roles.some((r) => r.key === asked) ? (asked as RoleKey) : "designer"
  );

  const items = useMemo(() => {
    const out: Item[] = [];
    const current = roles.find((r) => r.key === role);
    if (current) {
      const keys = [...current.featured, ...current.rest];
      keys.forEach((k, idx) => {
        const e = byKey.get(k);
        if (!e) return;
        const aspect = idx === 0 ? 4 / 5 : idx === 1 ? 1 : idx === 2 ? 4 / 3 : ASPECTS[(idx - 3) % ASPECTS.length];
        out.push({ e, aspect });
      });
    } else {
      const score = new Map<string, number>();
      for (const r of roles) {
        r.featured.forEach((k) => score.set(k, (score.get(k) ?? 0) + 3));
        r.rest.forEach((k) => score.set(k, (score.get(k) ?? 0) + 1));
      }
      [...score.entries()]
        .filter(([k]) => !k.startsWith("research:"))
        .sort((x, y) => y[1] - x[1])
        .forEach(([k], idx) => {
          const e = byKey.get(k);
          if (!e) return;
          out.push({ e, aspect: idx === 0 ? 4 / 5 : ASPECTS[idx % ASPECTS.length] });
        });
    }
    return out;
  }, [role]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {[{ key: "all" as const, chip: "All" }, ...roles].map((r) => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              role === r.key
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {r.chip}
          </button>
        ))}
      </div>

      <div className="hidden gap-1.5 md:flex">
        {columns(items, 3).map((col, ci) => (
          <div key={ci} className="flex min-w-0 flex-1 flex-col gap-1.5">
            {col.map((it) => (
              <Tile key={it.e.key} it={it} big={it === items[0]} />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 md:hidden">
        {columns(items, 2).map((col, ci) => (
          <div key={ci} className="flex min-w-0 flex-1 flex-col gap-1.5">
            {col.map((it) => (
              <Tile key={it.e.key} it={it} big={it === items[0]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
