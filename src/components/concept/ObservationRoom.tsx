"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { featured, hrefFor } from "@/data/concept";

type Pt = [number, number];

const INK = "#1f2a44";
const EDGE = "rgba(70,100,150,0.38)";

// ------------------------------------------------------------ iso projection
const TW = 44;
const TH = 22;
const OX = 470;
const OY = 96;
const N = 20;
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

// ------------------------------------------------------------ zones (the "universes")
type ZoneId = "home" | "clinic" | "mall" | "lobby";
type Zone = { id: ZoneId; name: string; sub: string; color: string; x0: number; y0: number; x1: number; y1: number; project: number };
const ZONES: Zone[] = [
  { id: "home", name: "Home", sub: "daily living", color: "#4c7df0", x0: 1, y0: 1, x1: 8, y1: 8, project: 0 },
  { id: "clinic", name: "Clinic", sub: "healthcare", color: "#14b8a6", x0: 12, y0: 1, x1: 19, y1: 8, project: 1 },
  { id: "mall", name: "Mall", sub: "retail", color: "#f5b301", x0: 1, y0: 12, x1: 8, y1: 19, project: 4 },
  { id: "lobby", name: "Robot lobby", sub: "human-robot", color: "#ff6b4a", x0: 12, y0: 12, x1: 19, y1: 19, project: 2 },
];
const zoneColor = (z: ZoneId | "plaza") => (z === "plaza" ? "#c3cddd" : ZONES.find((q) => q.id === z)!.color);
const zoneOf = (p: Pt): ZoneId | "plaza" => {
  for (const z of ZONES) if (p[0] >= z.x0 - 0.5 && p[0] <= z.x1 + 0.5 && p[1] >= z.y0 - 0.5 && p[1] <= z.y1 + 0.5) return z.id;
  return "plaza";
};

// ------------------------------------------------------------ stations, graph
type Station = { zone: ZoneId; node: string; label: string; note: string; need: boolean; sit?: boolean; npc?: "robot" | "nurse"; say?: string };
const STATIONS: Record<string, Station> = {
  h_bed: { zone: "home", node: "h_bed", label: "waking up", note: "Wakes late: nothing cues the start of the day.", need: true },
  h_cook: { zone: "home", node: "h_cook", label: "cooking", note: "Skips a step when the recipe isn't visual.", need: true },
  h_sofa: { zone: "home", node: "h_sofa", label: "relaxing", note: "Long idle stretch: low engagement with the day plan.", need: false, sit: true },
  c_in: { zone: "clinic", node: "c_in", label: "checking in", note: "The form is hard to read; asks for help.", need: true, npc: "nurse", say: "How can I help?" },
  c_wait: { zone: "clinic", node: "c_wait", label: "waiting", note: "No sense of how long the wait will be.", need: true, sit: true },
  c_con: { zone: "clinic", node: "c_con", label: "consultation", note: "Understands more when the nurse uses pictures.", need: false, npc: "nurse", say: "Let's go step by step." },
  m_browse: { zone: "mall", node: "m_browse", label: "browsing", note: "Can't find the aisle: signs are too abstract.", need: true },
  m_browse2: { zone: "mall", node: "m_browse2", label: "comparing", note: "Picks the item with the clearest picture.", need: false },
  m_check: { zone: "mall", node: "m_check", label: "paying", note: "Payment screen moves too fast.", need: true },
  l_greet: { zone: "lobby", node: "l_greet", label: "greeted by robot", note: "The robot's greeting lands well, though the voice is quick.", need: false, npc: "robot", say: "Welcome!" },
  l_guide: { zone: "lobby", node: "l_guide", label: "guided tour", note: "Follows the robot confidently, with a clear next step.", need: false, npc: "robot", say: "This way, please." },
  l_wait: { zone: "lobby", node: "l_wait", label: "waiting", note: "Unsure where to stand while the robot is busy.", need: true, sit: true },
};

