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

const ZONES = [
  { key: "C", name: "서연처 · 전시", x: 40, y: 70, w: 280, h: 340, fill: "#eef1ec" },
  { key: "B", name: "동궁 · 응접", x: 340, y: 40, w: 300, h: 400, fill: "#f4f0e7" },
  { key: "President", name: "총장실", x: 660, y: 40, w: 260, h: 170, fill: "#faf8f3" },
  { key: "Lounge", name: "휴게실 · 탕비실", x: 660, y: 230, w: 260, h: 210, fill: "#faf8f3" },
  { key: "A", name: "성균관 · 로비", x: 340, y: 460, w: 580, h: 110, fill: "#f1efe9" },
];

const STOPS: { id: string; x: number; y: number }[] = [
  { id: "A-S/E", x: 860, y: 515 },
  { id: "A-R", x: 520, y: 515 },
  { id: "B-S/E", x: 500, y: 400 },
  { id: "B-1-R", x: 345, y: 400 },
  { id: "B-Photo", x: 480, y: 90 },
  { id: "B-D", x: 560, y: 300 },
  { id: "전시품①", x: 270, y: 330 },
  { id: "전시품②", x: 270, y: 250 },
  { id: "전시품③", x: 270, y: 160 },
  { id: "전시품④", x: 110, y: 130 },
  { id: "전시품⑤", x: 110, y: 330 },
  { id: "C-2-E (총장실)", x: 860, y: 100 },
  { id: "C-S (휴게실)", x: 860, y: 330 },
];

const PATHS: Record<RobotKey, { d: string; dur: string }> = {
  a: { d: "M860,515 L520,515 L860,515", dur: "7s" },
  b: {
    d: "M500,400 L345,400 L270,330 L270,250 L270,160 L110,130 L110,330 L345,400 L500,400 L480,90 L500,400",
    dur: "20s",
  },
  c: { d: "M500,400 L560,300 L860,100 L860,330 L560,300 L500,400", dur: "13s" },
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
        <svg viewBox="0 0 960 600" className="h-auto w-full">
          {ZONES.map((z) => (
            <g key={z.key}>
              <rect
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                rx={10}
                fill={z.fill}
                stroke="var(--border)"
              />
              <text
                x={z.x + 12}
                y={z.y + 20}
                fontSize="13"
                fontWeight={600}
                fill="var(--muted)"
              >
                {z.name}
              </text>
            </g>
          ))}

          {/* guide paths */}
          {(Object.keys(PATHS) as RobotKey[]).map((k) => (
            <path
              key={k}
              d={PATHS[k].d}
              fill="none"
              stroke={ROBOTS[k].color}
              strokeOpacity={0.22}
              strokeWidth={2}
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
          ))}

          {/* waypoints */}
          {STOPS.map((s) => (
            <g key={s.id}>
              <circle cx={s.x} cy={s.y} r={3.5} fill="var(--border)" stroke="var(--muted)" />
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
              <text
                fontSize="11"
                fontWeight={700}
                fill="#fff"
                textAnchor="middle"
                dy="4"
              >
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
