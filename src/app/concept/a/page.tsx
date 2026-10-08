"use client";

import Link from "next/link";
import { useState } from "react";
import ObservationRoom from "@/components/concept/ObservationRoom";
import ProjectBento from "@/components/concept/ProjectBento";
import Switcher from "@/components/concept/Switcher";
import { ClockPair, Piano } from "@/components/concept/widgets";
import { journey, universeOf, whyQuote } from "@/data/concept";
import { profile } from "@/data/profile";

const INK = "#1f2a44";
const MUTED = "rgba(31,42,68,0.62)";
const CORAL = "#ff6b4a";

const label = "font-[family-name:var(--font-pixel)] text-[11px] uppercase tracking-[0.14em]";
const card = "min-w-0 rounded-[26px] border-[3px] bg-white p-5";
const cardStyle = { borderColor: INK, boxShadow: `6px 6px 0 ${INK}` };
const display = "font-[family-name:var(--font-bric)] font-extrabold tracking-tight";

export default function ConceptA() {
  const [jSel, setJSel] = useState(0);
  const j = journey[jSel];
  const ju = universeOf(j.universe);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden font-sans"
      style={{
        color: INK,
        background:
          "radial-gradient(900px 500px at 85% -5%, #bfe3ff 0%, transparent 60%), linear-gradient(#e6f3ff 0%, #f6fbff 45%, #fff8ec 100%)",
      }}
    >
      <Switcher current="a" />

      <header className="sticky top-0 z-30 border-b-[3px] bg-[#e6f3ff]/90 backdrop-blur" style={{ borderColor: INK }}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3">
          <Link href="/concept/a" className={`text-2xl ${display}`}>
            yun<span style={{ color: CORAL }}>.</span>lee
          </Link>
          <nav className={`hidden gap-1 sm:flex ${label}`}>
            {[
              ["Work", "/project"],
              ["Research", "/research"],
              ["Vision", "/vision"],
              ["Resume", "/resume"],
            ].map(([l, h]) => (
              <Link
                key={l}
                href={h}
                className="rounded-full border-2 border-transparent px-3 py-1.5 transition-colors hover:border-[#1f2a44] hover:bg-white"
              >
                {l}
              </Link>
            ))}
          </nav>
          <p className={`hidden md:block ${label}`} style={{ color: MUTED }}>
            Philadelphia · UPenn M:IPD
          </p>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 pb-12 pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:pt-14">
        <div>
          <p className={label} style={{ color: MUTED }}>
            Sang-yun &ldquo;Yun&rdquo; Lee · strategic designer
          </p>
          <h1 className={`mt-4 text-[clamp(2.6rem,5.4vw,4.7rem)] leading-[0.98] ${display}`}>
            I watch how people{" "}
            <span className="relative inline-block">
              <span className="relative z-10">live,</span>
              <span className="absolute inset-x-[-4px] bottom-[6%] z-0 h-[38%] -rotate-1 rounded-sm" style={{ background: "#ffd75e" }} />
            </span>{" "}
            then design for it.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed" style={{ color: MUTED }}>
            This is a tiny version of what I do: simulated people live an ordinary day, and I look
            for the moments where a service lets them down. Design thinking, data and AI
            simulation, now at Penn (M:IPD).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className={`rounded-full border-[3px] px-5 py-2.5 text-white transition-transform hover:-translate-y-0.5 ${label}`}
              style={{ background: CORAL, borderColor: INK, boxShadow: `4px 4px 0 ${INK}` }}
            >
              See the work ↓
            </a>
            <Link
              href="/research/idd-agent-simulation"
              className={`rounded-full border-[3px] bg-white px-5 py-2.5 transition-transform hover:-translate-y-0.5 ${label}`}
              style={{ borderColor: INK, boxShadow: `4px 4px 0 ${INK}` }}
            >
              The real simulator →
            </Link>
          </div>
        </div>

        <ObservationRoom />
      </section>

      {/* widgets */}
      <section className="mx-auto max-w-[1240px] px-6 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`${card} lg:col-span-2`} style={cardStyle}>
            <p className={label} style={{ color: MUTED }}>
              now
            </p>
            <p className={`mt-3 text-3xl leading-tight ${display}`}>
              Master of Integrated Product Design at <span style={{ color: CORAL }}>UPenn</span>
            </p>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>
              Penn Engineering × Weitzman × Wharton · Aug 2026 – 2028
            </p>
          </div>

          <div className={card} style={cardStyle}>
            <p className={`mb-4 ${label}`} style={{ color: MUTED }}>
              local time
            </p>
            <ClockPair tone="paper" />
          </div>

          <div className={card} style={{ ...cardStyle, background: "#e4f6ec" }}>
            <p className={label} style={{ color: MUTED }}>
              method, evolving
            </p>
            <div className="mt-5 flex items-center">
              {["Basic", "Data", "AI"].map((p, i) => (
                <div key={p} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`h-4 w-4 rounded-full border-[3px] ${i === 2 ? "animate-pulse" : ""}`}
                      style={{ borderColor: INK, background: ["#fff", "#ffd75e", CORAL][i] }}
                    />
                    <span className={label}>{p}</span>
                  </div>
                  {i < 2 && <span className="mx-2 mb-6 h-[3px] flex-1 rounded" style={{ background: INK }} />}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[13px]" style={{ color: MUTED }}>
              Becoming an AI-driven strategic designer &amp; entrepreneur.
            </p>
          </div>

          <div className={`${card} lg:col-span-2`} style={{ ...cardStyle, background: "#fff3b8" }}>
            <p className={label} style={{ color: MUTED }}>
              the question
            </p>
            <p className="mt-3 text-[1.9rem] leading-[1.05]" style={{ fontFamily: "var(--font-hand)" }}>
              &ldquo;{whyQuote}&rdquo;
            </p>
            <p className="mt-3 text-sm" style={{ color: MUTED }}>
              Carried since childhood, shaped by my younger brother&rsquo;s developmental disability.
            </p>
          </div>

          <div className={card} style={cardStyle}>
            <p className={`mb-3 ${label}`} style={{ color: MUTED }}>
              off hours · piano
            </p>
            <Piano tone="paper" />
          </div>

          <a
            href={`mailto:${profile.email}`}
            className={`${card} group flex flex-col justify-between transition-colors hover:bg-[#ffe0d8]`}
            style={cardStyle}
          >
            <p className={label} style={{ color: MUTED }}>
              say hello
            </p>
            <p className={`mt-6 break-all text-2xl leading-tight ${display}`}>
              {profile.email}
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </a>
        </div>
      </section>

      {/* work */}
      <section id="work" className="mx-auto max-w-[1240px] scroll-mt-20 px-6 py-14">
        <ProjectBento theme="pastel" />
      </section>

      {/* journey */}
      <section className="mx-auto max-w-[1240px] px-6 py-16">
        <h2 className={`text-5xl ${display}`}>
          One path, <span style={{ color: CORAL }}>many worlds</span>
        </h2>
        <p className="mt-3 max-w-lg text-sm" style={{ color: MUTED }}>
          Every chapter fed a different domain. Pick a chapter.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <ol className="relative space-y-3 border-l-[3px] pl-7" style={{ borderColor: INK }}>
            {journey.map((x, i) => {
              const u = universeOf(x.universe);
              const on = i === jSel;
              return (
                <li key={x.year + x.title} className="relative">
                  <span
                    className="absolute -left-[41px] top-5 h-4 w-4 rounded-full border-[3px]"
                    style={{ borderColor: INK, background: on ? u.color : "#fff" }}
                  />
                  <button
                    type="button"
                    onMouseEnter={() => setJSel(i)}
                    onClick={() => setJSel(i)}
                    className="w-full rounded-2xl border-[3px] px-4 py-3 text-left transition-all"
                    style={{
                      borderColor: on ? INK : "transparent",
                      background: on ? "#fff" : "transparent",
                      boxShadow: on ? `4px 4px 0 ${INK}` : "none",
                      transform: on ? "translateX(4px)" : "none",
                    }}
                  >
                    <span className={label} style={{ color: u.color }}>
                      {x.year}
                    </span>
                    <span className={`block text-2xl leading-tight ${display}`}>{x.title}</span>
                    <span className="block text-[13px]" style={{ color: MUTED }}>
                      {x.place}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-28 rounded-[26px] border-[3px] bg-white p-7" style={{ borderColor: INK, boxShadow: `8px 8px 0 ${INK}` }}>
              <p className={`text-[7rem] leading-none ${display}`} style={{ color: ju.color }}>
                {j.year}
              </p>
              <p className={`mt-2 text-3xl leading-tight ${display}`}>{j.title}</p>
              <p className={`mt-1 ${label}`} style={{ color: MUTED }}>
                {j.place}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                {j.note}
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 ${label}`}
                style={{ borderColor: INK }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: ju.color }} />
                fed: {ju.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1240px] px-6 pb-28 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t-[3px] pt-8" style={{ borderColor: INK }}>
          <p className={`text-4xl ${display}`}>Let&rsquo;s build a world together.</p>
          <div className={`flex gap-3 ${label}`}>
            <Link href="/resume" className="rounded-full border-[3px] bg-white px-4 py-2" style={{ borderColor: INK, boxShadow: `3px 3px 0 ${INK}` }}>
              Resume
            </Link>
            <a href={`mailto:${profile.email}`} className="rounded-full border-[3px] px-4 py-2 text-white" style={{ background: CORAL, borderColor: INK, boxShadow: `3px 3px 0 ${INK}` }}>
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
