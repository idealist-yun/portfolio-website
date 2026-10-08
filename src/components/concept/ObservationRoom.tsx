"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { featured, hrefFor } from "@/data/concept";

type Pt = [number, number];

const INK = "#1f2a44";
const LINE = "#7d92b4"; // soft outline used on the iso scene

// ------------------------------------------------------------ iso projection
const TW = 72;
const TH = 36;
const OX = 430;
const OY = 190;
const W = 11; // along gx (right wall length)
const D = 9; // along gy (left wall length)
const HZ = 140; // wall height in px

const P = (gx: number, gy: number, z = 0): Pt => [OX + ((gx - gy) * TW) / 2, OY + ((gx + gy) * TH) / 2 - z];
const pts = (a: Pt[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

// ------------------------------------------------------------ colours
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c: number[]) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mixc = (h: string, t: string, k: number) => {
  const a = hex(h);
  const b = hex(t);
  return toHex(a.map((v, i) => v + (b[i] - v) * k));
};
const faces = (base: string) => ({
  top: mixc(base, "#ffffff", 0.35),
  left: base,
  right: mixc(base, "#5b6b8c", 0.22),
});

// ------------------------------------------------------------ world graph (grid coords)
const NODES: Record<string, Pt> = {
  hub: [5.4, 5.0],
  bed: [3.1, 2.6],
  ward: [1.9, 6.3],
  sink: [1.8, 4.8],
  shower: [9.0, 6.6],
  sofa: [3.9, 4.45],
  table: [7.6, 4.6],
  stove: [7.4, 1.8],
  fridge: [10.2, 1.9],
};

const EDGES: [string, string][] = [
  ["hub", "bed"],
  ["hub", "ward"],
  ["hub", "sink"],
  ["hub", "shower"],
  ["hub", "sofa"],
  ["hub", "table"],
  ["hub", "stove"],
  ["bed", "sink"],
  ["sink", "ward"],
  ["stove", "fridge"],
  ["stove", "table"],
  ["table", "shower"],
];

const dist2 = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

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
      const alt = dist[u] + dist2(NODES[a], NODES[b]);
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

type Station = { node: string; label: string; note: string; need: boolean; sit?: boolean };
const STATIONS: Record<string, Station> = {
  bed: { node: "bed", label: "waking up", note: "Wakes late: nothing cues the start of the day.", need: true },
  ward: { node: "ward", label: "choosing clothes", note: "Choosing clothes takes far longer without a visual guide.", need: true },
  sink: { node: "sink", label: "brushing teeth", note: "Needs a prompt to start, and stops halfway.", need: true },
  shower: { node: "shower", label: "washing up", note: "Water temperature is hard to read.", need: true },
  sofa: { node: "sofa", label: "relaxing", note: "Long idle stretch: low engagement with the day plan.", need: false, sit: true },
  table: { node: "table", label: "eating", note: "Eats alone; meal times drift day to day.", need: false },
  stove: { node: "stove", label: "cooking", note: "Skips a step when the recipe isn't visual.", need: true },
  fridge: { node: "fridge", label: "opening the fridge", note: "Can't reach the top shelf: needs support.", need: true },
};

type Persona = { id: string; color: string; hair: string; routine: [string, number][] };
const PERSONAS: Persona[] = [
  { id: "P1", color: "#ff7a6b", hair: "#3b2a20", routine: [["bed", 3], ["ward", 3], ["sink", 3], ["fridge", 2.5], ["stove", 4], ["table", 4], ["sofa", 5]] },
  { id: "P2", color: "#6a9bff", hair: "#1f2a44", routine: [["stove", 3.5], ["table", 4], ["sofa", 4], ["bed", 3], ["shower", 3.5], ["fridge", 2.5]] },
  { id: "P3", color: "#ffc93c", hair: "#7a4a1f", routine: [["sofa", 5], ["fridge", 2.5], ["table", 4], ["sink", 3], ["ward", 3], ["bed", 3]] },
  { id: "P4", color: "#5fc47f", hair: "#2b2b2b", routine: [["shower", 3.5], ["ward", 3], ["stove", 4], ["fridge", 2], ["table", 4], ["sofa", 4]] },
  { id: "P5", color: "#f58ac0", hair: "#5a2a4a", routine: [["table", 3.5], ["sofa", 4], ["bed", 3.5], ["sink", 3], ["stove", 3.5], ["fridge", 2.5]] },
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

// ------------------------------------------------------------ time of day
const DAY = 96;
const clockAt = (t: number) => {
  const m = 7 * 60 + ((t % DAY) / DAY) * 16 * 60;
  const hh = Math.floor(m / 60);
  const mm = Math.floor(m % 60);
  return { hh, mm, label: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}` };
};
const mixA = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
function skyAt(hh: number, mm: number) {
  const h = hh + mm / 60;
  const day = [176, 224, 255];
  const dusk = [250, 188, 140];
  const night = [48, 64, 108];
  let c = day;
  if (h < 8) c = mixA(dusk, day, h - 7);
  else if (h < 17) c = day;
  else if (h < 19.5) c = mixA(day, dusk, (h - 17) / 2.5);
  else c = mixA(dusk, night, Math.min(1, (h - 19.5) / 2));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
const nightOpacity = (hh: number, mm: number) => {
  const h = hh + mm / 60;
  return h < 19 ? 0 : Math.min(0.3, (h - 19) * 0.1);
};

// ------------------------------------------------------------ iso drawing helpers
type Item = { depth: number; el: ReactNode };

function Box({
  gx, gy, w, d, h, z = 0, base, stroke = LINE, children,
}: {
  gx: number; gy: number; w: number; d: number; h: number; z?: number; base: string; stroke?: string; children?: ReactNode;
}) {
  const c = faces(base);
  return (
    <g stroke={stroke} strokeWidth="1.3" strokeLinejoin="round">
      <polygon points={pts([P(gx, gy + d, z), P(gx + w, gy + d, z), P(gx + w, gy + d, z + h), P(gx, gy + d, z + h)])} fill={c.left} />
      <polygon points={pts([P(gx + w, gy, z), P(gx + w, gy + d, z), P(gx + w, gy + d, z + h), P(gx + w, gy, z + h)])} fill={c.right} />
      <polygon points={pts([P(gx, gy, z + h), P(gx + w, gy, z + h), P(gx + w, gy + d, z + h), P(gx, gy + d, z + h)])} fill={c.top} />
      {children}
    </g>
  );
}

const box = (depth: number, el: ReactNode): Item => ({ depth, el });

function buildItems(): Item[] {
  const it: Item[] = [];
  const key = (() => {
    let n = 0;
    return () => `f${n++}`;
  })();
  const add = (gx: number, gy: number, w: number, d: number, depthBias: number, el: ReactNode) =>
    it.push(box(gx + w / 2 + gy + d / 2 + depthBias, <g key={key()}>{el}</g>));

  // bed against the left wall
  add(0.1, 0.7, 0.25, 3.5, 0, <Box gx={0.1} gy={0.7} w={0.25} d={3.5} h={38} base="#e9c79a" />);
  add(0.15, 0.8, 2.4, 3.3, 0.1, (
    <>
      <Box gx={0.15} gy={0.8} w={2.4} d={3.3} h={10} base="#e3bf93" />
      <Box gx={0.25} gy={0.9} w={2.2} d={3.1} z={10} h={8} base="#ffffff" />
      <Box gx={0.25} gy={2.2} w={2.2} d={1.8} z={18} h={4} base="#ff9aa8" />
      <Box gx={0.45} gy={1.0} w={1.3} d={0.9} z={18} h={5} base="#f4f8ff" />
    </>
  ));
  // wardrobe
  add(0.1, 5.5, 1.1, 1.6, 0, <Box gx={0.1} gy={5.5} w={1.1} d={1.6} h={108} base="#e6b98a">
    <path d={`M${P(0.1 + 1.1, 5.5 + 0.8, 4).join(",")} L${P(0.1 + 1.1, 5.5 + 0.8, 104).join(",")}`} stroke={LINE} fill="none" />
    <circle cx={P(1.2, 5.5 + 0.55, 56)[0]} cy={P(1.2, 5.5 + 0.55, 56)[1]} r="2" fill="#7d92b4" />
    <circle cx={P(1.2, 5.5 + 1.05, 56)[0]} cy={P(1.2, 5.5 + 1.05, 56)[1]} r="2" fill="#7d92b4" />
  </Box>);
  // washbasin
  add(0.1, 4.35, 0.9, 0.85, 0, (
    <>
      <Box gx={0.1} gy={4.35} w={0.9} d={0.85} h={34} base="#ffffff" />
      <Box gx={0.2} gy={4.45} w={0.65} d={0.65} z={34} h={4} base="#cfe9f4" />
    </>
  ));
  // TV console + TV
  add(2.4, 0.1, 2.1, 0.9, 0, (
    <>
      <Box gx={2.4} gy={0.1} w={2.1} d={0.9} h={20} base="#e6b98a" />
      <Box gx={2.75} gy={0.25} w={1.4} d={0.22} z={20} h={40} base="#3a4466">
        <polygon
          points={pts([P(2.75, 0.47, 24), P(4.15, 0.47, 24), P(4.15, 0.47, 56), P(2.75, 0.47, 56)])}
          fill="#8fb4e8"
          stroke="none"
        />
      </Box>
    </>
  ));
  // rug
  it.push(
    box(
      -1,
      <polygon
        key={key()}
        points={pts([P(1.9, 2.3, 0.8), P(6.4, 2.3, 0.8), P(6.4, 6.4, 0.8), P(1.9, 6.4, 0.8)])}
        fill="#fff3d9"
        stroke="#f0d9a8"
        strokeWidth="2"
      />
    )
  );
  // sofa
  add(2.8, 3.8, 2.3, 1.7, 0, (
    <>
      <Box gx={2.8} gy={3.8} w={2.3} d={1.5} h={14} base="#8eb4ff" />
      <Box gx={3.15} gy={3.85} w={1.6} d={1.1} z={14} h={6} base="#b3ccff" />
      <Box gx={2.8} gy={5.05} w={2.3} d={0.45} h={38} base="#7aa2f5" />
      <Box gx={2.8} gy={3.8} w={0.3} d={1.5} z={14} h={12} base="#7aa2f5" />
      <Box gx={4.8} gy={3.8} w={0.3} d={1.5} z={14} h={12} base="#7aa2f5" />
    </>
  ));
  // dining table + chairs
  add(6.6, 2.8, 2.2, 1.2, 0, (
    <>
      {[[6.7, 2.9], [8.5, 2.9], [6.7, 3.8], [8.5, 3.8]].map(([x, y], i) => (
        <Box key={i} gx={x} gy={y} w={0.14} d={0.14} h={26} base="#e3bf93" />
      ))}
      <Box gx={6.6} gy={2.8} w={2.2} d={1.2} z={26} h={5} base="#f1d8b3" />
    </>
  ));
  add(7.15, 2.0, 0.8, 0.7, 0, (
    <>
      <Box gx={7.15} gy={2.0} w={0.8} d={0.7} h={14} base="#ffb199" />
      <Box gx={7.15} gy={2.0} w={0.8} d={0.12} z={14} h={20} base="#ffa088" />
    </>
  ));
  add(7.4, 4.1, 0.8, 0.7, 0, (
    <>
      <Box gx={7.4} gy={4.1} w={0.8} d={0.7} h={14} base="#ffb199" />
      <Box gx={7.4} gy={4.62} w={0.8} d={0.12} z={14} h={20} base="#ffa088" />
    </>
  ));
  // kitchen counter + stove + upper cabinet
  add(6.4, 0.1, 3.0, 1.15, 0, (
    <>
      <Box gx={6.4} gy={0.1} w={3.0} d={1.15} h={38} base="#fdfdfb" />
      <Box gx={6.4} gy={0.1} w={3.0} d={1.15} z={38} h={3} base="#dfe8f2" />
      {[[7.1, 0.65], [8.1, 0.65]].map(([x, y], i) => (
        <ellipse key={i} cx={P(x, y, 41)[0]} cy={P(x, y, 41)[1]} rx="12" ry="6" fill="#47507a" stroke="none" />
      ))}
    </>
  ));
  add(6.4, 0.1, 3.0, 0.62, 0.2, <Box gx={6.4} gy={0.1} w={3.0} d={0.62} z={92} h={34} base="#fdfdfb" />);
  // fridge
  add(9.6, 0.1, 1.3, 1.25, 0, (
    <Box gx={9.6} gy={0.1} w={1.3} d={1.25} h={106} base="#eaf1fa">
      <path d={`M${P(9.6, 1.35, 62).join(",")} L${P(10.9, 1.35, 62).join(",")}`} stroke={LINE} fill="none" />
      <path d={`M${P(9.78, 1.35, 70).join(",")} L${P(9.78, 1.35, 92).join(",")}`} stroke="#7d92b4" strokeWidth="3" fill="none" />
      <path d={`M${P(9.78, 1.35, 30).join(",")} L${P(9.78, 1.35, 52).join(",")}`} stroke="#7d92b4" strokeWidth="3" fill="none" />
    </Box>
  ));
  // shower cubicle (glass)
  add(9.3, 5.0, 1.6, 1.9, 0.4, (
    <>
      <Box gx={9.3} gy={5.0} w={1.6} d={1.9} h={4} base="#cfe9f4" />
      <g stroke={LINE} strokeWidth="1.3" strokeLinejoin="round">
        <polygon points={pts([P(9.3, 6.9, 4), P(10.9, 6.9, 4), P(10.9, 6.9, 100), P(9.3, 6.9, 100)])} fill="rgba(170,220,240,0.32)" />
        <polygon points={pts([P(10.9, 5.0, 4), P(10.9, 6.9, 4), P(10.9, 6.9, 100), P(10.9, 5.0, 100)])} fill="rgba(150,205,230,0.38)" />
        <circle cx={P(10.55, 5.4, 94)[0]} cy={P(10.55, 5.4, 94)[1]} r="6" fill="#dff1f7" />
      </g>
    </>
  ));
  // plant
  add(0.5, 8.0, 0.7, 0.7, 0.5, (
    <>
      <Box gx={0.5} gy={8.0} w={0.7} d={0.7} h={16} base="#f2a47f" />
      <g stroke={LINE} strokeWidth="1.2">
        {[[-10, -34, "#7fd49a"], [8, -40, "#6cc88a"], [0, -50, "#8fe0a8"]].map(([dx, dy, c], i) => {
          const b = P(0.85, 8.35, 16);
          return <ellipse key={i} cx={b[0] + (dx as number)} cy={b[1] + (dy as number)} rx="9" ry="16" fill={c as string} />;
        })}
      </g>
    </>
  ));
  return it;
}

// ------------------------------------------------------------ wall frames (projects)
type Frame = { plane: "L" | "R"; a: number; b: number; z0: number; z1: number };
const FRAMES: Frame[] = [
  { plane: "L", a: 0.9, b: 2.2, z0: 72, z1: 126 },
  { plane: "L", a: 2.5, b: 3.8, z0: 72, z1: 126 },
  { plane: "L", a: 7.1, b: 8.5, z0: 64, z1: 120 },
  { plane: "R", a: 2.55, b: 4.35, z0: 76, z1: 126 },
  { plane: "R", a: 4.7, b: 6.0, z0: 76, z1: 126 },
];

function wallQuad(plane: "L" | "R", a: number, b: number, z0: number, z1: number): Pt[] {
  return plane === "L"
    ? [P(0, a, z0), P(0, b, z0), P(0, b, z1), P(0, a, z1)]
    : [P(a, 0, z0), P(b, 0, z0), P(b, 0, z1), P(a, 0, z1)];
}

function WallImage({ f, href, hot }: { f: Frame; href: string; hot: boolean }) {
  const pad = 0.07;
  const aa = f.a + (f.b - f.a) * pad;
  const bb = f.b - (f.b - f.a) * pad;
  const zz0 = f.z0 + 6;
  const zz1 = f.z1 - 6;
  // image x axis: left->right as seen from inside the room
  const tl = f.plane === "L" ? P(0, bb, zz1) : P(aa, 0, zz1);
  const tr = f.plane === "L" ? P(0, aa, zz1) : P(bb, 0, zz1);
  const h = zz1 - zz0;
  return (
    <g transform={`matrix(${tr[0] - tl[0]} ${tr[1] - tl[1]} 0 ${h} ${tl[0]} ${tl[1]})`}>
      <image href={href} width="1" height="1" preserveAspectRatio="xMidYMid slice" opacity={hot ? 1 : 0.95} />
    </g>
  );
}

// ------------------------------------------------------------ sprite
function Sprite({ color, hair, face, bob }: { color: string; hair: string; face: 1 | -1; bob: number }) {
  return (
    <g transform={`scale(${face} 1)`}>
      <ellipse cx="0" cy="1" rx="11" ry="4" fill="rgba(60,80,120,0.25)" />
      <g transform={`translate(0 ${bob})`} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round">
        <rect x="-5" y="-8" width="4.4" height="8" rx="1.5" fill="#4a5578" />
        <rect x="0.6" y="-8" width="4.4" height="8" rx="1.5" fill="#4a5578" />
        <rect x="-7" y="-21" width="14" height="14" rx="4" fill={color} />
        <rect x="-10" y="-42" width="20" height="21" rx="9" fill="#ffe0c4" />
        <path d="M-10,-31 Q-10,-45 0,-45 Q10,-45 10,-31 Q4,-37 -3,-36 Q-8,-35 -10,-31 Z" fill={hair} />
        <circle cx="-4" cy="-30" r="1.7" fill={INK} stroke="none" />
        <circle cx="4" cy="-30" r="1.7" fill={INK} stroke="none" />
        <path d="M-2,-26 Q0,-24 2,-26" stroke={INK} strokeWidth="1.1" fill="none" />
        <circle cx="-7" cy="-27" r="2" fill="#ffb7b7" stroke="none" opacity="0.8" />
        <circle cx="7" cy="-27" r="2" fill="#ffb7b7" stroke="none" opacity="0.8" />
      </g>
    </g>
  );
}

// ------------------------------------------------------------ component
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

const TABS: [string, string][] = [
  ["Work", "/project"],
  ["Research", "/research"],
  ["Vision", "/vision"],
  ["Resume", "/resume"],
];

export default function ObservationRoom({ chrome = true, showNotes = true }: { chrome?: boolean; showNotes?: boolean }) {
  const router = useRouter();
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
  const [frameHot, setFrameHot] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);
  const items = useMemo(() => buildItems(), []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const emit = useCallback((a: Agent, st: Station) => {
    const { label } = clockAt(clock.current);
    setNotes((arr) =>
      [{ id: ++noteId.current, who: a.p.id, time: label, text: st.note, need: st.need, color: a.p.color }, ...arr].slice(0, 4)
    );
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
            a.path = route(a.node, STATIONS[a.p.routine[a.i][0]].node);
            a.seg = 0;
            a.mode = "walk";
            a.comfort = 0.55;
          }
        } else {
          let move = 2.5 * dt;
          while (move > 0 && a.seg < a.path.length - 1) {
            const to = a.path[a.seg + 1];
            const dd = dist2(a.pos, to);
            if (dd <= move) {
              a.pos = [...to] as Pt;
              move -= dd;
              a.seg += 1;
            } else {
              const k = move / dd;
              const sx = P(to[0], to[1])[0] - P(a.pos[0], a.pos[1])[0];
              if (Math.abs(sx) > 0.5) a.face = sx > 0 ? 1 : -1;
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
        tick(Math.min(0.05, (now - last.current) / 1000) * speed);
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

  const chart = useMemo(
    () => curve.map((v, i) => `${(i / (curve.length - 1)) * 220},${46 - v * 46}`).join(" "),
    [curve]
  );

  // static scene pieces that depend on the sky colour
  const floorLines = [] as ReactNode[];
  for (let g = 1; g < D; g++) {
    floorLines.push(<line key={`a${g}`} x1={P(0, g)[0]} y1={P(0, g)[1]} x2={P(W, g)[0]} y2={P(W, g)[1]} stroke="#ecd0aa" strokeWidth="1" />);
  }
  for (let g = 2; g < W; g += 2) {
    floorLines.push(<line key={`b${g}`} x1={P(g, 0)[0]} y1={P(g, 0)[1]} x2={P(g, D)[0]} y2={P(g, D)[1]} stroke="#f0d9b8" strokeWidth="1" />);
  }

  const agentItems: Item[] = snap.a.map((a) => {
    const walking = a.mode === "walk";
    const st = STATIONS[a.routine[a.i][0]];
    const sit = !walking && st.sit;
    const sc = P(a.pos[0], a.pos[1]);
    const bob = walking ? Math.sin(snap.t * 16 + a.id.charCodeAt(1)) * 1.8 : 0;
    const on = focus === a.id;
    return {
      depth: a.pos[0] + a.pos[1] + 0.35 + (sit ? 0.6 : 0),
      el: (
        <g
          key={a.id}
          transform={`translate(${sc[0]} ${sc[1] - (sit ? 12 : 0)}) scale(1.1)`}
          className="cursor-pointer"
          onPointerEnter={() => setHov(a.id)}
          onPointerLeave={() => setHov(null)}
          onClick={() => setSel((s) => (s === a.id ? null : a.id))}
        >
          <rect x="-18" y="-58" width="36" height="66" fill="transparent" />
          <Sprite color={a.color} hair={a.hair} face={a.face} bob={bob} />
          <path
            d={`M0,${-52 - (on ? 3 : 0)} l${on ? 6 : 4.5},7 l${on ? -6 : -4.5},7 l${on ? -6 : -4.5},-7 z`}
            fill={a.color}
            stroke={LINE}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      ),
    };
  });

  const scene = [...items, ...agentItems].sort((a, b) => a.depth - b.depth);

  const room = (
    <div className="relative overflow-hidden rounded-[18px]" style={{ background: "#d9efff" }}>
      <svg viewBox="70 30 800 560" className="block h-auto w-full" role="img" aria-label="A simulated home in isometric view, with project pictures hanging on the walls">
        <defs>
          <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfe4ff" />
            <stop offset="1" stopColor="#eaf6ff" />
          </linearGradient>
          <pattern id="wl" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#d8edf9" />
            <rect width="7" height="14" fill="#cfe7f6" />
          </pattern>
          <pattern id="wr" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#fde9ef" />
            <circle cx="8" cy="8" r="1.5" fill="#f8cfdb" />
          </pattern>
        </defs>

        <rect x="70" y="30" width="800" height="560" fill="url(#skyg)" />
        <ellipse cx="170" cy="92" rx="64" ry="15" fill="#fff" opacity="0.95" />
        <ellipse cx="208" cy="80" rx="40" ry="13" fill="#fff" opacity="0.95" />
        <ellipse cx="760" cy="70" rx="56" ry="13" fill="#fff" opacity="0.9" />
        <ellipse cx="478" cy="555" rx="380" ry="22" fill="rgba(110,150,200,0.28)" />

        {/* slab */}
        <g stroke={LINE} strokeWidth="1.4" strokeLinejoin="round">
          <polygon points={pts([P(0, D, 0), P(W, D, 0), P(W, D, -16), P(0, D, -16)])} fill="#e4c39b" />
          <polygon points={pts([P(W, 0, 0), P(W, D, 0), P(W, D, -16), P(W, 0, -16)])} fill="#c9a479" />
        </g>
        {/* floor */}
        <polygon points={pts([P(0, 0), P(W, 0), P(W, D), P(0, D)])} fill="#f6e2c4" stroke={LINE} strokeWidth="1.4" />
        {floorLines}
        {/* walls */}
        <polygon points={pts([P(0, 0, 0), P(0, D, 0), P(0, D, HZ), P(0, 0, HZ)])} fill="url(#wl)" stroke={LINE} strokeWidth="1.4" />
        <polygon points={pts([P(0, 0, 0), P(W, 0, 0), P(W, 0, HZ), P(0, 0, HZ)])} fill="url(#wr)" stroke={LINE} strokeWidth="1.4" />
        <path d={`M${P(0, 0, 18).join(",")} L${P(0, D, 18).join(",")} M${P(0, 0, 18).join(",")} L${P(W, 0, 18).join(",")}`} stroke="#fff" strokeWidth="8" opacity="0.7" fill="none" />

        {/* window (right wall) */}
        <g stroke={LINE} strokeWidth="1.4" strokeLinejoin="round">
          <polygon points={pts(wallQuad("R", 0.7, 2.2, 58, 128))} fill="#fff" />
          <polygon points={pts(wallQuad("R", 0.85, 2.05, 66, 120))} fill={sky} />
          <path d={`M${P(1.45, 0, 66).join(",")} L${P(1.45, 0, 120).join(",")} M${P(0.85, 0, 93).join(",")} L${P(2.05, 0, 93).join(",")}`} fill="none" />
          <polygon points={pts(wallQuad("R", 0.5, 0.95, 52, 136))} fill="#ffc7d6" />
          <polygon points={pts(wallQuad("R", 1.95, 2.4, 52, 136))} fill="#ffc7d6" />
        </g>
        {/* mirror (left wall) */}
        <g stroke={LINE} strokeWidth="1.4" strokeLinejoin="round">
          <polygon points={pts(wallQuad("L", 4.3, 5.2, 50, 96))} fill="#fff" />
          <polygon points={pts(wallQuad("L", 4.4, 5.1, 56, 90))} fill="#e6f6fb" />
        </g>

        {/* picture frames = projects */}
        {FRAMES.map((fr, i) => {
          const f = featured[i];
          if (!f) return null;
          const hot = frameHot === i;
          const q = wallQuad(fr.plane, fr.a, fr.b, fr.z0, fr.z1);
          const c = q.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
          return (
            <g
              key={f.slug}
              className="cursor-pointer"
              onPointerEnter={() => setFrameHot(i)}
              onPointerLeave={() => setFrameHot(null)}
              onClick={() => router.push(hrefFor(f))}
            >
              <polygon points={pts(q)} fill={hot ? "#ff7a6b" : "#fff"} stroke={hot ? "#ff7a6b" : LINE} strokeWidth={hot ? 3 : 1.6} />
              <WallImage f={fr} href={f.image} hot={hot} />
              {hot && (
                <g transform={`translate(${c[0]} ${c[1] - 52})`} pointerEvents="none">
                  <rect x={-86} y={-13} width={172} height={24} rx={12} fill="#fff" stroke={INK} strokeWidth="2" />
                  <text x="0" y="3" textAnchor="middle" fontSize="11" fill={INK} style={{ fontFamily: "var(--font-pixel)" }}>
                    {String(i + 1).padStart(2, "0")} · {f.title.length > 24 ? f.title.slice(0, 23) + "…" : f.title}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* furniture + agents, back to front */}
        {scene.map((s, i) => (
          <g key={i}>{s.el}</g>
        ))}

        {/* evening tint */}
        <polygon
          points={pts([P(0, 0, HZ), P(W, 0, HZ), P(W, D, 0), P(0, D, 0)])}
          fill="#0b1a3a"
          opacity={night}
          pointerEvents="none"
        />

        {/* reticle + callout */}
        {focusAgent && (
          <g
            transform={`translate(${P(focusAgent.pos[0], focusAgent.pos[1])[0]} ${P(focusAgent.pos[0], focusAgent.pos[1])[1] - 24})`}
            pointerEvents="none"
          >
            {[
              [-26, -32, 1, 1],
              [26, -32, -1, 1],
              [-26, 28, 1, -1],
              [26, 28, -1, -1],
            ].map(([x, y, sx, sy], i) => (
              <path key={i} d={`M${x},${y + sy * 9} V${y} H${x + sx * 9}`} fill="none" stroke={INK} strokeWidth="2.6" />
            ))}
            <g transform="translate(0 -52)">
              <rect x="-64" y="-14" width="128" height="22" rx="11" fill="#fff" stroke={INK} strokeWidth="2.2" />
              <text x="0" y="1" textAnchor="middle" fontSize="11" fill={INK} style={{ fontFamily: "var(--font-pixel)" }}>
                {focusAgent.id} · {focusAgent.mode === "walk" ? "walking" : STATIONS[focusAgent.routine[focusAgent.i][0]].label}
              </text>
            </g>
          </g>
        )}
      </svg>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 text-[12px]"
        style={{ fontFamily: "var(--font-pixel)", color: "#fff" }}
      >
        <span className="flex items-center gap-2 rounded-md bg-[#1f2a44]/80 px-2.5 py-1">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff4d4d]" />
          REC · observation room
        </span>
        <span className="rounded-md bg-[#1f2a44]/80 px-2.5 py-1">Day 1 · {label}</span>
      </div>
      <p
        className="pointer-events-none absolute bottom-2 left-3 rounded-md bg-white/80 px-2 py-0.5 text-[11px] text-[#1f2a44]/80"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        click a framed picture to open the project
      </p>
    </div>
  );

  const controls = (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]"
      style={{ fontFamily: "var(--font-pixel)", color: INK }}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border-2 bg-white hover:bg-[#fff3b8]"
          style={{ borderColor: INK }}
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
            className="h-7 rounded-md border-2 px-2"
            style={{ borderColor: INK, background: speed === s ? INK : "#fff", color: speed === s ? "#fff" : INK }}
          >
            {s}×
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="opacity-60">journey curve</span>
        <svg viewBox="0 0 220 46" className="h-7 w-[150px]">
          <line x1="0" y1="23" x2="220" y2="23" stroke="rgba(31,42,68,0.25)" strokeDasharray="3 4" />
          <polyline points={chart} fill="none" stroke="#2fb89a" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="opacity-60">unmet needs found</span>
        <span className="rounded-md px-2 py-0.5 text-[13px] text-white" style={{ background: "#ff6b4a" }}>{needs}</span>
      </div>
    </div>
  );

  return (
    <div ref={wrap} className="w-full">
      {chrome ? (
        <div
          className="rounded-[30px] border-[3px] p-3"
          style={{
            borderColor: INK,
            boxShadow: `8px 8px 0 ${INK}`,
            background:
              "radial-gradient(circle at 12px 12px, #fff 0 4px, transparent 4.5px), radial-gradient(circle at 12px 12px, #ffe27a 0 1.6px, transparent 2px), linear-gradient(#8fd0f7, #72bdf0)",
            backgroundSize: "36px 36px, 36px 36px, auto",
          }}
        >
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <p className="text-[12px] text-white drop-shadow-[0_1px_0_rgba(31,42,68,0.6)]" style={{ fontFamily: "var(--font-pixel)" }}>
              ♥ yun&apos;s mini room · TODAY {snap.a.length} · notes {notes.length}
            </p>
            <nav className="flex gap-1">
              <span className="rounded-t-lg border-2 border-b-0 bg-white px-2.5 py-1 text-[11px]" style={{ borderColor: INK, fontFamily: "var(--font-pixel)", color: INK }}>
                Home
              </span>
              {TABS.map(([l, h]) => (
                <Link
                  key={l}
                  href={h}
                  className="hidden rounded-t-lg border-2 border-b-0 bg-[#cfe9fb] px-2.5 py-1 text-[11px] transition-colors hover:bg-white sm:block"
                  style={{ borderColor: INK, fontFamily: "var(--font-pixel)", color: INK }}
                >
                  {l}
                </Link>
              ))}
            </nav>
          </div>
          <div className="rounded-[20px] border-[3px] bg-white p-2" style={{ borderColor: INK }}>
            {room}
            <div className="mt-2 px-1 pb-1">{controls}</div>
          </div>
        </div>
      ) : (
        <div>
          {room}
          <div className="mt-2">{controls}</div>
        </div>
      )}

      {showNotes && (
        <>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {notes.length === 0 && <p className="text-sm text-[#1f2a44]/60">Waiting for the first observation…</p>}
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
        </>
      )}
    </div>
  );
}
