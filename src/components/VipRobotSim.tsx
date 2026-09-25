"use client";

import { useEffect, useState } from "react";

// Robot colors — reuses the site's accent/warm tokens plus one desaturated
// green so all three serving robots read distinctly against the floor plan.
const ROBOTS = {
  a: { color: "var(--accent)", label: "Robot A", role: "로비 안내" },
  b: { color: "#3f7a5c", label: "Robot B", role: "도슨트 투어" },
  c: { color: "var(--warm)", label: "Robot C", role: "다과 서빙" },
} as const;

type RobotKey = keyof typeof ROBOTS;

const TICKER: { robot: RobotKey; text: string }[] = [
  { robot: "a", text: "로비에서 대기 — 방문객 도착 확인" },
  { robot: "a", text: "인사 및 회의실 안내" },
  { robot: "b", text: "Zone C 진입 — 도슨트 투어 시작" },
  { robot: "b", text: "전시품 ①·②·③ 설명 재생" },
  { robot: "b", text: "전시품 ④·⑤ 설명 후 Zone B로 복귀" },
  { robot: "c", text: "다과 준비 데스크에서 음료 픽업" },
  { robot: "c", text: "총장실로 다과 서빙" },
  { robot: "c", text: "휴게실 정리 후 복귀" },
  { robot: "b", text: "포토존 안내 — 기념 촬영" },
];

// Room blocks, reproducing the actual service-blueprint floor plan (Zone C
// top-left / Zone B a tall central hall / Zone A the lobby beneath it, plus
// the President's Office and lounge to the right) in a quieter, editorial
// palette instead of the original slide's saturated pink/green/blue/yellow.
const ROOMS = [
  {
    key: "C",
    name: "서연처 · 전시",
    sub: "Zone C",
    x: 50,
    y: 90,
    w: 430,
    h: 280,
    fill: "#f2e6da",
    stroke: "#d9bd9c",
  },
  {
    key: "B",
    name: "궁궐(동궁) · 응접",
    sub: "Zone B",
    x: 480,
    y: 90,
    w: 320,
    h: 470,
    fill: "#e9efe6",
    stroke: "#bdd0b7",
  },
  {
    key: "A",
    name: "성균관 · 로비",
    sub: "Zone A",
    x: 480,
    y: 560,
    w: 320,
    h: 140,
    fill: "#e7ecf2",
    stroke: "#bccadb",
  },
  {
    key: "President",
    name: "총장실",
    x: 830,
    y: 20,
    w: 170,
    h: 190,
    fill: "#f7f1de",
    stroke: "#ddc98a",
  },
  {
    key: "Lounge",
    name: "휴게실 · 탕비실",
    x: 830,
    y: 230,
    w: 170,
    h: 290,
    fill: "#f5efe3",
    stroke: "#ddd0b4",
  },
  {
    key: "Elevator",
    name: "엘리베이터",
    x: 830,
    y: 560,
    w: 80,
    h: 140,
    fill: "#e9e7e0",
    stroke: "#cac5b8",
  },
  {
    key: "Office",
    name: "사무실",
    x: 560,
    y: 705,
    w: 160,
    h: 35,
    fill: "#e2e0d8",
    stroke: "#c3beaf",
  },
] as const;

const TABLES = [
  { x: 195, y: 165, w: 150, h: 150 },
  { x: 555, y: 150, w: 65, h: 85, label: "데스크" },
];

const STOPS: { id: string; x: number; y: number }[] = [
  { id: "A-S/E", x: 760, y: 630 },
  { id: "A-R", x: 650, y: 630 },
  { id: "B-S/E", x: 650, y: 520 },
  { id: "B-1-R", x: 480, y: 300 },
  { id: "B-Photo", x: 690, y: 185 },
  { id: "B-2-R", x: 760, y: 220 },
  { id: "B-D", x: 620, y: 320 },
  { id: "전시품①", x: 300, y: 300 },
  { id: "전시품②", x: 300, y: 230 },
  { id: "전시품③", x: 300, y: 150 },
  { id: "전시품④", x: 110, y: 130 },
  { id: "전시품⑤", x: 110, y: 300 },
  { id: "C-2-E (총장실)", x: 900, y: 90 },
  { id: "C-S (휴게실)", x: 900, y: 300 },
];