const NODES: Record<string, Pt> = {
  hub: [10, 10],
  g_home: [8.7, 8.7],
  g_clinic: [11.3, 8.7],
  g_mall: [8.7, 11.3],
  g_lobby: [11.3, 11.3],
  h_bed: [3.2, 4.3],
  h_cook: [3.3, 6.4],
  h_sofa: [6.5, 5.3],
  c_in: [14.8, 3.6],
  c_wait: [14.8, 6.0],
  c_con: [17.2, 6.4],
  m_browse: [3.4, 15.4],
  m_browse2: [5.6, 14.4],
  m_check: [6.4, 16.9],
  l_greet: [15.0, 16.0],
  l_guide: [17.4, 14.4],
  l_wait: [17.0, 17.6],
};
const EDGES: [string, string][] = [
  ["hub", "g_home"], ["hub", "g_clinic"], ["hub", "g_mall"], ["hub", "g_lobby"],
  ["g_home", "g_clinic"], ["g_home", "g_mall"], ["g_clinic", "g_lobby"], ["g_mall", "g_lobby"],
  ["g_home", "h_sofa"], ["h_sofa", "h_cook"], ["h_cook", "h_bed"], ["h_bed", "h_sofa"],
  ["g_clinic", "c_wait"], ["c_wait", "c_in"], ["c_wait", "c_con"], ["c_in", "c_con"],
  ["g_mall", "m_browse2"], ["m_browse2", "m_browse"], ["m_browse2", "m_check"], ["m_browse", "m_check"],
  ["g_lobby", "l_greet"], ["l_greet", "l_guide"], ["l_greet", "l_wait"], ["l_guide", "l_wait"],
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

type Persona = { id: string; color: string; hair: string; routine: [string, number][] };
const PERSONAS: Persona[] = [
  { id: "P1", color: "#ff7a6b", hair: "#3b2a20", routine: [["h_bed", 3], ["h_cook", 3.5], ["c_in", 3], ["c_con", 3.5], ["m_browse", 3], ["m_check", 3], ["l_greet", 3], ["h_sofa", 4]] },
  { id: "P2", color: "#6a9bff", hair: "#1f2a44", routine: [["m_browse", 3], ["m_check", 3], ["l_greet", 3], ["l_guide", 3.5], ["h_cook", 3.5], ["h_sofa", 4], ["c_wait", 3], ["c_con", 3.5]] },
  { id: "P3", color: "#ffc93c", hair: "#7a4a1f", routine: [["l_wait", 3], ["l_guide", 3.5], ["c_in", 3], ["c_wait", 3], ["h_bed", 3], ["h_cook", 3.5], ["m_browse2", 3]] },
  { id: "P4", color: "#5fc47f", hair: "#2b2b2b", routine: [["c_wait", 3], ["c_con", 3.5], ["h_sofa", 4], ["m_check", 3], ["l_greet", 3], ["m_browse", 3]] },
  { id: "P5", color: "#f58ac0", hair: "#5a2a4a", routine: [["h_sofa", 4], ["h_bed", 3], ["l_greet", 3], ["l_wait", 3], ["m_browse2", 3], ["c_in", 3]] },
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
  const i = (offset * 2) % p.routine.length;
  const st = STATIONS[p.routine[i][0]];
  return {
    p,
    i,
    mode: "do",
    path: [],
    seg: 0,
    pos: [...NODES[st.node]] as Pt,
    left: p.routine[i][1] * (0.3 + offset * 0.2),
    face: 1,
    node: st.node,
    comfort: 0.6,
    nSeen: 0,
  };
}

type Note = { id: number; who: string; time: string; text: string; need: boolean; color: string; zone: ZoneId };

const DAY = 120;
const clockAt = (t: number) => {
  const m = 7 * 60 + ((t % DAY) / DAY) * 16 * 60;
  const hh = Math.floor(m / 60);
  const mm = Math.floor(m % 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

// ------------------------------------------------------------ iso building blocks
function Box({
  gx, gy, w, d, h, z = 0, base, alpha = 1, children,
}: {
  gx: number; gy: number; w: number; d: number; h: number; z?: number; base: string; alpha?: number; children?: ReactNode;
}) {
  const top = mixc(base, "#ffffff", 0.38);
  const right = mixc(base, "#4d5d82", 0.2);
  return (
    <g stroke={EDGE} strokeWidth="1" strokeLinejoin="round" opacity={alpha}>
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

  // HOME
  add(1.5, 1.3, 3.2, 1.9, (
    <>
      <Box gx={1.5} gy={1.3} w={3.2} d={1.9} h={5} base="#dbe6ff" />
      <Box gx={1.6} gy={1.4} w={3.0} d={1.7} z={5} h={4} base="#ffffff" />
      <Box gx={3.0} gy={1.4} w={1.6} d={1.7} z={9} h={2} base="#ffb3bd" />
      <Box gx={1.7} gy={1.5} w={0.9} d={1.1} z={9} h={2.5} base="#f4f8ff" />
    </>
  ));
  add(1.2, 4.0, 1.1, 3.1, (
    <>
      <Box gx={1.2} gy={4.0} w={1.1} d={3.1} h={9} base="#f6f8fc" />
      <Box gx={1.2} gy={4.0} w={1.1} d={3.1} z={9} h={1.5} base="#cdd8ea" />
      {[[1.7, 4.9], [1.7, 6.0]].map(([x, y], i) => (
        <ellipse key={i} cx={P(x, y, 10.5)[0]} cy={P(x, y, 10.5)[1]} rx="5" ry="2.5" fill="#47507a" stroke="none" />
      ))}
    </>
  ));
  add(5.5, 5.9, 2.2, 1.3, (
    <>
      <Box gx={5.5} gy={5.9} w={2.2} d={1.3} h={6} base="#9bbcff" />
      <Box gx={5.5} gy={6.9} w={2.2} d={0.35} z={6} h={9} base="#86aaf8" />
    </>
  ));
  add(4.3, 3.9, 1.5, 1.0, (
    <>
      <Box gx={4.3} gy={3.9} w={1.5} d={1.0} z={6} h={1.5} base="#f4e3c6" />
      {[[4.4, 4.0], [5.55, 4.0], [4.4, 4.7], [5.55, 4.7]].map(([x, y], i) => (
        <Box key={i} gx={x} gy={y} w={0.12} d={0.12} h={6} base="#e3cba2" />
      ))}
    </>
  ));
  // CLINIC
  add(13.2, 1.3, 3.4, 1.0, (
    <>
      <Box gx={13.2} gy={1.3} w={3.4} d={1.0} h={9} base="#ffffff" />
      <Box gx={13.2} gy={1.3} w={3.4} d={1.0} z={9} h={1.5} base="#8fe3d6" />
    </>
  ));
  add(16.6, 3.0, 1.9, 2.8, (
    <>
      <Box gx={16.6} gy={3.0} w={1.9} d={2.8} h={5} base="#e1f6f2" />
      <Box gx={16.7} gy={3.1} w={1.7} d={2.6} z={5} h={3} base="#ffffff" />
      <Box gx={16.7} gy={3.1} w={1.7} d={0.7} z={8} h={2} base="#bfeee6" />
    </>
  ));
  add(13.5, 6.5, 2.7, 0.8, <Box gx={13.5} gy={6.5} w={2.7} d={0.8} h={5} base="#bfeee6" />);
  // MALL
  add(1.3, 13.2, 0.8, 2.4, <Box gx={1.3} gy={13.2} w={0.8} d={2.4} h={20} base="#ffe9a8" />);
  add(1.3, 16.2, 0.8, 2.4, <Box gx={1.3} gy={16.2} w={0.8} d={2.4} h={20} base="#ffdf86" />);
  add(3.9, 12.8, 0.9, 1.9, <Box gx={3.9} gy={12.8} w={0.9} d={1.9} h={15} base="#fff0c0" />);
  add(5.3, 17.6, 2.2, 0.9, (
    <>
      <Box gx={5.3} gy={17.6} w={2.2} d={0.9} h={9} base="#ffffff" />
      <Box gx={5.3} gy={17.6} w={2.2} d={0.9} z={9} h={1.5} base="#ffd566" />
    </>
  ));
  // LOBBY
  add(13.4, 13.2, 3.1, 1.0, (
    <>
      <Box gx={13.4} gy={13.2} w={3.1} d={1.0} h={9} base="#ffffff" />
      <Box gx={13.4} gy={13.2} w={3.1} d={1.0} z={9} h={1.5} base="#ffb199" />
    </>
  ));
  add(17.0, 15.2, 1.7, 0.8, <Box gx={17.0} gy={15.2} w={1.7} d={0.8} h={5} base="#ffd2c4" />);
  add(12.8, 18.0, 0.8, 0.8, (
    <>
      <Box gx={12.8} gy={18.0} w={0.8} d={0.8} h={6} base="#f4a98a" />
      {[[-6, -16, "#8de0a7"], [5, -20, "#6fcf92"], [0, -26, "#9be8b2"]].map(([dx, dy, c], i) => {
        const b = P(13.2, 18.4, 6);
        return <ellipse key={i} cx={b[0] + (dx as number)} cy={b[1] + (dy as number)} rx="5.5" ry="9" fill={c as string} stroke="none" />;
      })}
    </>
  ));
  return out;
}

// ------------------------------------------------------------ people
function Person({ color, hair, face, bob, coat }: { color: string; hair: string; face: 1 | -1; bob: number; coat?: boolean }) {
  return (
    <g transform={`scale(${face} 1)`}>
      <ellipse cx="0" cy="1.5" rx="8" ry="3" fill="rgba(60,80,120,0.22)" />
      <g transform={`translate(0 ${bob})`}>
        <rect x="-4" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="1" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="-5.5" y="-17" width="11" height="12" rx="4.5" fill={color} />
        {coat && <path d="M-1.6,-14 h3.2 M0,-15.6 v3.2" stroke="#ff5a5a" strokeWidth="1.6" />}
        <circle cx="0" cy="-23" r="6.2" fill="#ffe0c4" />
        <path d="M-6.2,-24 Q-6,-30 0,-30 Q6,-30 6.2,-24 Q2,-27 -1,-26 Q-5,-26 -6.2,-24 Z" fill={hair} />
        <circle cx="-2.2" cy="-22.5" r="0.9" fill={INK} />
        <circle cx="2.2" cy="-22.5" r="0.9" fill={INK} />
      </g>
    </g>
  );
}

function RobotNpc({ t }: { t: number }) {
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
      </g>
    </g>
  );
}

// ------------------------------------------------------------ snapshot
type Snap = {
  t: number;
  a: { id: string; color: string; hair: string; pos: Pt; face: 1 | -1; mode: "walk" | "do"; st: string }[];
  trail: Record<string, Pt[]>;
  cam: { x: number; y: number; w: number; h: number };
  pairs: [Pt, Pt][];
  npcSay: { at: Pt; text: string; who: "robot" | "nurse" }[];
};

type Lane = { z: ZoneId | "plaza"; t0: number; t1: number };

export default function ObservationRoom({
  chrome = true,
  showNotes = true,
  showLanes = true,
}: {
  chrome?: boolean;
  showNotes?: boolean;
  showLanes?: boolean;
}) {
  const router = useRouter();
  const [init] = useState(() => PERSONAS.map((p, i) => makeAgent(p, i)));
  const agents = useRef<Agent[]>(init);
  const clock = useRef(0);
  const noteId = useRef(0);
  const sample = useRef(0);
  const trailT = useRef(0);
  const trails = useRef<Record<string, Pt[]>>({});
  const lanesRef = useRef<Record<string, Lane[]>>({});
  const pairSet = useRef<Set<string>>(new Set());
  const cam = useRef({ x: 0, y: 0, w: VW, h: VH });
  const selRef = useRef<string | null>(null);

  const [snap, setSnap] = useState<Snap>({
    t: 0,
    a: init.map((x) => ({ id: x.p.id, color: x.p.color, hair: x.p.hair, pos: x.pos, face: x.face, mode: x.mode, st: x.p.routine[x.i][0] })),
    trail: {},
    cam: { x: 0, y: 0, w: VW, h: VH },
    pairs: [],
    npcSay: [],
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [needs, setNeeds] = useState(0);
  const [met, setMet] = useState(0);
  const [lanes, setLanes] = useState<Record<string, Lane[]>>({});
  const [curve, setCurve] = useState<number[]>(() => Array(48).fill(0.6));
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
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

  const emit = useCallback((a: Agent, st: Station) => {
    setNotes((arr) =>
      [{ id: ++noteId.current, who: a.p.id, time: clockAt(clock.current), text: st.note, need: st.need, color: a.p.color, zone: st.zone }, ...arr].slice(0, 4)
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
      a.comfort = st.need ? 0.22 : 0.8;
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
          let move = 2.6 * dt;
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

      // trails
      trailT.current += dt;
      if (trailT.current > 0.12) {
        trailT.current = 0;
        agents.current.forEach((a) => {
          const arr = (trails.current[a.p.id] ??= []);
          const s = P(a.pos[0], a.pos[1]);
          const l = arr[arr.length - 1];
          if (!l || Math.hypot(l[0] - s[0], l[1] - s[1]) > 1.5) arr.push(s);
          if (arr.length > 46) arr.shift();
        });
      }

      // lanes + curve
      sample.current += dt;
      if (sample.current > 0.5) {
        sample.current = 0;
        agents.current.forEach((a) => {
          const z = zoneOf(a.pos);
          const arr = (lanesRef.current[a.p.id] ??= []);
          const lastSeg = arr[arr.length - 1];
          if (lastSeg && lastSeg.z === z) lastSeg.t1 = clock.current;
          else arr.push({ z, t0: clock.current, t1: clock.current });
          while (arr.length > 1 && arr[0].t1 < clock.current - 70) arr.shift();
        });
        setLanes(Object.fromEntries(Object.entries(lanesRef.current).map(([k, v]) => [k, v.map((s) => ({ ...s }))])));
        const avg = agents.current.reduce((s, a) => s + a.comfort, 0) / agents.current.length;
        setCurve((c) => [...c.slice(1), avg]);
      }

      // encounters
      const now = new Set<string>();
      agents.current.forEach((a, i) => {
        agents.current.forEach((b, j) => {
          if (j <= i) return;
          if (zoneOf(a.pos) !== "plaza" && zoneOf(a.pos) === zoneOf(b.pos) && dist2(a.pos, b.pos) < 2.2) now.add(`${i}-${j}`);
        });
      });
      let fresh = 0;
      now.forEach((k) => {
        if (!pairSet.current.has(k)) fresh += 1;
      });
      pairSet.current = now;
      if (fresh) setMet((m) => m + fresh);

      // camera follow
      const target = { x: 0, y: 0, w: VW, h: VH };
      const f = agents.current.find((a) => a.p.id === selRef.current);
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
    [startDo]
  );

  const makeSnap = useCallback((): Snap => {
    const trail: Record<string, Pt[]> = {};
    Object.entries(trails.current).forEach(([k, v]) => (trail[k] = v.slice()));
    const pairs: [Pt, Pt][] = [];
    pairSet.current.forEach((k) => {
      const [i, j] = k.split("-").map(Number);
      pairs.push([[...agents.current[i].pos] as Pt, [...agents.current[j].pos] as Pt]);
    });
    const npcSay: Snap["npcSay"] = [];
    agents.current.forEach((a) => {
      const st = STATIONS[a.p.routine[a.i][0]];
      if (a.mode === "do" && st.npc) {
        npcSay.push({ at: st.npc === "robot" ? [15.0, 14.7] : [14.8, 2.4], text: st.say ?? "", who: st.npc });
      }
    });
    return {
      t: clock.current,
      a: agents.current.map((a) => ({ id: a.p.id, color: a.p.color, hair: a.p.hair, pos: [...a.pos] as Pt, face: a.face, mode: a.mode, st: a.p.routine[a.i][0] })),
      trail,
      cam: { ...cam.current },
      pairs,
      npcSay,
    };
  }, []);

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
        setSnap(makeSnap());
      }
      last.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, speed, tick, makeSnap]);

  const focus = hov ?? sel;
  const focusAgent = snap.a.find((a) => a.id === focus);
  const label = clockAt(snap.t);

  // depth-sorted scene (props, NPCs, personas)
  const peopleItems: Item[] = [
    { depth: 15.0 + 14.5 + 0.2, el: <g key="robot" transform={`translate(${P(15.0, 14.5)[0]} ${P(15.0, 14.5)[1]})`}><RobotNpc t={snap.t} /></g> },
    { depth: 14.8 + 2.2 + 0.2, el: <g key="nurse" transform={`translate(${P(14.8, 2.2)[0]} ${P(14.8, 2.2)[1]})`}><Person color="#f4fbff" hair="#14b8a6" face={1} bob={0} coat /></g> },
    ...snap.a.map((a): Item => {
      const walking = a.mode === "walk";
      const sit = !walking && STATIONS[a.st].sit;
      const sc = P(a.pos[0], a.pos[1]);
      const bob = walking ? Math.sin(snap.t * 15 + a.id.charCodeAt(1)) * 1.4 : 0;
      const on = focus === a.id;
      return {
        depth: a.pos[0] + a.pos[1] + 0.35,
        el: (
          <g
            key={a.id}
            transform={`translate(${sc[0]} ${sc[1] - (sit ? 6 : 0)}) scale(1.15)`}
            className="cursor-pointer"
            onPointerEnter={() => setHov(a.id)}
            onPointerLeave={() => setHov(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSel((s) => (s === a.id ? null : a.id));
            }}
          >
            <rect x="-14" y="-40" width="28" height="46" fill="transparent" />
            <Person color={a.color} hair={a.hair} face={a.face} bob={bob} />
            <g transform={`translate(0 ${-36 - (on ? 3 : 0)})`}>
              <rect x="-9" y="-8" width="18" height="11" rx="5.5" fill="#fff" stroke={a.color} strokeWidth="1.6" />
              <text x="0" y="0.4" textAnchor="middle" fontSize="7" fontWeight={700} fill={INK} style={{ fontFamily: "ui-sans-serif, system-ui" }}>
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

  const winT = 60;
  const laneRows = PERSONAS.map((p) => (
    <g key={p.id}>
      {(lanes[p.id] ?? []).map((s, i) => {
        const x0 = Math.max(0, 1 - (snap.t - s.t0) / winT);
        const x1 = Math.max(0, 1 - (snap.t - s.t1) / winT);
        if (x1 <= 0) return null;
        return (
          <rect
            key={i}
            x={x0 * 300}
            y={0}
            width={Math.max(2, (x1 - x0) * 300)}
            height="10"
            rx="3"
            fill={zoneColor(s.z)}
            opacity={s.z === "plaza" ? 0.5 : 0.95}
          />
        );
      })}
    </g>
  ));

  const scenePanel = (
    <div className="relative overflow-hidden rounded-[18px]" style={{ background: "linear-gradient(180deg,#f6f9fd,#e9f0f9)" }}>
      <svg
        viewBox={`${snap.cam.x.toFixed(1)} ${snap.cam.y.toFixed(1)} ${snap.cam.w.toFixed(1)} ${snap.cam.h.toFixed(1)}`}
        className="block h-auto w-full"
        role="img"
        aria-label="A glass cutaway of four service spaces, with simulated people moving between them while a designer observes"
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
        <rect x="0" y="0" width={VW} height={VH} fill="transparent" />

        {/* ground diamond + grid */}
        <polygon points={pts([P(-0.6, -0.6), P(N + 0.6, -0.6), P(N + 0.6, N + 0.6), P(-0.6, N + 0.6)])} fill="#ffffff" opacity="0.55" stroke={EDGE} strokeWidth="1" />
        {Array.from({ length: N / 2 - 1 }).map((_, k) => {
          const g = (k + 1) * 2;
          return (
            <g key={g} stroke="rgba(70,100,150,0.10)" strokeWidth="1">
              <line x1={P(g, 0)[0]} y1={P(g, 0)[1]} x2={P(g, N)[0]} y2={P(g, N)[1]} />
              <line x1={P(0, g)[0]} y1={P(0, g)[1]} x2={P(N, g)[0]} y2={P(N, g)[1]} />
            </g>
          );
        })}
        {/* plaza paths */}
        <polygon points={pts([P(8, 0), P(12, 0), P(12, N), P(8, N)])} fill="#eef3fa" opacity="0.9" />
        <polygon points={pts([P(0, 8), P(N, 8), P(N, 12), P(0, 12)])} fill="#eef3fa" opacity="0.9" />
        <polygon points={pts([P(8.4, 8.4), P(11.6, 8.4), P(11.6, 11.6), P(8.4, 11.6)])} fill="#ffffff" stroke={EDGE} strokeWidth="1" />
        <circle cx={P(10, 10)[0]} cy={P(10, 10)[1]} r="5" fill="none" stroke="#9db3d4" strokeDasharray="2 3" />

        {/* zones: slab, glass walls */}
        {ZONES.map((z) => (
          <g key={z.id}>
            <polygon points={pts([P(z.x0, z.y1, 0), P(z.x1, z.y1, 0), P(z.x1, z.y1, -7), P(z.x0, z.y1, -7)])} fill={mixc(z.color, "#ffffff", 0.7)} stroke={EDGE} strokeWidth="1" />
            <polygon points={pts([P(z.x1, z.y0, 0), P(z.x1, z.y1, 0), P(z.x1, z.y1, -7), P(z.x1, z.y0, -7)])} fill={mixc(z.color, "#7080a0", 0.4)} opacity="0.55" stroke={EDGE} strokeWidth="1" />
            <polygon points={pts([P(z.x0, z.y0), P(z.x1, z.y0), P(z.x1, z.y1), P(z.x0, z.y1)])} fill={mixc(z.color, "#ffffff", 0.84)} stroke={EDGE} strokeWidth="1" />
            <polygon points={pts([P(z.x0, z.y0, 0), P(z.x0, z.y1, 0), P(z.x0, z.y1, 50), P(z.x0, z.y0, 50)])} fill="url(#gl)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
            <polygon points={pts([P(z.x0, z.y0, 0), P(z.x1, z.y0, 0), P(z.x1, z.y0, 50), P(z.x0, z.y0, 50)])} fill="url(#gr)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
            {[0, 1, 2, 3].map((k) => {
              const g = z.x0 + ((z.x1 - z.x0) * k) / 3;
              const h = z.y0 + ((z.y1 - z.y0) * k) / 3;
              return (
                <g key={k} stroke="rgba(255,255,255,0.85)" strokeWidth="1">
                  <line x1={P(g, z.y0, 0)[0]} y1={P(g, z.y0, 0)[1]} x2={P(g, z.y0, 50)[0]} y2={P(g, z.y0, 50)[1]} />
                  <line x1={P(z.x0, h, 0)[0]} y1={P(z.x0, h, 0)[1]} x2={P(z.x0, h, 50)[0]} y2={P(z.x0, h, 50)[1]} />
                </g>
              );
            })}
            <path d={`M${P(z.x0, z.y0, 50).join(",")} L${P(z.x0, z.y1, 50).join(",")} M${P(z.x0, z.y0, 50).join(",")} L${P(z.x1, z.y0, 50).join(",")}`} stroke={z.color} strokeWidth="2" opacity="0.7" fill="none" />
          </g>
        ))}

        {/* journey trails */}
        {PERSONAS.map((p) => {
          const tr = snap.trail[p.id] ?? [];
          if (tr.length < 2) return null;
          return (
            <g key={p.id} fill="none" strokeLinecap="round" strokeLinejoin="round">
              {tr.slice(1).map((pt, i) => (
                <line
                  key={i}
                  x1={tr[i][0]}
                  y1={tr[i][1]}
                  x2={pt[0]}
                  y2={pt[1]}
                  stroke={p.color}
                  strokeWidth={focus === p.id ? 3 : 2}
                  opacity={((i + 1) / tr.length) * (focus && focus !== p.id ? 0.2 : 0.75)}
                />
              ))}
            </g>
          );
        })}

        {/* encounters */}
        {snap.pairs.map(([a, b], i) => {
          const sa = P(a[0], a[1], 14);
          const sb = P(b[0], b[1], 14);
          return (
            <g key={i} pointerEvents="none">
              <line x1={sa[0]} y1={sa[1]} x2={sb[0]} y2={sb[1]} stroke={INK} strokeWidth="1.6" strokeDasharray="3 3" />
              <circle cx={(sa[0] + sb[0]) / 2} cy={(sa[1] + sb[1]) / 2} r="3.4" fill="#ffd75e" stroke={INK} strokeWidth="1" />
            </g>
          );
        })}

        {/* furniture, NPCs and personas, back to front */}
        {scene.map((s, i) => (
          <g key={i}>{s.el}</g>
        ))}

        {/* NPC speech */}
        {snap.npcSay.map((n, i) => {
          const s = P(n.at[0], n.at[1], 44);
          return (
            <g key={i} transform={`translate(${s[0]} ${s[1]})`} pointerEvents="none">
              <rect x={-4 - n.text.length * 2.7} y="-11" width={8 + n.text.length * 5.4} height="15" rx="7.5" fill="#fff" stroke={INK} strokeWidth="1.2" />
              <text x="0" y="0" textAnchor="middle" fontSize="8.5" fill={INK} style={{ fontFamily: "ui-sans-serif, system-ui" }}>
                {n.text}
              </text>
            </g>
          );
        })}

        {/* zone labels + project billboards */}
        {ZONES.map((z) => {
          const f = featured[z.project];
          const anchor = P((z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2, 0);
          const top = P(z.x0, z.y0, 50);
          const bx = top[0] - 6;
          const by = top[1] - 34;
          const hot = bbHot === z.id;
          return (
            <g key={z.id}>
              <text x={anchor[0]} y={P(z.x1 - 0.2, z.y1 - 0.2, 0)[1] + 18} textAnchor="middle" fontSize="11" fontWeight={700} fill={z.color} style={{ fontFamily: "var(--font-bric), ui-sans-serif" }}>
                {z.name.toUpperCase()} <tspan fill="rgba(31,42,68,0.45)" fontWeight={500}>· {z.sub}</tspan>
              </text>
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
                  <line x1="0" y1="24" x2="0" y2="34" stroke={z.color} strokeWidth="1.6" />
                  <rect x="-70" y="-12" width="140" height="38" rx="9" fill="rgba(255,255,255,0.82)" stroke={hot ? z.color : "rgba(255,255,255,0.95)"} strokeWidth={hot ? 2.4 : 1.4} />
                  <clipPath id={`cp-${z.id}`}>
                    <rect x="-66" y="-8" width="30" height="30" rx="6" />
                  </clipPath>
                  <image href={f.image} x="-66" y="-8" width="30" height="30" preserveAspectRatio="xMidYMid slice" clipPath={`url(#cp-${z.id})`} />
                  <text x="-30" y="3" fontSize="8.5" fontWeight={700} fill={INK} style={{ fontFamily: "var(--font-bric), ui-sans-serif" }}>
                    {f.title.length > 20 ? f.title.slice(0, 19) + "…" : f.title}
                  </text>
                  <text x="-30" y="15" fontSize="7.5" fill={z.color} style={{ fontFamily: "ui-sans-serif, system-ui" }}>
                    open project →
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* reticle */}
        {focusAgent && (
          <g
            transform={`translate(${P(focusAgent.pos[0], focusAgent.pos[1])[0]} ${P(focusAgent.pos[0], focusAgent.pos[1])[1] - 16})`}
            pointerEvents="none"
          >
            {[
              [-17, -26, 1, 1],
              [17, -26, -1, 1],
              [-17, 15, 1, -1],
              [17, 15, -1, -1],
            ].map(([x, y, sx, sy], i) => (
              <path key={i} d={`M${x},${y + sy * 6} V${y} H${x + sx * 6}`} fill="none" stroke={INK} strokeWidth="1.8" />
            ))}
            <g transform="translate(0 -48)">
              <rect x="-52" y="-9" width="104" height="16" rx="8" fill={INK} />
              <text x="0" y="2.4" textAnchor="middle" fontSize="8.5" fill="#fff" style={{ fontFamily: "ui-sans-serif, system-ui" }}>
                {focusAgent.id} · {focusAgent.mode === "walk" ? "walking" : STATIONS[focusAgent.st].label}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* observation overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-3">
        <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2" style={{ borderColor: INK }} />
        <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2" style={{ borderColor: INK }} />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2" style={{ borderColor: INK }} />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2" style={{ borderColor: INK }} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-6 py-5 text-[11px]" style={{ color: INK }}>
        <span className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 backdrop-blur" style={{ fontFamily: "var(--font-pixel)" }}>
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d4d]" />
          <span className="sm:hidden">OBSERVATION</span>
          <span className="hidden sm:inline">OBSERVATION DECK · 4 spaces · 5 personas</span>
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
          click a persona to follow · click a billboard to open a project
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
          <p className="text-[10px] uppercase opacity-55">comfort</p>
          <svg viewBox="0 0 160 30" className="h-6 w-[96px]">
            <line x1="0" y1="15" x2="160" y2="15" stroke="rgba(31,42,68,0.2)" strokeDasharray="3 4" />
            <polyline points={chartPoints} fill="none" stroke="#2fb89a" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase opacity-55">needs</p>
          <span className="rounded-md px-2 py-0.5 text-white" style={{ background: "#ff6b4a" }}>{needs}</span>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase opacity-55">encounters</p>
          <span className="rounded-md px-2 py-0.5 text-white" style={{ background: INK }}>{met}</span>
        </div>
      </div>
      {showLanes && (
      <div className="min-w-0 basis-full">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-pixel)", color: "rgba(31,42,68,0.55)" }}>
          <span>service journey · last {winT}s</span>
          <span className="flex gap-3">
            {ZONES.map((z) => (
              <span key={z.id} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: z.color }} />
                {z.name}
              </span>
            ))}
          </span>
        </div>
        <svg viewBox="0 0 330 100" className="h-auto w-full">
          {PERSONAS.map((p, i) => (
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
            {notes.length === 0 && <p className="text-sm text-[#1f2a44]/60">Waiting for the first observation…</p>}
            {notes.map((n, i) => (
              <div
                key={n.id}
                className="relative rounded-xl border bg-white/85 px-4 pb-3 pt-3 shadow-[0_10px_24px_-16px_rgba(31,42,68,0.5)] backdrop-blur"
                style={{
                  borderColor: `${zoneColor(n.zone)}88`,
                  borderLeftWidth: 5,
                  borderLeftColor: zoneColor(n.zone),
                  transform: `rotate(${[-0.6, 0.5, -0.3, 0.6][i % 4]}deg)`,
                }}
              >
                <p className="flex items-center gap-2 text-[11px] text-[#1f2a44]/65" style={{ fontFamily: "var(--font-pixel)" }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: n.color }} />
                  {n.who} · {n.time} · {ZONES.find((z) => z.id === n.zone)!.name}
                  <span
                    className="ml-auto rounded px-1.5 text-white"
                    style={{ background: n.need ? "#ff6b4a" : "#2fb89a" }}
                  >
                    {n.need ? "need" : "works"}
                  </span>
                </p>
                <p className="mt-1.5 text-[1.28rem] leading-[1.05] text-[#1f2a44]" style={{ fontFamily: "var(--font-hand)" }}>
                  {n.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[#1f2a44]/55">
            Simulated personas and illustrative field notes. The same logic drives my real agent simulator.
          </p>
        </>
      )}
    </div>
  );
}
