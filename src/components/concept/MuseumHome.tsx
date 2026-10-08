"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DeskItem, InkDiagram, StageScale } from "@/components/concept/Desk";
import ObservationRoom from "@/components/concept/ObservationRoom";
import Switcher from "@/components/concept/Switcher";
import ProjectBento from "@/components/concept/ProjectBento";
import VipRobotSim from "@/components/VipRobotSim";
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

function PostIt({ color, children, pin = "#e2493a", className = "" }: { color: string; children: React.ReactNode; pin?: string; className?: string }) {
  return (
    <div
      className={`relative rounded-[2px] px-4 pb-4 pt-5 shadow-[0_12px_18px_-8px_rgba(29,27,24,0.6)] ${className}`}
      style={{ background: `linear-gradient(165deg, ${color} 0%, ${color} 82%, rgba(0,0,0,0.07) 100%)`, color: INK }}
    >
      <span
        className="absolute left-1/2 top-[-6px] h-3.5 w-3.5 -translate-x-1/2 rounded-full shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.25),0_2px_3px_rgba(0,0,0,0.3)]"
        style={{ background: pin }}
      />
      {children}
    </div>
  );
}

const DESIGN_W = 1192;
// the desk is laid out at one width and scaled to fit, so nothing ever overlaps at any desktop width
function Stage({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const upd = () => {
      const wide = window.innerWidth >= 768;
      const sc = wide ? Math.min(1, o.clientWidth / DESIGN_W) : 1;
      setS(sc);
      setH(wide ? i.offsetHeight * sc : null);
    };
    const ro = new ResizeObserver(upd);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);
  return (
    <StageScale.Provider value={s}>
      <div ref={outer} style={h ? { height: h } : undefined}>
        <div ref={inner} className="md:w-[1192px] md:origin-top-left" style={s < 1 ? { transform: `scale(${s})` } : undefined}>
          {children}
        </div>
      </div>
    </StageScale.Provider>
  );
}

