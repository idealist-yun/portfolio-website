"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { featured, hrefFor, journey, whyQuote } from "@/data/concept";

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
  plaque: string;
  pics: [string, number][]; // [src, aspect] hung on the walls: back-left, back-right, left wall
};
const ZONES_RAW: Omit<Hall, "plaque" | "pics">[] = [
  { id: "army", name: "Army", sub: "ROKA · 2022–24", color: "#4caf6a", x0: 1, y0: 1, x1: 7, y1: 7, project: 3, doing: "studying the terrain model", caption: "Led 60+ people, and built a 3D terrain trainer.", top: true },
  { id: "care", name: "Care", sub: "disability · thesis", color: "#4c7df0", x0: 9, y0: 1, x1: 15, y1: 7, project: 0, doing: "reading the story", caption: "It started with my brother. 2,400 profiles, 5 personas.", top: true },
  { id: "samsung", name: "Samsung", sub: "2025–26", color: "#6d5bd0", x0: 17, y0: 1, x1: 23, y1: 7, project: 5, doing: "reading the numbers", caption: "Demand forecasts to 2030, a dashboard, a Bixby cook.", top: true },
  { id: "robots", name: "Robots", sub: "HRI · SKKU", color: "#ff6b4a", x0: 1, y0: 13, x1: 7, y1: 19, project: 2, doing: "watching the robots", caption: "Three serving robots, choreographed like a royal ceremony.", top: false },
  { id: "lab", name: "Lab", sub: "grad school · SDI", color: "#14b8a6", x0: 9, y0: 13, x1: 15, y1: 19, project: 1, doing: "trying the simulator", caption: "AI agents living a day in a virtual world.", top: false },
  { id: "mall", name: "Mall", sub: "retail · Starfield", color: "#f5b301", x0: 17, y0: 13, x1: 23, y1: 19, project: 4, doing: "browsing the shelves", caption: "Network-analysis personas for a mega mall.", top: false },
];
const FULL = "/images/full/";
const HALL_PICS: Record<ZoneId, [string, number][]> = {
  army: [[FULL + "military-3d-battlefield-mapping-01.jpg", 1400 / 1131], [FULL + "military-3d-battlefield-mapping-03.jpg", 1400 / 950], [FULL + "military-3d-battlefield-mapping-02.jpg", 824 / 1400]],
  care: [["/images/cards/disability-persona-augmentation.jpg", 1], [FULL + "disability-persona-augmentation-07.jpg", 1400 / 1314], [FULL + "disability-persona-augmentation-05.jpg", 1132 / 1400]],
  samsung: [["/images/cards/samsung-raemian-metaverse.jpg", 1000 / 607], [FULL + "samsung-raemian-metaverse-04.jpg", 1095 / 1400], [FULL + "samsung-raemian-metaverse-06.jpg", 1400 / 515]],
  robots: [["/images/cards/vip-concierge-robot.jpg", 1000 / 776], [FULL + "vip-concierge-robot-02.jpg", 1400 / 662], [FULL + "vip-concierge-robot-07.jpg", 1049 / 1400]],
  lab: [["/images/cards/idd-agent-simulation.jpg", 1000 / 562], [FULL + "disability-persona-augmentation-03.jpg", 1400 / 1054], [FULL + "disability-persona-augmentation-09.jpg", 1400 / 1167]],
  mall: [["/images/cards/starfield-existing-branch.jpg", 1000 / 722], [FULL + "starfield-existing-branch-01.jpg", 1400 / 1054], [FULL + "starfield-existing-branch-09.jpg", 1400 / 823]],
};
const PLAQUE: Record<ZoneId, string> = { army: "TERRAIN MODEL", care: "FIVE PERSONAS", samsung: "RAEMIAN TOWER", robots: "ROBES FOR ROBOTS", lab: "IDD VILLAGE", mall: "STARFIELD MODEL" };
export const ZONES: Hall[] = ZONES_RAW.map((z) => ({ ...z, plaque: PLAQUE[z.id], pics: HALL_PICS[z.id] }));
const hallOf = (id: ZoneId) => ZONES.find((z) => z.id === id)!;
export const zoneColor = (z: ZoneId | "plaza") => (z === "plaza" ? "#c3cddd" : hallOf(z).color);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  NODES[`${z.id}_d`] = [xc + 1.0, z.top ? 6.2 : 13.8];
  EDGES.push([cNode, `${z.id}_door`], [`${z.id}_door`, `${z.id}_a`], [`${z.id}_a`, `${z.id}_b`], [`${z.id}_door`, `${z.id}_d`]);
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

// ------------------------------------------------------------ walkable floor + obstacles (for the playable avatar)
const PED: Record<ZoneId, [number, number, number, number]> = {
  army: [-1.3, -1.0, 2.6, 2.0],
  care: [-1.2, -0.9, 2.4, 1.8],
  samsung: [-1.2, -0.9, 2.4, 1.8],
  robots: [-1.5, -0.5, 3.0, 1.0],
  lab: [-1.4, -0.7, 2.8, 1.4],
  mall: [-1.2, -0.9, 2.4, 1.8],
};
type Rect = [number, number, number, number];
const FLOOR: Rect[] = [[0.5, 8.3, NX - 0.5, 11.7]];
const OBST: Rect[] = [];
ZONES.forEach((z) => {
  const xc = (z.x0 + z.x1) / 2;
  const yc = (z.y0 + z.y1) / 2;
  FLOOR.push([z.x0 + 0.45, z.y0 + 0.45, z.x1 - 0.45, z.y1 - 0.45]);
  FLOOR.push(z.top ? [xc - 0.7, z.y1 - 0.5, xc + 0.7, 8.4] : [xc - 0.7, 11.6, xc + 0.7, z.y0 + 0.5]);
  const [dx, dy, w, d] = PED[z.id];
  OBST.push([xc + dx - 0.25, yc + dy - 0.25, xc + dx + w + 0.25, yc + dy + d + 0.25]);
});
const inRect = (x: number, y: number, r: Rect) => x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3];
const walkable = (x: number, y: number) => FLOOR.some((r) => inRect(x, y, r)) && !OBST.some((r) => inRect(x, y, r));
const clearLine = (a: Pt, b: Pt) => {
  const n = Math.max(2, Math.ceil(dist2(a, b) / 0.25));
  for (let i = 0; i <= n; i++) if (!walkable(a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n)) return false;
  return true;
};
const nearestVisible = (p: Pt): string | null => {
  let best: string | null = null;
  let bd = Infinity;
  Object.entries(NODES).forEach(([k, v]) => {
    const dd = dist2(p, v);
    if (dd < bd && clearLine(p, v)) {
      bd = dd;
      best = k;
    }
  });
  return best;
};

