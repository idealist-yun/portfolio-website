"use client";

import { useRef, useState, type ReactNode } from "react";

type Pos = { x: number; y: number };

export function DeskItem({
  children,
  left,
  top,
  rot = 0,
  z = 1,
  className = "",
  onFront,
  front,
}: {
  children: ReactNode;
  left: string;
  top: string;
  rot?: number;
  z?: number;
  className?: string;
  onFront: () => void;
  front: number;
}) {
  const [off, setOff] = useState<Pos>({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const start = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

  return (
    <div
      className={`relative md:absolute md:left-[var(--l)] md:top-[var(--t)] ${className}`}
      style={
        {
          "--l": left,
          "--t": top,
          zIndex: z + (drag ? 100 : 0) + front,
          transform: `translate3d(${off.x}px, ${off.y}px, 0) rotate(${drag ? 0 : rot}deg) scale(${drag ? 1.03 : 1})`,
          transition: drag ? "none" : "transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s",
          cursor: "grab",
          touchAction: "pan-y",
        } as React.CSSProperties
      }
      onPointerDown={(e) => {
        if (!isDesktop()) return;
        if ((e.target as HTMLElement).closest("button,a")) return;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        start.current = { px: e.clientX, py: e.clientY, ox: off.x, oy: off.y };
        setDrag(true);
        onFront();
      }}
      onPointerMove={(e) => {
        if (!start.current) return;
        setOff({
          x: start.current.ox + e.clientX - start.current.px,
          y: start.current.oy + e.clientY - start.current.py,
        });
      }}
      onPointerUp={() => {
        start.current = null;
        setDrag(false);
      }}
      onPointerCancel={() => {
        start.current = null;
        setDrag(false);
      }}
    >
      {children}
    </div>
  );
}

export function InkDiagram() {
  const draw = (delay: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: 1,
    animation: `inkdraw 1.6s ${delay}s cubic-bezier(.4,.1,.2,1) forwards`,
  });
  const branches = [
    { d: "M262,140 C300,110 318,70 336,44", l: "disability", x: 292, y: 36 },
    { d: "M262,140 C304,128 330,112 352,100", l: "AI sims", x: 300, y: 92 },
    { d: "M262,140 C310,142 336,142 356,142", l: "robots", x: 306, y: 160 },
    { d: "M262,140 C304,160 330,180 348,196", l: "military", x: 296, y: 208 },
    { d: "M262,140 C296,176 306,214 318,240", l: "retail", x: 246, y: 250 },
    { d: "M262,140 C250,176 230,204 204,226", l: "public", x: 150, y: 244 },
  ];
  return (
    <svg viewBox="0 0 380 280" className="h-auto w-full" fill="none" stroke="#1d1b18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <style>{`@keyframes inkdraw{to{stroke-dashoffset:0}}`}</style>
      <path pathLength={1} style={draw(0)} d="M20,140 L84,66 L148,140 L84,214 Z" />
      <path pathLength={1} style={draw(0.5)} d="M148,140 L205,76 L262,140 L205,204 Z" stroke="#c8431f" />
      <path pathLength={1} style={draw(1)} d="M262,140 L262,140" />
      {branches.map((b, i) => (
        <g key={b.l}>
          <path pathLength={1} style={draw(1 + i * 0.12)} d={b.d} strokeWidth="1.6" />
          <text
            x={b.x}
            y={b.y}
            fill="#1d1b18"
            stroke="none"
            fontSize="17"
            style={{ fontFamily: "var(--font-hand)", opacity: 0, animation: `inkfade .6s ${1.6 + i * 0.12}s forwards` }}
          >
            {b.l}
          </text>
        </g>
      ))}
      <style>{`@keyframes inkfade{to{opacity:1}}`}</style>
      <text x="64" y="146" fill="#1d1b18" stroke="none" fontSize="15" style={{ fontFamily: "var(--font-hand)" }}>
        discover
      </text>
      <text x="184" y="146" fill="#c8431f" stroke="none" fontSize="15" style={{ fontFamily: "var(--font-hand)" }}>
        deliver
      </text>
      <text x="20" y="262" fill="#6b655a" stroke="none" fontSize="14" style={{ fontFamily: "var(--font-hand)" }}>
        design thinking →
      </text>
    </svg>
  );
}