// a horizontal strip you can wheel, drag, or step through with arrows
function HScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + e.deltaY;
      if ((e.deltaY > 0 && el.scrollLeft < max - 1) || (e.deltaY < 0 && el.scrollLeft > 1)) {
        e.preventDefault();
        el.scrollLeft = Math.max(0, Math.min(max, next));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  const step = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <div className="relative">
      <div
        ref={ref}
        className="mt-8 cursor-grab overflow-x-auto pb-6 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft };
        }}
        onPointerMove={(e) => {
          if (drag.current && ref.current) ref.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        {children}
      </div>
      <div className="mt-2 flex justify-end gap-2 px-6 font-mono text-[11px] sm:px-[max(1.5rem,calc((100vw-1240px)/2+1.5rem))]">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => step(d)}
            aria-label={d < 0 ? "Scroll left" : "Scroll right"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/25 transition-colors hover:bg-black hover:text-[#f3eee2]"
          >
            {d < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
    </div>
  );
}

const noteLabel = "text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60";
const noteHand = "leading-[1.05]";



// first visit per tab: a red dot, one line, then the dot opens the page like an aperture
function Opening() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mark = () => {
      try {
        sessionStorage.setItem("opened", "1");
      } catch {
        /* storage unavailable */
      }
    };
    const hide = () => {
      el.style.display = "none";
      mark();
    };
    let seen = false;
    try {
      seen = sessionStorage.getItem("opened") === "1";
    } catch {
      /* storage unavailable */
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hide();
      return;
    }
    const t = window.setTimeout(hide, 2800);
    el.addEventListener("pointerdown", hide);
    return () => {
      window.clearTimeout(t);
      el.removeEventListener("pointerdown", hide);
    };
  }, []);
  return (
    <div ref={ref} aria-hidden className="open-wrap fixed inset-0 z-[600]">
      <svg className="absolute inset-0 h-full w-full" viewBox="-160 -160 320 320" preserveAspectRatio="xMidYMid slice">
        <path className="open-blade open-blade-0" d="M 0.00 -2.50 A 230 230 0 0 1 -218.3 -160.0 L -41.2 -267.5 A 230 230 0 0 0 1.77 -1.77 Z" style={{ ["--dx" as string]: "261.8px", ["--dy" as string]: "-200.9px" }} />
        <path className="open-blade open-blade-1" d="M 1.77 -1.77 A 230 230 0 0 1 -41.2 -267.5 L 160.0 -218.3 A 230 230 0 0 0 2.50 0.00 Z" style={{ ["--dx" as string]: "327.2px", ["--dy" as string]: "43.1px" }} />
        <path className="open-blade open-blade-0" d="M 2.50 0.00 A 230 230 0 0 1 160.0 -218.3 L 267.5 -41.2 A 230 230 0 0 0 1.77 1.77 Z" style={{ ["--dx" as string]: "200.9px", ["--dy" as string]: "261.8px" }} />
        <path className="open-blade open-blade-1" d="M 1.77 1.77 A 230 230 0 0 1 267.5 -41.2 L 218.3 160.0 A 230 230 0 0 0 0.00 2.50 Z" style={{ ["--dx" as string]: "-43.1px", ["--dy" as string]: "327.2px" }} />
        <path className="open-blade open-blade-0" d="M 0.00 2.50 A 230 230 0 0 1 218.3 160.0 L 41.2 267.5 A 230 230 0 0 0 -1.77 1.77 Z" style={{ ["--dx" as string]: "-261.8px", ["--dy" as string]: "200.9px" }} />
        <path className="open-blade open-blade-1" d="M -1.77 1.77 A 230 230 0 0 1 41.2 267.5 L -160.0 218.3 A 230 230 0 0 0 -2.50 0.00 Z" style={{ ["--dx" as string]: "-327.2px", ["--dy" as string]: "-43.1px" }} />
        <path className="open-blade open-blade-0" d="M -2.50 0.00 A 230 230 0 0 1 -160.0 218.3 L -267.5 41.2 A 230 230 0 0 0 -1.77 -1.77 Z" style={{ ["--dx" as string]: "-200.9px", ["--dy" as string]: "-261.8px" }} />
        <path className="open-blade open-blade-1" d="M -1.77 -1.77 A 230 230 0 0 1 -267.5 41.2 L -218.3 -160.0 A 230 230 0 0 0 0.00 -2.50 Z" style={{ ["--dx" as string]: "43.1px", ["--dy" as string]: "-327.2px" }} />
        <path className="open-line" pathLength={1} d="M 0.00 -2.50 A 230 230 0 0 1 -218.3 -160.0" fill="none" />
        <path className="open-line" pathLength={1} d="M 1.77 -1.77 A 230 230 0 0 1 -41.2 -267.5" fill="none" />
        <path className="open-line" pathLength={1} d="M 2.50 0.00 A 230 230 0 0 1 160.0 -218.3" fill="none" />
        <path className="open-line" pathLength={1} d="M 1.77 1.77 A 230 230 0 0 1 267.5 -41.2" fill="none" />
        <path className="open-line" pathLength={1} d="M 0.00 2.50 A 230 230 0 0 1 218.3 160.0" fill="none" />
        <path className="open-line" pathLength={1} d="M -1.77 1.77 A 230 230 0 0 1 41.2 267.5" fill="none" />
        <path className="open-line" pathLength={1} d="M -2.50 0.00 A 230 230 0 0 1 -160.0 218.3" fill="none" />
        <path className="open-line" pathLength={1} d="M -1.77 -1.77 A 230 230 0 0 1 -267.5 41.2" fill="none" />
        <circle className="open-dot" cx="0" cy="0" r="3" fill={RED} />
      </svg>
      <p
        className="open-text absolute left-0 right-0 top-[calc(50%+34px)] text-center font-[family-name:var(--font-instrument)] text-[clamp(1.4rem,3.4vw,2.2rem)] italic"
        style={{ color: INK }}
      >
        Everything starts from a dot.
      </p>
      <style>{`
        .open-wrap { animation: openWrap 2.75s linear forwards; }
        .open-blade { fill: ${PAPER}; stroke: ${RED}; stroke-width: 1.5px; vector-effect: non-scaling-stroke; stroke-opacity: 0; animation: bladeStroke .01s 1.25s forwards, bladeOpen 1.1s 1.5s cubic-bezier(.55,0,.2,1) forwards; }
        .open-blade-1 { animation: bladeTone .3s 1.25s forwards, bladeStroke .01s 1.25s forwards, bladeOpen 1.1s 1.5s cubic-bezier(.55,0,.2,1) forwards; }
        .open-line { stroke: ${RED}; stroke-width: 0.4px; stroke-dasharray: 1; stroke-dashoffset: 1; animation: lineDraw .7s .55s cubic-bezier(.3,.6,.2,1) forwards, lineOff .01s 1.25s forwards; }
        .open-dot { transform-box: fill-box; transform-origin: center; animation: dotIn .4s cubic-bezier(.2,.9,.3,1.3) both, dotOut .25s 1.5s forwards; }
        .open-text { animation: textIn .35s .15s ease-out both, textOut .6s .55s ease-in forwards; }
        @keyframes dotIn { from { transform: scale(0) } to { transform: scale(1) } }
        @keyframes dotOut { to { opacity: 0 } }
        @keyframes textIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @keyframes textOut { to { opacity: 0; transform: translateY(-6px) } }
        @keyframes lineDraw { to { stroke-dashoffset: 0 } }
        @keyframes lineOff { to { opacity: 0 } }
        @keyframes bladeStroke { to { stroke-opacity: 1 } }
        @keyframes bladeTone { to { fill: #ebe4d3 } }
        @keyframes bladeOpen { to { transform: translate(var(--dx), var(--dy)) } }
        @keyframes openWrap { 0%, 98% { visibility: visible } 100% { visibility: hidden; pointer-events: none } }
      `}</style>
    </div>
  );
}