// ------------------------------------------------------------ the six Yuns
type YunInfo = { tag: string; doing: string; hi: string; who: string; made: string };
const YUN: Record<ZoneId, YunInfo> = {
  army: {
    tag: "Army Yun",
    doing: "building the terrain trainer",
    hi: "Hi. I'm the Yun from the Army years.",
    who: journey[2].note,
    made: featured[3].line,
  },
  care: {
    tag: "Thesis Yun",
    doing: "interviewing caregivers",
    hi: "Hi. I'm the Yun who started with a question.",
    who: `"${whyQuote}" Carried since childhood, shaped by my younger brother's developmental disability.`,
    made: featured[0].line,
  },
  samsung: {
    tag: "Samsung Yun",
    doing: "forecasting demand",
    hi: "Hi. I'm the Yun at Samsung.",
    who: journey[5].note,
    made: featured[5].line,
  },
  robots: {
    tag: "Robot-lab Yun",
    doing: "choreographing robots",
    hi: "Hi. I'm the Yun from the SDI robot projects.",
    who: journey[4].note,
    made: featured[2].line,
  },
  lab: {
    tag: "Simulator Yun",
    doing: "running the simulator",
    hi: "Hi. I'm the Yun who builds the simulator.",
    who: "Personas of people with developmental disabilities, augmented by data and run through AI simulation.",
    made: featured[1].line,
  },
  mall: {
    tag: "Retail Yun",
    doing: "mapping shoppers",
    hi: "Hi. I'm the Yun who turned customer data into strategy.",
    who: "Customer data turned into service strategy for malls, appliances and apartment life.",
    made: featured[4].line,
  },
};

type Spot = [ZoneId, "a" | "b", number];
const ROUTES: Record<ZoneId, Spot[]> = {
  army: [["army", "a", 6], ["army", "b", 4], ["care", "a", 3], ["army", "a", 5], ["army", "b", 4], ["samsung", "b", 3]],
  care: [["care", "a", 6], ["care", "b", 4], ["lab", "a", 3], ["care", "b", 5], ["care", "a", 4], ["robots", "a", 3]],
  samsung: [["samsung", "a", 6], ["samsung", "b", 4], ["mall", "b", 3], ["samsung", "b", 5], ["samsung", "a", 4], ["army", "a", 3]],
  robots: [["robots", "a", 6], ["robots", "b", 4], ["lab", "b", 3], ["robots", "a", 5], ["robots", "b", 4], ["mall", "a", 3]],
  lab: [["lab", "a", 6], ["lab", "b", 4], ["care", "a", 3], ["lab", "b", 5], ["lab", "a", 4], ["robots", "b", 3]],
  mall: [["mall", "a", 6], ["mall", "b", 4], ["samsung", "a", 3], ["mall", "b", 5], ["mall", "a", 4], ["lab", "a", 3]],
};

type Yun = { hall: ZoneId; pos: Pt; path: Pt[]; seg: number; mode: "walk" | "do"; left: number; i: number; node: string; face: 1 | -1 };
const makeYun = (hall: ZoneId, k: number): Yun => ({ hall, pos: [...NODES[`${hall}_a`]] as Pt, path: [], seg: 0, mode: "do", left: 2 + k * 1.3, i: 0, node: `${hall}_a`, face: 1 });

const WELCOME = "Welcome. This museum is about one person, in six chapters. Follow me!";
const TOUR: ZoneId[] = ["army", "care", "samsung", "mall", "lab", "robots"];
type Docent = { pos: Pt; path: Pt[]; seg: number; mode: "walk" | "do"; left: number; i: number; node: string; face: 1 | -1; hall: ZoneId | null };

type Choice = { label: string; go?: string; href?: string };
type DNode = { text: string; choices: Choice[] };
function dialogNode(who: string, key: string): DNode {
  if (who === "D") {
    if (key === "start")
      return {
        text: "Start with the Care hall: the question behind everything is there. Then walk the others in any order, and talk to each Yun.",
        choices: [{ label: "Show me the journey map", href: "/concept/journey" }, { label: "Thanks" }],
      };
    return {
      text: "I'm the docent. Every Yun you see here is Yun at one chapter of their life. Talk to all six to fill your passport.",
      choices: [{ label: "Where do I start?", go: "start" }, { label: "Show me the journey map", href: "/concept/journey" }, { label: "Thanks" }],
    };
  }
  const h = who as ZoneId;
  const y = YUN[h];
  const href = hrefFor(featured[hallOf(h).project]);
  const open: Choice = { label: "Show me the exhibit", href };
  if (key === "who") return { text: y.who, choices: [{ label: "What did you make?", go: "made" }, open, { label: "See you" }] };
  if (key === "made") return { text: y.made, choices: [{ label: "Who were you then?", go: "who" }, open, { label: "See you" }] };
  return { text: y.hi, choices: [{ label: "Who were you then?", go: "who" }, { label: "What did you make?", go: "made" }, open, { label: "See you" }] };
}


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

// a flat image mapped onto a wall plane (side "y": plane gy=y0 running along gx; "x": plane gx=x0 running along gy)
function WallPic({ src, side, wall, c, wu, z0, H, hot, color }: { src: string; side: "x" | "y"; wall: number; c: number; wu: number; z0: number; H: number; hot: boolean; color: string }) {
  const o = side === "y" ? P(c - wu / 2, wall, z0 + H) : P(wall, c + wu / 2, z0 + H);
  const m = side === "y" ? `matrix(${20 * wu} ${10 * wu} 0 ${H} ${o[0]} ${o[1]})` : `matrix(${20 * wu} ${-10 * wu} 0 ${H} ${o[0]} ${o[1]})`;
  return (
    <g transform={m}>
      <rect x="-0.06" y={-0.09 * (20 / H)} width="1.12" height={1 + 0.18 * (20 / H)} fill="#fffdf7" stroke={hot ? color : "rgba(31,42,68,0.35)"} strokeWidth={hot ? 3 : 1} vectorEffect="non-scaling-stroke" />
      <image href={src} x="0" y="0" width="1" height="1" preserveAspectRatio="none" />
    </g>
  );
}

function Pedestal({ gx, gy, w, d, h, plaque, color }: { gx: number; gy: number; w: number; d: number; h: number; plaque: string; color: string }) {
  const t = P(gx + 0.12, gy + d, h * 0.45);
  return (
    <>
      <Box gx={gx} gy={gy} w={w} d={d} h={h} base="#f7f5ef" />
      <text transform={`matrix(0.894 0.447 0 1 ${t[0]} ${t[1]})`} fontSize="5.4" fontWeight={700} fill={color} style={{ fontFamily: SANS }}>
        {plaque}
      </text>
    </>
  );
}

function MiniRobot({ x, y, z, robe }: { x: number; y: number; z: number; robe: string }) {
  const c = P(x, y, z);
  return (
    <g transform={`translate(${c[0]} ${c[1]})`}>
      <path d="M-5,0 L-3.5,-13 L3.5,-13 L5,0 Z" fill={robe} stroke={EDGE} strokeWidth="0.7" />
      <rect x="-3.2" y="-23" width="6.4" height="9" rx="2" fill="#26324f" />
      <circle cx="-1.3" cy="-19" r="0.9" fill="#6fe3ff" />
      <circle cx="1.3" cy="-19" r="0.9" fill="#6fe3ff" />
    </g>
  );
}

function MiniPerson({ x, y, z, color }: { x: number; y: number; z: number; color: string }) {
  const c = P(x, y, z);
  return (
    <g transform={`translate(${c[0]} ${c[1]})`}>
      <rect x="-3" y="-11" width="6" height="11" rx="3" fill={color} stroke={EDGE} strokeWidth="0.6" />
      <circle cx="0" cy="-15" r="3.2" fill="#ffe0c4" stroke={EDGE} strokeWidth="0.6" />
    </g>
  );
}

