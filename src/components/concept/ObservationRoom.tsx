"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Pt = [number, number];

const INK = "#1f2a44";

// ---------------------------------------------------------------- world
const NODES: Record<string, Pt> = {
  bed: [245, 232],
  ward: [315, 232],
  stT: [386, 232],
  b1: [450, 232],
  sink: [520, 232],
  shower: [650, 232],
  sofa: [175, 424],
  l2: [290, 424],
  stB: [338, 424],
  k1: [430, 424],
  table: [490, 424],
  stove: [610, 424],
  fridge: [655, 424],
};

const EDGES: [string, string][] = [
  ["bed", "ward"],
  ["ward", "stT"],
  ["stT", "b1"],
  ["b1", "sink"],
  ["sink", "shower"],
  ["sofa", "l2"],
  ["l2", "stB"],
  ["stB", "k1"],
  ["k1", "table"],
  ["table", "stove"],
  ["stove", "fridge"],
  ["stB", "stT"],
];

const d = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

function route(from: string, to: string): Pt[] {
  if (from === to) return [NODES[from]];
  const dist: Record<string, number> = {};
  const prev: Record<string, string> = {};
  const todo = new Set(Object.keys(NODES));
  Object.keys(NODES).forEach((k) => (dist[k] = Infinity));
  dist[from] = 0;
  while (todo.size) {
    let u = "";
    todo.forEach((k) => {
      if (!u || dist[k] < dist[u]) u = k;
    });
    todo.delete(u);
    if (u === to) break;
    EDGES.forEach(([a, b]) => {
      if (a !== u && b !== u) return;
      const v = a === u ? b : a;
      const alt = dist[u] + d(NODES[a], NODES[b]);
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    });
  }
  const out: string[] = [];
  let c = to;
  while (c) {
    out.unshift(c);
    c = prev[c];
  }
  return out.map((k) => NODES[k]);
}

type Station = { node: string; label: string; note: string; need: boolean };
const STATIONS: Record<string, Station> = {
  bed: { node: "bed", label: "waking up", note: "Wakes late: nothing cues the start of the day.", need: true },
  ward: { node: "ward", label: "choosing clothes", note: "Choosing clothes takes far longer without a visual guide.", need: true },
  sink: { node: "sink", label: "brushing teeth", note: "Needs a prompt to start, and stops halfway.", need: true },
  shower: { node: "shower", label: "washing up", note: "Water temperature is hard to read.", need: true },
  sofa: { node: "sofa", label: "relaxing", note: "Long idle stretch: low engagement with the day plan.", need: false },
  table: { node: "table", label: "eating", note: "Eats alone; meal times drift day to day.", need: false },
  stove: { node: "stove", label: "cooking", note: "Skips a step when the recipe isn't visual.", need: true },
  fridge: { node: "fridge", label: "opening the fridge", note: "Can't reach the top shelf: needs support.", need: true },
};

type Persona = { id: string; color: string; hair: string; routine: [string, number][] };
const PERSONAS: Persona[] = [
  { id: "P1", color: "#ff6b4a", hair: "#3b2a20", routine: [["bed", 3], ["ward", 3], ["sink", 3], ["fridge", 2.5], ["stove", 4], ["table", 4], ["sofa", 5]] },
  { id: "P2", color: "#4c7df0", hair: "#1f2a44", routine: [["stove", 3.5], ["table", 4], ["sofa", 4], ["bed", 3], ["shower", 3.5], ["fridge", 2.5]] },
  { id: "P3", color: "#f5b301", hair: "#7a4a1f", routine: [["sofa", 5], ["fridge", 2.5], ["table", 4], ["sink", 3], ["ward", 3], ["bed", 3]] },
  { id: "P4", color: "#4caf6a", hair: "#2b2b2b", routine: [["shower", 3.5], ["ward", 3], ["stove", 4], ["fridge", 2], ["table", 4], ["sofa", 4]] },
  { id: "P5", color: "#e46cb0", hair: "#5a2a4a", routine: [["table", 3.5], ["sofa", 4], ["bed", 3.5], ["sink", 3], ["stove", 3.5], ["fridge", 2.5]] },
];