export default function MuseumHome({ preview = false }: { preview?: boolean }) {
  const [front, setFront] = useState(0);
  const bump = () => setFront((f) => f + 1);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
      style={{ background: PAPER, color: INK, backgroundImage: grain }}
    >
      <Opening />
      {preview && <Switcher current="b" />}

      <header className="sticky top-0 z-40 border-b border-black/10 backdrop-blur-md" style={{ background: "rgba(243,238,226,0.82)" }}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3.5">
          <Link href="/" className="group flex items-center pt-2" title="Everything starts from a dot">
            <span className="font-[family-name:var(--font-instrument)] text-[1.8rem] leading-none">
              <span className="relative inline-block italic">
                ı
                <span
                  aria-hidden
                  className="absolute h-[0.15em] w-[0.15em] rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{ background: RED, left: "0.08em", top: "0.1em" }}
                />
              </span>
              an
            </span>
          </Link>
          <nav className="hidden gap-7 font-mono text-[11px] uppercase tracking-wider sm:flex" style={{ color: MUTED }}>
            {[
              ["Work", "/project"],
              ["Research", "/research"],
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
        <Stage>
        <div className="relative md:min-h-[900px]">
          <h1 className="relative z-[5] max-w-[22ch] font-[family-name:var(--font-instrument)] text-[clamp(2.5rem,10vw,4rem)] leading-[0.98] tracking-[-0.02em] md:max-w-[540px] md:text-[72px]">
            <span className="block md:whitespace-nowrap">
              Standing on the <em style={{ color: RED }}>edge.</em>
            </span>
            <span className="block md:whitespace-nowrap">Designing from it.</span>
          </h1>
          <p className="relative z-[5] mt-6 max-w-sm text-[15px] leading-relaxed md:mt-7" style={{ color: MUTED }}>
            I&rsquo;m Ian, a strategic, service &amp; experience designer across business, design and engineering. I turn research into strategy, and test it on simulated users (generative agents) before it reaches real ones.
          </p>
          <p className="relative z-[5] mt-4 max-w-sm font-[family-name:var(--font-hand)] text-[1.6rem] leading-[1.05]" style={{ color: INK }}>
            Define personas from data. Ideate and prototype the service. Test &amp; simulate it with persona agents.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-0 md:block">
            <DeskItem left="33.5%" top="30%" rot={-3} z={7} front={front} onFront={bump} className="max-md:max-w-[220px] md:w-[160px]">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("museum:enlarge"))}
                className="group block w-full text-left"
                aria-label="Open the museum"
              >
                <svg viewBox="0 0 170 84" className="h-auto w-full animate-[nudge_2.6s_ease-in-out_infinite]" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10 74 C 36 80, 112 70, 152 14" />
                  <path d="M152 14 L137 20 M152 14 L155 31" />
                </svg>
                <span className="mt-1 block text-[1.55rem] leading-[1.02] transition-colors group-hover:text-[#c8431f]" style={{ fontFamily: "var(--font-hand)", fontWeight: 700 }}>
                  Click in! A docent will walk you through my journey.
                </span>
              </button>
              <style>{`@keyframes nudge{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,-5px)}}`}</style>
            </DeskItem>

            <DeskItem left="47%" top="0%" rot={0} z={3} front={front} onFront={bump} className="sm:col-span-2 md:w-[600px]">
              <div
                className="rounded-[4px] p-[10px] shadow-[0_22px_40px_-18px_rgba(29,27,24,0.7)]"
                style={{ background: "linear-gradient(135deg,#9a6a38,#6e4520)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18), 0 22px 40px -18px rgba(29,27,24,0.7)" }}
              >
                <div className="rounded-[2px] bg-[#f8f2e4] p-3">
                  <ObservationRoom />
                </div>
              </div>
              <p className="mt-2 text-center text-[1.35rem] leading-none" style={{ fontFamily: "var(--font-hand)", color: MUTED }}>
                the museum of Ian: every avatar is me at one chapter. The avatar in the middle is you: move it with WASD, arrows or a click, and talk to the Ians.
              </p>
            </DeskItem>

            <DeskItem left="76%" top="55%" rot={4} z={4} front={front} onFront={bump} className="md:w-[250px]">
              <div className="rounded-sm bg-white p-2 pb-8 shadow-[0_14px_30px_-14px_rgba(29,27,24,0.6)]">
                <Image
                  src="/images/about-collage.png"
                  alt="Ian traveling, surfing, playing piano and running a marathon"
                  width={760}
                  height={372}
                  className="h-auto w-full"
                />
                <p className="mt-2 text-center text-xl leading-none" style={{ fontFamily: "var(--font-hand)" }}>
                  travel · piano · running · reading
                </p>
              </div>
            </DeskItem>

            <DeskItem left="22%" top="56%" rot={-3} z={5} front={front} onFront={bump} className="md:w-[250px]">
              <PostIt color="#ffe9a0">
                <p className="text-[1.5rem] leading-[1.1]" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
                  &ldquo;{whyQuote}&rdquo;
                </p>
                <p className="mt-2 text-lg leading-none" style={{ fontFamily: "var(--font-hand)", color: RED, fontWeight: 600 }}>
                  : the question since childhood
                </p>
              </PostIt>
            </DeskItem>

            <DeskItem left="0%" top="72%" rot={-2} z={4} front={front} onFront={bump} className="md:w-[290px]">
              <PostIt color="#bfe0ff">
                <p className={noteLabel}>now</p>
                <p className={`mt-1 text-[1.65rem] ${noteHand}`} style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
                  Master of Integrated Product Design at UPenn
                </p>
                <p className="mt-1 text-[1.15rem] opacity-70" style={{ fontFamily: "var(--font-hand)" }}>
                  engineering × design × Wharton · 2026 – 2028
                </p>
              </PostIt>
            </DeskItem>

            <DeskItem left="25%" top="82%" rot={2} z={4} front={front} onFront={bump} className="md:w-[270px]">
              <PostIt color="#c4f1d2">
                <p className={`mb-2 ${noteLabel}`}>time check</p>
                <ClockPair tone="paper" />
              </PostIt>
            </DeskItem>

            <DeskItem left="53%" top="88%" rot={-1.5} z={4} front={front} onFront={bump} className="md:w-[290px]">
              <PostIt color="#ffd0dc">
                <p className={`mb-2 ${noteLabel}`}>off hours · play me (a – k, w e t y u)</p>
                <Piano tone="paper" />
              </PostIt>
            </DeskItem>

            <DeskItem left="46%" top="58%" rot={2} z={6} front={front} onFront={bump} className="md:w-[270px]">
              <PostIt color="#fff6d6" pin="#c8431f">
                <p className={noteLabel}>how it branches</p>
                <div className="mt-1">
                  <InkDiagram />
                </div>
              </PostIt>
            </DeskItem>

            <DeskItem left="80%" top="84%" rot={3} z={6} front={front} onFront={bump} className="md:w-[190px]">
              <PostIt color="#fff3a8" pin="#2f6fdf">
                <p className={noteLabel}>method</p>
                <p className="mt-1 text-[1.5rem] leading-[1.05]" style={{ fontFamily: "var(--font-hand)", fontWeight: 700 }}>
                  Basic → Data → <span style={{ color: RED }}>AI</span>
                </p>
              </PostIt>
            </DeskItem>
          </div>
        </div>
        </Stage>
        <p className="mt-6 hidden font-mono text-[11px] uppercase tracking-[0.18em] md:block" style={{ color: MUTED }}>
          ↑ everything on the desk is draggable
        </p>
      </section>

      {/* work */}
      <section className="mx-auto max-w-[1240px] px-6 py-14">
        <ProjectBento theme="paper" />
      </section>

      {/* how I work: the VIP reception as a live service simulation */}
      <section className="border-y border-black/15" style={{ background: "rgba(36,56,107,0.06)" }}>
        <div className="mx-auto max-w-[1240px] px-6 py-14">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_1.2fr]">
            <h2 className="font-[family-name:var(--font-instrument)] text-5xl leading-[1.02]">
              This is how I <em style={{ color: INDIGO }}>work.</em>
            </h2>
            <p className="max-w-md text-[14px] leading-relaxed" style={{ color: MUTED }}>
              A robot-run VIP reception for Sungkyunkwan University, designed as six steps borrowed from a 1817 album of the Crown Prince&rsquo;s entrance ceremony. This is the service blueprint, running: three robots, a guest, and the President. Press play, or hover a stop.
            </p>
          </div>
          <div className="mt-10">
            <VipRobotSim />
          </div>
          <Link href="/project/vip-concierge-robot" className="mt-8 inline-block font-mono text-[11px] uppercase tracking-wider underline underline-offset-4" style={{ color: RED }}>
            Read the full project →
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
            scroll, drag, or use the arrows →
          </p>
        </div>
        <HScroll>
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
        </HScroll>
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
            <Link href="/classic" className="underline underline-offset-4 hover:text-black">
              Classic layout
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
