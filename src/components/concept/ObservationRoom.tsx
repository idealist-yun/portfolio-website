"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { featured, hrefFor } from "@/data/concept";

type Pt = [number, number];

const INK = "#1f2a44";
const EDGE = "rgba(70,100,150,0.38)";
const SANS = "ui-sans-serif, system-ui";

// ------------------------------------------------------------ iso projection
const TW = 40;
const TH = 20;
const OX = 430;
const OY = 78;
const NX = 24;
const NY = 20;
const VW = 940;
const VH = 560;

const P = (gx: number, gy: number, z = 0): Pt => [OX + ((gx - gy) * TW) / 2, OY + ((gx + gy) * TH) / 2 - z];
const pts = (a: Pt[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

const hexv = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c: number[]) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mixc = (h: string, t: string, k: number) => {
  const a = hexv(h);
  const b = hexv(t);
  return toHex(a.map((v, i) => v + (b[i] - v) * k));
};

// ------------------------------------------------------------ the museum: six halls = six chapters
export type ZoneId = "army" | "care" | "samsung" | "robots" | "lab" | "mall";
type Hall = {
  id: ZoneId;
  name: string;
  sub: string;
  color: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  project: number; // index into `featured`
  doing: string; // what a visitor is doing here
  caption: string; // docent line
  top: boolean;
};
export const ZONES: Hall[] = [
  { id: "army", name: "Army", sub: "ROKA · 2022–24", color: "#4caf6a", x0: 1, y0: 1, x1: 7, y1: 7, project: 3, doing: "studying the terrain model", caption: "Led 60+ people, and built a 3D terrain trainer.", top: true },
  { id: "care", name: "Care", sub: "disability · thesis", color: "#4c7df0", x0: 9, y0: 1, x1: 15, y1: 7, project: 0, doing: "reading the story", caption: "It started with my brother. 2,400 profiles, 5 personas.", top: true },
  { id: "samsung", name: "Samsung", sub: "2025–26", color: "#6d5bd0", x0: 17, y0: 1, x1: 23, y1: 7, project: 5, doing: "reading the numbers", caption: "Demand forecasts to 2030, a dashboard, a Bixby cook.", top: true },
  { id: "robots", name: "Robots", sub: "HRI · SKKU", color: "#ff6b4a", x0: 1, y0: 13, x1: 7, y1: 19, project: 2, doing: "watching the robots", caption: "Three serving robots, choreographed like a royal ceremony.", top: false },
  { id: "lab", name: "Lab", sub: "grad school · SDI", color: "#14b8a6", x0: 9, y0: 13, x1: 15, y1: 19, project: 1, doing: "trying the simulator", caption: "AI agents living a day in a virtual world.", top: false },
  { id: "mall", name: "Mall", sub: "retail · Starfield", color: "#f5b301", x0: 17, y0: 13, x1: 23, y1: 19, project: 4, doing: "browsing the shelves", caption: "Network-analysis personas for a mega mall.", top: false },
];
const hallOf = (id: ZoneId) => ZONES.find((z) => z.id === id)!;
export const zoneColor = (z: ZoneId | "plaza") => (z === "plaza" ? "#c3cddd" : hallOf(z).color);
const zoneOf = (p: Pt): ZoneId | "plaza" => {
  for (const z of ZONES) if (p[0] >= z.x0 - 0.5 && p[0] <= z.x1 + 0.5 && p[1] >= z.y0 - 0.5 && p[1] <= z.y1 + 0.5) return z.id;
  return "plaza";
};

// ------------------------------------------------------------ graph (corridor + gates + two viewing spots per hall)
const NODES: Record<string, Pt> = { gate: [1.6, 10], c1: [4, 10], c2: [12, 10], c3: [20, 10] };
const EDGES: [string, string][] = [["gate", "c1"], ["c1", "c2"], ["c2", "c3"]];
ZONES.forEach((z) => {
  const xc = (z.x0 + z.x1) / 2;
  const cNode = xc < 8 ? "c1" : xc < 16 ? "c2" : "c3";
  const door: Pt = [xc, z.top ? 7.9 : 12.1];
  NODES[`${z.id}_door`] = door;
  NODES[`${z.id}_a`] = [xc - 1.3, z.top ? 5.8 : 14.2];
  NODES[`${z.id}_b`] = [xc + 1.7, z.top ? 4.2 : 15.8];
  EDGES.push([cNode, `${z.id}_door`], [`${z.id}_door`, `${z.id}_a`], [`${z.id}_a`, `${z.id}_b`]);
});

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

// ------------------------------------------------------------ visitors = my three audiences, plus two
type Visitor = { id: string; role: string; color: string; hair: string; route: [ZoneId, "a" | "b", number][] };
const VISITORS: Visitor[] = [
  { id: "V1", role: "Lab contact", color: "#4c7df0", hair: "#1f2a44", route: [["lab", "a", 4], ["care", "a", 4], ["robots", "b", 2], ["samsung", "a", 1.5], ["army", "b", 2.5]] },
  { id: "V2", role: "Investor", color: "#f5b301", hair: "#7a4a1f", route: [["robots", "a", 4], ["samsung", "b", 3.5], ["mall", "a", 2], ["lab", "b", 2.5], ["care", "b", 3]] },
  { id: "V3", role: "Recruiter", color: "#4caf6a", hair: "#2b2b2b", route: [["samsung", "a", 3.5], ["army", "a", 3], ["care", "a", 2.5], ["robots", "b", 2.5], ["mall", "b", 1.5]] },
  { id: "V4", role: "Student", color: "#f58ac0", hair: "#5a2a4a", route: [["army", "b", 3], ["care", "b", 3.5], ["lab", "a", 3.5], ["mall", "a", 2], ["robots", "a", 3]] },
  { id: "V5", role: "Collaborator", color: "#ff7a6b", hair: "#3b2a20", route: [["care", "a", 3.5], ["robots", "b", 3], ["lab", "b", 3], ["army", "a", 2], ["samsung", "b", 2]] },
];

// illustrative reactions (service-design view of the museum itself)
const REACT: Record<string, Partial<Record<ZoneId, [string, boolean]>>> = {
  V1: {
    lab: ["Asks where the clinical data comes from.", true],
    care: ["Stays long: the thesis is the hook.", false],
    robots: ["Skims, wants the research question.", true],
    samsung: ["Skips: link to research unclear.", true],
    army: ["Curious: simulation for training?", false],
  },
  V2: {
    robots: ["Photographs a robot. 'Is this a product?'", false],
    samsung: ["Nods at the numbers, wants market size.", true],
    mall: ["Reads fast: where's the business model?", true],
    lab: ["Asks how this scales.", true],
    care: ["Moved by the story, then asks about the company.", false],
  },
  V3: {
    samsung: ["Recognises the brand and stays.", false],
    army: ["Leading 60+ people: noted.", false],
    care: ["Wants one line of impact.", true],
    robots: ["Asks how big the team was.", true],
    mall: ["Passes: too many projects.", true],
  },
  V4: {
    army: ["A 3D model of terrain? Wow.", false],
    care: ["Reads the whole story.", false],
    lab: ["Wants to try it right now.", false],
    mall: ["Unclear what exactly she did.", true],
    robots: ["Excited by the royal-court idea.", false],
  },
  V5: {
    care: ["Wants to co-design a pilot.", false],
    robots: ["Asks about the simulation scenarios.", false],
    lab: ["Can't find how to get in touch.", true],
    army: ["Passes through quickly.", true],
    samsung: ["Needs a clearer 'what's next'.", true],
  },
};

type Agent = {
  v: Visitor;
  i: number;
  mode: "walk" | "do";
  path: Pt[];
  seg: number;
  pos: Pt;
  left: number;
  face: 1 | -1;
  node: string;
  comfort: number;
};

function makeAgent(v: Visitor, offset: number): Agent {
  const [hall, which] = v.route[0];
  const node = `${hall}_${which}`;
  return { v, i: 0, mode: "walk", path: route("gate", node), seg: 0, pos: [NODES.gate[0] - offset * 0.4, NODES.gate[1] + (offset % 2 ? 0.5 : -0.5)] as Pt, left: 0, face: 1, node: "gate", comfort: 0.6 };
}

export type Note = { id: number; who: string; time: string; hour: number; text: string; need: boolean; color: string; zone: ZoneId };

const DAY = 150;
const hourAt = (t: number) => 9 + ((t % DAY) / DAY) * 8;
const clockAt = (t: number) => {
  const m = 9 * 60 + ((t % DAY) / DAY) * 8 * 60;
  const hh = Math.floor(m / 60);
  const mm = Math.floor(m % 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

// ------------------------------------------------------------ iso building blocks
function Box({
  gx, gy, w, d, h, z = 0, base, children,
}: {
  gx: number; gy: number; w: number; d: number; h: number; z?: number; base: string; children?: ReactNode;
}) {
  const top = mixc(base, "#ffffff", 0.38);
  const right = mixc(base, "#4d5d82", 0.2);
  return (
    <g stroke={EDGE} strokeWidth="1" strokeLinejoin="round">
      <polygon points={pts([P(gx, gy + d, z), P(gx + w, gy + d, z), P(gx + w, gy + d, z + h), P(gx, gy + d, z + h)])} fill={base} />
      <polygon points={pts([P(gx + w, gy, z), P(gx + w, gy + d, z), P(gx + w, gy + d, z + h), P(gx + w, gy, z + h)])} fill={right} />
      <polygon points={pts([P(gx, gy, z + h), P(gx + w, gy, z + h), P(gx + w, gy + d, z + h), P(gx, gy + d, z + h)])} fill={top} />
      {children}
    </g>
  );
}

type Item = { depth: number; el: ReactNode };

function buildProps(): Item[] {
  const out: Item[] = [];
  let n = 0;
  const add = (gx: number, gy: number, w: number, d: number, el: ReactNode, bias = 0) =>
    out.push({ depth: gx + w / 2 + gy + d / 2 + bias, el: <g key={`p${n++}`}>{el}</g> });

  // ARMY: stepped terrain model, sandbags, flag
  add(2.6, 2.2, 3.0, 2.6, (
    <>
      <Box gx={2.6} gy={2.2} w={3.0} d={2.6} h={4} base="#cfe6cf" />
      <Box gx={3.0} gy={2.6} w={2.2} d={1.8} z={4} h={4} base="#b4d8b4" />
      <Box gx={3.5} gy={3.0} w={1.2} d={1.0} z={8} h={4} base="#97c797" />
      <circle cx={P(4.1, 3.5, 17)[0]} cy={P(4.1, 3.5, 17)[1]} r="2.4" fill="#e2493a" stroke="none" />
    </>
  ));
  [[2.0, 6.0], [3.1, 6.0], [4.2, 6.0]].forEach(([x, y]) => add(x, y, 1.0, 0.5, <Box gx={x} gy={y} w={1.0} d={0.5} h={4} base="#d9cfa8" />));
  add(6.2, 1.6, 0.2, 0.2, (
    <>
      <Box gx={6.2} gy={1.6} w={0.2} d={0.2} h={46} base="#dfe6ee" />
      <polygon points={pts([P(6.4, 1.7, 44), P(6.4, 1.7, 36), P(6.4, 2.9, 40)])} fill="#ff6b4a" stroke={EDGE} strokeWidth="1" />
    </>
  ));

  // CARE: a home corner, the way the thesis starts
  add(10.2, 1.4, 2.8, 1.7, (
    <>
      <Box gx={10.2} gy={1.4} w={2.8} d={1.7} h={5} base="#dbe6ff" />
      <Box gx={10.3} gy={1.5} w={2.6} d={1.5} z={5} h={4} base="#ffffff" />
      <Box gx={11.7} gy={1.5} w={1.2} d={1.5} z={9} h={2} base="#ffb3bd" />
    </>
  ));
  add(13.7, 1.4, 1.0, 3.0, (
    <>
      <Box gx={13.7} gy={1.4} w={1.0} d={3.0} h={9} base="#f6f8fc" />
      <Box gx={13.7} gy={1.4} w={1.0} d={3.0} z={9} h={1.4} base="#cdd8ea" />
    </>
  ));
  add(10.8, 4.4, 1.6, 1.0, <Box gx={10.8} gy={4.4} w={1.6} d={1.0} h={6} base="#f4e3c6" />);

  // SAMSUNG: appliances + dashboard wall
  add(18.0, 1.4, 1.2, 1.2, (
    <Box gx={18.0} gy={1.4} w={1.2} d={1.2} h={44} base="#e6ecf8">
      <path d={`M${P(18.0, 2.6, 24).join(",")} L${P(19.2, 2.6, 24).join(",")}`} stroke={EDGE} fill="none" />
    </Box>
  ));
  add(19.6, 1.4, 1.2, 1.2, (
    <Box gx={19.6} gy={1.4} w={1.2} d={1.2} h={22} base="#f3f5fb">
      <circle cx={P(20.2, 2.6, 11)[0]} cy={P(20.2, 2.6, 11)[1]} r="5" fill="#bcd0f5" stroke={EDGE} />
    </Box>
  ));
  add(21.3, 1.4, 1.6, 0.4, (
    <Box gx={21.3} gy={1.4} w={1.6} d={0.4} z={8} h={26} base="#3a4466">
      <polyline points={pts([P(21.5, 1.8, 14), P(21.9, 1.8, 20), P(22.3, 1.8, 17), P(22.7, 1.8, 26)])} fill="none" stroke="#6fe3ff" strokeWidth="1.6" />
    </Box>
  ));

  // ROBOTS: kiosk desk + two small robots
  add(2.6, 17.6, 3.0, 0.9, (
    <>
      <Box gx={2.6} gy={17.6} w={3.0} d={0.9} h={9} base="#ffffff" />
      <Box gx={2.6} gy={17.6} w={3.0} d={0.9} z={9} h={1.5} base="#ffb199" />
    </>
  ));
  add(5.4, 14.4, 0.7, 0.7, <Box gx={5.4} gy={14.4} w={0.7} d={0.7} h={14} base="#eef2fa" />);
  add(2.0, 14.6, 0.7, 0.7, <Box gx={2.0} gy={14.6} w={0.7} d={0.7} h={14} base="#eef2fa" />);

  // LAB: desks with screens + a small "mini world" table
  [[10.0, 17.4], [11.8, 17.4], [13.6, 17.4]].forEach(([x, y]) =>
    add(x, y, 1.2, 0.9, (
      <>
        <Box gx={x} gy={y} w={1.2} d={0.9} h={7} base="#e1f6f2" />
        <Box gx={x + 0.3} gy={y + 0.1} w={0.7} d={0.12} z={7} h={8} base="#3a4466" />
      </>
    ))
  );
  add(11.4, 14.6, 2.2, 1.6, (
    <>
      <Box gx={11.4} gy={14.6} w={2.2} d={1.6} h={6} base="#bfeee6" />
      {[[11.9, 15.0], [12.6, 15.5], [13.1, 14.9]].map(([x, y], i) => (
        <circle key={i} cx={P(x, y, 8)[0]} cy={P(x, y, 8)[1]} r="2.2" fill={["#ff7a6b", "#6a9bff", "#ffc93c"][i]} stroke="none" />
      ))}
    </>
  ));

  // MALL: shelves + checkout
  [[18.0, 14.0], [19.9, 14.0]].forEach(([x, y]) => add(x, y, 0.8, 3.0, <Box gx={x} gy={y} w={0.8} d={3.0} h={20} base="#ffe9a8" />));
  add(21.6, 14.0, 0.8, 2.0, <Box gx={21.6} gy={14.0} w={0.8} d={2.0} h={16} base="#fff0c0" />);
  add(20.6, 17.6, 2.2, 0.9, (
    <>
      <Box gx={20.6} gy={17.6} w={2.2} d={0.9} h={9} base="#ffffff" />
      <Box gx={20.6} gy={17.6} w={2.2} d={0.9} z={9} h={1.5} base="#ffd566" />
    </>
  ));

  // ENTRANCE arch
  add(0.4, 9.0, 0.3, 2.0, (
    <>
      <Box gx={0.4} gy={9.0} w={0.3} d={0.3} h={48} base="#dfe6ee" />
      <Box gx={0.4} gy={10.7} w={0.3} d={0.3} h={48} base="#dfe6ee" />
      <Box gx={0.4} gy={9.0} w={0.3} d={2.0} z={46} h={4} base="#cbd6e8" />
    </>
  ));
  return out;
}

// ------------------------------------------------------------ people
function Person({ color, hair, face, bob }: { color: string; hair: string; face: 1 | -1; bob: number }) {
  return (
    <g transform={`scale(${face} 1)`}>
      <ellipse cx="0" cy="1.5" rx="8" ry="3" fill="rgba(60,80,120,0.22)" />
      <g transform={`translate(0 ${bob})`}>
        <rect x="-4" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="1" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="-5.5" y="-17" width="11" height="12" rx="4.5" fill={color} />
        <circle cx="0" cy="-23" r="6.2" fill="#ffe0c4" />
        <path d="M-6.2,-24 Q-6,-30 0,-30 Q6,-30 6.2,-24 Q2,-27 -1,-26 Q-5,-26 -6.2,-24 Z" fill={hair} />
        <circle cx="-2.2" cy="-22.5" r="0.9" fill={INK} />
        <circle cx="2.2" cy="-22.5" r="0.9" fill={INK} />
      </g>
    </g>
  );
}

function Docent({ t }: { t: number }) {
  const bob = Math.sin(t * 3) * 0.8;
  return (
    <g>
      <ellipse cx="0" cy="1.5" rx="9" ry="3.2" fill="rgba(60,80,120,0.22)" />
      <g transform={`translate(0 ${bob})`}>
        <rect x="-7" y="-8" width="14" height="8" rx="3" fill="#2f3b5c" />
        <rect x="-4" y="-22" width="8" height="15" rx="3" fill="#f3f6fb" stroke={EDGE} strokeWidth="0.8" />
        <rect x="-8" y="-32" width="16" height="11" rx="3.5" fill="#26324f" />
        <circle cx="-3" cy="-26.5" r="1.5" fill="#6fe3ff" />
        <circle cx="3" cy="-26.5" r="1.5" fill="#6fe3ff" />
        <path d="M-5,-34 q5,-6 10,0" stroke="#ff6b4a" strokeWidth="1.6" fill="none" />
      </g>
    </g>
  );
}

// ------------------------------------------------------------ snapshot
type Snap = {
  t: number;
  a: { id: string; color: string; hair: string; pos: Pt; face: 1 | -1; mode: "walk" | "do"; hall: ZoneId }[];
  trail: Record<string, Pt[]>;
  cam: { x: number; y: number; w: number; h: number };
  heat: Record<string, number>;
  busy: Record<string, number>;
  docentNear: boolean;
};
type Lane = { z: ZoneId | "plaza"; t0: number; t1: number };

export default function ObservationRoom({
  chrome = true,
  showNotes = true,
  showLanes = true,
  onNote,
  hoverId = null,
  selected,
  onSelectedChange,
  active,
}: {
  chrome?: boolean;
  showNotes?: boolean;
  showLanes?: boolean;
  onNote?: (n: Note) => void;
  hoverId?: string | null;
  selected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  active?: boolean;
}) {
  const router = useRouter();
  const [init] = useState(() => VISITORS.map((v, i) => makeAgent(v, i)));
  const agents = useRef<Agent[]>(init);
  const clock = useRef(0);
  const noteId = useRef(0);
  const sample = useRef(0);
  const trailT = useRef(0);
  const trails = useRef<Record<string, Pt[]>>({});
  const lanesRef = useRef<Record<string, Lane[]>>({});
  const heat = useRef<Record<string, number>>({});
  const cam = useRef({ x: 0, y: 0, w: VW, h: VH });
  const selRef = useRef<string | null>(null);

  const [snap, setSnap] = useState<Snap>({
    t: 0,
    a: init.map((x) => ({ id: x.v.id, color: x.v.color, hair: x.v.hair, pos: x.pos, face: x.face, mode: x.mode, hall: "army" })),
    trail: {},
    cam: { x: 0, y: 0, w: VW, h: VH },
    heat: {},
    busy: {},
    docentNear: false,
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [friction, setFriction] = useState(0);
  const [delight, setDelight] = useState(0);
  const [lanes, setLanes] = useState<Record<string, Lane[]>>({});
  const [curve, setCurve] = useState<number[]>(() => Array(48).fill(0.6));
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selInt, setSelInt] = useState<string | null>(null);
  const sel = selected !== undefined ? selected : selInt;
  const setSel = useCallback(
    (v: string | null) => {
      if (onSelectedChange) onSelectedChange(v);
      else setSelInt(v);
    },
    [onSelectedChange]
  );
  const [hov, setHov] = useState<string | null>(null);
  const [bbHot, setBbHot] = useState<ZoneId | null>(null);
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);
  const props = useMemo(() => buildProps(), []);

  useEffect(() => {
    selRef.current = sel;
  }, [sel]);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const arrive = useCallback(
    (a: Agent) => {
      const [hall, , dur] = a.v.route[a.i];
      a.mode = "do";
      a.left = dur;
      const react = REACT[a.v.id]?.[hall];
      const need = react ? react[1] : false;
      a.comfort = need ? 0.22 : 0.82;
      const n: Note = {
        id: ++noteId.current,
        who: a.v.id,
        time: clockAt(clock.current),
        hour: hourAt(clock.current),
        text: react ? react[0] : "Pauses for a moment.",
        need,
        color: a.v.color,
        zone: hall,
      };
      setNotes((arr) => [n, ...arr].slice(0, 4));
      if (need) setFriction((x) => x + 1);
      else setDelight((x) => x + 1);
      onNote?.(n);
    },
    [onNote]
  );

  const tick = useCallback(
    (dt: number) => {
      clock.current += dt;
      agents.current.forEach((a) => {
        if (a.mode === "do") {
          a.left -= dt;
          const h = a.v.route[a.i][0];
          heat.current[h] = (heat.current[h] ?? 0) + dt;
          a.comfort += (0.6 - a.comfort) * dt * 0.15;
          if (a.left <= 0) {
            a.i = (a.i + 1) % a.v.route.length;
            const [nh, nw] = a.v.route[a.i];
            a.path = route(a.node, `${nh}_${nw}`);
            a.seg = 0;
            a.mode = "walk";
            a.comfort = 0.55;
          }
        } else {
          let move = 2.9 * dt;
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
          if (a.seg >= a.path.length - 1) {
            const [h, w] = a.v.route[a.i];
            a.node = `${h}_${w}`;
            arrive(a);
          }
        }
      });

      trailT.current += dt;
      if (trailT.current > 0.12) {
        trailT.current = 0;
        agents.current.forEach((a) => {
          const arr = (trails.current[a.v.id] ??= []);
          const s = P(a.pos[0], a.pos[1]);
          const l = arr[arr.length - 1];
          if (!l || Math.hypot(l[0] - s[0], l[1] - s[1]) > 1.5) arr.push(s);
          if (arr.length > 46) arr.shift();
        });
      }

      sample.current += dt;
      if (sample.current > 0.5) {
        sample.current = 0;
        agents.current.forEach((a) => {
          const z = zoneOf(a.pos);
          const arr = (lanesRef.current[a.v.id] ??= []);
          const lastSeg = arr[arr.length - 1];
          if (lastSeg && lastSeg.z === z) lastSeg.t1 = clock.current;
          else arr.push({ z, t0: clock.current, t1: clock.current });
          while (arr.length > 1 && arr[0].t1 < clock.current - 70) arr.shift();
        });
        setLanes(Object.fromEntries(Object.entries(lanesRef.current).map(([k, v]) => [k, v.map((s) => ({ ...s }))])));
        setCurve((c) => [...c.slice(1), agents.current.reduce((s, a) => s + a.comfort, 0) / agents.current.length]);
      }

      const target = { x: 0, y: 0, w: VW, h: VH };
      const f = agents.current.find((a) => a.v.id === selRef.current);
      if (f) {
        const s = P(f.pos[0], f.pos[1]);
        target.w = VW * 0.46;
        target.h = VH * 0.46;
        target.x = Math.max(0, Math.min(VW - target.w, s[0] - target.w / 2));
        target.y = Math.max(0, Math.min(VH - target.h, s[1] - 24 - target.h / 2));
      }
      const k = 1 - Math.exp(-dt * 4.5);
      const c = cam.current;
      c.x += (target.x - c.x) * k;
      c.y += (target.y - c.y) * k;
      c.w += (target.w - c.w) * k;
      c.h += (target.h - c.h) * k;
    },
    [arrive]
  );

  const makeSnap = useCallback((): Snap => {
    const trail: Record<string, Pt[]> = {};
    Object.entries(trails.current).forEach(([k, v]) => (trail[k] = v.slice()));
    const busy: Record<string, number> = {};
    agents.current.forEach((a) => {
      const z = zoneOf(a.pos);
      if (z !== "plaza" && a.mode === "do") busy[z] = (busy[z] ?? 0) + 1;
    });
    const dpos = NODES.c1;
    return {
      t: clock.current,
      a: agents.current.map((a) => ({
        id: a.v.id,
        color: a.v.color,
        hair: a.v.hair,
        pos: [...a.pos] as Pt,
        face: a.face,
        mode: a.mode,
        hall: a.v.route[a.i][0],
      })),
      trail,
      cam: { ...cam.current },
      heat: { ...heat.current },
      busy,
      docentNear: agents.current.some((a) => dist2(a.pos, dpos) < 3.6),
    };
  }, []);

  const run = active ?? visible;
  useEffect(() => {
    if (!playing || !run) {
      last.current = null;
      return;
    }
    let raf = 0;
    const loop = (now: number) => {
      if (last.current != null) {
        tick(Math.min(0.05, (now - last.current) / 1000) * speed);
        setSnap(makeSnap());
      }
      last.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, run, speed, tick, makeSnap]);

  const focus = hov ?? sel ?? hoverId;
  const focusAgent = snap.a.find((a) => a.id === focus);
  const focusVisitor = VISITORS.find((v) => v.id === focus);
  const label = clockAt(snap.t);
  const heatMax = Math.max(12, ...Object.values(snap.heat));
  const busiest = ZONES.map((z) => [z, snap.heat[z.id] ?? 0] as const).sort((a, b) => b[1] - a[1])[0];

  const peopleItems: Item[] = [
    { depth: NODES.c1[0] + 1.2 + (NODES.c1[1] + 1.2) + 0.2, el: <g key="docent" transform={`translate(${P(NODES.c1[0] - 1.4, NODES.c1[1] + 1.4)[0]} ${P(NODES.c1[0] - 1.4, NODES.c1[1] + 1.4)[1]})`}><Docent t={snap.t} /></g> },
    ...snap.a.map((a): Item => {
      const sc = P(a.pos[0], a.pos[1]);
      const walking = a.mode === "walk";
      const bob = walking ? Math.sin(snap.t * 15 + a.id.charCodeAt(1)) * 1.4 : 0;
      const on = focus === a.id;
      return {
        depth: a.pos[0] + a.pos[1] + 0.35,
        el: (
          <g
            key={a.id}
            transform={`translate(${sc[0]} ${sc[1]}) scale(1.1)`}
            className="cursor-pointer"
            onPointerEnter={() => setHov(a.id)}
            onPointerLeave={() => setHov(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSel(sel === a.id ? null : a.id);
            }}
          >
            <rect x="-14" y="-40" width="28" height="46" fill="transparent" />
            <Person color={a.color} hair={a.hair} face={a.face} bob={bob} />
            <g transform={`translate(0 ${-36 - (on ? 3 : 0)})`}>
              <rect x="-9" y="-8" width="18" height="11" rx="5.5" fill="#fff" stroke={a.color} strokeWidth="1.6" />
              <text x="0" y="0.4" textAnchor="middle" fontSize="7" fontWeight={700} fill={INK} style={{ fontFamily: SANS }}>
                {a.id}
              </text>
            </g>
          </g>
        ),
      };
    }),
  ];
  const scene = [...props, ...peopleItems].sort((a, b) => a.depth - b.depth);

  const chartPoints = curve.map((v, i) => `${(i / (curve.length - 1)) * 160},${30 - v * 30}`).join(" ");
  const winT = 70;
  const laneRows = VISITORS.map((p) => (
    <g key={p.id}>
      {(lanes[p.id] ?? []).map((s, i) => {
        const x0 = Math.max(0, 1 - (snap.t - s.t0) / winT);
        const x1 = Math.max(0, 1 - (snap.t - s.t1) / winT);
        if (x1 <= 0) return null;
        return <rect key={i} x={x0 * 300} y={0} width={Math.max(2, (x1 - x0) * 300)} height="10" rx="3" fill={zoneColor(s.z)} opacity={s.z === "plaza" ? 0.45 : 0.95} />;
      })}
    </g>
  ));

  const scenePanel = (
    <div className="relative overflow-hidden rounded-[18px]" style={{ background: "linear-gradient(180deg,#f6f9fd,#e9f0f9)" }}>
      <svg
        viewBox={`${snap.cam.x.toFixed(1)} ${snap.cam.y.toFixed(1)} ${snap.cam.w.toFixed(1)} ${snap.cam.h.toFixed(1)}`}
        className="block h-auto w-full"
        role="img"
        aria-label="A glass museum of six halls about Yun's work, with visitors walking through while a designer observes"
        onClick={() => setSel(null)}
      >
        <defs>
          <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#dcebff" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.42" />
            <stop offset="1" stopColor="#d4e6ff" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <polygon points={pts([P(-0.6, -0.6), P(NX + 0.6, -0.6), P(NX + 0.6, NY + 0.6), P(-0.6, NY + 0.6)])} fill="#ffffff" opacity="0.55" stroke={EDGE} strokeWidth="1" />
        {Array.from({ length: NX / 2 - 1 }).map((_, k) => {
          const g = (k + 1) * 2;
          return <line key={`x${g}`} x1={P(g, 0)[0]} y1={P(g, 0)[1]} x2={P(g, NY)[0]} y2={P(g, NY)[1]} stroke="rgba(70,100,150,0.08)" strokeWidth="1" />;
        })}
        {Array.from({ length: NY / 2 - 1 }).map((_, k) => {
          const g = (k + 1) * 2;
          return <line key={`y${g}`} x1={P(0, g)[0]} y1={P(0, g)[1]} x2={P(NX, g)[0]} y2={P(NX, g)[1]} stroke="rgba(70,100,150,0.08)" strokeWidth="1" />;
        })}

        {/* corridor */}
        <polygon points={pts([P(0, 8), P(NX, 8), P(NX, 12), P(0, 12)])} fill="#eef3fa" opacity="0.95" stroke={EDGE} strokeWidth="1" />
        <line x1={P(1, 10)[0]} y1={P(1, 10)[1]} x2={P(NX - 1, 10)[0]} y2={P(NX - 1, 10)[1]} stroke="#9db3d4" strokeDasharray="3 6" strokeWidth="1.4" />

        {/* halls: slab, heat, glass walls */}
        {ZONES.map((z) => {
          const h = Math.min(1, (snap.heat[z.id] ?? 0) / heatMax);
          return (
            <g key={z.id}>
              <polygon points={pts([P(z.x0, z.y1, 0), P(z.x1, z.y1, 0), P(z.x1, z.y1, -6), P(z.x0, z.y1, -6)])} fill={mixc(z.color, "#ffffff", 0.7)} stroke={EDGE} strokeWidth="1" />
              <polygon points={pts([P(z.x1, z.y0, 0), P(z.x1, z.y1, 0), P(z.x1, z.y1, -6), P(z.x1, z.y0, -6)])} fill={mixc(z.color, "#7080a0", 0.4)} opacity="0.55" stroke={EDGE} strokeWidth="1" />
              <polygon points={pts([P(z.x0, z.y0), P(z.x1, z.y0), P(z.x1, z.y1), P(z.x0, z.y1)])} fill={mixc(z.color, "#ffffff", 0.9 - h * 0.42)} stroke={EDGE} strokeWidth="1" />
              <polygon points={pts([P(z.x0, z.y0, 0), P(z.x0, z.y1, 0), P(z.x0, z.y1, 46), P(z.x0, z.y0, 46)])} fill="url(#gl)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
              <polygon points={pts([P(z.x0, z.y0, 0), P(z.x1, z.y0, 0), P(z.x1, z.y0, 46), P(z.x0, z.y0, 46)])} fill="url(#gr)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
              <path d={`M${P(z.x0, z.y0, 46).join(",")} L${P(z.x0, z.y1, 46).join(",")} M${P(z.x0, z.y0, 46).join(",")} L${P(z.x1, z.y0, 46).join(",")}`} stroke={z.color} strokeWidth="2" opacity="0.7" fill="none" />
            </g>
          );
        })}

        {/* journey trails */}
        {VISITORS.map((p) => {
          const tr = snap.trail[p.id] ?? [];
          if (tr.length < 2) return null;
          return (
            <g key={p.id} strokeLinecap="round">
              {tr.slice(1).map((pt, i) => (
                <line key={i} x1={tr[i][0]} y1={tr[i][1]} x2={pt[0]} y2={pt[1]} stroke={p.color} strokeWidth={focus === p.id ? 3 : 2} opacity={((i + 1) / tr.length) * (focus && focus !== p.id ? 0.2 : 0.75)} />
              ))}
            </g>
          );
        })}

        {scene.map((s, i) => (
          <g key={i}>{s.el}</g>
        ))}

        {/* docent line at the entrance */}
        {snap.docentNear && (
          <g transform={`translate(${P(NODES.c1[0] - 1.4, NODES.c1[1] + 1.4, 44)[0]} ${P(NODES.c1[0] - 1.4, NODES.c1[1] + 1.4, 44)[1]})`} pointerEvents="none">
            <rect x="-62" y="-11" width="124" height="15" rx="7.5" fill="#fff" stroke={INK} strokeWidth="1.2" />
            <text x="0" y="0" textAnchor="middle" fontSize="8.5" fill={INK} style={{ fontFamily: SANS }}>
              Welcome, start anywhere.
            </text>
          </g>
        )}

        {/* hall labels, docent captions, project billboards */}
        {ZONES.map((z) => {
          const f = featured[z.project];
          const top = P(z.x0, z.y0, 46);
          const bx = top[0] - 4;
          const by = top[1] - 30;
          const hot = bbHot === z.id;
          const occupied = (snap.busy[z.id] ?? 0) > 0;
          const lab = P(z.x1 - 0.3, z.y1 - 0.3, 0);
          return (
            <g key={z.id}>
              <text x={lab[0]} y={lab[1] + 17} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={z.color} style={{ fontFamily: "var(--font-bric), " + SANS }}>
                {z.name.toUpperCase()} <tspan fill="rgba(31,42,68,0.45)" fontWeight={500}>· {z.sub}</tspan>
              </text>
              {occupied && (
                <g transform={`translate(${lab[0]} ${lab[1] + 31})`} pointerEvents="none">
                  <rect x={-Math.min(150, z.caption.length * 2.6 + 8)} y="-9" width={Math.min(300, z.caption.length * 5.2 + 16)} height="14" rx="7" fill="rgba(255,255,255,0.9)" stroke={z.color} strokeWidth="1" />
                  <text x="0" y="1" textAnchor="middle" fontSize="7.8" fill={INK} style={{ fontFamily: SANS }}>
                    {z.caption}
                  </text>
                </g>
              )}
              {f && (
                <g
                  className="cursor-pointer"
                  transform={`translate(${bx} ${by})`}
                  onPointerEnter={() => setBbHot(z.id)}
                  onPointerLeave={() => setBbHot(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(hrefFor(f));
                  }}
                >
                  <line x1="0" y1="24" x2="0" y2="32" stroke={z.color} strokeWidth="1.6" />
                  <rect x="-66" y="-12" width="132" height="36" rx="9" fill="rgba(255,255,255,0.86)" stroke={hot ? z.color : "rgba(255,255,255,0.95)"} strokeWidth={hot ? 2.4 : 1.4} />
                  <clipPath id={`cp-${z.id}`}>
                    <rect x="-62" y="-8" width="28" height="28" rx="6" />
                  </clipPath>
                  <image href={f.image} x="-62" y="-8" width="28" height="28" preserveAspectRatio="xMidYMid slice" clipPath={`url(#cp-${z.id})`} />
                  <text x="-28" y="3" fontSize="8.2" fontWeight={700} fill={INK} style={{ fontFamily: "var(--font-bric), " + SANS }}>
                    {f.title.length > 19 ? f.title.slice(0, 18) + "…" : f.title}
                  </text>
                  <text x="-28" y="14" fontSize="7.2" fill={z.color} style={{ fontFamily: SANS }}>
                    open exhibit →
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <text x={P(0.4, 9.8, 62)[0]} y={P(0.4, 9.8, 62)[1]} textAnchor="middle" fontSize="9" fontWeight={700} fill="#5a6f94" letterSpacing="1.4" style={{ fontFamily: SANS }}>
          ENTRANCE
        </text>

        {focusAgent && focusVisitor && (
          <g transform={`translate(${P(focusAgent.pos[0], focusAgent.pos[1])[0]} ${P(focusAgent.pos[0], focusAgent.pos[1])[1] - 16})`} pointerEvents="none">
            {[
              [-17, -26, 1, 1],
              [17, -26, -1, 1],
              [-17, 15, 1, -1],
              [17, 15, -1, -1],
            ].map(([x, y, sx, sy], i) => (
              <path key={i} d={`M${x},${y + sy * 6} V${y} H${x + sx * 6}`} fill="none" stroke={INK} strokeWidth="1.8" />
            ))}
            <g transform="translate(0 -48)">
              <rect x="-62" y="-9" width="124" height="16" rx="8" fill={INK} />
              <text x="0" y="2.4" textAnchor="middle" fontSize="8.5" fill="#fff" style={{ fontFamily: SANS }}>
                {focusVisitor.role} · {focusAgent.mode === "walk" ? "walking" : hallOf(focusAgent.hall).doing}
              </text>
            </g>
          </g>
        )}
      </svg>

      <div aria-hidden className="pointer-events-none absolute inset-3">
        <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2" style={{ borderColor: INK }} />
        <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2" style={{ borderColor: INK }} />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2" style={{ borderColor: INK }} />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2" style={{ borderColor: INK }} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-6 py-5 text-[11px]" style={{ color: INK }}>
        <span className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 backdrop-blur" style={{ fontFamily: "var(--font-pixel)" }}>
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d4d]" />
          <span className="sm:hidden">OBSERVING</span>
          <span className="hidden sm:inline">OBSERVING THE MUSEUM · 6 halls · 5 visitors</span>
        </span>
        <span className="rounded-full bg-white/80 px-3 py-1 backdrop-blur" style={{ fontFamily: "var(--font-pixel)" }}>
          {sel ? `FOLLOW ${sel}` : "OVERVIEW"} · {label}
        </span>
      </div>
      {sel && (
        <button
          type="button"
          onClick={() => setSel(null)}
          className="absolute bottom-5 right-6 rounded-full bg-white/90 px-3 py-1 text-[11px] backdrop-blur hover:bg-white"
          style={{ fontFamily: "var(--font-pixel)", color: INK }}
        >
          × back to overview
        </button>
      )}
      {!sel && (
        <p className="pointer-events-none absolute bottom-5 left-6 hidden rounded-full bg-white/70 px-3 py-1 text-[11px] backdrop-blur sm:block" style={{ fontFamily: "var(--font-pixel)", color: "rgba(31,42,68,0.7)" }}>
          click a visitor to follow · click an exhibit to open it
        </p>
      )}
    </div>
  );

  const analysis = (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3" style={{ color: INK }}>
      <div className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: "var(--font-pixel)" }}>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white hover:bg-[#fff3b8]"
          style={{ borderColor: "rgba(31,42,68,0.3)" }}
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
            className="h-7 rounded-full border px-2.5"
            style={{ borderColor: "rgba(31,42,68,0.3)", background: speed === s ? INK : "#fff", color: speed === s ? "#fff" : INK }}
          >
            {s}×
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 text-[12px]" style={{ fontFamily: "var(--font-pixel)" }}>
        <div>
          <p className="text-[10px] uppercase opacity-55">engagement</p>
          <svg viewBox="0 0 160 30" className="h-6 w-[96px]">
            <line x1="0" y1="15" x2="160" y2="15" stroke="rgba(31,42,68,0.2)" strokeDasharray="3 4" />
            <polyline points={chartPoints} fill="none" stroke="#2fb89a" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase opacity-55">friction</p>
          <span className="rounded-md px-2 py-0.5 text-white" style={{ background: "#ff6b4a" }}>{friction}</span>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase opacity-55">delight</p>
          <span className="rounded-md px-2 py-0.5 text-white" style={{ background: "#2fb89a" }}>{delight}</span>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase opacity-55">busiest hall</p>
          <span className="rounded-md px-2 py-0.5 text-white" style={{ background: busiest[1] > 0 ? busiest[0].color : "#9db3d4" }}>
            {busiest[1] > 0 ? busiest[0].name : "—"}
          </span>
        </div>
      </div>

      {showLanes && (
        <div className="min-w-0 basis-full">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-pixel)", color: "rgba(31,42,68,0.55)" }}>
            <span>visitor journey · last {winT}s</span>
            <span className="flex flex-wrap gap-x-3 gap-y-1">
              {ZONES.map((z) => (
                <span key={z.id} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ background: z.color }} />
                  {z.name}
                </span>
              ))}
            </span>
          </div>
          <svg viewBox="0 0 330 100" className="h-auto w-full">
            {VISITORS.map((p, i) => (
              <g key={p.id} transform={`translate(24 ${i * 19 + 2})`}>
                <text x="-4" y="9" textAnchor="end" fontSize="8" fill={INK} style={{ fontFamily: "var(--font-pixel)" }}>
                  {p.id}
                </text>
                <rect x="0" y="0" width="300" height="10" rx="3" fill="rgba(31,42,68,0.06)" />
                {laneRows[i]}
              </g>
            ))}
            <line x1="324" y1="0" x2="324" y2="100" stroke={INK} strokeWidth="1.2" />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div ref={wrap} className="w-full">
      {chrome ? (
        <div
          className="rounded-[28px] border bg-white/70 p-3 backdrop-blur"
          style={{ borderColor: "rgba(31,42,68,0.18)", boxShadow: "0 30px 60px -30px rgba(31,42,68,0.35), inset 0 0 0 1px rgba(255,255,255,0.9)" }}
        >
          {scenePanel}
          <div className="px-2 pb-1">{analysis}</div>
        </div>
      ) : (
        <div>
          {scenePanel}
          {analysis}
        </div>
      )}

      {showNotes && (
        <>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {notes.length === 0 && <p className="text-sm text-[#1f2a44]/60">Waiting for the first visitor…</p>}
            {notes.map((n, i) => (
              <div
                key={n.id}
                className="relative rounded-xl border bg-white/85 px-4 pb-3 pt-3 shadow-[0_10px_24px_-16px_rgba(31,42,68,0.5)] backdrop-blur"
                style={{ borderColor: `${zoneColor(n.zone)}88`, borderLeftWidth: 5, borderLeftColor: zoneColor(n.zone), transform: `rotate(${[-0.6, 0.5, -0.3, 0.6][i % 4]}deg)` }}
              >
                <p className="flex items-center gap-2 text-[11px] text-[#1f2a44]/65" style={{ fontFamily: "var(--font-pixel)" }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: n.color }} />
                  {VISITORS.find((v) => v.id === n.who)?.role} · {n.time} · {hallOf(n.zone).name}
                  <span className="ml-auto rounded px-1.5 text-white" style={{ background: n.need ? "#ff6b4a" : "#2fb89a" }}>
                    {n.need ? "friction" : "delight"}
                  </span>
                </p>
                <p className="mt-1.5 text-[1.28rem] leading-[1.05] text-[#1f2a44]" style={{ fontFamily: "var(--font-hand)" }}>
                  {n.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[#1f2a44]/55">Simulated visitors and illustrative observations.</p>
        </>
      )}
    </div>
  );
}