const PATHS: Record<RobotKey, { d: string; dur: string }> = {
  a: { d: "M760,630 L650,630 L760,630", dur: "7s" },
  b: {
    d: "M650,520 L480,300 L110,300 L110,130 L300,150 L300,230 L300,300 L480,300 L650,520 L690,185 L650,520",
    dur: "22s",
  },
  c: { d: "M650,520 L620,320 L760,220 L900,90 L900,300 L760,220 L650,520", dur: "14s" },
};

export default function VipRobotSim() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % TICKER.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const active = TICKER[step];

  return (
    <div className="not-prose overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warm">
          Live simulation — service circulation
        </p>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Simulated
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <p className="mb-3 text-[11px] text-muted">
          현대 공간 ↔ 조선시대 서사: <span className="text-foreground/80">성균관 = 로비</span> ·{" "}
          <span className="text-foreground/80">궁궐(동궁) = 응접</span> ·{" "}
          <span className="text-foreground/80">서연처 = 전시</span>
        </p>

        <svg viewBox="0 0 1010 760" className="h-auto w-full">
          {ROOMS.map((r) => (
            <g key={r.key}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={12}
                fill={r.fill}
                stroke={r.stroke}
              />
              <text
                x={r.x + 14}
                y={r.y + 24}
                fontSize="13"
                fontWeight={600}
                fill="var(--foreground)"
                opacity={0.75}
              >
                {r.name}
              </text>
              {"sub" in r && (
                <text
                  x={r.x + 14}
                  y={r.y + 40}
                  fontSize="10"
                  fontWeight={500}
                  fill="var(--muted)"
                  letterSpacing="0.06em"
                >
                  {r.sub}
                </text>
              )}
            </g>
          ))}

          {TABLES.map((t, i) => (
            <g key={i}>
              <rect
                x={t.x}
                y={t.y}
                width={t.w}
                height={t.h}
                rx={6}
                fill="#d7d2c6"
                stroke="#b7b0a0"
              />
              {t.label && (
                <text
                  x={t.x + t.w / 2}
                  y={t.y + t.h / 2 + 4}
                  fontSize="10"
                  textAnchor="middle"
                  fill="var(--muted)"
                >
                  {t.label}
                </text>
              )}
            </g>
          ))}

          {/* guide paths */}
          {(Object.keys(PATHS) as RobotKey[]).map((k) => (
            <path
              key={k}
              d={PATHS[k].d}
              fill="none"
              stroke={ROBOTS[k].color}
              strokeOpacity={0.28}
              strokeWidth={2}
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
          ))}

          {/* waypoints */}
          {STOPS.map((s) => (
            <g key={s.id}>
              <circle cx={s.x} cy={s.y} r={3.5} fill="#fff" stroke="var(--muted)" />
              <title>{s.id}</title>
            </g>
          ))}

          {/* robots */}
          {(Object.keys(PATHS) as RobotKey[]).map((k) => (
            <g key={k}>
              <circle r={12} fill={ROBOTS[k].color}>
                <animateMotion
                  dur={PATHS[k].dur}
                  repeatCount="indefinite"
                  path={PATHS[k].d}
                  rotate="0"
                />
              </circle>
              <text fontSize="11" fontWeight={700} fill="#fff" textAnchor="middle" dy="4">
                {k}
                <animateMotion
                  dur={PATHS[k].dur}
                  repeatCount="indefinite"
                  path={PATHS[k].d}
                  rotate="0"
                />
              </text>
            </g>
          ))}
        </svg>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          {(Object.keys(ROBOTS) as RobotKey[]).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: ROBOTS[k].color }}
              />
              {ROBOTS[k].label} · {ROBOTS[k].role}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-border bg-background/60 px-4 py-3">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ background: ROBOTS[active.robot].color }}
          />
          <p className="text-sm leading-snug text-foreground">
            <span className="font-semibold">{ROBOTS[active.robot].label}</span>{" "}
            <span className="text-foreground/80">{active.text}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
