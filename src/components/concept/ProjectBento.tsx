"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TiltCard } from "@/components/concept/widgets";
import { archiveCount, featured, hrefFor, universeOf, universes } from "@/data/concept";

type Theme = "pastel" | "paper";

const T = {
  pastel: {
    ink: "#1f2a44",
    muted: "rgba(31,42,68,0.62)",
    title: "font-[family-name:var(--font-bric)] font-extrabold tracking-tight",
    h2: "font-[family-name:var(--font-bric)] font-extrabold tracking-tight text-5xl",
    card: "rounded-[26px] border-[3px] border-[#1f2a44]",
    shadow: "6px 6px 0 #1f2a44",
    imageFx: "",
    chipOn: "bg-[#1f2a44] text-white border-[#1f2a44]",
    chipOff: "bg-white text-[#1f2a44] border-[#1f2a44]",
    label: "font-[family-name:var(--font-pixel)]",
  },
  paper: {
    ink: "#1d1b18",
    muted: "#6b655a",
    title: "font-[family-name:var(--font-instrument)]",
    h2: "font-[family-name:var(--font-instrument)] text-6xl",
    card: "rounded-lg border border-black/20",
    shadow: "0 14px 34px -20px rgba(29,27,24,0.7)",
    imageFx: "saturate-[0.6] sepia-[0.2] group-hover:saturate-100 group-hover:sepia-0",
    chipOn: "bg-[#1d1b18] text-[#f3eee2] border-[#1d1b18]",
    chipOff: "bg-transparent text-[#1d1b18] border-black/25",
    label: "font-mono",
  },
} as const;

export default function ProjectBento({ theme }: { theme: Theme }) {
  const t = T[theme];
  const [filter, setFilter] = useState<string | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={t.h2} style={{ color: t.ink }}>
          Selected{" "}
          {theme === "paper" ? <em style={{ color: "#c8431f" }}>work</em> : <span style={{ color: "#ff6b4a" }}>work</span>}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`mr-1 flex items-center gap-2 text-[10px] uppercase tracking-wider ${t.label}`} style={{ color: t.muted }}>
            <svg viewBox="0 0 44 16" className="h-4 w-11" fill="none" stroke={t.ink} strokeWidth="1.6" strokeLinejoin="round">
              <path d="M2,8 L9,2 L16,8 L9,14 Z" />
              <path d="M16,8 L23,2 L30,8 L23,14 Z" fill={theme === "paper" ? "#c8431f" : "#ff6b4a"} />
              <path d="M30,8 H42 M33,8 L40,3 M33,8 L40,13" />
            </svg>
            design thinking branches into
          </span>
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={`rounded-full border-2 px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors ${t.label} ${
              !filter ? t.chipOn : t.chipOff
            }`}
          >
            All
          </button>
          {universes
            .filter((u) => featured.some((f) => f.universe === u.id))
            .map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setFilter((f) => (f === u.id ? null : u.id))}
                className={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors ${t.label} ${
                  filter === u.id ? t.chipOn : t.chipOff
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: u.color }} />
                {u.name}
              </button>
            ))}
        </div>
      </div>

      <div className="mt-8 grid auto-rows-[250px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((f, i) => {
          const u = universeOf(f.universe);
          const on = !filter || filter === f.universe;
          const big = i === 0;
          return (
            <TiltCard
              key={f.slug}
              max={theme === "paper" ? 4 : 6}
              className={`${t.card} ${big ? "sm:col-span-2 sm:row-span-2" : ""} ${i === 5 ? "lg:col-span-2" : ""}`}
            >
              <Link
                href={hrefFor(f)}
                className="relative block h-full overflow-hidden rounded-[inherit] transition-all duration-300"
                style={{
                  opacity: on ? 1 : 0.3,
                  filter: on ? "none" : "grayscale(1)",
                  boxShadow: on ? t.shadow : "none",
                }}
              >
                <Image
                  src={f.image}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className={`object-cover transition-all duration-500 group-hover:scale-[1.06] ${t.imageFx}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span
                    className={`flex items-center gap-2 rounded-full border-2 bg-white px-3 py-1 text-[10px] uppercase tracking-wider ${t.label}`}
                    style={{ borderColor: t.ink, color: t.ink }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: u.color }} />
                    {u.name}
                  </span>
                  <span className={`rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white ${t.label}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className={`leading-[1.02] ${t.title} ${big ? "text-4xl" : "text-2xl"}`}>{f.title}</p>
                  <p
                    className={`mt-2 max-w-md text-[13px] leading-snug text-white/80 transition-all duration-300 ${
                      big ? "" : "max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100"
                    }`}
                  >
                    {f.line}
                  </p>
                </div>
              </Link>
            </TiltCard>
          );
        })}

        <Link
          href="/project"
          className={`group flex flex-col justify-between p-6 transition-colors lg:col-span-2 ${t.card} ${
            theme === "pastel" ? "bg-white hover:bg-[#fff0a8]" : "border-dashed bg-transparent hover:bg-black/[0.04]"
          }`}
          style={{ color: t.ink, boxShadow: theme === "pastel" ? t.shadow : "none" }}
        >
          <p className={`text-[10px] uppercase tracking-[0.2em] ${t.label}`} style={{ color: t.muted }}>
            The rest
          </p>
          <p className={`text-3xl leading-tight ${t.title}`}>
            {archiveCount} more projects live in the archive
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
