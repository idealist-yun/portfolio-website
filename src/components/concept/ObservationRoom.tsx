"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { featured, hrefFor, journey, universeOf, whyQuote } from "@/data/concept";

type Pt = [number, number];

const INK = "#1f2a44";
const EDGE = "rgba(70,100,150,0.38)";
const SANS = "ui-sans-serif, system-ui";

// ------------------------------------------------------------ iso projection
const TW = 40;
const TH = 20;
const OX = 430;
const OY = 84;
const NX = 26;
const NY = 20;
const VW = 960;
const VH = 575;

const P = (gx: number, gy: number, z = 0): Pt => [OX + ((gx - gy) * TW) / 2, OY + ((gx + gy) * TH) / 2 - z];
const pts = (a: Pt[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

const hexv = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c: number[]) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mixc = (h: string, t: string, k: number) => {
  const a = hexv(h);
  const b = hexv(t);
  return toHex(a.map((v, i) => v + (b[i] - v) * k));
};

// ------------------------------------------------------------ the museum: one open gallery. Back row: defense | care & assistive | robotics & simulation. Front: the long SDI Lab wing
export type ZoneId = "army" | "care" | "access" | "tom" | "robots" | "lab" | "mall" | "raemian" | "fandom" | "lifelog" | "samsung" | "bixby";
type WingId = "defense" | "care" | "robots" | "sdi" | "samsung";
type Wing = { id: WingId; name: string; color: string; tint: string; x0: number; y0: number; x1: number; y1: number };
const WINGS: Wing[] = [
  { id: "defense", name: "DEFENSE", color: "#3f9a5a", tint: "#e6f1e3", x0: 0.7, y0: 0.7, x1: 6.0, y1: 8.0 },
  { id: "care", name: "CARE & ASSISTIVE", color: "#4c7df0", tint: "#e4ebfb", x0: 6.0, y0: 0.7, x1: 16.8, y1: 8.0 },
  { id: "robots", name: "ROBOTICS & SIMULATION", color: "#ff6b4a", tint: "#fde6de", x0: 16.8, y0: 0.7, x1: 25.3, y1: 8.0 },
  { id: "sdi", name: "SDI LAB · SINCE 2021", color: "#d98a0c", tint: "#fbefd6", x0: 0.7, y0: 11.6, x1: 18.4, y1: 19.3 },
  { id: "samsung", name: "SAMSUNG ELECTRONICS", color: "#3a4cc7", tint: "#e3e7fb", x0: 18.4, y0: 11.6, x1: 25.3, y1: 19.3 },
];
type Hall = {
  id: ZoneId;
  wing: WingId;
  name: string;
  sub: string;
  color: string;
  cx: number;
  cy: number;
  rw: number; // rug half-width
  link: { href: string; title: string } | null;
  caption: string; // docent line
  plaque: string;
  pics: [string, number][]; // [src, aspect]
};
const FULL = "/images/full/";
const CARD = "/images/cards/";
const HALL_PICS: Record<ZoneId, [string, number][]> = {
  army: [[FULL + "military-3d-battlefield-mapping-01.jpg", 1400 / 1131], [FULL + "military-3d-battlefield-mapping-03.jpg", 1400 / 950], [FULL + "military-3d-battlefield-mapping-02.jpg", 824 / 1400]],
  care: [[CARD + "disability-persona-augmentation.jpg", 1], [FULL + "disability-persona-augmentation-07.jpg", 1400 / 1314]],
  access: [[CARD + "disability-as-market.jpg", 1]],
  tom: [],
  robots: [[CARD + "vip-concierge-robot.jpg", 1000 / 776], [FULL + "vip-concierge-robot-02.jpg", 1400 / 662]],
  lab: [[CARD + "idd-agent-simulation.jpg", 1000 / 562]],
  mall: [[CARD + "starfield-existing-branch.jpg", 1000 / 722]],
  raemian: [[CARD + "samsung-raemian-metaverse.jpg", 1000 / 607]],
  fandom: [[CARD + "samsung-brand-fandom.jpg", 1000 / 562]],
  lifelog: [[CARD + "samsung-lifelog-minifridge.jpg", 1000 / 750]],
  samsung: [],
  bixby: [],
};
const PLAQUE: Record<ZoneId, string> = { army: "TERRAIN MODEL", care: "FIVE PERSONAS", access: "NRC HACKATHON", tom: "GUIDED HANDS · TOM", robots: "ROBES FOR ROBOTS", lab: "IDD VILLAGE", mall: "STARFIELD MODEL", raemian: "RAEMIAN TOWER", fandom: "BRAND FANDOM", lifelog: "LIFE-LOG FRIDGE", samsung: "DEMAND DASHBOARD", bixby: "BIXBY COOK" };
const ZONES_RAW: Omit<Hall, "plaque" | "pics">[] = [
  { id: "army", wing: "defense", name: "Army", sub: "ROKA · 2022–24", color: "#4caf6a", cx: 3.3, cy: 3.9, rw: 2.3, link: { href: hrefFor(featured[3]), title: featured[3].title }, caption: "Led 60+ people, and built a 3D terrain trainer." },
  { id: "care", wing: "care", name: "Thesis", sub: "disability personas", color: "#4c7df0", cx: 7.9, cy: 3.8, rw: 1.7, link: { href: hrefFor(featured[0]), title: featured[0].title }, caption: "It started with my brother. 2,400 profiles, 5 personas." },
  { id: "access", wing: "care", name: "NRC hackathon", sub: "three journeys", color: "#3a9bd9", cx: 11.5, cy: 3.8, rw: 1.8, link: { href: "/project/disability-as-market", title: "Disability service design: what I truly wish to carve out" }, caption: "Developmental, stroke, spinal: three daily-life journeys from NRC fieldwork, turned into a hackathon." },
  { id: "tom", wing: "care", name: "Guided Hands", sub: "TOM · assistive", color: "#2fb5d9", cx: 15.1, cy: 3.8, rw: 1.7, link: null, caption: "At Penn, TOM: rebuilding a writing aid for people with limited hand control, at low cost." },
  { id: "robots", wing: "robots", name: "VIP Robots", sub: "HRI · SKKU", color: "#ff6b4a", cx: 19.9, cy: 3.9, rw: 1.9, link: { href: hrefFor(featured[2]), title: featured[2].title }, caption: "Three serving robots, choreographed like a royal ceremony." },
  { id: "lab", wing: "robots", name: "IDD Lab", sub: "simulation testbed", color: "#14b8a6", cx: 23.6, cy: 3.9, rw: 1.7, link: { href: hrefFor(featured[1]), title: featured[1].title }, caption: "AI agents living a day in a virtual world." },
  { id: "mall", wing: "sdi", name: "Starfield", sub: "2021 · first project", color: "#f5b301", cx: 3.1, cy: 15.3, rw: 1.9, link: { href: hrefFor(featured[4]), title: featured[4].title }, caption: "My first lab project, 2021: network-analysis personas for a mega mall." },
  { id: "raemian", wing: "sdi", name: "Raemian", sub: "Samsung C&T", color: "#6d5bd0", cx: 7.2, cy: 15.3, rw: 1.9, link: { href: hrefFor(featured[5]), title: featured[5].title }, caption: "Housing data turned into metaverse services for a Samsung C&T complex." },
  { id: "fandom", wing: "sdi", name: "Fandom", sub: "Samsung vs rivals", color: "#e0457b", cx: 11.3, cy: 15.3, rw: 1.9, link: { href: "/project/samsung-brand-fandom", title: "Brand fandom analysis between Samsung and a competitor" }, caption: "Who loves Samsung, and who loves its rivals? A brand fandom analysis." },
  { id: "lifelog", wing: "sdi", name: "Life-log", sub: "mini fridge", color: "#3d8bff", cx: 15.4, cy: 15.3, rw: 1.9, link: { href: "/project/samsung-lifelog-minifridge", title: "Life-log analysis for new product service planning" }, caption: "Life-log analysis to plan a new service around a mini fridge." },
  { id: "samsung", wing: "samsung", name: "Demand dashboard", sub: "Samsung MI · 2025–26", color: "#3a4cc7", cx: 21.0, cy: 15.3, rw: 1.6, link: { href: "/project/samsung-ax-dashboard", title: "Enterprise demand dashboard & AI chatbot" }, caption: "At Samsung: a demand dashboard with an AI chatbot, used across the appliance division." },
  { id: "bixby", wing: "samsung", name: "Bixby cook", sub: "Samsung · 2025–26", color: "#2f80ed", cx: 24.0, cy: 15.3, rw: 1.3, link: { href: "/project/samsung-bixby-cooking-assistant", title: "Bixby-powered cooking assistant" }, caption: "A Bixby-powered cooking assistant for screen-based appliances." },
];
export const ZONES: Hall[] = ZONES_RAW.map((z) => ({ ...z, plaque: PLAQUE[z.id], pics: HALL_PICS[z.id] }));
const hallOf = (id: ZoneId) => ZONES.find((z) => z.id === id)!;
export const zoneColor = (z: ZoneId | "plaza") => (z === "plaza" ? "#c3cddd" : hallOf(z).color);

const DETAIL: Record<ZoneId, string> = {
  army: featured[3].line,
  care: featured[0].line,
  access: "Fieldwork with the National Rehabilitation Center turned the daily lives of people with developmental disabilities, stroke and spinal injuries into journey maps, then into a hackathon with SKKU students.",
  tom: "A mechanical sliding frame that turns big arm movements into writing. The goal: quiet, tight, cheap, and good-looking enough to use in a classroom. Still being built.",
  robots: featured[2].line,
  lab: featured[1].line,
  mall: featured[4].line,
  raemian: featured[5].line,
  fandom: "A brand fandom analysis between Samsung and a competitor, for the Household Appliance Division.",
  lifelog: "Life-log analysis to plan new product services, for the Household Appliance Division.",
  samsung: "The AX project: an enterprise demand dashboard with an AI chatbot, for the Digital Appliances Division.",
  bixby: "A Bixby-powered cooking assistant for screen-based appliances, for the Digital Appliances Division.",
};

// pictures: hung on the back wall (wall) or standing on free panels
type Panel = { z: ZoneId; src: string; plane: "x" | "y"; fixed: number; along: number; wall: boolean; wu: number; H: number };
const PANEL_CFG: Partial<Record<ZoneId, ["x" | "y", number, number, boolean][]>> = {
  army: [["y", 0, 1.9, true], ["y", 0, 4.9, true], ["x", 0, 5.4, true]],
  care: [["y", 0, 7.0, true], ["y", 0, 8.9, true]],
  access: [["y", 0, 11.5, true]],
  robots: [["y", 0, 18.7, true], ["y", 0, 21.1, true]],
  lab: [["y", 0, 23.7, true]],
  mall: [["y", 12.4, 3.1, false]],
  raemian: [["y", 12.4, 7.2, false]],
  fandom: [["y", 12.4, 11.3, false]],
  lifelog: [["y", 12.4, 15.4, false]],
};
const PANELS: Panel[] = ZONES.flatMap((z) =>
  (PANEL_CFG[z.id] ?? []).map(([plane, fixed, along, wall], i) => {
    const [src, ar] = z.pics[i];
    const maxw = wall ? 1.5 : plane === "x" ? 2.2 : 1.9;
    const H = Math.min(27, (maxw * 20) / ar);
    return { z: z.id, src, plane, fixed, along, wall, wu: (ar * H) / 20, H };
  })
);

// ------------------------------------------------------------ floor, obstacles, and the walking graph
type Rect = [number, number, number, number];
const FLOOR_RECT: Rect = [0.7, 0.7, NX - 0.7, NY - 0.7];
const OBST: Rect[] = [];
const NODES: Record<string, Pt> = {};
const EDGES: [string, string][] = [];
const dist2 = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const inRect = (x: number, y: number, r: Rect) => x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3];
const walkable = (x: number, y: number) => inRect(x, y, FLOOR_RECT) && !OBST.some((r) => inRect(x, y, r));
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
const fixSpot = (p: Pt): Pt => {
  if (walkable(p[0], p[1])) return p;
  for (let r = 0.3; r < 3; r += 0.3)
    for (let k = 0; k < 16; k++) {
      const a = (k * Math.PI) / 8;
      const x = p[0] + Math.cos(a) * r;
      const y = p[1] + Math.sin(a) * r;
      if (walkable(x, y)) return [x, y];
    }
  return p;
};

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
    if (u === to || dist[u] === Infinity) break;
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
  return out.length > 1 || from === to ? out.map((k) => NODES[k]) : [NODES[from], NODES[to]];
}