// the exhibit at the centre of each hall, evoking its project
function buildProps(): Item[] {
  const out: Item[] = [];
  let n = 0;
  const add = (gx: number, gy: number, w: number, d: number, el: ReactNode, bias = 0) =>
    out.push({ depth: gx + w / 2 + gy + d / 2 + bias, el: <g key={`p${n++}`}>{el}</g> });
  const ctr = (id: ZoneId): [number, number] => {
    const z = hallOf(id);
    return [(z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2];
  };

  // ARMY: clay terrain table (rivers + ridges), sandbags, flag
  {
    const [xc, yc] = ctr("army");
    const gx = xc - 1.3, gy = yc - 1.0;
    add(gx, gy, 2.6, 2.0, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.6} d={2.0} h={6} plaque={PLAQUE.army} color="#2f7d4a" />
        <polygon points={pts([P(gx + 0.1, gy + 0.1, 6), P(gx + 2.5, gy + 0.1, 6), P(gx + 2.5, gy + 1.9, 6), P(gx + 0.1, gy + 1.9, 6)])} fill="#e9d9b8" />
        <polyline points={pts([P(gx + 0.3, gy + 0.5, 6.2), P(gx + 1.1, gy + 0.8, 6.2), P(gx + 1.5, gy + 1.4, 6.2), P(gx + 2.3, gy + 1.5, 6.2)])} fill="none" stroke="#2fb5b0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <Box gx={gx + 0.4} gy={gy + 1.1} w={0.8} d={0.7} z={6} h={4} base="#c9deb8" />
        <Box gx={gx + 1.6} gy={gy + 0.3} w={0.7} d={0.6} z={6} h={6} base="#b4d4a0" />
        <circle cx={P(gx + 1.9, gy + 1.5, 14)[0]} cy={P(gx + 1.9, gy + 1.5, 14)[1]} r="2" fill="#e2493a" stroke="none" />
      </>
    ));
    [[xc + 2.0, 1.3], [xc + 2.0, 1.9], [xc + 1.5, 1.3]].forEach(([x, y]) => add(x, y, 1.0, 0.5, <Box gx={x} gy={y} w={1.0} d={0.5} h={4} base="#d9cfa8" />));
  }

  // CARE: the five personas, standing on a low round-ish plinth, with the ABC star behind
  {
    const [xc, yc] = ctr("care");
    const gx = xc - 1.2, gy = yc - 0.9;
    add(gx, gy, 2.4, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.4} d={1.8} h={5} plaque={PLAQUE.care} color="#3a62c9" />
        {["#ff7a6b", "#6a9bff", "#ffc93c", "#4caf6a", "#b07af0"].map((c, i) => (
          <MiniPerson key={c} x={gx + 0.35 + i * 0.4} y={gy + 0.6 + (i % 2) * 0.6} z={5} color={c} />
        ))}
      </>
    ), 0.3);
    add(xc - 3.0, yc + 1.2, 1.2, 1.0, <Box gx={xc - 3.0} gy={yc + 1.2} w={1.2} d={1.0} h={6} base="#dbe6ff" />);
  }

  // SAMSUNG: Raemian apartment tower model + smart-home panel
  {
    const [xc, yc] = ctr("samsung");
    const gx = xc - 1.2, gy = yc - 0.9;
    add(gx, gy, 2.4, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.4} d={1.8} h={5} plaque={PLAQUE.samsung} color="#5a47b8" />
        <Box gx={gx + 0.3} gy={gy + 0.35} w={0.8} d={1.1} z={5} h={30} base="#dfe7f7" />
        <Box gx={gx + 1.3} gy={gy + 0.5} w={0.8} d={0.9} z={5} h={20} base="#e9eefb" />
        {[9, 14, 19, 24, 29].map((z) => (
          <line key={z} x1={P(gx + 0.3, gy + 1.45, 5 + z)[0]} y1={P(gx + 0.3, gy + 1.45, 5 + z)[1]} x2={P(gx + 1.1, gy + 1.45, 5 + z)[0]} y2={P(gx + 1.1, gy + 1.45, 5 + z)[1]} stroke="#7e92c4" strokeWidth="1.4" />
        ))}
        <circle cx={P(gx + 0.7, gy + 0.9, 38)[0]} cy={P(gx + 0.7, gy + 0.9, 38)[1]} r="2.2" fill="#6d5bd0" stroke="none" />
      </>
    ));
    add(xc + 2.2, 1.6, 0.6, 0.6, <Box gx={xc + 2.2} gy={1.6} w={0.6} d={0.6} h={12} base="#e6ecf8" />);
  }

  // ROBOTS: three serving robots in court dress on a long plinth
  {
    const [xc, yc] = ctr("robots");
    const gx = xc - 1.5, gy = yc - 0.5;
    add(gx, gy, 3.0, 1.0, (
      <>
        <Pedestal gx={gx} gy={gy} w={3.0} d={1.0} h={4} plaque={PLAQUE.robots} color="#d9502f" />
        <MiniRobot x={gx + 0.6} y={gy + 0.5} z={4} robe="#3b6fd8" />
        <MiniRobot x={gx + 1.5} y={gy + 0.5} z={4} robe="#2f9e7a" />
        <MiniRobot x={gx + 2.4} y={gy + 0.5} z={4} robe="#2b2b33" />
      </>
    ), 0.3);
    add(xc + 2.4, yc + 2.2, 0.7, 0.7, <Box gx={xc + 2.4} gy={yc + 2.2} w={0.7} d={0.7} h={6} base="#ffe1d8" />);
  }

  // LAB: workstation whose screen shows the actual IDD village map
  {
    const [xc, yc] = ctr("lab");
    const gx = xc - 1.4, gy = yc - 0.7;
    const o = P(gx + 0.2, gy + 0.24, 19);
    add(gx, gy, 2.8, 1.4, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.8} d={1.4} h={6} plaque={PLAQUE.lab} color="#0f8f80" />
        <Box gx={gx + 0.1} gy={gy + 0.1} w={2.6} d={0.14} z={6} h={14} base="#2f3b5c" />
        <g transform={`matrix(${20 * 2.4} ${10 * 2.4} 0 11 ${o[0]} ${o[1]})`}>
          <image href="/images/cards/idd-agent-simulation.jpg" x="0" y="0" width="1" height="1" preserveAspectRatio="none" />
        </g>
        <MiniPerson x={gx + 0.7} y={gy + 0.9} z={6} color="#2fb5d9" />
        <MiniPerson x={gx + 1.5} y={gy + 1.0} z={6} color="#ff7a6b" />
        <MiniPerson x={gx + 2.2} y={gy + 0.9} z={6} color="#ffc93c" />
      </>
    ), 0.3);
  }

  // MALL: five-storey Starfield model (B1–4F) with an added-brand pin
  {
    const [xc, yc] = ctr("mall");
    const gx = xc - 1.2, gy = yc - 0.9;
    add(gx, gy, 2.4, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.4} d={1.8} h={4} plaque={PLAQUE.mall} color="#b27d00" />
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} gx={gx + 0.2} gy={gy + 0.25} w={2.0} d={1.3} z={4 + i * 7} h={4} base={["#fff0c0", "#ffe9a8", "#ffe090", "#ffd566"][i]} />
        ))}
        <circle cx={P(gx + 1.6, gy + 0.9, 36)[0]} cy={P(gx + 1.6, gy + 0.9, 36)[1]} r="3" fill="#ff6b4a" stroke="#fff" strokeWidth="1" />
      </>
    ));
    add(xc + 2.4, yc + 2.2, 0.8, 0.8, <Box gx={xc + 2.4} gy={yc + 2.2} w={0.8} d={0.8} h={14} base="#fff0c0" />);
  }

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
type Kind = ZoneId | "you";
const SHIRT: Record<Kind, string> = { army: "#5b7a46", care: "#6a9bff", samsung: "#eef0ff", robots: "#ff8a66", lab: "#f6f8fb", mall: "#ffd24a", you: "#ff4d6d" };

