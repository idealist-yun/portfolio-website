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

// Room blocks, sized and placed to match the actual room proportions from
// the "서비스 동선 (세부)" blueprint — Zone C is a shorter room top-left,
// Zone B a taller central hall, Zone A the lobby beneath it, with the
// President's Office / lounge / elevator / back-office filling the right
// column — rendered in a quieter, editorial palette instead of the original
// slide's saturated pink/green/blue/yellow.
const ROOMS = [
  {
    key: "C",
    name: "서연처 · 전시",
    sub: "Zone C",
    x: 230,
    y: 140,
    w: 475,
    h: 270,
    fill: "#f2e6da",
    stroke: "#d9bd9c",
  },
  {
    key: "B",
    name: "궁궐(동궁) · 응접",
    sub: "Zone B",
    x: 705,
    y: 140,
    w: 465,
    h: 300,
    fill: "#e9efe6",
    stroke: "#bdd0b7",
  },
  {
    key: "A",
    name: "성균관 · 로비",
    sub: "Zone A",
    x: 705,
    y: 440,
    w: 465,
    h: 290,
    fill: "#e7ecf2",
    stroke: "#bccadb",
  },
  {
    key: "President",
    name: "총장실",
    x: 1170,
    y: 15,
    w: 230,
    h: 205,
    fill: "#f7f1de",
    stroke: "#ddc98a",
  },
  {
    key: "Lounge",
    name: "휴게실 · 탕비실",
    x: 1170,
    y: 220,
    w: 230,
    h: 340,
    fill: "#f5efe3",
    stroke: "#ddd0b4",
  },
  {
    key: "Elevator",
    name: "엘리베이터",
    x: 1170,
    y: 560,
    w: 120,
    h: 170,
    fill: "#e9e7e0",
    stroke: "#cac5b8",
  },
  {
    key: "Office",
    name: "사무실",
    x: 820,
    y: 730,
    w: 220,
    h: 50,
    fill: "#e2e0d8",
    stroke: "#c3beaf",
  },
] as const;

// The photo zone is a labeled strip (not a stop), matching the top of Zone B
// in the original blueprint.
const PHOTO_ZONE = { x: 865, y: 140, w: 140, h: 35, label: "포토존" };

const TABLES = [
  { x: 395, y: 195, w: 140, h: 155 },
  { x: 705, y: 195, w: 70, h: 110, label: "데스크" },
];

// Exhibit points (전시품①–⑧) are pushed flush against each room's nearest
// wall, ~20px in from the border — matching how the art actually hangs
// around the perimeter in the original blueprint, rather than floating
// mid-floor.
const STOPS: { id: string; x: number; y: number }[] = [
  { id: "A-S/E", x: 1150, y: 653 },
  { id: "A-R", x: 900, y: 470 },
  { id: "B-S/E", x: 985, y: 400 },
  { id: "B-1-R", x: 725, y: 353 },
  { id: "B-Photo (포토존)", x: 930, y: 185 },
  { id: "B-2-R", x: 1150, y: 160 },
  { id: "B-D", x: 1150, y: 290 },
  { id: "전시품⑤", x: 1150, y: 325 },
  { id: "B-1-3 · 전시품③", x: 685, y: 160 },
  { id: "B-1-2 · 전시품②", x: 685, y: 265 },
  { id: "B-1-1 · 전시품①", x: 685, y: 370 },
  { id: "B-1-4 · 전시품④", x: 245, y: 265 },
  { id: "B-1-5", x: 245, y: 390 },
  { id: "전시품⑥ (총장실)", x: 1190, y: 200 },
  { id: "전시품⑦ (휴게실)", x: 1190, y: 260 },
  { id: "전시품⑧ (로비)", x: 725, y: 480 },
  { id: "C-1-E", x: 650, y: 395 },
  { id: "C-2-E (총장실)", x: 1380, y: 35 },
  { id: "C-S (휴게실)", x: 1190, y: 400 },
];

const PATHS: Record<RobotKey, { d: string; dur: string }> = {
  a: { d: "M1150,653 L900,470 L1150,653", dur: "7s" },
  b: {
    d: "M985,400 L725,353 L650,395 L245,390 L245,265 L245,160 L685,160 L685,265 L685,370 L725,353 L985,400 L930,185 L985,400",
    dur: "26s",
  },
  c: {
    d: "M985,400 L1150,290 L1150,160 L1380,35 L1190,400 L1150,290 L985,400",
    dur: "15s",
  },
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

        <svg viewBox="0 0 1400 790" className="h-auto w-full">
          {ROOMS.map((r) => (
            <g key={r.key}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={14}
                fill={r.fill}
                stroke={r.stroke}
              />
              <text
                x={r.x + 16}
                y={r.y + 28}
                fontSize="17"
                fontWeight={600}
                fill="var(--foreground)"
                opacity={0.75}
              >
                {r.name}
              </text>
              {"sub" in r && (
                <text
                  x={r.x + 16}
                  y={r.y + 48}
                  fontSize="12"
                  fontWeight={500}
                  fill="var(--muted)"
                  letterSpacing="0.06em"
                >
                  {r.sub}
                </text>
              )}
            </g>
          ))}

          <g>
            <rect
              x={PHOTO_ZONE.x}
              y={PHOTO_ZONE.y}
              width={PHOTO_ZONE.w}
              height={PHOTO_ZONE.h}
              rx={6}
              fill="#fff"
              stroke="#bdd0b7"
              strokeDasharray="4 3"
            />
            <text
              x={PHOTO_ZONE.x + PHOTO_ZONE.w / 2}
              y={PHOTO_ZONE.y + PHOTO_ZONE.h / 2 + 5}
              fontSize="13"
              textAnchor="middle"
              fill="var(--muted)"
            >
              {PHOTO_ZONE.label}
            </text>
          </g>

          {TABLES.map((t, i) => (
            <g key={i}>
              <rect
                x={t.x}
                y={t.y}
                width={t.w}
                height={t.h}
                rx={8}
                fill="#d7d2c6"
                stroke="#b7b0a0"
              />
              {t.label && (
                <text
                  x={t.x + t.w / 2}
                  y={t.y + t.h / 2 + 5}
                  fontSize="13"
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
              <circle cx={s.x} cy={s.y} r={5} fill="#fff" stroke="var(--muted)" strokeWidth={1.5} />
              <title>{s.id}</title>
            </g>
          ))}

          {/* robots */}
          {(Object.keys(PATHS) as RobotKey[]).map((k) => (
            <g key={k}>
              <circle r={16} fill={ROBOTS[k].color}>
                <animateMotion
                  dur={PATHS[k].dur}
                  repeatCount="indefinite"
                  path={PATHS[k].d}
                  rotate="0"
                />
              </circle>
              <text fontSize="15" fontWeight={700} fill="#fff" textAnchor="middle" dy="5">
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
