"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Multiverse from "@/components/concept/Multiverse";
import Switcher from "@/components/concept/Switcher";
import { ClockPair, Piano, TiltCard } from "@/components/concept/widgets";
import {
  archiveCount,
  featured,
  hrefFor,
  journey,
  universeOf,
  universes,
  whyQuote,
} from "@/data/concept";
import { profile } from "@/data/profile";

const ink = "#eceef5";
const muted = "rgba(236,238,245,0.55)";

const card =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm";

export default function ConceptA() {
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [jActive, setJActive] = useState<string | null>(null);
  const workRef = useRef<HTMLElement>(null);

  const pick = (id: string) => {
    setFilter((f) => (f === id ? null : id));
    workRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const shown = active ?? filter;
  const au = shown ? universeOf(shown) : null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
      style={{
        background:
          "radial-gradient(1200px 700px at 78% -10%, rgba(120,100,255,0.22), transparent 60%), radial-gradient(900px 600px at -5% 40%, rgba(255,138,91,0.10), transparent 60%), #07080d",
        color: ink,
      }}
    >
      <Switcher current="a" dark />

      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#07080d]/70 backdrop-blur-md"><div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4">
        <Link href="/concept/a" className="font-[family-name:var(--font-instrument)] text-2xl italic">
          Yun Lee
        </Link>
        <nav
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 font-mono text-[11px] uppercase tracking-wider backdrop-blur sm:flex"
          style={{ color: muted }}
        >
          {[
            ["Work", "/project"],
            ["Research", "/research"],
            ["Vision", "/vision"],
            ["Resume", "/resume"],
          ].map(([l, h]) => (
            <Link key={l} href={h} className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-white">
              {l}
            </Link>
          ))}
        </nav>
        <p className="hidden font-mono text-[11px] uppercase tracking-wider md:block" style={{ color: muted }}>
          Open to collaborate
        </p>
      </div></header>

      {/* hero */}
      <section className="mx-auto grid max-w-[1240px] items-center gap-6 px-6 pb-10 pt-4 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: muted }}>
            Sang-yun &ldquo;Yun&rdquo; Lee · Strategic designer &amp; researcher
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-instrument)] text-[clamp(2.8rem,7.2vw,5.6rem)] leading-[0.98] tracking-tight">
            Design thinking,
            <br />
            branching into
            <br />
            <em className="text-[#b9a8ff]">every universe.</em>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ color: muted }}>
            One method at the centre. Disability, robotics, the military, retail and AI are the worlds
            I&rsquo;ve tested it in, moving from basic design thinking toward data and AI-driven
            simulation. Now at Penn (M:IPD).
          </p>

          <div className="mt-8 min-h-[7.5rem] max-w-md">
            {au ? (
              <div className="rounded-2xl border p-4" style={{ borderColor: `${au.color}55`, background: `${au.color}12` }}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: au.color }}>
                  universe · {String(au.slugs.length).padStart(2, "0")} works
                </p>
                <p className="mt-1 font-[family-name:var(--font-instrument)] text-2xl">{au.name}</p>
                <p className="mt-1 text-[13px] leading-snug" style={{ color: muted }}>
                  {au.blurb}
                </p>
              </div>
            ) : (
              <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: muted }}>
                ← hover a universe · click to filter the work below
              </p>
            )}
          </div>
        </div>

        <div className="lg:-mr-8">
          <Multiverse active={shown} onActive={setActive} onPick={pick} />
          <div className="mt-2 flex flex-wrap gap-2 sm:hidden">
            {universes.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => pick(u.id)}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider"
                style={{ borderColor: `${u.color}66`, color: ink }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: u.color }} />
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* widgets */}
      <section className="mx-auto max-w-[1240px] px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`${card} lg:col-span-2`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: muted }}>
              Now
            </p>
            <p className="mt-3 font-[family-name:var(--font-instrument)] text-3xl leading-tight">
              Master of Integrated Product Design, <em>UPenn</em>
            </p>
            <p className="mt-2 text-sm" style={{ color: muted }}>
              Penn Engineering × Weitzman × Wharton · Aug 2026 – 2028
            </p>
          </div>

          <div className={card}>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: muted }}>
              Local time
            </p>
            <ClockPair />
          </div>

          <div className={card}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: muted }}>
              Method, evolving
            </p>
            <div className="mt-5 flex items-center">
              {["Basic", "Data", "AI"].map((p, i) => (
                <div key={p} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${i === 2 ? "animate-pulse" : ""}`}
                      style={{ background: ["#9aa4c7", "#7aa2ff", "#c58bff"][i], boxShadow: i === 2 ? "0 0 18px #c58bff" : "none" }}
                    />
                    <span className="font-mono text-[10px] uppercase" style={{ color: muted }}>
                      {p}
                    </span>
                  </div>
                  {i < 2 && <span className="mx-2 mb-5 h-px flex-1 bg-gradient-to-r from-white/30 to-white/10" />}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[13px]" style={{ color: muted }}>
              Becoming an AI-driven strategic designer &amp; entrepreneur.
            </p>
          </div>

          <div className={`${card} lg:col-span-2`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: muted }}>
              The question
            </p>
            <p className="mt-3 font-[family-name:var(--font-instrument)] text-[1.7rem] italic leading-snug">
              &ldquo;{whyQuote}&rdquo;
            </p>
            <p className="mt-3 text-sm" style={{ color: muted }}>
              Carried since childhood, shaped by my younger brother&rsquo;s developmental disability.
            </p>
          </div>

          <div className={card}>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: muted }}>
              Off hours · piano
            </p>
            <Piano />
          </div>

          <a href={`mailto:${profile.email}`} className={`${card} group flex flex-col justify-between transition-colors hover:bg-white/[0.07]`}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: muted }}>
              Say hello
            </p>
            <p className="mt-6 font-[family-name:var(--font-instrument)] text-2xl leading-tight">
              {profile.email}
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </a>
        </div>
      </section>

      {/* work */}
      <section ref={workRef} className="mx-auto max-w-[1240px] scroll-mt-6 px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-instrument)] text-5xl">
            Selected <em className="text-[#b9a8ff]">universes</em>
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter(null)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                !filter ? "border-white bg-white text-black" : "border-white/15 hover:border-white/50"
              }`}
              style={!filter ? undefined : { color: muted }}
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
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                  style={{
                    borderColor: filter === u.id ? u.color : "rgba(255,255,255,0.15)",
                    background: filter === u.id ? `${u.color}22` : "transparent",
                    color: filter === u.id ? "#fff" : muted,
                  }}
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
            const on = !shown || shown === f.universe;
            const big = i === 0;
            return (
              <TiltCard
                key={f.slug}
                className={`rounded-3xl ${big ? "sm:col-span-2 sm:row-span-2" : ""} ${i === 5 ? "lg:col-span-2" : ""}`}
              >
                <Link
                  href={hrefFor(f)}
                  className="relative block h-full overflow-hidden rounded-3xl border transition-all duration-300"
                  style={{
                    borderColor: on ? `${u.color}66` : "rgba(255,255,255,0.08)",
                    opacity: on ? 1 : 0.28,
                    filter: on ? "none" : "grayscale(1)",
                    boxShadow: on ? `0 0 0 1px ${u.color}22, 0 20px 60px -30px ${u.color}` : "none",
                  }}
                >
                  <Image
                    src={f.image}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                    <span
                      className="flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: u.color }} />
                      {u.name}
                    </span>
                    <span className="font-mono text-[10px] text-white/60">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className={`font-[family-name:var(--font-instrument)] leading-none ${big ? "text-4xl" : "text-2xl"}`}>
                      {f.title}
                    </p>
                    <p
                      className={`mt-2 max-w-md text-[13px] leading-snug text-white/70 transition-all duration-300 ${
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
            className="group flex flex-col justify-between rounded-3xl border border-dashed border-white/20 p-6 transition-colors hover:border-white/50 hover:bg-white/[0.04] lg:col-span-2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: muted }}>
              The rest
            </p>
            <p className="font-[family-name:var(--font-instrument)] text-3xl leading-tight">
              {archiveCount} more projects live in the archive
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </Link>
        </div>
      </section>

      {/* journey */}
      <section className="mx-auto max-w-[1240px] px-6 py-16">
        <h2 className="font-[family-name:var(--font-instrument)] text-5xl">
          One timeline, <em className="text-[#b9a8ff]">many branches</em>
        </h2>
        <p className="mt-3 max-w-lg text-sm" style={{ color: muted }}>
          Every chapter fed a different universe. Hover one to see where it landed.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <ol className="relative border-l border-white/15 pl-8">
            {journey.map((j) => {
              const u = universeOf(j.universe);
              return (
                <li
                  key={j.year + j.title}
                  className="relative -ml-2 cursor-default rounded-xl py-4 pl-2 pr-2 pb-8 transition-colors hover:bg-white/[0.04]"
                  onMouseEnter={() => setJActive(j.universe)}
                  onMouseLeave={() => setJActive(null)}
                >
                  <span
                    className="absolute -left-[31px] top-6 h-3 w-3 rounded-full ring-4 ring-[#07080d]"
                    style={{ background: u.color, boxShadow: `0 0 14px ${u.color}` }}
                  />
                  <span
                    aria-hidden
                    className="absolute -left-6 top-[1.85rem] h-px w-6"
                    style={{ background: `linear-gradient(90deg, ${u.color}, transparent)` }}
                  />
                  <div className="grid gap-1 sm:grid-cols-[88px_1fr]">
                    <p className="font-mono text-sm tabular-nums" style={{ color: u.color }}>
                      {j.year}
                    </p>
                    <div>
                      <p className="font-[family-name:var(--font-instrument)] text-3xl leading-tight">{j.title}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: muted }}>
                        {j.place}
                      </p>
                      <p className="mt-2 max-w-md text-[14px] leading-relaxed" style={{ color: muted }}>
                        {j.note}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <Multiverse active={jActive} onActive={() => {}} onPick={() => {}} />
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1240px] px-6 pb-28 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-8">
          <p className="font-[family-name:var(--font-instrument)] text-4xl italic">Let&rsquo;s build a world together.</p>
          <div className="flex gap-3 font-mono text-[11px] uppercase tracking-wider">
            <Link href="/resume" className="rounded-full border border-white/20 px-4 py-2 hover:bg-white hover:text-black">
              Resume
            </Link>
            <a href={`mailto:${profile.email}`} className="rounded-full border border-white/20 px-4 py-2 hover:bg-white hover:text-black">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
