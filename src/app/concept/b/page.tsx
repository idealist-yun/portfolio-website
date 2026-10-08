"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DeskItem } from "@/components/concept/Desk";
import ObservationRoom from "@/components/concept/ObservationRoom";
import Switcher from "@/components/concept/Switcher";
import ProjectBento from "@/components/concept/ProjectBento";
import { ClockPair, Piano } from "@/components/concept/widgets";
import { journey, whyQuote } from "@/data/concept";
import { profile } from "@/data/profile";

const PAPER = "#f3eee2";
const INK = "#1d1b18";
const RED = "#c8431f";
const INDIGO = "#24386b";
const GOLD = "#c99a2e";
const MUTED = "#6b655a";

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .11  0 0 0 0 .10  0 0 0 0 .09  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.55'/></svg>\")";

const paperCard =
  "rounded-lg border border-black/10 bg-[#fbf8ef] p-4 shadow-[0_10px_30px_-18px_rgba(29,27,24,0.55)]";

const rites = ["출궁의", "작헌의", "왕복의", "수폐의", "입학의", "수하의"];
const steps = ["Welcome", "Greet", "Move", "Be seated", "Meet", "See off"];

export default function ConceptB() {
  const [front, setFront] = useState(0);
  const bump = () => setFront((f) => f + 1);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
      style={{ background: PAPER, color: INK, backgroundImage: grain }}
    >
      <Switcher current="b" />

      <header className="sticky top-0 z-40 border-b border-black/10 backdrop-blur-md" style={{ background: "rgba(243,238,226,0.82)" }}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3.5">
          <Link href="/concept/b" className="flex items-center gap-3">
            <span
              className="inline-flex h-9 w-9 -rotate-3 items-center justify-center rounded-[5px] font-[family-name:var(--font-instrument)] text-xl italic text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]"
              style={{ background: RED }}
            >
              Y
            </span>
            <span className="font-[family-name:var(--font-instrument)] text-2xl">Yun Lee</span>
          </Link>
          <nav className="hidden gap-7 font-mono text-[11px] uppercase tracking-wider sm:flex" style={{ color: MUTED }}>
            {[
              ["Work", "/project"],
              ["Research", "/research"],
              ["Vision", "/vision"],
              ["Resume", "/resume"],
            ].map(([l, h]) => (
              <Link key={l} href={h} className="underline-offset-4 transition-colors hover:text-black hover:underline">
                {l}
              </Link>
            ))}
          </nav>
          <p className="hidden font-mono text-[11px] uppercase tracking-wider md:block" style={{ color: MUTED }}>
            Philadelphia · UPenn M:IPD
          </p>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-[1240px] px-6 pb-16 pt-10 sm:pt-14">
        <div className="relative md:min-h-[820px]">
          <h1 className="relative z-[5] max-w-[17ch] font-[family-name:var(--font-instrument)] text-[clamp(3rem,8.6vw,8.4rem)] leading-[0.92] tracking-[-0.02em] md:max-w-[10.9ch]">
            Designing for <em style={{ color: RED }}>vulnerability,</em> with data &amp; AI.
          </h1>
          <p className="relative z-[5] mt-6 max-w-sm text-[15px] leading-relaxed md:mt-8" style={{ color: MUTED }}>
            Hi, I&rsquo;m Yun, a strategic designer. Design thinking sits at the centre; data and AI
            simulation are the instruments I&rsquo;m learning to play it with.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-0 md:block">
            <DeskItem left="47%" top="0%" rot={0} z={3} front={front} onFront={bump} className="md:w-[600px]">
              <div
                className="rounded-[4px] p-[10px] shadow-[0_22px_40px_-18px_rgba(29,27,24,0.7)]"
                style={{ background: "linear-gradient(135deg,#9a6a38,#6e4520)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18), 0 22px 40px -18px rgba(29,27,24,0.7)" }}
              >
                <div className="rounded-[2px] bg-[#f8f2e4] p-3">
                  <ObservationRoom chrome={false} showNotes={false} showLanes={false} />
                </div>
              </div>
              <p className="mt-2 text-center text-[1.35rem] leading-none" style={{ fontFamily: "var(--font-hand)", color: MUTED }}>
                five simulated people, one ordinary day (click the pictures on the walls!)
              </p>
            </DeskItem>

            <DeskItem left="76%" top="60%" rot={4} z={4} front={front} onFront={bump} className="md:w-[250px]">
              <div className="rounded-sm bg-white p-2 pb-8 shadow-[0_14px_30px_-14px_rgba(29,27,24,0.6)]">
                <Image
                  src="/images/about-collage.png"
                  alt="Yun traveling, surfing, playing piano and running a marathon"
                  width={760}
                  height={372}
                  className="h-auto w-full"
                />
                <p className="mt-2 text-center text-xl leading-none" style={{ fontFamily: "var(--font-hand)" }}>
                  travel · piano · running · reading
                </p>
              </div>
            </DeskItem>

            <DeskItem left="24%" top="63%" rot={-3} z={5} front={front} onFront={bump} className="md:w-[250px]">
              <div className="rounded-[3px] bg-[#f6e7a8] p-5 shadow-[0_12px_26px_-14px_rgba(29,27,24,0.6)]">
                <p className="text-[1.45rem] leading-[1.15]" style={{ fontFamily: "var(--font-hand)" }}>
                  &ldquo;{whyQuote}&rdquo;
                </p>
                <p className="mt-2 text-lg leading-none" style={{ fontFamily: "var(--font-hand)", color: RED }}>
                  : the question since childhood
                </p>
              </div>
            </DeskItem>

            <DeskItem left="0%" top="76%" rot={-2} z={4} front={front} onFront={bump} className="md:w-[290px]">
              <div className={paperCard}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                  Now
                </p>
                <p className="mt-2 font-[family-name:var(--font-instrument)] text-2xl leading-tight">
                  Master of Integrated Product Design, <em>UPenn</em>
                </p>
                <p className="mt-1 text-xs" style={{ color: MUTED }}>
                  Engineering × Design × Wharton · 2026 – 2028
                </p>
              </div>
            </DeskItem>

            <DeskItem left="26%" top="80%" rot={2} z={4} front={front} onFront={bump} className="md:w-[270px]">
              <div className={paperCard}>
                <ClockPair tone="paper" />
              </div>
            </DeskItem>

            <DeskItem left="56%" top="82%" rot={-1.5} z={4} front={front} onFront={bump} className="md:w-[290px]">
              <div className={paperCard}>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                  Off hours · piano (a–k)
                </p>
                <Piano tone="paper" />
              </div>
            </DeskItem>

            <DeskItem left="82%" top="80%" rot={3} z={6} front={front} onFront={bump} className="md:w-[150px]">
              <div className="rounded-full border-2 px-4 py-3 text-center" style={{ borderColor: INDIGO, color: INDIGO }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em]">Method</p>
                <p className="font-[family-name:var(--font-instrument)] text-lg italic leading-tight">
                  Basic → Data → <span style={{ color: RED }}>AI</span>
                </p>
              </div>
            </DeskItem>
          </div>
        </div>
        <p className="mt-6 hidden font-mono text-[11px] uppercase tracking-[0.18em] md:block" style={{ color: MUTED }}>
          ↑ everything on the desk is draggable
        </p>
      </section>

      {/* work */}
      <section className="mx-auto max-w-[1240px] px-6 py-14">
        <ProjectBento theme="paper" />
      </section>

      {/* ceremony band */}
      <section className="border-y border-black/15" style={{ background: "rgba(36,56,107,0.06)" }}>
        <div className="mx-auto max-w-[1240px] px-6 py-14">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_1.2fr]">
            <h2 className="font-[family-name:var(--font-instrument)] text-5xl leading-[1.02]">
              Every visit has <em style={{ color: INDIGO }}>six steps.</em>
            </h2>
            <p className="max-w-md text-[14px] leading-relaxed" style={{ color: MUTED }}>
              For a robot-run reception at Sungkyunkwan University, I borrowed its structure from a
              1817 album of the Crown Prince&rsquo;s entrance ceremony, and turned each scene into a
              step of service.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {rites.map((r, i) => (
              <div key={r} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-black/20 shadow-[0_10px_24px_-16px_rgba(29,27,24,0.7)]">
                  <Image
                    src={`/images/ipakdo/rite-${i + 1}.jpg`}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
                  {i + 1} · {r}
                </p>
                <p className="font-[family-name:var(--font-instrument)] text-xl leading-tight">{steps[i]}</p>
              </div>
            ))}
          </div>
          <Link href="/project/vip-concierge-robot" className="mt-8 inline-block font-mono text-[11px] uppercase tracking-wider underline underline-offset-4" style={{ color: RED }}>
            See the live simulation →
          </Link>
        </div>
      </section>

      {/* journey */}
      <section className="py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <h2 className="font-[family-name:var(--font-instrument)] text-6xl">
            A path, <em style={{ color: RED }}>unrolled</em>
          </h2>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>
            scroll sideways →
          </p>
        </div>
        <div className="mt-8 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative flex w-max gap-5 px-6 pt-8 sm:px-[max(1.5rem,calc((100vw-1240px)/2+1.5rem))]">
            <span aria-hidden className="absolute left-0 right-0 top-[1.15rem] h-px bg-black/30" />
            {journey.map((j, i) => {
              const tint = [RED, INDIGO, GOLD][i % 3];
              return (
                <article key={j.year + j.title} className="relative w-[290px] shrink-0">
                  <span
                    className="absolute -top-[2.05rem] left-0 h-3.5 w-3.5 rounded-full ring-4"
                    style={{ background: tint, boxShadow: `0 0 0 4px ${PAPER}` }}
                  />
                  <p className="font-[family-name:var(--font-instrument)] text-[5.5rem] leading-none" style={{ color: tint, opacity: 0.9 }}>
                    {j.year}
                  </p>
                  <div className="-mt-2 rounded-lg border border-black/10 bg-[#fbf8ef] p-5 shadow-[0_12px_28px_-18px_rgba(29,27,24,0.6)]">
                    <p className="font-[family-name:var(--font-instrument)] text-[1.7rem] leading-tight">{j.title}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>
                      {j.place}
                    </p>
                    <p className="mt-3 text-[13.5px] leading-snug" style={{ color: MUTED }}>
                      {j.note}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1240px] px-6 pb-32 pt-10">
        <div className="border-t border-black/20 pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
            Say hello
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-3 block font-[family-name:var(--font-instrument)] text-[clamp(2rem,6vw,5rem)] leading-none underline decoration-[#c8431f] decoration-2 underline-offset-8 transition-colors hover:text-[#c8431f]"
          >
            {profile.email}
          </a>
          <div className="mt-10 flex gap-4 font-mono text-[11px] uppercase tracking-wider" style={{ color: MUTED }}>
            <Link href="/resume" className="underline underline-offset-4 hover:text-black">
              Resume
            </Link>
            <Link href="/vision" className="underline underline-offset-4 hover:text-black">
              Vision
            </Link>
            <Link href="/" className="underline underline-offset-4 hover:text-black">
              Current site
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