type Agent = {
  p: Persona;
  i: number;
  mode: "walk" | "do";
  path: Pt[];
  seg: number;
  pos: Pt;
  left: number;
  face: 1 | -1;
  node: string;
  comfort: number;
  nSeen: number;
};

function makeAgent(p: Persona, offset: number): Agent {
  const i = offset % p.routine.length;
  const st = STATIONS[p.routine[i][0]];
  return {
    p,
    i,
    mode: "do",
    path: [],
    seg: 0,
    pos: [...NODES[st.node]] as Pt,
    left: p.routine[i][1] * (0.3 + offset * 0.18),
    face: 1,
    node: st.node,
    comfort: 0.6,
    nSeen: 0,
  };
}

type Note = { id: number; who: string; time: string; text: string; need: boolean; color: string };

// ---------------------------------------------------------------- helpers
const DAY = 96; // seconds for 07:00 -> 23:00
const clockAt = (t: number) => {
  const m = 7 * 60 + ((t % DAY) / DAY) * 16 * 60;
  const hh = Math.floor(m / 60);
  const mm = Math.floor(m % 60);
  return { hh, mm, label: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}` };
};
const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
function skyAt(hh: number, mm: number) {
  const h = hh + mm / 60;
  const day = [191, 227, 255];
  const dusk = [248, 184, 139];
  const night = [42, 59, 102];
  let c = day;
  if (h < 8) c = mix(dusk, day, (h - 7) / 1);
  else if (h < 17) c = day;
  else if (h < 19.5) c = mix(day, dusk, (h - 17) / 2.5);
  else c = mix(dusk, night, Math.min(1, (h - 19.5) / 2));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
const nightOpacity = (hh: number, mm: number) => {
  const h = hh + mm / 60;
  return h < 19 ? 0 : Math.min(0.32, (h - 19) * 0.1);
};

// ---------------------------------------------------------------- sprite
function Sprite({ color, hair, face, bob }: { color: string; hair: string; face: 1 | -1; bob: number }) {
  return (
    <g transform={`scale(${face} 1)`}>
      <ellipse cx="0" cy="1" rx="10" ry="3" fill="rgba(31,42,68,0.22)" />
      <g transform={`translate(0 ${bob})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <rect x="-6" y="-8" width="5" height="9" rx="1" fill="#2b3350" />
        <rect x="1" y="-8" width="5" height="9" rx="1" fill="#2b3350" />
        <rect x="-8" y="-24" width="16" height="17" rx="3" fill={color} />
        <rect x="-7" y="-39" width="14" height="14" rx="4" fill="#ffd9b8" />
        <path d="M-8,-33 Q-8,-43 0,-43 Q8,-43 8,-33 L8,-35 L-8,-35 Z" fill={hair} />
        <rect x="-4" y="-33" width="2.4" height="3" fill={INK} stroke="none" />
        <rect x="2" y="-33" width="2.4" height="3" fill={INK} stroke="none" />
      </g>
    </g>
  );
}

// ---------------------------------------------------------------- component
type Snap = {
  t: number;
  a: { id: string; color: string; hair: string; pos: Pt; face: 1 | -1; mode: "walk" | "do"; i: number; routine: [string, number][] }[];
};
const toSnap = (agents: Agent[], t: number): Snap => ({
  t,
  a: agents.map((x) => ({
    id: x.p.id,
    color: x.p.color,
    hair: x.p.hair,
    pos: x.pos,
    face: x.face,
    mode: x.mode,
    i: x.i,
    routine: x.p.routine,
  })),
});

