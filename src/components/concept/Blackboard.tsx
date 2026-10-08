"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ObservationRoom, { ZONES, type Note, type ZoneId } from "@/components/concept/ObservationRoom";
import { whyQuote } from "@/data/concept";

const CHALK = "#f1efe6";
const BOARD = "#1f2b27";

const STAGES = ["Morning", "Midday", "Afternoon", "Evening"];
const STAGE_HOURS = ["07 – 11", "11 – 15", "15 – 19", "19 – 23"];
const stageOf = (h: number) => (h < 11 ? 0 : h < 15 ? 1 : h < 19 ? 2 : 3);

const HMW: Record<ZoneId, string> = {
  home: "HMW cue the start of the day without nagging?",
  clinic: "HMW make forms and waiting legible at a glance?",
  mall: "HMW make wayfinding concrete, not abstract?",
  lobby: "HMW let the robot match each person's pace?",
};

type Sticky = { key: string; kind: "need" | "works" | "hmw"; text: string; who?: string; color?: string; time?: string; zone: ZoneId; stage: number };

const tilt = (k: string) => {
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 997;
  return ((h % 70) - 35) / 10; // -3.5..3.5 deg
};

function Sticky({ s, onHover, onPick }: { s: Sticky; onHover: (id: string | null) => void; onPick: (id: string) => void }) {
  const bg = s.kind === "need" ? "#ffe27a" : s.kind === "works" ? "#bff0c9" : "#ffb3c7";
  return (
    <button
      type="button"
      onPointerEnter={() => s.who && onHover(s.who)}
      onPointerLeave={() => onHover(null)}
      onClick={() => s.who && onPick(s.who)}
      className="stick relative w-[132px] shrink-0 rounded-[2px] px-2.5 pb-2 pt-3 text-left shadow-[0_6px_10px_-4px_rgba(0,0,0,0.6)] transition-transform hover:z-10 hover:scale-105"
      style={{ background: bg, transform: `rotate(${tilt(s.key)}deg)`, color: "#1f2a44" }}
    >
      <span className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-[#e2493a] shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.25)]" />
      {s.who && (
        <span className="mb-0.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide opacity-70">
          <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
          {s.who} · {s.time}
        </span>
      )}
      <span className="block text-[1.02rem] leading-[1.02]" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
        {s.text}
      </span>
    </button>
  );
}

export default function Blackboard() {
  const [cells, setCells] = useState<Record<string, Sticky[]>>({});
  const [hmw, setHmw] = useState<Record<string, Sticky>>({});
  const needCount = useRef<Record<string, number>>({});
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [stuck, setStuck] = useState(0);
  const board = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = board.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onNote = useCallback((n: Note) => {
    const stage = stageOf(n.hour);
    const key = `${n.zone}-${stage}`;
    const sticky: Sticky = {
      key: `n${n.id}`,
      kind: n.need ? "need" : "works",
      text: n.text,
      who: n.who,
      color: n.color,
      time: n.time,
      zone: n.zone,
      stage,
    };
    setCells((c) => ({ ...c, [key]: [sticky, ...(c[key] ?? [])].slice(0, 3) }));
    setStuck((x) => x + 1);
    if (n.need) {
      const c = (needCount.current[n.zone] = (needCount.current[n.zone] ?? 0) + 1);
      if (c === 2) {
        setHmw((h) => (h[n.zone] ? h : { ...h, [n.zone]: { key: `h-${n.zone}`, kind: "hmw", text: HMW[n.zone], zone: n.zone, stage: 4 } }));
      }
    }
  }, []);

  return (
    <section ref={board} className="mx-auto max-w-[1240px] px-4 pt-6 sm:px-6">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="chalk">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
      </svg>
      <style>{`@keyframes stick{0%{opacity:0;translate:0 -26px;scale:1.35}60%{opacity:1}100%{opacity:1;translate:0 0;scale:1}} .stick{animation:stick .55s cubic-bezier(.2,.9,.3,1) both}`}</style>

      {/* wooden frame + board */}
      <div
        className="rounded-[10px] p-3 sm:p-4"
        style={{
          background: "linear-gradient(135deg,#a47443,#6e4520)",
          boxShadow: "0 30px 50px -30px rgba(29,27,24,0.8), inset 0 0 0 2px rgba(255,255,255,0.15)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[4px] px-4 pb-10 pt-8 sm:px-8"
          style={{
            background: `radial-gradient(900px 400px at 20% 10%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(700px 300px at 85% 60%, rgba(255,255,255,0.05), transparent 60%), ${BOARD}`,
            boxShadow: "inset 0 0 70px rgba(0,0,0,0.55)",
            color: CHALK,
          }}
        >
          {/* header: chalk title + intro notes */}
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] opacity-60" style={{ filter: "url(#chalk)" }}>
                Sang-yun &ldquo;Yun&rdquo; Lee · strategic designer
              </p>
              <h1
                className="mt-4 font-[family-name:var(--font-instrument)] text-[clamp(2.8rem,6.4vw,5.6rem)] leading-[0.95] tracking-[-0.01em]"
                style={{ filter: "url(#chalk)" }}
              >
                Designing for <em style={{ color: "#ff9d8a" }}>vulnerability,</em> with data &amp; AI.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed opacity-75" style={{ filter: "url(#chalk)" }}>
                I run tiny worlds of simulated people, watch where a service lets them down, and stick
                it on the wall until a design question appears.
              </p>
              <p className="mt-6 text-[1.6rem] leading-none" style={{ fontFamily: "var(--font-hand)", color: "#9bd7ff", filter: "url(#chalk)" }}>
                the screen →  five personas, one ordinary day
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="relative w-[210px] -rotate-2 rounded-[2px] bg-[#bfe0ff] px-3.5 pb-3 pt-4 text-[#1f2a44] shadow-[0_8px_12px_-5px_rgba(0,0,0,0.6)]">
                  <span className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-[#e2493a]" />
                  <p className="text-[1.25rem] leading-[1.02]" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
                    &ldquo;{whyQuote}&rdquo;
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-wide opacity-65">asked since childhood</p>
                </div>
                <div className="relative w-[170px] rotate-2 rounded-[2px] bg-[#fff0a8] px-3.5 pb-3 pt-4 text-[#1f2a44] shadow-[0_8px_12px_-5px_rgba(0,0,0,0.6)]">
                  <span className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-[#e2493a]" />
                  <p className="text-[10px] uppercase tracking-wide opacity-65">now</p>
                  <p className="text-[1.2rem] leading-[1.02]" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
                    UPenn M:IPD: engineering × design × Wharton
                  </p>
                </div>
                <div className="relative w-[150px] -rotate-1 rounded-[2px] bg-[#bff0c9] px-3.5 pb-3 pt-4 text-[#1f2a44] shadow-[0_8px_12px_-5px_rgba(0,0,0,0.6)]">
                  <span className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-[#e2493a]" />
                  <p className="text-[10px] uppercase tracking-wide opacity-65">method</p>
                  <p className="text-[1.2rem] leading-[1.02]" style={{ fontFamily: "var(--font-hand)", fontWeight: 600 }}>
                    Basic → Data → AI
                  </p>
                </div>
              </div>
            </div>

            {/* monitor pinned to the board */}
            <div className="relative">
              <span className="absolute -top-2 left-8 z-10 h-4 w-16 rotate-[-4deg] bg-[#f4e7b0]/80" />
              <span className="absolute -top-2 right-8 z-10 h-4 w-16 rotate-[3deg] bg-[#f4e7b0]/80" />
              <div className="rounded-[6px] bg-[#f3f1e8] p-2 shadow-[0_18px_30px_-12px_rgba(0,0,0,0.8)]">
                <ObservationRoom
                  chrome={false}
                  showNotes={false}
                  showLanes={false}
                  onNote={onNote}
                  hoverId={hover}
                  selected={sel}
                  onSelectedChange={setSel}
                  active={live}
                />
              </div>
            </div>
          </div>

          {/* wall: journey map built from the field notes */}
          <div className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-[2.1rem] leading-none" style={{ fontFamily: "var(--font-hand)", fontWeight: 700, filter: "url(#chalk)" }}>
                the wall <span className="opacity-55">· journey map, live</span>
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-wide opacity-80">
                <span className="flex items-center gap-1.5"><i className="h-3 w-3 bg-[#ffe27a]" /> pain point</span>
                <span className="flex items-center gap-1.5"><i className="h-3 w-3 bg-[#bff0c9]" /> what works</span>
                <span className="flex items-center gap-1.5"><i className="h-3 w-3 bg-[#ffb3c7]" /> design question</span>
                <span className="opacity-60">{stuck} notes stuck</span>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto pb-2 [scrollbar-width:thin]">
              <div className="grid min-w-[1060px] grid-cols-[104px_repeat(5,minmax(0,1fr))]" style={{ filter: "url(#chalk)" }}>
                <div />
                {[...STAGES, "How might we…"].map((s, i) => (
                  <div key={s} className="border-b-2 border-dashed border-white/25 px-2 pb-2 text-center">
                    <p className="text-[1.35rem] leading-none" style={{ fontFamily: "var(--font-hand)", fontWeight: 700, color: i === 4 ? "#ffb3c7" : CHALK }}>
                      {s}
                    </p>
                    {i < 4 && <p className="mt-0.5 text-[9px] uppercase tracking-widest opacity-45">{STAGE_HOURS[i]}</p>}
                  </div>
                ))}
              </div>
              {ZONES.map((z) => (
                <div key={z.id} className="grid min-w-[1060px] grid-cols-[104px_repeat(5,minmax(0,1fr))] border-b border-dashed border-white/15">
                  <div className="flex items-center gap-2 px-1 py-3" style={{ filter: "url(#chalk)" }}>
                    <span className="h-3 w-3 rounded-full" style={{ background: z.color }} />
                    <span className="text-[1.25rem] leading-none" style={{ fontFamily: "var(--font-hand)", fontWeight: 700 }}>
                      {z.name}
                    </span>
                  </div>
                  {[0, 1, 2, 3].map((st) => (
                    <div key={st} className="flex min-h-[132px] flex-wrap content-start gap-x-1 gap-y-2 border-l border-dashed border-white/15 px-2 py-3">
                      {(cells[`${z.id}-${st}`] ?? []).map((s) => (
                        <Sticky key={s.key} s={s} onHover={setHover} onPick={setSel} />
                      ))}
                    </div>
                  ))}
                  <div className="flex min-h-[132px] items-start border-l border-dashed border-white/15 px-2 py-3">
                    {hmw[z.id] && <Sticky s={hmw[z.id]} onHover={setHover} onPick={setSel} />}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] opacity-50">
              Notes are generated by the simulated personas as they move (illustrative). Hover a note to
              find its persona in the screen above, click to follow them.
            </p>
          </div>

          {/* chalk tray */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-[#7a5028] to-[#5a3a1c]" />
          <div className="pointer-events-none absolute bottom-3 right-10 flex items-end gap-1.5">
            <span className="h-2 w-10 rotate-[-4deg] rounded-full bg-[#f4f2ea]" />
            <span className="h-2 w-8 rounded-full bg-[#ff9d8a]" />
            <span className="h-3.5 w-12 rounded-[2px] bg-[#3a3f3c]" />
          </div>
        </div>
      </div>
    </section>
  );
}