// ------------------------------------------------------------ the seven Yuns (one per chapter; they live in the wing of their theme)
type YunId = "army" | "care" | "robots" | "mall" | "samsung" | "penn";
type YunInfo = { tag: string; home: ZoneId; doing: string; hi: string; who: string; made: string; href: string; hrefLabel: string };
const YUN: Record<YunId, YunInfo> = {
  army: {
    tag: "Army Yun",
    home: "army",
    doing: "building the terrain trainer",
    hi: "Hi. I'm the Yun from the Army years.",
    who: journey[3].note,
    made: featured[3].line,
    href: hrefFor(featured[3]),
    hrefLabel: "Show me the exhibit",
  },
  care: {
    tag: "Thesis Yun",
    home: "care",
    doing: "interviewing caregivers",
    hi: "Hi. I'm the Yun who started with a question.",
    who: `"${whyQuote}" Carried since childhood, shaped by my younger brother's developmental disability.`,
    made: featured[0].line,
    href: hrefFor(featured[0]),
    hrefLabel: "Show me the exhibit",
  },
  robots: {
    tag: "Robotics Yun",
    home: "robots",
    doing: "choreographing robots and running the simulator",
    hi: "Hi. I'm the Yun from the robot and simulation projects.",
    who: journey[5].note,
    made: featured[2].line + " And the simulator: " + featured[1].line,
    href: hrefFor(featured[2]),
    hrefLabel: "Show me the exhibit",
  },
  mall: {
    tag: "SDI-Lab Yun",
    home: "mall",
    doing: "learning data-driven service design",
    hi: "Hi. I'm the Yun who turned customer data into strategy.",
    who: "In Feb 2021 I joined SDI Lab as an undergraduate researcher; my first project was Starfield. Data-driven service design started here, and I stayed until 2025: malls, appliances, apartments, then robots.",
    made: featured[4].line,
    href: hrefFor(featured[4]),
    hrefLabel: "Show me the exhibit",
  },
  samsung: {
    tag: "Samsung Yun",
    home: "samsung",
    doing: "forecasting demand",
    hi: "Hi. I'm the Yun at Samsung.",
    who: journey[6].note,
    made: "A demand dashboard with an AI chatbot, and a Bixby cooking assistant for screen-based appliances.",
    href: "/project/samsung-ax-dashboard",
    hrefLabel: "Show me the dashboard",
  },
  penn: {
    tag: "Penn Yun",
    home: "tom",
    doing: "building Guided Hands",
    hi: "Hi. I'm the Yun at Penn, right now.",
    who: journey[7].note,
    made: "A low-cost Guided Hands with TOM: a sliding frame that lets big arm motions become writing.",
    href: "/resume",
    hrefLabel: "Open my resume",
  },
};
const YUN_IDS = Object.keys(YUN) as YunId[];
const yunColor = (id: YunId) => (id === "penn" ? "#c23d8c" : hallOf(YUN[id].home).color);

type Spot = [ZoneId, "a" | "b", number];
const ROUTES: Record<YunId, Spot[]> = {
  army: [["army", "a", 6], ["army", "b", 4], ["care", "a", 3], ["army", "a", 5], ["army", "b", 4], ["tom", "b", 3]],
  care: [["care", "a", 6], ["care", "b", 4], ["access", "a", 3], ["care", "b", 5], ["tom", "a", 3], ["lab", "a", 3]],
  robots: [["robots", "a", 6], ["robots", "b", 4], ["lab", "a", 4], ["lab", "b", 4], ["robots", "a", 5], ["tom", "b", 3]],
  mall: [["mall", "a", 6], ["mall", "b", 4], ["raemian", "a", 3], ["fandom", "a", 3], ["lifelog", "a", 3], ["mall", "a", 4]],
  samsung: [["samsung", "a", 6], ["samsung", "b", 4], ["bixby", "a", 4], ["bixby", "b", 3], ["samsung", "a", 4], ["mall", "b", 3]],
  penn: [["tom", "a", 6], ["tom", "b", 4], ["access", "a", 3], ["tom", "b", 5], ["care", "a", 3], ["tom", "a", 4]],
};

type Yun = { id: YunId; pos: Pt; path: Pt[]; seg: number; mode: "walk" | "do"; left: number; i: number; node: string; face: 1 | -1 };
const makeYun = (id: YunId, k: number): Yun => {
  const [h, w] = ROUTES[id][0];
  const node = `${h}_${w}`;
  return { id, pos: [...NODES[node]] as Pt, path: [], seg: 0, mode: "do", left: 2 + k * 1.2, i: 0, node, face: 1 };
};

const WELCOME = "Welcome. This museum is about one person, in six chapters. Follow me!";
const TOUR: ZoneId[] = ["army", "care", "access", "tom", "robots", "lab", "mall", "raemian", "fandom", "lifelog", "samsung", "bixby"];
type Docent = { pos: Pt; path: Pt[]; seg: number; mode: "walk" | "do"; left: number; i: number; node: string; face: 1 | -1; hall: ZoneId | null };