export default function ObservationRoom() {
  const [init] = useState(() => PERSONAS.map((p, i) => makeAgent(p, i)));
  const agents = useRef<Agent[]>(init);
  const clock = useRef(0);
  const noteId = useRef(0);
  const sample = useRef(0);
  const [snap, setSnap] = useState<Snap>(() => toSnap(init, 0));
  const [notes, setNotes] = useState<Note[]>([]);
  const [needs, setNeeds] = useState(0);
  const [curve, setCurve] = useState<number[]>(() => Array(60).fill(0.6));
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
  const [hov, setHov] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const emit = useCallback((a: Agent, st: Station) => {
    const { label } = clockAt(clock.current);
    const n: Note = {
      id: ++noteId.current,
      who: a.p.id,
      time: label,
      text: st.note,
      need: st.need,
      color: a.p.color,
    };
    setNotes((arr) => [n, ...arr].slice(0, 4));
    if (st.need) setNeeds((x) => x + 1);
  }, []);

  const startDo = useCallback(
    (a: Agent) => {
      const [sid, dur] = a.p.routine[a.i];
      const st = STATIONS[sid];
      a.mode = "do";
      a.left = dur;
      a.node = st.node;
      a.nSeen += 1;
      a.comfort = st.need ? 0.22 : 0.78;
      if (a.nSeen % 2 === 1 || st.need) emit(a, st);
    },
    [emit]
  );

  const tick = useCallback(
    (dt: number) => {
      clock.current += dt;
      agents.current.forEach((a) => {
        if (a.mode === "do") {
          a.left -= dt;
          a.comfort += (0.6 - a.comfort) * dt * 0.18;
          if (a.left <= 0) {
            a.i = (a.i + 1) % a.p.routine.length;
            const next = STATIONS[a.p.routine[a.i][0]];
            a.path = route(a.node, next.node);
            a.seg = 0;
            a.mode = "walk";
            a.comfort = 0.55;
          }
        } else {
          let move = 72 * dt;
          while (move > 0 && a.seg < a.path.length - 1) {
            const to = a.path[a.seg + 1];
            const dd = d(a.pos, to);
            if (dd <= move) {
              a.pos = [...to] as Pt;
              move -= dd;
              a.seg += 1;
            } else {
              const k = move / dd;
              if (Math.abs(to[0] - a.pos[0]) > 0.5) a.face = to[0] > a.pos[0] ? 1 : -1;
              a.pos = [a.pos[0] + (to[0] - a.pos[0]) * k, a.pos[1] + (to[1] - a.pos[1]) * k];
              move = 0;
            }
          }
          if (a.seg >= a.path.length - 1) startDo(a);
        }
      });
      sample.current += dt;
      if (sample.current > 0.6) {
        sample.current = 0;
        const avg = agents.current.reduce((s, a) => s + a.comfort, 0) / agents.current.length;
        setCurve((c) => [...c.slice(1), avg]);
      }
    },
    [startDo]
  );

  useEffect(() => {
    // first note without waiting for the first station change
    agents.current.forEach((a, i) => {
      if (i < 2) startDo(a);
    });
  }, [startDo]);

  useEffect(() => {
    if (!playing || !visible) {
      last.current = null;
      return;
    }
    let raf = 0;
    const loop = (now: number) => {
      if (last.current != null) {
        const dt = Math.min(0.05, (now - last.current) / 1000) * speed;
        tick(dt);
        setSnap(toSnap(agents.current, clock.current));
      }
      last.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, speed, tick]);

  const { hh, mm, label } = clockAt(snap.t);
  const sky = skyAt(hh, mm);
  const night = nightOpacity(hh, mm);
  const focus = hov ?? sel;
  const focusAgent = snap.a.find((a) => a.id === focus);

  const chart = useMemo(() => {
    const w = 220;
    const h = 46;
    return curve
      .map((v, i) => `${(i / (curve.length - 1)) * w},${h - v * h}`)
      .join(" ");
  }, [curve]);

  return (
    <div ref={wrap} className="w-full">
      {/* observation window */}
      <div
        className="rounded-[26px] border-[3px] bg-[#1f2a44] p-2.5"
        style={{ borderColor: INK, boxShadow: `8px 8px 0 ${INK}` }}
      >
        <div className="relative overflow-hidden rounded-[18px]" style={{ background: "#cfe8fb" }}>
          <svg viewBox="0 0 800 490" className="block h-auto w-full" role="img" aria-label="A simulated home where five agents go about a day while a designer observes">
            <defs>
              <pattern id="wp-pink" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#ffe0ea" />
                <circle cx="8" cy="8" r="1.6" fill="#ffc2d4" />
              </pattern>
              <pattern id="wp-aqua" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#d9f0f2" />
                <path d="M0,0 H20 M0,0 V20" stroke="#b9dde1" strokeWidth="1" />
              </pattern>
              <pattern id="wp-blue" width="18" height="18" patternUnits="userSpaceOnUse">
                <rect width="18" height="18" fill="#e4edff" />
                <path d="M0,18 L18,0" stroke="#cbdafc" strokeWidth="1.4" />
              </pattern>
              <pattern id="wp-cream" width="14" height="14" patternUnits="userSpaceOnUse">
                <rect width="14" height="14" fill="#fff0c9" />
                <rect width="7" height="14" fill="#ffe8ac" />
              </pattern>
              <pattern id="wood" width="30" height="14" patternUnits="userSpaceOnUse">
                <rect width="30" height="14" fill="#e0b27a" />
                <path d="M0,13 H30 M15,0 V13" stroke="#c99560" strokeWidth="1" />
              </pattern>
            </defs>

            {/* sky + ground */}
            <rect width="800" height="490" fill="#cfe8fb" />
            <ellipse cx="110" cy="62" rx="70" ry="16" fill="#fff" opacity="0.9" />
            <ellipse cx="150" cy="52" rx="44" ry="14" fill="#fff" opacity="0.9" />
            <ellipse cx="690" cy="40" rx="60" ry="14" fill="#fff" opacity="0.8" />
            <rect x="0" y="470" width="800" height="20" fill="#8fd49a" />

            {/* house shell */}
            <rect x="30" y="24" width="740" height="446" rx="14" fill="#fff8ec" stroke={INK} strokeWidth="4" />

            {/* rooms */}
            <rect x="60" y="44" width="340" height="188" fill="url(#wp-pink)" />
            <rect x="400" y="44" width="340" height="188" fill="url(#wp-aqua)" />
            <rect x="60" y="246" width="340" height="178" fill="url(#wp-blue)" />
            <rect x="400" y="246" width="340" height="178" fill="url(#wp-cream)" />

            {/* floors */}
            <rect x="60" y="232" width="680" height="14" fill="url(#wood)" stroke={INK} strokeWidth="2.5" />
            <rect x="60" y="424" width="680" height="16" fill="url(#wood)" stroke={INK} strokeWidth="2.5" />

            {/* partitions with doorways */}
            <path d="M400,44 V150 M400,246 V342" stroke={INK} strokeWidth="5" />

            {/* ---- bedroom */}
            <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
              <rect x="150" y="76" width="74" height="62" rx="4" fill={sky} />
              <path d="M187,76 V138 M150,107 H224" strokeWidth="2" />
              <path d="M142,72 Q150,100 144,142 L158,142 Q164,100 156,72 Z" fill="#ff9db8" />
              <rect x="70" y="176" width="12" height="56" rx="2" fill="#a86a3a" />
              <rect x="82" y="204" width="152" height="28" rx="4" fill="#fff" />
              <rect x="132" y="204" width="102" height="28" rx="4" fill="#ff6b4a" />
              <rect x="88" y="192" width="38" height="14" rx="6" fill="#fff" />
              <rect x="288" y="118" width="54" height="114" rx="3" fill="#c98a4b" />
              <path d="M315,118 V232" />
              <circle cx="310" cy="178" r="2.2" fill={INK} />
              <circle cx="320" cy="178" r="2.2" fill={INK} />
            </g>

            {/* ---- bathroom */}
            <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
              <rect x="492" y="96" width="58" height="62" rx="5" fill="#eaf8fb" />
              <path d="M498,150 L520,104" stroke="#fff" strokeWidth="3" />
              <rect x="478" y="196" width="84" height="36" rx="3" fill="#fff" />
              <rect x="488" y="188" width="64" height="10" rx="4" fill="#cfe9f0" />
              <path d="M520,188 v-12 h10" fill="none" />
              <rect x="612" y="106" width="96" height="126" rx="4" fill="rgba(160,215,235,0.45)" />
              <path d="M626,106 v-16 h26" fill="none" />
              <circle cx="654" cy="92" r="6" fill="#cfe9f0" />
              <rect x="430" y="204" width="26" height="28" rx="3" fill="#fff" />
              <rect x="432" y="186" width="22" height="18" rx="3" fill="#fff" />
            </g>

            {/* ---- living */}
            <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
              <rect x="118" y="286" width="92" height="66" rx="4" fill={sky} />
              <path d="M164,286 V352 M118,319 H210" strokeWidth="2" />
              <rect x="90" y="364" width="152" height="60" rx="6" fill="#4c7df0" />
              <rect x="90" y="364" width="152" height="26" rx="6" fill="#3a66d1" />
              <rect x="100" y="394" width="60" height="18" rx="5" fill="#6d96f5" />
              <rect x="170" y="394" width="60" height="18" rx="5" fill="#6d96f5" />
              <rect x="256" y="404" width="18" height="20" rx="2" fill="#d97a4a" />
              <path d="M265,404 Q250,376 258,360 Q268,380 274,366 Q282,384 265,404 Z" fill="#4caf6a" />
              <rect x="276" y="378" width="62" height="46" rx="2" fill="#a86a3a" />
              <rect x="282" y="340" width="52" height="36" rx="3" fill="#1f2a44" />
              <rect x="286" y="344" width="44" height="28" rx="2" fill="#3e5a8a" />
            </g>

            {/* stairs */}
            <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
              <polygon points="326,424 396,232 396,424" fill="#e0b27a" />
              {Array.from({ length: 9 }).map((_, k) => (
                <path key={k} d={`M${326 + k * 7.7},${424 - k * 21.3} h${70 - k * 7.7}`} strokeWidth="1.6" />
              ))}
            </g>

            {/* ---- kitchen */}
            <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
              <rect x="556" y="288" width="84" height="62" rx="4" fill={sky} />
              <path d="M598,288 V350" strokeWidth="2" />
              <rect x="540" y="258" width="130" height="22" rx="3" fill="#fff" />
              <rect x="556" y="380" width="106" height="44" rx="3" fill="#fff" />
              <rect x="556" y="374" width="106" height="8" rx="2" fill="#dfe6ee" />
              <ellipse cx="584" cy="372" rx="12" ry="4" fill="#3a3f55" />
              <ellipse cx="632" cy="372" rx="12" ry="4" fill="#3a3f55" />
              <rect x="676" y="296" width="52" height="128" rx="5" fill="#e9eef5" />
              <path d="M676,350 H728" />
              <rect x="682" y="320" width="4" height="22" rx="2" fill={INK} />
              <rect x="682" y="360" width="4" height="22" rx="2" fill={INK} />
              <rect x="452" y="400" width="82" height="8" rx="2" fill="#a86a3a" />
              <path d="M460,408 v16 M526,408 v16" />
              <rect x="440" y="396" width="8" height="28" rx="2" fill="#d97a4a" />
              <rect x="538" y="396" width="8" height="28" rx="2" fill="#d97a4a" />
            </g>

            {/* lighting for evening */}
            <rect x="30" y="24" width="740" height="446" rx="14" fill="#0b1a3a" opacity={night} pointerEvents="none" />

            {/* agents, back to front */}
            {[...snap.a]
              .sort((a, b) => a.pos[1] - b.pos[1])
              .map((a) => {
                const walking = a.mode === "walk";
                const bob = walking ? Math.sin(snap.t * 16 + a.id.charCodeAt(1)) * 1.6 : 0;
                const on = focus === a.id;
                return (
                  <g
                    key={a.id}
                    transform={`translate(${a.pos[0]} ${a.pos[1]}) scale(1.22)`}
                    className="cursor-pointer"
                    onPointerEnter={() => setHov(a.id)}
                    onPointerLeave={() => setHov(null)}
                    onClick={() => setSel((s) => (s === a.id ? null : a.id))}
                  >
                    <rect x="-18" y="-50" width="36" height="58" fill="transparent" />
                    <Sprite color={a.color} hair={a.hair} face={a.face} bob={bob} />
                    <path
                      d={`M0,${-56 - (on ? 2 : 0)} l${on ? 6 : 4.5},7 l${on ? -6 : -4.5},7 l${on ? -6 : -4.5},-7 z`}
                      fill={a.color}
                      stroke={INK}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}

            {/* reticle + callout for the focused agent */}
            {focusAgent && (
              <g transform={`translate(${focusAgent.pos[0]} ${focusAgent.pos[1] - 27}) scale(1.1)`} pointerEvents="none">
                {[
                  [-24, -34, 1, 1],
                  [24, -34, -1, 1],
                  [-24, 28, 1, -1],
                  [24, 28, -1, -1],
                ].map(([x, y, sx, sy], i) => (
                  <path
                    key={i}
                    d={`M${x},${y + sy * 9} V${y} H${x + sx * 9}`}
                    fill="none"
                    stroke={INK}
                    strokeWidth="2.6"
                  />
                ))}
                <g transform="translate(0 -52)">
                  <rect x="-62" y="-14" width="124" height="22" rx="11" fill="#fff" stroke={INK} strokeWidth="2.2" />
                  <text x="0" y="1" textAnchor="middle" fontSize="11" fill={INK} style={{ fontFamily: "var(--font-pixel)" }}>
                    {focusAgent.id} ·{" "}
                    {focusAgent.mode === "walk" ? "walking" : STATIONS[focusAgent.routine[focusAgent.i][0]].label}
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* observation overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 text-[12px]" style={{ fontFamily: "var(--font-pixel)", color: "#fff" }}>
            <span className="flex items-center gap-2 rounded-md bg-[#1f2a44]/85 px-2.5 py-1">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff4d4d]" />
              REC · observation room · session 07
            </span>
            <span className="rounded-md bg-[#1f2a44]/85 px-2.5 py-1">Day 1 · {label}</span>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.12) 70%, rgba(255,255,255,0) 71%), radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(10,20,45,0.38) 100%)",
            }}
          />
        </div>

        {/* observer's desk */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 pb-0.5 text-white" style={{ fontFamily: "var(--font-pixel)" }}>
          <div className="flex items-center gap-1.5 text-[12px]">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 hover:bg-white/30"
            >
              {playing ? (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><rect x="3" y="2" width="3.4" height="12" /><rect x="9.6" y="2" width="3.4" height="12" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M4 2v12l10-6z" /></svg>
              )}
            </button>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`h-7 rounded-md px-2 ${speed === s ? "bg-white text-[#1f2a44]" : "bg-white/15 hover:bg-white/30"}`}
              >
                {s}×
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-white/60">journey curve</span>
            <svg viewBox="0 0 220 46" className="h-7 w-[150px]">
              <line x1="0" y1="23" x2="220" y2="23" stroke="rgba(255,255,255,0.25)" strokeDasharray="3 4" />
              <polyline points={chart} fill="none" stroke="#7fe0b5" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[12px]">
            <span className="text-white/60">unmet needs found</span>
            <span className="rounded-md bg-[#ff6b4a] px-2 py-0.5 text-[13px] text-white">{needs}</span>
          </div>
        </div>
      </div>

      {/* field notes */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {notes.length === 0 && (
          <p className="text-sm text-[#1f2a44]/60">Waiting for the first observation…</p>
        )}
        {notes.map((n, i) => (
          <div
            key={n.id}
            className="relative rounded-[3px] px-4 pb-3 pt-3.5 shadow-[3px_3px_0_rgba(31,42,68,0.9)]"
            style={{
              background: n.need ? "#fff0a8" : "#d9f0e4",
              border: `2px solid ${INK}`,
              transform: `rotate(${[-1.2, 0.9, -0.6, 1.1][i % 4]}deg)`,
            }}
          >
            <span className="absolute -top-2 left-3 h-3 w-8 rounded-sm bg-[#1f2a44]/15" />
            <p className="flex items-center gap-2 text-[11px] text-[#1f2a44]/70" style={{ fontFamily: "var(--font-pixel)" }}>
              <span className="h-2.5 w-2.5 rounded-full border border-[#1f2a44]" style={{ background: n.color }} />
              {n.who} · {n.time}
              {n.need && <span className="ml-auto rounded bg-[#ff6b4a] px-1.5 text-white">need</span>}
            </p>
            <p className="mt-1.5 text-[1.28rem] leading-[1.05] text-[#1f2a44]" style={{ fontFamily: "var(--font-hand)" }}>
              {n.text}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[#1f2a44]/55">
        Simulated agents and illustrative field notes. Hover or click a persona to follow them.
      </p>
    </div>
  );
}
