"use client";

import { useSyncExternalStore } from "react";
import { universes } from "@/data/concept";

const CX = 450;
const CY = 380;
const pos = universes.map((u, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { u, x: CX + Math.cos(a) * 325, y: CY + Math.sin(a) * 275 };
});

function branch(x: number, y: number, i: number) {
  const dx = x - CX;
  const dy = y - CY;
  const len = Math.hypot(dx, dy);
  const px = -dy / len;
  const py = dx / len;
  const s = i % 2 === 0 ? 1 : -1;
  const c1 = [CX + dx * 0.3 + px * 70 * s, CY + dy * 0.3 + py * 70 * s];
  const c2 = [CX + dx * 0.72 - px * 45 * s, CY + dy * 0.72 - py * 45 * s];
  return `M${CX},${CY} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x},${y}`;
}

export default function Multiverse({
  active,
  onActive,
  onPick,
}: {
  active: string | null;
  onActive: (id: string | null) => void;
  onPick: (id: string) => void;
}) {
  const reduce = useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  return (
    <svg
      viewBox="-50 20 1000 720"
      className="h-auto w-full select-none"
      role="img"
      aria-label="Design thinking at the centre, branching into six domains"
    >
      <defs>
        <radialGradient id="mvGlow">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#8b7bff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#8b7bff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {[
        { r: 85, l: "Basic" },
        { r: 150, l: "Data-driven" },
        { r: 215, l: "AI-driven" },
      ].map((ring) => (
        <g key={ring.l}>
          <circle
            cx={CX}
            cy={CY}
            r={ring.r}
            fill="none"
            stroke="white"
            strokeOpacity="0.1"
            strokeDasharray="2 6"
          />
          <text
            x={CX}
            y={CY - ring.r - 7}
            textAnchor="middle"
            fontSize="10"
            letterSpacing="2"
            fill="white"
            fillOpacity="0.35"
            style={{ fontFamily: "var(--font-mono-c)", textTransform: "uppercase" }}
          >
            {ring.l}
          </text>
        </g>
      ))}

      <circle cx={CX} cy={CY} r="130" fill="url(#mvGlow)" />

      {pos.map(({ u, x, y }, i) => {
        const dim = active && active !== u.id;
        const d = branch(x, y, i);
        return (
          <g key={u.id} style={{ opacity: dim ? 0.22 : 1, transition: "opacity .25s" }}>
            <path d={d} fill="none" stroke={u.color} strokeOpacity="0.18" strokeWidth="9" strokeLinecap="round" />
            <path
              id={`mv-${u.id}`}
              d={d}
              fill="none"
              stroke={u.color}
              strokeOpacity={active === u.id ? 1 : 0.7}
              strokeWidth={active === u.id ? 2.4 : 1.4}
              strokeLinecap="round"
              strokeDasharray={reduce ? undefined : "1 7"}
            >
              {!reduce && (
                <animate attributeName="stroke-dashoffset" from="64" to="0" dur="3.2s" repeatCount="indefinite" />
              )}
            </path>
            {!reduce &&
              [0, 1].map((k) => (
                <circle key={k} r="3.6" fill={u.color}>
                  <animateMotion
                    dur={`${6 + i * 0.8}s`}
                    begin={`${k * (3 + i * 0.4)}s`}
                    repeatCount="indefinite"
                    keyPoints={k === 0 ? "0;1" : "1;0"}
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#mv-${u.id}`} />
                  </animateMotion>
                </circle>
              ))}
          </g>
        );
      })}

      {/* centre: double diamond */}
      <g transform={`translate(${CX} ${CY})`}>
        <path d="M-58,0 L-29,-34 L0,0 L-29,34 Z" fill="#fff" fillOpacity="0.92" />
        <path d="M0,0 L29,-34 L58,0 L29,34 Z" fill="#b9a8ff" fillOpacity="0.95" />
        <text
          y="62"
          textAnchor="middle"
          fontSize="13"
          fill="white"
          style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic" }}
        >
          design thinking
        </text>
      </g>

      {pos.map(({ u, x, y }) => {
        const on = active === u.id;
        const right = x > CX + 20;
        const left = x < CX - 20;
        const anchor = right ? "start" : left ? "end" : "middle";
        const lx = right ? x + 46 : left ? x - 46 : x;
        const ly = right || left ? y + 4 : y < CY ? y - 44 : y + 56;
        return (
          <g
            key={u.id}
            tabIndex={0}
            role="button"
            aria-label={`${u.name}: ${u.slugs.length} works`}
            className="cursor-pointer outline-none"
            onMouseEnter={() => onActive(u.id)}
            onMouseLeave={() => onActive(null)}
            onFocus={() => onActive(u.id)}
            onBlur={() => onActive(null)}
            onClick={() => onPick(u.id)}
            style={{ opacity: active && !on ? 0.4 : 1, transition: "opacity .25s" }}
          >
            <circle cx={x} cy={y} r="44" fill="transparent" />
            <circle
              cx={x}
              cy={y}
              r={on ? 38 : 31}
              fill={u.color}
              fillOpacity={on ? 0.28 : 0.14}
              stroke={u.color}
              strokeWidth={on ? 2.5 : 1.5}
              style={{ transition: "all .25s" }}
            />
            <circle cx={x} cy={y} r="5" fill={u.color} />
            <text
              x={x}
              y={y + 22}
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fillOpacity="0.7"
              style={{ fontFamily: "var(--font-mono-c)" }}
            >
              {String(u.slugs.length).padStart(2, "0")}
            </text>
            <text
              className="max-sm:hidden"
              x={lx}
              y={ly}
              textAnchor={anchor}
              fontSize="17"
              fill="white"
              style={{ fontFamily: "var(--font-instrument)" }}
            >
              {u.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