function Person({ kind, face, bob }: { kind: Kind; face: 1 | -1; bob: number }) {
  const shirt = SHIRT[kind];
  return (
    <g transform={`scale(${face} 1)`}>
      <ellipse cx="0" cy="1.5" rx="8" ry="3" fill="rgba(60,80,120,0.22)" />
      <g transform={`translate(0 ${bob})`}>
        <rect x="-4" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="1" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="-5.5" y="-17" width="11" height="12" rx="4.5" fill={shirt} stroke={kind === "samsung" || kind === "lab" ? "rgba(70,100,150,0.4)" : "none"} strokeWidth="0.8" />
        {kind === "lab" && <rect x="-1" y="-17" width="2" height="12" fill="#2fb8a8" />}
        {kind === "samsung" && (
          <>
            <line x1="-1.5" y1="-17" x2="0" y2="-11" stroke="#1f2a44" strokeWidth="0.9" />
            <line x1="1.5" y1="-17" x2="0" y2="-11" stroke="#1f2a44" strokeWidth="0.9" />
            <rect x="-1.6" y="-11" width="3.2" height="3.8" rx="0.6" fill="#4a5bd8" />
          </>
        )}
        <circle cx="0" cy="-23" r="6.2" fill="#ffe0c4" />
        <path d="M-6.2,-24 Q-6,-30 0,-30 Q6,-30 6.2,-24 Q2,-27 -1,-26 Q-5,-26 -6.2,-24 Z" fill="#1f2a44" />
        <circle cx="-2.2" cy="-22.5" r="0.9" fill={INK} />
        <circle cx="2.2" cy="-22.5" r="0.9" fill={INK} />
        {kind === "army" && (
          <>
            <path d="M-6.6,-25 Q-6,-32 0,-32 Q6,-32 6.6,-25 Z" fill="#4a6a38" />
            <rect x="-1" y="-26.4" width="9" height="2" rx="1" fill="#3a5430" />
          </>
        )}
        {kind === "lab" && (
          <>
            <circle cx="-2.6" cy="-22.6" r="2.1" fill="none" stroke={INK} strokeWidth="0.8" />
            <circle cx="2.6" cy="-22.6" r="2.1" fill="none" stroke={INK} strokeWidth="0.8" />
            <line x1="-0.5" y1="-22.6" x2="0.5" y2="-22.6" stroke={INK} strokeWidth="0.8" />
          </>
        )}
        {kind === "robots" && (
          <>
            <path d="M-6.4,-24 Q0,-34 6.4,-24" fill="none" stroke="#26324f" strokeWidth="1.4" />
            <rect x="-7.6" y="-24" width="2.6" height="5" rx="1.2" fill="#26324f" />
          </>
        )}
        {kind === "care" && <path d="M0,-9.5 C-3,-12.5 -3.6,-14.2 -1.8,-14.8 C-0.8,-15 0,-14.2 0,-14.2 C0,-14.2 0.8,-15 1.8,-14.8 C3.6,-14.2 3,-12.5 0,-9.5 Z" fill="#ff6b8a" />}
        {kind === "mall" && (
          <>
            <rect x="5" y="-12" width="6.5" height="8" rx="1" fill="#ff6b4a" stroke={EDGE} strokeWidth="0.6" />
            <path d="M6.6,-12 Q8.2,-16 9.9,-12" fill="none" stroke="#c94b2e" strokeWidth="0.9" />
          </>
        )}
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
type SnapAgent = { id: ZoneId; pos: Pt; face: 1 | -1; mode: "walk" | "do"; frozen: boolean };
type Snap = {
  t: number;
  a: SnapAgent[];
  p: { pos: Pt; face: 1 | -1; moving: boolean };
  doc: { pos: Pt; face: 1 | -1; mode: "walk" | "do"; hall: ZoneId | null; line: string };
  near: string | null;
  cam: { x: number; y: number; w: number; h: number };
};

const KEYDIR: Record<string, Pt> = { ArrowUp: [-1, -1], w: [-1, -1], ArrowDown: [1, 1], s: [1, 1], ArrowLeft: [-1, 1], a: [-1, 1], ArrowRight: [1, -1], d: [1, -1] };
const START: Pt = [NODES.gate[0] + 1.6, NODES.gate[1] + 0.6];

export default function ObservationRoom({
  active,
  selected,
  onSelectedChange,
}: {
  chrome?: boolean;
  active?: boolean;
  selected?: string | null;
  onSelectedChange?: (id: string | null) => void;
}) {
  const router = useRouter();
  const [init] = useState(() => ZONES.map((z, k) => makeYun(z.id, k)));
  const agents = useRef<Yun[]>(init);
  const clock = useRef(0);
  const docent = useRef<Docent>({ pos: [NODES.gate[0] + 0.8, NODES.gate[1] - 1] as Pt, path: [], seg: 0, mode: "do", left: 4, i: -1, node: "gate", face: 1, hall: null });
  const player = useRef<{ pos: Pt; face: 1 | -1; path: Pt[]; moving: boolean }>({ pos: START, face: 1, path: [], moving: false });
  const keys = useRef<Set<string>>(new Set());
  const cam = useRef({ x: 0, y: 0, w: VW, h: VH });
  const st = useRef({ play: false, sel: null as string | null, dlg: null as { who: string; key: string } | null, near: null as string | null });
  const svgRef = useRef<SVGSVGElement>(null);
  const last = useRef<number | null>(null);

  const [snap, setSnap] = useState<Snap>({
    t: 0,
    a: init.map((a) => ({ id: a.hall, pos: a.pos, face: a.face, mode: a.mode, frozen: false })),
    p: { pos: START, face: 1, moving: false },
    doc: { pos: [NODES.gate[0] + 0.8, NODES.gate[1] - 1] as Pt, face: 1, mode: "do", hall: null, line: WELCOME },
    near: null,
    cam: { x: 0, y: 0, w: VW, h: VH },
  });
  const [playing, setPlaying] = useState(true);
  const [play, setPlay] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dlg, setDlg] = useState<{ who: string; key: string } | null>(null);
  const [met, setMet] = useState<ZoneId[]>([]);
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
  const [picHot, setPicHot] = useState<ZoneId | null>(null);
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const [frameH, setFrameH] = useState(0);
  const props = useMemo(() => buildProps(), []);

  useEffect(() => {
    st.current.play = play;
    st.current.sel = sel;
    st.current.dlg = dlg;
    st.current.near = snap.near;
  });

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  const expand = useCallback(() => {
    setFrameH(wrap.current?.offsetHeight ?? 0);
    setExpanded(true);
  }, []);
  const collapse = useCallback(() => {
    setExpanded(false);
    setPlay(false);
    setDlg(null);
    player.current.path = [];
    keys.current.clear();
  }, [setPlay]);

  const openDialog = useCallback((who: string) => {
    setDlg({ who, key: "root" });
    if (who !== "D") setMet((m) => (m.includes(who as ZoneId) ? m : [...m, who as ZoneId]));
  }, []);

  const choose = useCallback(
    (c: Choice) => {
      if (c.href) {
        router.push(c.href);
        return;
      }
      if (c.go) setDlg((d) => (d ? { ...d, key: c.go as string } : d));
      else setDlg(null);
    },
    [router]
  );

  // keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const s = st.current;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === "Escape") {
        if (s.dlg) setDlg(null);
        else if (s.play) {
          setPlay(false);
          keys.current.clear();
        } else if (expanded) collapse();
        return;
      }
      if (!s.play) return;
      if (s.dlg) {
        const n = dialogNode(s.dlg.who, s.dlg.key);
        const idx = parseInt(k, 10);
        if (idx >= 1 && idx <= n.choices.length) choose(n.choices[idx - 1]);
        else if (k === "e" || k === "Enter") choose(n.choices[0]);
        e.preventDefault();
        return;
      }
      if (k === "e" || k === "Enter") {
        if (s.near) openDialog(s.near);
        e.preventDefault();
        return;
      }
      if (KEYDIR[k]) {
        keys.current.add(k);
        player.current.path = [];
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys.current.delete(k);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [expanded, collapse, choose, openDialog]);

  const tick = useCallback((dt: number) => {
    clock.current += dt;
    const s = st.current;
    const pl = player.current;

    // player
    if (s.play && !s.dlg) {
      let vx = 0;
      let vy = 0;
      keys.current.forEach((k) => {
        const d = KEYDIR[k];
        if (d) {
          vx += d[0];
          vy += d[1];
        }
      });
      let moved = false;
      const step = (tx: number, ty: number) => {
        const [x, y] = pl.pos;
        let nx = x;
        let ny = y;
        if (walkable(x + tx, y + ty)) {
          nx = x + tx;
          ny = y + ty;
        } else if (walkable(x + tx, y)) nx = x + tx;
        else if (walkable(x, y + ty)) ny = y + ty;
        if (nx !== x || ny !== y) {
          pl.pos = [nx, ny];
          moved = true;
          const sx = nx - ny - (x - y);
          if (Math.abs(sx) > 0.001) pl.face = sx > 0 ? 1 : -1;
        }
      };
      if (vx || vy) {
        const m = Math.hypot(vx, vy);
        step((vx / m) * 4.6 * dt, (vy / m) * 4.6 * dt);
      } else if (pl.path.length) {
        const to = pl.path[0];
        const dd = dist2(pl.pos, to);
        const mv = 4.6 * dt;
        if (dd <= mv) {
          pl.pos = [...to] as Pt;
          pl.path.shift();
          moved = true;
        } else {
          const nx = pl.pos[0] + ((to[0] - pl.pos[0]) / dd) * mv;
          const ny = pl.pos[1] + ((to[1] - pl.pos[1]) / dd) * mv;
          const sx = nx - ny - (pl.pos[0] - pl.pos[1]);
          if (Math.abs(sx) > 0.001) pl.face = sx > 0 ? 1 : -1;
          pl.pos = [nx, ny];
          moved = true;
        }
      }
      pl.moving = moved;
    } else pl.moving = false;

    // nearest talkable
    let near: string | null = null;
    if (s.play) {
      let bd = 2.7;
      agents.current.forEach((a) => {
        const d = dist2(pl.pos, a.pos);
        if (d < bd) {
          bd = d;
          near = a.hall;
        }
      });
      if (dist2(pl.pos, docent.current.pos) < bd) near = "D";
    }
    s.near = near;

    // the Yuns
    agents.current.forEach((a) => {
      if (near === a.hall || (s.dlg && s.dlg.who === a.hall)) {
        const sx = P(pl.pos[0], pl.pos[1])[0] - P(a.pos[0], a.pos[1])[0];
        if (Math.abs(sx) > 1) a.face = sx > 0 ? 1 : -1;
        return;
      }
      if (a.mode === "do") {
        a.left -= dt;
        if (a.left <= 0) {
          a.i = (a.i + 1) % ROUTES[a.hall].length;
          const [nh, nw] = ROUTES[a.hall][a.i];
          a.path = route(a.node, `${nh}_${nw}`);
          a.seg = 0;
          a.mode = "walk";
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
        if (a.seg >= a.path.length - 1) {
          const [h, w, dur] = ROUTES[a.hall][a.i];
          a.node = `${h}_${w}`;
          a.mode = "do";
          a.left = dur;
        }
      }
    });

    // the docent tour
    const d = docent.current;
    if (s.dlg && s.dlg.who === "D") {
      // paused while talking
    } else if (d.mode === "do") {
      d.left -= dt;
      if (d.left <= 0) {
        d.i = (d.i + 1) % TOUR.length;
        d.path = route(d.node, `${TOUR[d.i]}_d`);
        d.seg = 0;
        d.mode = "walk";
        d.hall = null;
      }
    } else {
      let move = 3.0 * dt;
      while (move > 0 && d.seg < d.path.length - 1) {
        const to = d.path[d.seg + 1];
        const dd = dist2(d.pos, to);
        if (dd <= move) {
          d.pos = [...to] as Pt;
          move -= dd;
          d.seg += 1;
        } else {
          const k = move / dd;
          const sx = P(to[0], to[1])[0] - P(d.pos[0], d.pos[1])[0];
          if (Math.abs(sx) > 0.5) d.face = sx > 0 ? 1 : -1;
          d.pos = [d.pos[0] + (to[0] - d.pos[0]) * k, d.pos[1] + (to[1] - d.pos[1]) * k];
          move = 0;
        }
      }
      if (d.seg >= d.path.length - 1) {
        d.node = `${TOUR[d.i]}_d`;
        d.mode = "do";
        d.left = 9;
        d.hall = TOUR[d.i];
      }
    }

    // camera
    const target = { x: 0, y: 0, w: VW, h: VH };
    let f: Pt | undefined;
    if (s.play) f = pl.pos;
    else if (s.sel === "D") f = d.pos;
    else if (s.sel) f = agents.current.find((a) => a.hall === s.sel)?.pos;
    if (f) {
      const z = s.play ? 0.5 : 0.46;
      const sc = P(f[0], f[1]);
      target.w = VW * z;
      target.h = VH * z;
      target.x = Math.max(0, Math.min(VW - target.w, sc[0] - target.w / 2));
      target.y = Math.max(0, Math.min(VH - target.h, sc[1] - 24 - target.h / 2));
    }
    const k = 1 - Math.exp(-dt * 4.5);
    const c = cam.current;
    c.x += (target.x - c.x) * k;
    c.y += (target.y - c.y) * k;
    c.w += (target.w - c.w) * k;
    c.h += (target.h - c.h) * k;
  }, []);

  const makeSnap = useCallback((): Snap => {
    const dc = docent.current;
    const s = st.current;
    return {
      t: clock.current,
      a: agents.current.map((a) => ({ id: a.hall, pos: [...a.pos] as Pt, face: a.face, mode: a.mode, frozen: s.near === a.hall })),
      p: { pos: [...player.current.pos] as Pt, face: player.current.face, moving: player.current.moving },
      doc: { pos: [...dc.pos] as Pt, face: dc.face, mode: dc.mode, hall: dc.hall, line: dc.hall ? hallOf(dc.hall).caption : WELCOME },
      near: s.near,
      cam: { ...cam.current },
    };
  }, []);

  const run = active ?? (visible || expanded);
  useEffect(() => {
    if (!playing || !run) {
      last.current = null;
      return;
    }
    let raf = 0;
    const loop = (now: number) => {
      if (last.current != null) {
        tick(Math.min(0.05, (now - last.current) / 1000));
        setSnap(makeSnap());
      }
      last.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, run, tick, makeSnap]);

  const toGrid = (e: React.MouseEvent<SVGSVGElement>): Pt | null => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const q = pt.matrixTransform(m.inverse());
    const u = (q.x - OX) / (TW / 2);
    const v = (q.y - OY) / (TH / 2);
    return [(u + v) / 2, (v - u) / 2];
  };

  const walkTo = (target: Pt) => {
    const pl = player.current;
    if (!walkable(target[0], target[1])) return;
    if (clearLine(pl.pos, target)) {
      pl.path = [target];
      return;
    }
    const a = nearestVisible(pl.pos);
    const b = nearestVisible(target);
    if (!a || !b) return;
    pl.path = [...route(a, b), target];
  };

  const onBackground = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!expanded) {
      if (sel) setSel(null);
      else expand();
      return;
    }
    if (play && !dlg) {
      const g = toGrid(e);
      if (g) walkTo(g);
      return;
    }
    if (sel) setSel(null);
  };

  const focus = hov ?? sel;
  const focusPos = focus === "D" ? snap.doc.pos : snap.a.find((a) => a.id === focus)?.pos;
  const focusText =
    focus === "D"
      ? `Docent robot · ${snap.doc.mode === "walk" ? "leading the tour" : snap.doc.hall ? `presenting ${hallOf(snap.doc.hall).name}` : "welcoming"}`
      : focus
        ? (() => {
            const a = snap.a.find((x) => x.id === focus);
            if (!a) return "";
            return `${YUN[a.id].tag} · ${a.mode === "walk" ? "walking" : YUN[a.id].doing}`;
          })()
        : "";
  const lines = (t: string, max = 30) => {
    const out: string[] = [];
    let cur = "";
    t.split(" ").forEach((w) => {
      if ((cur + " " + w).trim().length > max) {
        out.push(cur);
        cur = w;
      } else cur = (cur + " " + w).trim();
    });
    if (cur) out.push(cur);
    return out;
  };

  const tag = (text: string, color: string, y: number, on = false, w = 54) => (
    <g transform={`translate(0 ${y - (on ? 3 : 0)})`}>
      <rect x={-w / 2} y="-8" width={w} height="11" rx="5.5" fill="#fff" stroke={color} strokeWidth="1.6" />
      <text x="0" y="0.2" textAnchor="middle" fontSize="6.4" fontWeight={700} fill={INK} style={{ fontFamily: SANS }}>
        {text}
      </text>
    </g>
  );

  const peopleItems: Item[] = [
    ...snap.a.map((a): Item => {
      const sc = P(a.pos[0], a.pos[1]);
      const walking = a.mode === "walk";
      const bob = walking ? Math.sin(snap.t * 14 + a.id.length * 3) * 1.4 : 0;
      const on = focus === a.id;
      const h = hallOf(a.id);
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
              if (play && expanded) {
                if (snap.near === a.id) openDialog(a.id);
                else walkTo([a.pos[0], a.pos[1] + 1.2]);
              } else setSel(sel === a.id ? null : a.id);
            }}
          >
            <rect x="-14" y="-42" width="28" height="48" fill="transparent" />
            <Person kind={a.id} face={a.face} bob={bob} />
            {tag(YUN[a.id].tag.toUpperCase(), h.color, -37, on, YUN[a.id].tag.length * 4.1 + 12)}
            {a.frozen && play && (
              <g transform="translate(0 -52)">
                <rect x="-17" y="-8" width="34" height="11" rx="5.5" fill={INK} />
                <text x="0" y="0" textAnchor="middle" fontSize="6.6" fill="#fff" style={{ fontFamily: SANS }}>
                  E · talk
                </text>
              </g>
            )}
          </g>
        ),
      };
    }),
    {
      depth: snap.doc.pos[0] + snap.doc.pos[1] + 0.35,
      el: (
        <g
          key="docent"
          transform={`translate(${P(snap.doc.pos[0], snap.doc.pos[1])[0]} ${P(snap.doc.pos[0], snap.doc.pos[1])[1]}) scale(1.1)`}
          className="cursor-pointer"
          onPointerEnter={() => setHov("D")}
          onPointerLeave={() => setHov(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (play && expanded) {
              if (snap.near === "D") openDialog("D");
              else walkTo([snap.doc.pos[0], snap.doc.pos[1] + 1.2]);
            } else setSel(sel === "D" ? null : "D");
          }}
        >
          <rect x="-14" y="-42" width="28" height="48" fill="transparent" />
          <g transform={`scale(${snap.doc.face} 1)`}>
            <Docent t={snap.doc.mode === "walk" ? snap.t * 3 : snap.t} />
          </g>
          {tag("DOCENT", INK, -39, focus === "D", 40)}
          {snap.near === "D" && play && (
            <g transform="translate(0 -54)">
              <rect x="-17" y="-8" width="34" height="11" rx="5.5" fill={INK} />
              <text x="0" y="0" textAnchor="middle" fontSize="6.6" fill="#fff" style={{ fontFamily: SANS }}>
                E · talk
              </text>
            </g>
          )}
        </g>
      ),
    },
    {
      depth: snap.p.pos[0] + snap.p.pos[1] + 0.35,
      el: (
        <g key="you" transform={`translate(${P(snap.p.pos[0], snap.p.pos[1])[0]} ${P(snap.p.pos[0], snap.p.pos[1])[1]}) scale(1.1)`} pointerEvents="none">
          <ellipse cx="0" cy="1.5" rx="11" ry="4" fill="none" stroke="#ff4d6d" strokeWidth="1.4" opacity={0.5 + 0.4 * Math.sin(snap.t * 4)} />
          <Person kind="you" face={snap.p.face} bob={snap.p.moving ? Math.sin(snap.t * 16) * 1.4 : 0} />
          {tag("YOU", "#ff4d6d", -37, play, 26)}
          <path d={`M-3,${-50 + Math.sin(snap.t * 5) * 1.5} L3,${-50 + Math.sin(snap.t * 5) * 1.5} L0,${-45 + Math.sin(snap.t * 5) * 1.5} Z`} fill="#ff4d6d" />
        </g>
      ),
    },
  ];
  const scene = [...props, ...peopleItems].sort((a, b) => a.depth - b.depth);

  const dnode = dlg ? dialogNode(dlg.who, dlg.key) : null;
  const dcolor = dlg ? (dlg.who === "D" ? INK : hallOf(dlg.who as ZoneId).color) : INK;
  const dname = dlg ? (dlg.who === "D" ? "Docent robot" : YUN[dlg.who as ZoneId].tag) : "";

  const dpad = (dir: string, label: string, cls: string) => (
    <button
      type="button"
      aria-label={label}
      className={`absolute h-9 w-9 rounded-full border bg-white/90 text-sm shadow ${cls}`}
      style={{ borderColor: "rgba(31,42,68,0.3)", color: INK }}
      onPointerDown={(e) => {
        e.stopPropagation();
        keys.current.add(dir);
        player.current.path = [];
      }}
      onPointerUp={() => keys.current.delete(dir)}
      onPointerLeave={() => keys.current.delete(dir)}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </button>
  );

  const scenePanel = (
    <div className="relative overflow-hidden rounded-[18px]" style={{ background: "linear-gradient(180deg,#f6f9fd,#e9f0f9)" }}>
      <svg
        ref={svgRef}
        viewBox={`${snap.cam.x.toFixed(1)} ${snap.cam.y.toFixed(1)} ${snap.cam.w.toFixed(1)} ${snap.cam.h.toFixed(1)}`}
        className={`block w-full ${expanded ? "" : "h-auto"}`}
        style={expanded ? { height: "calc(100vh - 150px)" } : undefined}
        role="img"
        aria-label="A glass museum about Yun: six halls for six chapters, each with a Yun avatar, a docent robot, and a visitor you can control"
        onClick={onBackground}
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

        <polygon points={pts([P(0, 8), P(NX, 8), P(NX, 12), P(0, 12)])} fill="#eef3fa" opacity="0.95" stroke={EDGE} strokeWidth="1" />
        <line x1={P(1, 10)[0]} y1={P(1, 10)[1]} x2={P(NX - 1, 10)[0]} y2={P(NX - 1, 10)[1]} stroke="#9db3d4" strokeDasharray="3 6" strokeWidth="1.4" />

        {ZONES.map((z) => {
          const stamped = met.includes(z.id);
          return (
            <g key={z.id}>
              <polygon points={pts([P(z.x0, z.y1, 0), P(z.x1, z.y1, 0), P(z.x1, z.y1, -6), P(z.x0, z.y1, -6)])} fill={mixc(z.color, "#ffffff", 0.7)} stroke={EDGE} strokeWidth="1" />
              <polygon points={pts([P(z.x1, z.y0, 0), P(z.x1, z.y1, 0), P(z.x1, z.y1, -6), P(z.x1, z.y0, -6)])} fill={mixc(z.color, "#7080a0", 0.4)} opacity="0.55" stroke={EDGE} strokeWidth="1" />
              <polygon points={pts([P(z.x0, z.y0), P(z.x1, z.y0), P(z.x1, z.y1), P(z.x0, z.y1)])} fill={mixc(z.color, "#ffffff", stamped ? 0.72 : 0.88)} stroke={EDGE} strokeWidth="1" />
              <polygon points={pts([P(z.x0, z.y0, 0), P(z.x0, z.y1, 0), P(z.x0, z.y1, 46), P(z.x0, z.y0, 46)])} fill="url(#gl)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
              <polygon points={pts([P(z.x0, z.y0, 0), P(z.x1, z.y0, 0), P(z.x1, z.y0, 46), P(z.x0, z.y0, 46)])} fill="url(#gr)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
              <path d={`M${P(z.x0, z.y0, 46).join(",")} L${P(z.x0, z.y1, 46).join(",")} M${P(z.x0, z.y0, 46).join(",")} L${P(z.x1, z.y0, 46).join(",")}`} stroke={z.color} strokeWidth="2" opacity="0.7" fill="none" />
              {snap.doc.hall === z.id && snap.doc.mode === "do" && (
                <polygon points={pts([P(z.x0, z.y0), P(z.x1, z.y0), P(z.x1, z.y1), P(z.x0, z.y1)])} fill="none" stroke={z.color} strokeWidth="3" strokeDasharray="6 4" />
              )}
              {z.pics.map(([src, ar], i) => {
                const side = i === 2 ? "x" : "y";
                const maxw = side === "x" ? 2.5 : 1.9;
                const H = Math.min(27, (maxw * 20) / ar);
                const wu = (ar * H) / 20;
                const xc = (z.x0 + z.x1) / 2;
                const c = side === "x" ? (z.y0 + z.y1) / 2 - 0.3 : xc + (i === 0 ? -2 : 2);
                const f = featured[z.project];
                return (
                  <g
                    key={src}
                    className="cursor-pointer"
                    onPointerEnter={() => setPicHot(z.id)}
                    onPointerLeave={() => setPicHot(null)}
                    onClick={(e) => {
                      if (!expanded) return;
                      e.stopPropagation();
                      router.push(hrefFor(f));
                    }}
                  >
                    <WallPic src={src} side={side} wall={side === "x" ? z.x0 : z.y0} c={c} wu={wu} z0={14} H={H} hot={picHot === z.id} color={z.color} />
                  </g>
                );
              })}
            </g>
          );
        })}

        {scene.map((s, i) => (
          <g key={i}>{s.el}</g>
        ))}

        {snap.doc.mode === "do" && !dlg && (() => {
          const ls = lines(snap.doc.line, 32);
          const sc = P(snap.doc.pos[0], snap.doc.pos[1]);
          const w = Math.max(...ls.map((l) => l.length)) * 4.3 + 16;
          const h = ls.length * 10 + 8;
          const col = snap.doc.hall ? hallOf(snap.doc.hall).color : INK;
          return (
            <g transform={`translate(${sc[0]} ${sc[1] - 62})`} pointerEvents="none">
              <rect x={-w / 2} y={-h} width={w} height={h} rx="8" fill="#fff" stroke={col} strokeWidth="1.5" />
              <path d="M-4,0 L0,6 L4,0 Z" fill="#fff" stroke={col} strokeWidth="1.5" />
              <rect x="-5" y="-1.5" width="10" height="3" fill="#fff" />
              {ls.map((l, i) => (
                <text key={i} x="0" y={-h + 10 + i * 10 - 1} textAnchor="middle" fontSize="7.6" fill={INK} style={{ fontFamily: SANS }}>
                  {l}
                </text>
              ))}
            </g>
          );
        })()}

        {ZONES.map((z) => {
          const f = featured[z.project];
          const lab = P(z.x1 - 0.3, z.y1 - 0.3, 0);
          return (
            <g key={z.id}>
              <text x={lab[0]} y={lab[1] + 17} textAnchor="middle" fontSize="10.5" fontWeight={700} fill={z.color} style={{ fontFamily: "var(--font-bric), " + SANS }}>
                {z.name.toUpperCase()} <tspan fill="rgba(31,42,68,0.45)" fontWeight={500}>· {z.sub}</tspan>
              </text>
              {picHot === z.id && (
                <g transform={`translate(${lab[0]} ${lab[1] + 32})`} pointerEvents="none">
                  <rect x="-96" y="-10" width="192" height="15" rx="7.5" fill={INK} />
                  <text x="0" y="0.5" textAnchor="middle" fontSize="8" fill="#fff" style={{ fontFamily: SANS }}>
                    {expanded ? "Open exhibit" : "Click to enlarge"}: {f.title.length > 24 ? f.title.slice(0, 23) + "…" : f.title} →
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <text x={P(0.4, 9.8, 62)[0]} y={P(0.4, 9.8, 62)[1]} textAnchor="middle" fontSize="9" fontWeight={700} fill="#5a6f94" letterSpacing="1.4" style={{ fontFamily: SANS }}>
          ENTRANCE
        </text>

        {focusPos && focusText && !play && (
          <g transform={`translate(${P(focusPos[0], focusPos[1])[0]} ${P(focusPos[0], focusPos[1])[1] - 16})`} pointerEvents="none">
            {[
              [-17, -26, 1, 1],
              [17, -26, -1, 1],
              [-17, 15, 1, -1],
              [17, 15, -1, -1],
            ].map(([x, y, sx, sy], i) => (
              <path key={i} d={`M${x},${y + sy * 6} V${y} H${x + sx * 6}`} fill="none" stroke={INK} strokeWidth="1.8" />
            ))}
            <g transform="translate(0 -62)">
              <rect x="-82" y="-9" width="164" height="16" rx="8" fill={INK} />
              <text x="0" y="2.4" textAnchor="middle" fontSize="8.5" fill="#fff" style={{ fontFamily: SANS }}>
                {focusText}
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
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 px-6 py-5 text-[11px]" style={{ color: INK }}>
        <span className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 backdrop-blur" style={{ fontFamily: "var(--font-pixel)" }}>
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d4d]" />
          <span className="sm:hidden">MUSEUM OF YUN</span>
          <span className="hidden sm:inline">THE MUSEUM OF YUN · 6 chapters · 6 Yuns</span>
        </span>
        <span className="pointer-events-auto flex items-center gap-2">
          <span className="rounded-full bg-white/85 px-3 py-1 backdrop-blur" style={{ fontFamily: "var(--font-pixel)" }}>
            {play ? "YOU'RE INSIDE" : sel ? `FOLLOW · ${sel === "D" ? "DOCENT" : YUN[sel as ZoneId]?.tag.toUpperCase()}` : "OVERVIEW"}
          </span>
          <button
            type="button"
            onClick={() => (expanded ? collapse() : expand())}
            aria-label={expanded ? "Close" : "Enlarge"}
            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/90 px-3 backdrop-blur hover:bg-[#fff3b8]"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {expanded ? "× close" : "⤢ enlarge"}
          </button>
        </span>
      </div>

      {sel && !play && (
        <div className="absolute bottom-5 right-6 flex gap-2" style={{ fontFamily: "var(--font-pixel)" }}>
          {sel === "D" || YUN[sel as ZoneId] ? (
            <button type="button" onClick={() => openDialog(sel)} className="rounded-full px-3 py-1 text-[11px] text-white" style={{ background: INK }}>
              talk
            </button>
          ) : null}
          <button type="button" onClick={() => setSel(null)} className="rounded-full bg-white/90 px-3 py-1 text-[11px] backdrop-blur hover:bg-white" style={{ color: INK }}>
            × overview
          </button>
        </div>
      )}
      {!sel && !play && (
        <p className="pointer-events-none absolute bottom-5 left-6 hidden rounded-full bg-white/75 px-3 py-1 text-[11px] backdrop-blur sm:block" style={{ fontFamily: "var(--font-pixel)", color: "rgba(31,42,68,0.75)" }}>
          {expanded ? "click a Yun to follow · press “Step inside” to play" : "each avatar is me at a chapter · click the frame to enlarge"}
        </p>
      )}
      {play && !dlg && (
        <>
          <p className="pointer-events-none absolute bottom-5 left-6 hidden rounded-full bg-white/80 px-3 py-1 text-[11px] backdrop-blur md:block" style={{ fontFamily: "var(--font-pixel)", color: INK }}>
            WASD / arrows move · click floor to walk · E talk · Esc exit
          </p>
          <div className="absolute bottom-3 left-3 h-[84px] w-[84px] md:hidden">
            {dpad("ArrowUp", "↖", "left-0 top-0")}
            {dpad("ArrowRight", "↗", "right-0 top-0")}
            {dpad("ArrowLeft", "↙", "bottom-0 left-0")}
            {dpad("ArrowDown", "↘", "bottom-0 right-0")}
          </div>
          {snap.near && (
            <button
              type="button"
              onClick={() => openDialog(snap.near as string)}
              className="absolute bottom-5 right-6 rounded-full px-4 py-1.5 text-[12px] text-white md:hidden"
              style={{ background: INK, fontFamily: "var(--font-pixel)" }}
            >
              talk
            </button>
          )}
        </>
      )}

      {dnode && dlg && (
        <div className="absolute inset-x-3 bottom-3 mx-auto max-w-[560px] rounded-2xl border-2 bg-white/95 p-4 shadow-[0_18px_40px_-14px_rgba(31,42,68,0.6)] backdrop-blur" style={{ borderColor: dcolor }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <span className="rounded-full px-2.5 py-0.5 text-[11px] text-white" style={{ background: dcolor, fontFamily: "var(--font-pixel)" }}>
              {dname}
            </span>
            <button type="button" onClick={() => setDlg(null)} aria-label="Close dialogue" className="text-[13px] opacity-60 hover:opacity-100" style={{ color: INK }}>
              ×
            </button>
          </div>
          <p className="mt-2 text-[14px] leading-snug" style={{ color: INK }}>
            {dnode.text}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dnode.choices.map((c, i) => (
              <button
                key={c.label}
                type="button"
                onClick={() => choose(c)}
                className="rounded-full border px-3 py-1 text-[12px] transition-colors hover:bg-[#fff3b8]"
                style={{ borderColor: "rgba(31,42,68,0.35)", color: INK, background: "#fff" }}
              >
                <span className="opacity-50">{i + 1}</span> {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const controls = (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 px-1" style={{ color: INK }}>
      <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: "var(--font-pixel)" }}>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-[#fff3b8]"
          style={{ borderColor: "rgba(31,42,68,0.3)" }}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><rect x="3" y="2" width="3.4" height="12" /><rect x="9.6" y="2" width="3.4" height="12" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M4 2v12l10-6z" /></svg>
          )}
        </button>
        {expanded ? (
          <button
            type="button"
            onClick={() => {
              setPlay((p) => !p);
              setSel(null);
              keys.current.clear();
              player.current.path = [];
            }}
            className="inline-flex h-8 items-center rounded-full px-4 text-white"
            style={{ background: play ? "#8a94ad" : "#ff4d6d" }}
          >
            {play ? "Exit game" : "Step inside"}
          </button>
        ) : (
          <button type="button" onClick={expand} className="inline-flex h-8 items-center rounded-full border bg-white px-4 hover:bg-[#fff3b8]" style={{ borderColor: "rgba(31,42,68,0.3)" }}>
            Enlarge &amp; play
          </button>
        )}
        <Link href="/concept/journey" className="inline-flex h-8 items-center rounded-full border bg-white px-4 hover:bg-[#fff3b8]" style={{ borderColor: "rgba(31,42,68,0.3)" }}>
          Journey map →
        </Link>
      </div>
      <div className="flex items-center gap-2 text-[11px]" style={{ fontFamily: "var(--font-pixel)" }}>
        <span className="uppercase opacity-55">passport {met.length}/6</span>
        <span className="flex gap-1">
          {ZONES.map((z) => (
            <span key={z.id} title={YUN[z.id].tag} className="h-3.5 w-3.5 rounded-full border" style={{ borderColor: z.color, background: met.includes(z.id) ? z.color : "transparent" }} />
          ))}
        </span>
      </div>
    </div>
  );

  const body = (
    <div
      className={
        expanded
          ? "fixed inset-0 z-[300] overflow-y-auto bg-[#eaf1fa] p-3 sm:p-5"
          : "w-full"
      }
    >
      {chromeWrap(scenePanel, controls, expanded)}
    </div>
  );

  return (
    <div ref={wrap} className="w-full" style={expanded && frameH ? { height: frameH } : undefined}>
      {expanded && typeof document !== "undefined" ? createPortal(body, document.body) : body}
    </div>
  );
}

function chromeWrap(scene: ReactNode, controls: ReactNode, expanded: boolean) {
  return (
    <div className={expanded ? "mx-auto max-w-[1500px]" : ""}>
      {scene}
      {controls}
    </div>
  );
}