type Choice = { label: string; go?: string; href?: string };
type DNode = { text: string; choices: Choice[] };
function dialogNode(who: string, key: string): DNode {
  if (who.startsWith("x:")) {
    const h = hallOf(who.slice(2) as ZoneId);
    const open: Choice[] = h.link ? [{ label: "Open the project", href: h.link.href }] : [];
    if (key === "more") return { text: DETAIL[h.id], choices: [...open, { label: "Thanks" }] };
    return { text: h.caption, choices: [{ label: "Tell me more", go: "more" }, ...open, { label: "Thanks" }] };
  }
  if (who === "D") {
    if (key === "start")
      return {
        text: "Start in the Care & Assistive wing: the question behind everything is there. Then the long SDI Lab wing in front is where it all began. Talk to each Yun on the way.",
        choices: [{ label: "Show me the journey map", href: "/concept/journey" }, { label: "Thanks" }],
      };
    return {
      text: "I'm the docent. Every Yun you see here is Yun at one chapter of their life, living in the wing of their theme. Talk to all six to fill your passport.",
      choices: [{ label: "Where do I start?", go: "start" }, { label: "Show me the journey map", href: "/concept/journey" }, { label: "Thanks" }],
    };
  }
  const y = YUN[who as YunId];
  const open: Choice = { label: y.hrefLabel, href: y.href };
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
// ------------------------------------------------------------ decor + the artifacts themselves
// a gabled roof/tent: ridge runs along gx
function Prism({ gx, gy, w, d, z = 0, h, color, side }: { gx: number; gy: number; w: number; d: number; z?: number; h: number; color: string; side?: string }) {
  const m = gy + d / 2;
  return (
    <g stroke={EDGE} strokeWidth="1" strokeLinejoin="round">
      <polygon points={pts([P(gx + w, gy, z), P(gx + w, gy + d, z), P(gx + w, m, z + h)])} fill={side ?? mixc(color, "#4d5d82", 0.25)} />
      <polygon points={pts([P(gx, gy + d, z), P(gx + w, gy + d, z), P(gx + w, m, z + h), P(gx, m, z + h)])} fill={color} />
      <polygon points={pts([P(gx, gy, z), P(gx + w, gy, z), P(gx + w, m, z + h), P(gx, m, z + h)])} fill={mixc(color, "#ffffff", 0.3)} />
    </g>
  );
}

function Plant({ gx, gy }: { gx: number; gy: number }) {
  const c = P(gx, gy, 0);
  return (
    <g transform={`translate(${c[0]} ${c[1]})`}>
      <ellipse cx="0" cy="1" rx="8" ry="3" fill="rgba(60,80,120,0.2)" />
      <path d="M-5,-9 L5,-9 L4,0 L-4,0 Z" fill="#d9a47a" stroke={EDGE} strokeWidth="0.8" />
      <ellipse cx="0" cy="-9" rx="5" ry="1.8" fill="#8a5a3a" />
      <path d="M0,-9 C-9,-14 -10,-26 -3,-30 C-3,-22 -1,-16 0,-9 Z" fill="#4faa6a" />
      <path d="M0,-9 C9,-14 10,-26 3,-30 C3,-22 1,-16 0,-9 Z" fill="#3f9a5a" />
      <path d="M0,-9 C-3,-18 -2,-30 1,-36 C4,-28 3,-16 0,-9 Z" fill="#5dbb78" />
    </g>
  );
}

function Spot({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const apex = P(cx, cy, 78);
  const l = P(cx - 1.9, cy + 1.9, 0);
  const r = P(cx + 1.9, cy - 1.9, 0);
  return (
    <g pointerEvents="none">
      <polygon points={`${apex[0] - 3},${apex[1]} ${apex[0] + 3},${apex[1]} ${r[0]},${r[1]} ${l[0]},${l[1]}`} fill={color} opacity="0.13" />
      <polygon points={pts([P(cx - 1.9, cy, 0), P(cx, cy - 1.9, 0), P(cx + 1.9, cy, 0), P(cx, cy + 1.9, 0)])} fill={color} opacity="0.12" />
      <rect x={apex[0] - 5} y={apex[1] - 5} width="10" height="5" rx="2" fill="#2f3b5c" />
    </g>
  );
}

function Orbs({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g pointerEvents="none">
      {[0, 1, 2, 3].map((i) => {
        const p = P(cx + Math.cos(i * 1.7) * 2.2, cy + Math.sin(i * 1.7) * 1.6, 40 + i * 6);
        return (
          <circle key={i} cx={p[0]} cy={p[1]} r={1.6 + (i % 2)} fill={color} opacity="0.7">
            <animate attributeName="cy" values={`${p[1]};${p[1] - 5};${p[1]}`} dur={`${2.4 + i * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.9;0.35" dur={`${2.4 + i * 0.7}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>
  );
}

// the museum is built once: static artifacts + decor, plus the obstacle map for the walkable avatar
function buildWorld(): Item[] {
  const out: Item[] = [];
  let n = 0;
  const add = (gx: number, gy: number, w: number, d: number, el: ReactNode, o: { solid?: boolean; bias?: number } = {}) => {
    out.push({ depth: gx + w / 2 + gy + d / 2 + (o.bias ?? 0), el: <g key={`p${n++}`}>{el}</g> });
    if (o.solid !== false) OBST.push([gx - 0.2, gy - 0.2, gx + w + 0.2, gy + d + 0.2]);
  };

  // free-standing picture panels block the floor
  PANELS.filter((p) => !p.wall).forEach((p) => {
    if (p.plane === "y") OBST.push([p.along - p.wu / 2 - 0.15, p.fixed - 0.25, p.along + p.wu / 2 + 0.15, p.fixed + 0.25]);
    else OBST.push([p.fixed - 0.25, p.along - p.wu / 2 - 0.15, p.fixed + 0.25, p.along + p.wu / 2 + 0.15]);
  });

  // ARMY: clay terrain table, a field tent, sandbags, a flag
  {
    const { cx, cy } = hallOf("army");
    const gx = cx - 1.3, gy = cy - 1.0;
    add(gx, gy, 2.6, 2.0, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.6} d={2.0} h={6} plaque={PLAQUE.army} color="#2f7d4a" />
        <polygon points={pts([P(gx + 0.1, gy + 0.1, 6), P(gx + 2.5, gy + 0.1, 6), P(gx + 2.5, gy + 1.9, 6), P(gx + 0.1, gy + 1.9, 6)])} fill="#e9d9b8" />
        <polyline points={pts([P(gx + 0.3, gy + 0.5, 6.2), P(gx + 1.1, gy + 0.8, 6.2), P(gx + 1.5, gy + 1.4, 6.2), P(gx + 2.3, gy + 1.5, 6.2)])} fill="none" stroke="#2fb5b0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <Box gx={gx + 0.4} gy={gy + 1.1} w={0.8} d={0.7} z={6} h={4} base="#c9deb8" />
        <Box gx={gx + 1.6} gy={gy + 0.3} w={0.7} d={0.6} z={6} h={6} base="#b4d4a0" />
        <circle cx={P(gx + 1.9, gy + 1.5, 14)[0]} cy={P(gx + 1.9, gy + 1.5, 14)[1]} r="2" fill="#e2493a" stroke="none" />
      </>
    ), { bias: 0.3 });
    add(cx - 2.5, cy - 2.5, 1.5, 1.2, <Prism gx={cx - 2.5} gy={cy - 2.5} w={1.5} d={1.2} h={14} color="#6f8f5a" />);
    [0, 0.55, 1.1].forEach((o) => add(5.0, cy - 1.0 + o, 0.5, 0.5, <Box gx={5.0} gy={cy - 1.0 + o} w={0.5} d={0.5} h={4} base="#d9cfa8" />, { solid: o === 0 }));
    add(5.2, 1.3, 0.2, 0.2, (
      <>
        <Box gx={5.2} gy={1.3} w={0.2} d={0.2} h={44} base="#dfe6ee" />
        <polygon points={pts([P(5.4, 1.4, 43), P(5.4, 1.4, 35), P(5.4, 2.6, 39)])} fill="#ff6b4a" stroke={EDGE} strokeWidth="1" />
      </>
    ));
  }

  // THESIS: five personas and a floating heart
  {
    const { cx, cy } = hallOf("care");
    const gx = cx - 1.2, gy = cy - 0.9;
    add(gx, gy, 2.4, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.4} d={1.8} h={5} plaque={PLAQUE.care} color="#3a62c9" />
        {["#ff7a6b", "#6a9bff", "#ffc93c", "#4caf6a", "#b07af0"].map((c, i) => (
          <MiniPerson key={c} x={gx + 0.35 + i * 0.4} y={gy + 0.6 + (i % 2) * 0.6} z={5} color={c} />
        ))}
        <g transform={`translate(${P(cx, cy, 52)[0]} ${P(cx, cy, 52)[1]})`}>
          <path d="M0,8 C-12,-2 -10,-12 -4,-12 C-1,-12 0,-9 0,-9 C0,-9 1,-12 4,-12 C10,-12 12,-2 0,8 Z" fill="#ff6b8a" stroke="#fff" strokeWidth="1.2">
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="3s" repeatCount="indefinite" />
          </path>
        </g>
      </>
    ), { bias: 0.3 });
  }

  // ACCESS: the NRC fieldwork groups as objects: a wheelchair (spinal), a quad cane (stroke), a puzzle piece (developmental)
  {
    const { cx, cy } = hallOf("access");
    const gx = cx - 1.5, gy = cy - 1.1;
    const wc = P(cx - 0.75, cy - 0.1, 3);
    const cane = P(cx + 0.35, cy + 0.15, 3);
    const pz = P(cx + 1.0, cy - 0.2, 3);
    add(gx, gy, 3.0, 2.2, (
      <>
        <Pedestal gx={gx} gy={gy} w={3.0} d={2.2} h={3} plaque={PLAQUE.access} color="#2b78b5" />
        <g transform={`translate(${wc[0]} ${wc[1]})`} stroke="#2f3b5c" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="-2" cy="-9" r="9" strokeWidth="1.8" fill="rgba(255,255,255,0.35)" />
          <circle cx="-2" cy="-9" r="6" strokeWidth="0.6" />
          <line x1="-2" y1="-18" x2="-2" y2="0" strokeWidth="0.6" />
          <line x1="-11" y1="-9" x2="7" y2="-9" strokeWidth="0.6" />
          <circle cx="11" cy="-3" r="3" strokeWidth="1.4" fill="#fff" />
          <path d="M-6,-14 L-6,-26 L-9,-31" strokeWidth="2.2" />
          <path d="M-6,-14 L6,-14 L10,-4" strokeWidth="2.2" />
          <rect x="-6" y="-16" width="11" height="3" rx="1" fill="#3a9bd9" stroke="#2f3b5c" strokeWidth="0.8" />
        </g>
        <g transform={`translate(${cane[0]} ${cane[1]})`} stroke="#2f3b5c" fill="none" strokeLinecap="round">
          <path d="M0,-34 C0,-38 6,-38 6,-34" strokeWidth="2.4" />
          <line x1="0" y1="-34" x2="0" y2="-6" strokeWidth="2.2" stroke="#c9ced8" />
          <path d="M0,-6 L-5,0 M0,-6 L5,0 M0,-6 L-2,1 M0,-6 L3,1" strokeWidth="1.4" />
        </g>
        <g transform={`translate(${pz[0]} ${pz[1] - 4})`}>
          <path d="M-7,-7 L-2,-7 C-4,-12 4,-12 2,-7 L7,-7 L7,-2 C12,-4 12,4 7,2 L7,7 L-7,7 Z" fill="#5b9bff" stroke="#2f5db3" strokeWidth="1" />
        </g>
      </>
    ), { bias: 0.3 });
  }

  // GUIDED HANDS (TOM): an X-Y sliding frame that turns big arm motions into writing
  {
    const { cx, cy } = hallOf("tom");
    const gx = cx - 1.5, gy = cy - 1.1;
    add(gx, gy, 3.0, 2.2, (
      <>
        <Pedestal gx={gx} gy={gy} w={3.0} d={2.2} h={6} plaque={PLAQUE.tom} color="#1a8fb0" />
        <polygon points={pts([P(gx + 0.3, gy + 0.3, 6), P(gx + 2.7, gy + 0.3, 6), P(gx + 2.7, gy + 1.9, 6), P(gx + 0.3, gy + 1.9, 6)])} fill="#fffdf6" stroke={EDGE} strokeWidth="1" />
        <polyline points={pts([P(gx + 0.7, gy + 1.5, 6.1), P(gx + 1.1, gy + 0.8, 6.1), P(gx + 1.5, gy + 1.4, 6.1), P(gx + 1.9, gy + 0.7, 6.1)])} fill="none" stroke="#2fb5d9" strokeWidth="1.4" />
        <Box gx={gx + 0.3} gy={gy + 0.3} w={2.4} d={0.14} z={6} h={3} base="#9aa6bc" />
        <Box gx={gx + 0.3} gy={gy + 1.76} w={2.4} d={0.14} z={6} h={3} base="#9aa6bc" />
        <Box gx={gx + 0.3} gy={gy + 0.3} w={0.14} d={1.6} z={6} h={3} base="#9aa6bc" />
        <Box gx={gx + 2.56} gy={gy + 0.3} w={0.14} d={1.6} z={6} h={3} base="#9aa6bc" />
        <g>
          <Box gx={gx + 0.3} gy={gy + 1.0} w={2.4} d={0.1} z={9} h={1.4} base="#cdd5e4" />
          <g transform={`translate(${P(gx + 1.5, gy + 1.0, 11)[0]} ${P(gx + 1.5, gy + 1.0, 11)[1]})`}>
            <animateTransform attributeName="transform" type="translate" values={`${P(gx + 0.9, gy + 1.0, 11)[0]} ${P(gx + 0.9, gy + 1.0, 11)[1]};${P(gx + 2.1, gy + 1.0, 11)[0]} ${P(gx + 2.1, gy + 1.0, 11)[1]};${P(gx + 0.9, gy + 1.0, 11)[0]} ${P(gx + 0.9, gy + 1.0, 11)[1]}`} dur="5s" repeatCount="indefinite" />
            <rect x="-4" y="-3" width="8" height="5" rx="1.5" fill="#2fb5d9" stroke={EDGE} strokeWidth="0.8" />
            <line x1="0" y1="2" x2="0" y2="8" stroke="#1f2a44" strokeWidth="1.4" />
          </g>
        </g>
      </>
    ), { bias: 0.3 });
  }

  // ROBOTS: three robots in court dress and a small royal gate
  {
    const { cx, cy } = hallOf("robots");
    const gx = cx - 1.5, gy = cy - 0.5;
    add(gx, gy, 3.0, 1.0, (
      <>
        <Pedestal gx={gx} gy={gy} w={3.0} d={1.0} h={4} plaque={PLAQUE.robots} color="#d9502f" />
        <MiniRobot x={gx + 0.6} y={gy + 0.5} z={4} robe="#3b6fd8" />
        <MiniRobot x={gx + 1.5} y={gy + 0.5} z={4} robe="#2f9e7a" />
        <MiniRobot x={gx + 2.4} y={gy + 0.5} z={4} robe="#2b2b33" />
      </>
    ), { bias: 0.3 });
    add(17.6, 2.2, 0.3, 0.3, <Box gx={17.6} gy={2.2} w={0.3} d={0.3} h={34} base="#c8431f" />);
    add(17.6, 5.4, 0.3, 0.3, <Box gx={17.6} gy={5.4} w={0.3} d={0.3} h={34} base="#c8431f" />);
    add(17.4, 2.0, 0.7, 3.9, <Box gx={17.4} gy={2.0} w={0.7} d={3.9} z={34} h={4} base="#3a3f52" />, { solid: false, bias: 0.2 });
  }

  // LAB: the simulator workstation showing the real IDD village, a server rack
  {
    const { cx, cy } = hallOf("lab");
    const gx = cx - 1.4, gy = cy - 0.7;
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
    ), { bias: 0.3 });
    add(cx - 3.1, cy - 2.2, 0.9, 0.8, (
      <Box gx={cx - 3.1} gy={cy - 2.2} w={0.9} d={0.8} h={30} base="#2f3b5c">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={P(cx - 2.2, cy - 1.8, 5 + i * 5)[0] - 2} cy={P(cx - 2.2, cy - 1.8, 5 + i * 5)[1]} r="1.2" fill={i % 2 ? "#6fe3ff" : "#8bf59a"}>
            <animate attributeName="opacity" values="1;0.2;1" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </Box>
    ));
  }

  // STARFIELD: the mall model, B1-4F
  {
    const { cx, cy } = hallOf("mall");
    const gx = cx - 1.2, gy = cy - 0.9;
    add(gx, gy, 2.4, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.4} d={1.8} h={4} plaque={PLAQUE.mall} color="#b27d00" />
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} gx={gx + 0.2} gy={gy + 0.25} w={2.0} d={1.3} z={4 + i * 7} h={4} base={["#fff0c0", "#ffe9a8", "#ffe090", "#ffd566"][i]} />
        ))}
        <circle cx={P(gx + 1.6, gy + 0.9, 36)[0]} cy={P(gx + 1.6, gy + 0.9, 36)[1]} r="3" fill="#ff6b4a" stroke="#fff" strokeWidth="1" />
      </>
    ), { bias: 0.3 });
  }

  // RAEMIAN: apartment tower with windows
  {
    const { cx, cy } = hallOf("raemian");
    const gx = cx - 1.2, gy = cy - 0.9;
    add(gx, gy, 2.4, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.4} d={1.8} h={5} plaque={PLAQUE.raemian} color="#5a47b8" />
        <Box gx={gx + 0.3} gy={gy + 0.35} w={0.8} d={1.1} z={5} h={30} base="#dfe7f7" />
        <Box gx={gx + 1.3} gy={gy + 0.5} w={0.8} d={0.9} z={5} h={20} base="#e9eefb" />
        {[9, 14, 19, 24, 29].map((z) => (
          <line key={z} x1={P(gx + 0.3, gy + 1.45, 5 + z)[0]} y1={P(gx + 0.3, gy + 1.45, 5 + z)[1]} x2={P(gx + 1.1, gy + 1.45, 5 + z)[0]} y2={P(gx + 1.1, gy + 1.45, 5 + z)[1]} stroke="#7e92c4" strokeWidth="1.4" />
        ))}
        <circle cx={P(gx + 0.7, gy + 0.9, 40)[0]} cy={P(gx + 0.7, gy + 0.9, 40)[1]} r="2.4" fill="#6fe3ff" stroke="#fff" strokeWidth="1" />
      </>
    ), { bias: 0.3 });
  }

  // FANDOM: light sticks glowing over a brand-personality radar
  {
    const { cx, cy } = hallOf("fandom");
    const gx = cx - 1.2, gy = cy - 0.9;
    const c = P(cx, cy, 4);
    add(gx, gy, 2.4, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.4} d={1.8} h={4} plaque={PLAQUE.fandom} color="#b8305f" />
        <g transform={`translate(${c[0]} ${c[1]})`}>
          <polygon points="0,-9 8.6,-2.8 5.3,7.3 -5.3,7.3 -8.6,-2.8" fill="rgba(224,69,123,0.12)" stroke="#e0457b" strokeWidth="1" />
          <polygon points="0,-5 5,-1.6 2.6,4.4 -3.2,4 -4.6,-1.8" fill="rgba(224,69,123,0.35)" stroke="#e0457b" strokeWidth="1" />
        </g>
        {["#e0457b", "#ffc93c", "#6fe3ff", "#8bf59a", "#b07af0"].map((col, i) => {
          const p = P(gx + 0.4 + i * 0.4, gy + 0.9 + (i % 2) * 0.4, 4);
          return (
            <g key={col} transform={`translate(${p[0]} ${p[1]})`}>
              <line x1="0" y1="0" x2="0" y2="-20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="-22" r="4" fill={col}>
                <animate attributeName="opacity" values="1;0.45;1" dur={`${1.1 + i * 0.25}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </>
    ), { bias: 0.3 });
  }

  // LIFE-LOG: a mini fridge streaming data
  {
    const { cx, cy } = hallOf("lifelog");
    const gx = cx - 1.0, gy = cy - 0.8;
    add(gx, gy, 2.0, 1.6, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.0} d={1.6} h={4} plaque={PLAQUE.lifelog} color="#2b6fd1" />
        <Box gx={gx + 0.45} gy={gy + 0.35} w={1.0} d={0.9} z={4} h={22} base="#eaf1ff" />
        <line x1={P(gx + 0.5, gy + 1.25, 20)[0]} y1={P(gx + 0.5, gy + 1.25, 20)[1]} x2={P(gx + 0.5, gy + 1.25, 12)[0]} y2={P(gx + 0.5, gy + 1.25, 12)[1]} stroke="#9aa6bc" strokeWidth="2" />
        <circle cx={P(gx + 1.3, gy + 1.25, 22)[0]} cy={P(gx + 1.3, gy + 1.25, 22)[1]} r="1.4" fill="#6fe3ff" />
        {[0, 1, 2, 3, 4].map((i) => {
          const p = P(cx + (i - 2) * 0.35, cy, 30);
          return (
            <circle key={i} cx={p[0]} cy={p[1]} r="1.6" fill={["#6fe3ff", "#8bf59a", "#ffc93c", "#ff7a6b", "#b07af0"][i]}>
              <animate attributeName="cy" values={`${p[1]};${p[1] - 14};${p[1]}`} dur={`${1.6 + i * 0.35}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur={`${1.6 + i * 0.35}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </>
    ), { bias: 0.3 });
  }

  // SAMSUNG: the demand dashboard
  {
    const { cx, cy } = hallOf("samsung");
    const gx = cx - 1.3, gy = cy - 0.9;
    add(gx, gy, 2.6, 1.8, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.6} d={1.8} h={6} plaque={PLAQUE.samsung} color="#2b3aa8" />
        <Box gx={gx + 0.2} gy={gy + 0.3} w={2.2} d={0.14} z={6} h={18} base="#232844">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={P(gx + 0.45 + i * 0.33, gy + 0.44, 0)[0] - 2} y={P(gx + 0.45 + i * 0.33, gy + 0.44, 9 + i * 2)[1]} width="4" height={3 + i * 2} fill="#6fe3ff" opacity="0.9" stroke="none" />
          ))}
        </Box>
        <MiniPerson x={gx + 1.3} y={gy + 1.3} z={6} color="#4a5bd8" />
      </>
    ), { bias: 0.3 });
  }

  // BIXBY: a cooking assistant on a screen-based appliance, with a steaming pot
  {
    const { cx, cy } = hallOf("bixby");
    const gx = cx - 1.1, gy = cy - 0.8;
    const pot = P(cx + 0.3, cy + 0.1, 10);
    add(gx, gy, 2.2, 1.6, (
      <>
        <Pedestal gx={gx} gy={gy} w={2.2} d={1.6} h={5} plaque={PLAQUE.bixby} color="#1f5fc0" />
        <Box gx={gx + 0.25} gy={gy + 0.3} w={1.0} d={0.8} z={5} h={14} base="#eef1f8" />
        <circle cx={P(gx + 0.75, gy + 1.1, 16)[0]} cy={P(gx + 0.75, gy + 1.1, 16)[1]} r="3.4" fill="#2f80ed">
          <animate attributeName="r" values="2.6;4;2.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <g transform={`translate(${pot[0]} ${pot[1]})`}>
          <ellipse cx="0" cy="0" rx="6" ry="2.4" fill="#9aa6bc" stroke={EDGE} strokeWidth="0.7" />
          <path d="M-6,0 L-5,-7 L5,-7 L6,0 Z" fill="#c9ced8" stroke={EDGE} strokeWidth="0.7" />
          {[-2.5, 0, 2.5].map((x, i) => (
            <path key={i} d={`M${x},-9 q-2,-4 0,-7 q2,-3 0,-6`} fill="none" stroke="#bcc6da" strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.1;0.9;0.1" dur={`${1.4 + i * 0.4}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>
      </>
    ), { bias: 0.3 });
  }

  // decor: plants, benches
  [[1.2, 1.2], [24.4, 1.2], [5.7, 7.1], [16.3, 7.1], [1.2, 8.4], [24.6, 8.4], [1.0, 18.6], [24.5, 18.6], [6.0, 18.6], [10.8, 18.6], [15.4, 18.6], [20.2, 18.6]].forEach(([x, y]) => add(x, y, 0.5, 0.5, <Plant gx={x + 0.25} gy={y + 0.25} />));
  [[8.4, 10.9], [17.0, 10.9]].forEach(([x, y]) =>
    add(x, y, 1.6, 0.6, (
      <>
        <Box gx={x} gy={y} w={1.6} d={0.6} h={5} base="#c79f78" />
        <Box gx={x} gy={y} w={1.6} d={0.14} z={5} h={6} base="#b88c64" />
      </>
    ))
  );

  // ---- walking graph: exhibit spots + a lane grid, linked wherever the floor is clear
  NODES.gate = fixSpot([3.0, 9.8]);
  ZONES.forEach((z) => {
    NODES[`${z.id}_a`] = fixSpot([z.cx - 0.9, z.cy + 2.0]);
    NODES[`${z.id}_b`] = fixSpot([z.cx + 2.0, z.cy + 1.1]);
    NODES[`${z.id}_d`] = fixSpot([z.cx + 0.8, z.cy + 2.8]);
  });
  [1.7, 4.7, 7.7, 10.7, 13.7, 16.7, 19.7, 22.7, 24.4].forEach((x) =>
    [1.6, 5.6, 8.8, 10.2, 13.4, 17.6].forEach((y) => {
      if (walkable(x, y) && !Object.values(NODES).some((p) => dist2(p, [x, y]) < 0.9)) NODES[`l${x}_${y}`] = [x, y];
    })
  );
  const keys = Object.keys(NODES);
  keys.forEach((a, i) =>
    keys.slice(i + 1).forEach((b) => {
      if (dist2(NODES[a], NODES[b]) <= 9 && clearLine(NODES[a], NODES[b])) EDGES.push([a, b]);
    })
  );
  return out;
}
const PROPS = buildWorld();




// ------------------------------------------------------------ people
type Kind = YunId | "you";
const SHIRT: Record<Kind, string> = { army: "#5b7a46", care: "#6a9bff", samsung: "#eef0ff", robots: "#ff8a66", mall: "#ffd24a", penn: "#2a3f7f", you: "#ff4d6d" };

function Person({ kind, face, bob }: { kind: Kind; face: 1 | -1; bob: number }) {
  const shirt = SHIRT[kind];
  return (
    <g transform={`scale(${face} 1)`}>
      <ellipse cx="0" cy="1.5" rx="8" ry="3" fill="rgba(60,80,120,0.22)" />
      <g transform={`translate(0 ${bob})`}>
        <rect x="-4" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="1" y="-6" width="3" height="6" rx="1.2" fill="#56618a" />
        <rect x="-5.5" y="-17" width="11" height="12" rx="4.5" fill={shirt} stroke={kind === "samsung" ? "rgba(70,100,150,0.4)" : "none"} strokeWidth="0.8" />
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
        {kind === "robots" && (
          <>
            <path d="M-6.4,-24 Q0,-34 6.4,-24" fill="none" stroke="#26324f" strokeWidth="1.4" />
            <rect x="-7.6" y="-24" width="2.6" height="5" rx="1.2" fill="#26324f" />
          </>
        )}
        {kind === "care" && <path d="M0,-9.5 C-3,-12.5 -3.6,-14.2 -1.8,-14.8 C-0.8,-15 0,-14.2 0,-14.2 C0,-14.2 0.8,-15 1.8,-14.8 C3.6,-14.2 3,-12.5 0,-9.5 Z" fill="#ff6b8a" />}
        {kind === "penn" && (
          <>
            <path d="M-6.4,-24 Q0,-34 6.4,-24" fill="none" stroke="#c23d8c" strokeWidth="1.6" />
            <circle cx="-6.6" cy="-22" r="2.2" fill="#c23d8c" />
            <circle cx="0" cy="-12" r="2.4" fill="#d6283a" />
          </>
        )}
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
type SnapAgent = { id: YunId; pos: Pt; face: 1 | -1; mode: "walk" | "do"; frozen: boolean };
type Snap = {
  t: number;
  a: SnapAgent[];
  p: { pos: Pt; face: 1 | -1; moving: boolean };
  doc: { pos: Pt; face: 1 | -1; mode: "walk" | "do"; hall: ZoneId | null; line: string };
  near: string | null;
  follow: boolean;
  moved: boolean;
  cam: { x: number; y: number; w: number; h: number };
};

// physical keys, so Korean (or any non-Latin) input layouts still work
const keyOf = (e: KeyboardEvent) => (e.code.startsWith("Key") ? e.code.slice(3).toLowerCase() : e.code.startsWith("Digit") ? e.code.slice(5) : e.key);
const KEYDIR: Record<string, Pt> = { ArrowUp: [-1, -1], w: [-1, -1], ArrowDown: [1, 1], s: [1, 1], ArrowLeft: [-1, 1], a: [-1, 1], ArrowRight: [1, -1], d: [1, -1] };
const START: Pt = fixSpot([11.2, 9.7]);

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
  const [init] = useState(() => YUN_IDS.map((id, k) => makeYun(id, k)));
  const agents = useRef<Yun[]>(init);
  const clock = useRef(0);
  const docent = useRef<Docent>({ pos: [START[0] - 1.8, START[1] - 0.5] as Pt, path: [], seg: 0, mode: "do", left: 7, i: -1, node: "gate", face: 1, hall: null });
  const player = useRef<{ pos: Pt; face: 1 | -1; path: Pt[]; moving: boolean }>({ pos: START, face: 1, path: [], moving: false });
  const keys = useRef<Set<string>>(new Set());
  const cam = useRef({ x: 0, y: 0, w: VW, h: VH });
  const st = useRef({ play: true, follow: false, moved: false, talkWho: null as string | null, sel: null as string | null, dlg: null as { who: string; key: string } | null, near: null as string | null });
  const svgRef = useRef<SVGSVGElement>(null);
  const last = useRef<number | null>(null);

  const [snap, setSnap] = useState<Snap>({
    t: 0,
    a: init.map((a) => ({ id: a.id, pos: a.pos, face: a.face, mode: a.mode, frozen: false })),
    p: { pos: START, face: 1, moving: false },
    doc: { pos: [START[0] - 1.8, START[1] - 0.5] as Pt, face: 1, mode: "do", hall: null, line: WELCOME },
    near: null,
    follow: false,
    moved: false,
    cam: { x: 0, y: 0, w: VW, h: VH },
  });
  const [playing, setPlaying] = useState(true);
  const play = true;
  const hoverFrame = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [dlg, setDlg] = useState<{ who: string; key: string } | null>(null);
  const [met, setMet] = useState<YunId[]>([]);
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
    setDlg(null);
    player.current.path = [];
    keys.current.clear();
  }, [setDlg]);

  const openDialog = useCallback((who: string) => {
    setDlg({ who, key: "root" });
    if (who !== "D" && !who.startsWith("x:")) setMet((m) => (m.includes(who as YunId) ? m : [...m, who as YunId]));
  }, [setDlg]);

  const choose = useCallback(
    (c: Choice) => {
      if (c.href) {
        router.push(c.href);
        return;
      }
      if (c.go) setDlg((d) => (d ? { ...d, key: c.go as string } : d));
      else setDlg(null);
    },
    [router, setDlg]
  );

  // keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const s = st.current;
      const k = keyOf(e);
      if (k === "Escape") {
        if (s.dlg) setDlg(null);
        else if (s.follow) {
          s.follow = false;
          s.talkWho = null;
        } else if (expanded) collapse();
        return;
      }
      if (s.dlg) {
        const n = dialogNode(s.dlg.who, s.dlg.key);
        const idx = parseInt(k, 10);
        if (idx >= 1 && idx <= n.choices.length) choose(n.choices[idx - 1]);
        else if (k === " " || k === "e" || k === "Enter") choose(n.choices[0]);
        e.preventDefault();
        return;
      }
      if ((k === " " || k === "e" || (k === "Enter" && hoverFrame.current)) && s.near) {
        openDialog(s.near);
        e.preventDefault();
        return;
      }
      if (!expanded && !hoverFrame.current) return;
      if (KEYDIR[k]) {
        keys.current.add(k);
        player.current.path = [];
        s.follow = true;
        s.talkWho = null;
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = keyOf(e);
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
      if (moved) s.moved = true;
    } else pl.moving = false;

    // nearest talkable
    let near: string | null = null;
    if (s.play) {
      let bd = 2.7;
      agents.current.forEach((a) => {
        const d = dist2(pl.pos, a.pos);
        if (d < bd) {
          bd = d;
          near = a.id;
        }
      });
      if (dist2(pl.pos, docent.current.pos) < bd) near = "D";
      if (near === null) {
        let be = 2.9;
        ZONES.forEach((z) => {
          const d = dist2(pl.pos, [z.cx, z.cy]);
          if (d < be) {
            be = d;
            near = `x:${z.id}`;
          }
        });
      }
    }
    s.near = near;

    // the Yuns
    agents.current.forEach((a) => {
      if (near === a.id || (s.dlg && s.dlg.who === a.id)) {
        const sx = P(pl.pos[0], pl.pos[1])[0] - P(a.pos[0], a.pos[1])[0];
        if (Math.abs(sx) > 1) a.face = sx > 0 ? 1 : -1;
        return;
      }
      if (a.mode === "do") {
        a.left -= dt;
        if (a.left <= 0) {
          a.i = (a.i + 1) % ROUTES[a.id].length;
          const [nh, nw] = ROUTES[a.id][a.i];
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
          const [h, w, dur] = ROUTES[a.id][a.i];
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
    if (s.sel === "D") f = d.pos;
    else if (s.sel) f = agents.current.find((a) => a.id === s.sel)?.pos;
    else if (s.follow) f = pl.pos;
    if (f) {
      const z = s.follow && !s.sel ? 0.5 : 0.46;
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
      a: agents.current.map((a) => ({ id: a.id, pos: [...a.pos] as Pt, face: a.face, mode: a.mode, frozen: s.near === a.id })),
      p: { pos: [...player.current.pos] as Pt, face: player.current.face, moving: player.current.moving },
      doc: { pos: [...dc.pos] as Pt, face: dc.face, mode: dc.mode, hall: dc.hall, line: dc.hall ? hallOf(dc.hall).caption : WELCOME },
      near: s.near,
      follow: s.follow,
      moved: s.moved,
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
        const sx = st.current;
        if (sx.talkWho && sx.near === sx.talkWho && !sx.dlg) {
          const who = sx.talkWho;
          sx.talkWho = null;
          openDialog(who);
        }
      }
      last.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, run, tick, makeSnap, openDialog]);

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
    st.current.follow = true;
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
    if (play) {
      if (dlg) return;
      const g = toGrid(e);
      if (g) walkTo(g);
      return;
    }
    if (sel) setSel(null);
    else if (!expanded) expand();
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
      const ycol = yunColor(a.id);
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
              if (play) {
                if (snap.near === a.id) openDialog(a.id);
                else {
                  st.current.talkWho = a.id;
                  walkTo([a.pos[0], a.pos[1] + 1.2]);
                }
              } else setSel(sel === a.id ? null : a.id);
            }}
          >
            <rect x="-14" y="-42" width="28" height="48" fill="transparent" />
            <Person kind={a.id} face={a.face} bob={bob} />
            {(on || snap.near === a.id || hov === a.id || (snap.follow && dist2(snap.p.pos, a.pos) < 6.5)) && tag(YUN[a.id].tag.toUpperCase(), ycol, -37, on, YUN[a.id].tag.length * 4.1 + 12)}
            {a.frozen && play && (
              <g transform="translate(0 -52)">
                <rect x="-24" y="-8" width="48" height="11" rx="5.5" fill={INK} />
                <text x="0" y="0" textAnchor="middle" fontSize="6.6" fill="#fff" style={{ fontFamily: SANS }}>
                  Space · talk
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
            if (play) {
              if (snap.near === "D") openDialog("D");
              else {
                st.current.talkWho = "D";
                walkTo([snap.doc.pos[0], snap.doc.pos[1] + 1.2]);
              }
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
              <rect x="-24" y="-8" width="48" height="11" rx="5.5" fill={INK} />
              <text x="0" y="0" textAnchor="middle" fontSize="6.6" fill="#fff" style={{ fontFamily: SANS }}>
                Space · talk
              </text>
            </g>
          )}
        </g>
      ),
    },
    {
      depth: snap.p.pos[0] + snap.p.pos[1] + 0.35,
      el: (
        <g key="you" transform={`translate(${P(snap.p.pos[0], snap.p.pos[1])[0]} ${P(snap.p.pos[0], snap.p.pos[1])[1]}) scale(1.2)`} pointerEvents="none">
          <ellipse cx="0" cy="1.5" rx="11" ry="4" fill="none" stroke="#ff4d6d" strokeWidth="1.4" opacity={0.5 + 0.4 * Math.sin(snap.t * 4)} />
          <Person kind="you" face={snap.p.face} bob={snap.p.moving ? Math.sin(snap.t * 16) * 1.4 : 0} />
          {tag("YOU", "#ff4d6d", -37, true, 28)}
          {!snap.moved && (
            <g transform="translate(0 -64)">
              <rect x="-50" y="-11" width="100" height="22" rx="8" fill="#ff4d6d" />
              <text x="0" y="-1" textAnchor="middle" fontSize="6.6" fontWeight={700} fill="#fff" style={{ fontFamily: SANS }}>
                Move me!
              </text>
              <text x="0" y="7" textAnchor="middle" fontSize="5.6" fill="#fff" style={{ fontFamily: SANS }}>
                WASD / arrows / click the floor
              </text>
            </g>
          )}
          <path d={`M-3,${-50 + Math.sin(snap.t * 5) * 1.5} L3,${-50 + Math.sin(snap.t * 5) * 1.5} L0,${-45 + Math.sin(snap.t * 5) * 1.5} Z`} fill="#ff4d6d" />
        </g>
      ),
    },
  ];
  const picProps = (zid: ZoneId) => ({
    className: "cursor-pointer",
    onPointerEnter: () => setPicHot(zid),
    onPointerLeave: () => setPicHot(null),
    onClick: (e: React.MouseEvent) => {
      if (!expanded && !play) return;
      e.stopPropagation();
      const lk = hallOf(zid).link;
      if (lk) router.push(lk.href);
    },
  });
  const panelItems: Item[] = PANELS.filter((p) => !p.wall).map((p, i) => {
    const color = hallOf(p.z).color;
    const gx0 = p.plane === "y" ? p.along : p.fixed;
    const gy0 = p.plane === "y" ? p.fixed : p.along;
    const legA = p.plane === "y" ? [p.along - p.wu / 2, p.fixed] : [p.fixed, p.along - p.wu / 2];
    const legB = p.plane === "y" ? [p.along + p.wu / 2 - 0.12, p.fixed] : [p.fixed, p.along + p.wu / 2 - 0.12];
    return {
      depth: gx0 + gy0 + 0.1,
      el: (
        <g key={`pan${i}`} {...picProps(p.z)}>
          <Box gx={legA[0]} gy={legA[1]} w={0.12} d={0.12} h={14} base="#cfd6e4" />
          <Box gx={legB[0]} gy={legB[1]} w={0.12} d={0.12} h={14} base="#cfd6e4" />
          <WallPic src={p.src} side={p.plane} wall={p.fixed} c={p.along} wu={p.wu} z0={14} H={p.H} hot={picHot === p.z} color={color} />
        </g>
      ),
    };
  });
  const activeId: ZoneId | null = (() => {
    if (picHot) return picHot;
    if (snap.doc.hall && snap.doc.mode === "do") return snap.doc.hall;
    let best: ZoneId | null = null;
    let bd = 3.4;
    ZONES.forEach((z) => {
      const d = dist2(snap.p.pos, [z.cx, z.cy + 1]);
      if (d < bd) {
        bd = d;
        best = z.id;
      }
    });
    return best;
  })();
  const exhItems: Item[] = ZONES.map((z) => {
    const c = P(z.cx, z.cy, 8);
    const isNear = snap.near === `x:${z.id}`;
    return {
      depth: z.cx + z.cy + 0.9,
      el: (
        <g
          key={`hit-${z.id}`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (snap.near === `x:${z.id}`) openDialog(`x:${z.id}`);
            else {
              st.current.talkWho = `x:${z.id}`;
              walkTo(NODES[`${z.id}_a`]);
            }
          }}
        >
          <ellipse cx={c[0]} cy={c[1]} rx="38" ry="26" fill="transparent" />
          {isNear && !dlg && (
            <g transform={`translate(${c[0]} ${c[1] - 34})`} pointerEvents="none">
              <rect x="-26" y="-8" width="52" height="11" rx="5.5" fill={INK} />
              <text x="0" y="0" textAnchor="middle" fontSize="6.6" fill="#fff" style={{ fontFamily: SANS }}>
                Space · look
              </text>
            </g>
          )}
        </g>
      ),
    };
  });
  const activeItems: Item[] = activeId
    ? [{ depth: hallOf(activeId).cx + hallOf(activeId).cy - 2.6, el: <g key="active-fx"><Spot cx={hallOf(activeId).cx} cy={hallOf(activeId).cy} color={hallOf(activeId).color} /><Orbs cx={hallOf(activeId).cx} cy={hallOf(activeId).cy} color={hallOf(activeId).color} /></g> }]
    : [];
  const scene = [...PROPS, ...panelItems, ...activeItems, ...exhItems, ...peopleItems].sort((a, b) => a.depth - b.depth);

  const dnode = dlg ? dialogNode(dlg.who, dlg.key) : null;
  const dcolor = dlg ? (dlg.who === "D" ? INK : dlg.who.startsWith("x:") ? hallOf(dlg.who.slice(2) as ZoneId).color : yunColor(dlg.who as YunId)) : INK;
  const dname = dlg ? (dlg.who === "D" ? "Docent robot" : dlg.who.startsWith("x:") ? hallOf(dlg.who.slice(2) as ZoneId).name : YUN[dlg.who as YunId].tag) : "";

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
        st.current.follow = true;
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
        data-nodrag=""
        viewBox={`${snap.cam.x.toFixed(1)} ${snap.cam.y.toFixed(1)} ${snap.cam.w.toFixed(1)} ${snap.cam.h.toFixed(1)}`}
        className={`block w-full ${expanded ? "" : "h-auto"}`}
        style={expanded ? { height: "calc(100vh - 150px)" } : undefined}
        role="img"
        aria-label="A museum about Yun: one open gallery with five thematic wings, ten exhibits, seven Yuns, a docent robot, and a visitor you can control, each with a Yun avatar, a docent robot, and a visitor you can control"
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

        {/* floor: corridor + five wings */}
        <polygon points={pts([P(-0.2, -0.2), P(NX + 0.2, -0.2), P(NX + 0.2, NY + 0.2), P(-0.2, NY + 0.2)])} fill="#f1ece0" stroke={EDGE} strokeWidth="1" />
        <polygon points={pts([P(0, 8.0), P(NX, 8.0), P(NX, 11.6), P(0, 11.6)])} fill="#f5f1e7" />
        {WINGS.map((w) => {
          const tiles: ReactNode[] = [];
          for (let i = 0; w.x0 + i * 1.5 < w.x1; i++)
            for (let j = 0; w.y0 + j * 1.5 < w.y1; j++)
              if ((i + j) % 2) {
                const x = w.x0 + i * 1.5, y = w.y0 + j * 1.5;
                tiles.push(<polygon key={`${i}-${j}`} points={pts([P(x, y), P(Math.min(x + 1.5, w.x1), y), P(Math.min(x + 1.5, w.x1), Math.min(y + 1.5, w.y1)), P(x, Math.min(y + 1.5, w.y1))])} fill="#ffffff" opacity="0.38" />);
              }
          const ty = w.y0 < 5 ? w.y1 - 0.4 : w.y1 - 0.5;
          const t = P(w.x0 + 0.7, ty, 0);
          return (
            <g key={w.id}>
              <polygon points={pts([P(w.x0, w.y0), P(w.x1, w.y0), P(w.x1, w.y1), P(w.x0, w.y1)])} fill={w.tint} stroke={w.color} strokeWidth="1.6" opacity="0.98" />
              {tiles}
              <text transform={`matrix(0.894 0.447 0 1 ${t[0]} ${t[1]})`} fontSize="11" fontWeight={800} fill={w.color} opacity="0.5" letterSpacing="2.4" style={{ fontFamily: "var(--font-bric), " + SANS }}>
                {w.name}
              </text>
            </g>
          );
        })}
        <polygon points={pts([P(4.5, 9.1), P(23.5, 9.1), P(23.5, 10.3), P(4.5, 10.3)])} fill="#f7e7c6" stroke="#c99a2e" strokeWidth="1" strokeDasharray="4 3" />
        {journey.map((j, i) => {
          const gx = 5.4 + i * 2.5;
          const u = universeOf(j.universe);
          const t = P(gx - 0.3, 10.1, 0);
          return (
            <g key={j.year + j.title}>
              <circle cx={P(gx, 9.45)[0]} cy={P(gx, 9.45)[1]} r="2.6" fill={u.color} stroke="#fff" strokeWidth="1" />
              <text transform={`matrix(0.894 0.447 0 1 ${t[0]} ${t[1]})`} fontSize="6.4" fontWeight={700} fill={INK} style={{ fontFamily: SANS }}>
                {j.year}
              </text>
            </g>
          );
        })}

        {/* walls, door, windows */}
        <polygon points={pts([P(0, 0, 0), P(0, NY, 0), P(0, NY, 64), P(0, 0, 64)])} fill="#f6efe2" stroke={EDGE} strokeWidth="1" />
        <polygon points={pts([P(0, 0, 0), P(NX, 0, 0), P(NX, 0, 64), P(0, 0, 64)])} fill="#efe6d4" stroke={EDGE} strokeWidth="1" />
        <polygon points={pts([P(0, 0, 0), P(0, NY, 0), P(0, NY, 5), P(0, 0, 5)])} fill="#d8c9ac" />
        <polygon points={pts([P(0, 0, 0), P(NX, 0, 0), P(NX, 0, 5), P(0, 0, 5)])} fill="#cdbd9d" />
        <polygon points={pts([P(0, 0, 58), P(0, NY, 58), P(0, NY, 64), P(0, 0, 64)])} fill="#1f2a44" opacity="0.9" />
        <polygon points={pts([P(0, 0, 58), P(NX, 0, 58), P(NX, 0, 64), P(0, 0, 64)])} fill="#1f2a44" opacity="0.9" />
        <polygon points={pts([P(0, 9.0, 0), P(0, 10.6, 0), P(0, 10.6, 38), P(0, 9.0, 38)])} fill="#ffe9b8" stroke="#1f2a44" strokeWidth="3" />
        <polygon points={pts([P(0, 8.2, 41), P(0, 11.4, 41), P(0, 11.4, 53), P(0, 8.2, 53)])} fill="#1f2a44" />
        {(() => {
          const t = P(0, 11.2, 44);
          return (
            <text transform={`matrix(0.894 -0.447 0 1 ${t[0]} ${t[1]})`} fontSize="6.6" fontWeight={700} fill="#fff" letterSpacing="0.8" style={{ fontFamily: "var(--font-bric), " + SANS }}>
              THE MUSEUM OF YUN
            </text>
          );
        })()}
        {[2.4, 14.4, 17.4].map((c) => {
          const o = P(0, c + 0.9, 46);
          return (
            <g key={c} transform={`matrix(${20 * 1.8} ${-10 * 1.8} 0 30 ${o[0]} ${o[1]})`}>
              <rect x="0" y="0" width="1" height="1" fill="#cfe8fb" stroke="#fff" strokeWidth="4" vectorEffect="non-scaling-stroke" />
              <line x1="0.5" y1="0" x2="0.5" y2="1" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="0.5" x2="1" y2="0.5" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}

        {/* a rug appears under the exhibit you are at */}
        {ZONES.filter((z) => z.id === activeId).map((z) => {
          const x0 = z.cx - z.rw, x1 = z.cx + z.rw, y0 = z.cy - 1.9, y1 = z.cy + 3.3, c = 0.7;
          const oct = [P(x0 + c, y0), P(x1 - c, y0), P(x1, y0 + c), P(x1, y1 - c), P(x1 - c, y1), P(x0 + c, y1), P(x0, y1 - c), P(x0, y0 + c)];
          return <polygon key={z.id} points={pts(oct)} fill={mixc(z.color, "#ffffff", 0.78)} stroke={z.color} strokeWidth="2" strokeDasharray="6 4" opacity="0.95" />;
        })}

        {/* pictures hung on the walls */}
        {PANELS.filter((p) => p.wall).map((p, i) => (
          <g key={`w${i}`} {...picProps(p.z)}>
            <WallPic src={p.src} side={p.plane} wall={p.fixed} c={p.along} wu={p.wu} z0={14} H={p.H} hot={picHot === p.z} color={hallOf(p.z).color} />
          </g>
        ))}

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

        {ZONES.filter((z) => z.id === activeId).map((z) => {
          const f = z.link;
          const sp = P(z.cx, z.cy, 84);
          const w = (z.name.length + z.sub.length) * 4.6 + 26;
          return (
            <g key={z.id} transform={`translate(${sp[0]} ${sp[1]})`} pointerEvents="none">
              <line x1="-8" y1="8" x2="-8" y2="26" stroke={z.color} strokeWidth="1" opacity="0.6" />
              <line x1="8" y1="8" x2="8" y2="26" stroke={z.color} strokeWidth="1" opacity="0.6" />
              <rect x={-w / 2} y="-8" width={w} height="16" rx="8" fill="#fff" stroke={z.color} strokeWidth="1.8" />
              <text x="0" y="3" textAnchor="middle" fontSize="8.4" fontWeight={700} fill={z.color} style={{ fontFamily: "var(--font-bric), " + SANS }}>
                {(Object.keys(YUN) as YunId[]).some((id) => met.includes(id) && YUN[id].home === z.id) ? "✓ " : ""}{z.name.toUpperCase()} <tspan fill="rgba(31,42,68,0.55)" fontWeight={500}>· {z.sub}</tspan>
              </text>
              {f && picHot === z.id && (
                <g transform="translate(0 -18)">
                  <rect x="-96" y="-10" width="192" height="15" rx="7.5" fill={INK} />
                  <text x="0" y="0.5" textAnchor="middle" fontSize="8" fill="#fff" style={{ fontFamily: SANS }}>
                    {expanded || play ? "Open exhibit" : "Click to enlarge"}: {f.title.length > 24 ? f.title.slice(0, 23) + "…" : f.title} →
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {WINGS.map((w) => {
          const sp = P((w.x0 + w.x1) / 2, (w.y0 + w.y1) / 2, 122);
          const wd = w.name.length * 6.2 + 28;
          return (
            <g key={w.id} transform={`translate(${sp[0]} ${sp[1]})`} pointerEvents="none">
              <line x1={-wd / 2 + 6} y1="10" x2={-wd / 2 + 6} y2="30" stroke={w.color} strokeWidth="1" opacity="0.5" />
              <line x1={wd / 2 - 6} y1="10" x2={wd / 2 - 6} y2="30" stroke={w.color} strokeWidth="1" opacity="0.5" />
              <rect x={-wd / 2} y="-10" width={wd} height="20" rx="10" fill={w.color} />
              <text x="0" y="3.6" textAnchor="middle" fontSize="9.4" fontWeight={800} fill="#fff" letterSpacing="1.4" style={{ fontFamily: "var(--font-bric), " + SANS }}>
                {w.name}
              </text>
            </g>
          );
        })}

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
          <span className="whitespace-nowrap">MUSEUM OF YUN</span>
        </span>
        <span className="pointer-events-auto flex items-center gap-2">
          <span className="rounded-full bg-white/85 px-3 py-1 backdrop-blur" style={{ fontFamily: "var(--font-pixel)" }}>
            {snap.follow ? "FOLLOWING" : "OVERVIEW"}
          </span>
          {snap.follow && (
            <button
              type="button"
              onClick={() => {
                st.current.follow = false;
                st.current.talkWho = null;
              }}
              className="inline-flex h-7 items-center rounded-full bg-white/90 px-3 backdrop-blur hover:bg-[#fff3b8]"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              ⤡
            </button>
          )}
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

      {play && !dlg && (
        <>
          <p className="pointer-events-none absolute bottom-5 left-6 hidden rounded-full bg-white/80 px-3 py-1 text-[11px] backdrop-blur md:block" style={{ fontFamily: "var(--font-pixel)", color: INK }}>
            WASD / arrows to move · click the floor to walk · click a Yun to talk · Space to talk
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
        {!expanded && (
          <button type="button" onClick={expand} className="inline-flex h-8 items-center rounded-full border bg-white px-4 hover:bg-[#fff3b8]" style={{ borderColor: "rgba(31,42,68,0.3)" }}>
            Enlarge
          </button>
        )}
        <Link href="/concept/journey" className="inline-flex h-8 items-center rounded-full border bg-white px-4 hover:bg-[#fff3b8]" style={{ borderColor: "rgba(31,42,68,0.3)" }}>
          Journey map →
        </Link>
      </div>
      <div className="flex items-center gap-2 text-[11px]" style={{ fontFamily: "var(--font-pixel)" }}>
        <span className="uppercase opacity-55">passport {met.length}/6</span>
        <span className="flex gap-1">
          {YUN_IDS.map((id) => (
            <span key={id} title={YUN[id].tag} className="h-3.5 w-3.5 rounded-full border" style={{ borderColor: yunColor(id), background: met.includes(id) ? yunColor(id) : "transparent" }} />
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
    <div ref={wrap} className="w-full" onPointerEnter={() => (hoverFrame.current = true)} onPointerMove={() => (hoverFrame.current = true)} onPointerDown={() => (hoverFrame.current = true)} onPointerLeave={() => (hoverFrame.current = false)} style={expanded && frameH ? { height: frameH } : undefined}>
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
