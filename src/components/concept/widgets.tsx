"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function useNow(tz: string) {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

export function ClockPair({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const phl = useNow("America/New_York");
  const sel = useNow("Asia/Seoul");
  const sub = tone === "dark" ? "text-white/45" : "text-black/45";
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { c: "Philadelphia", t: phl },
        { c: "Seoul", t: sel },
      ].map((x) => (
        <div key={x.c}>
          <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${sub}`}>{x.c}</p>
          <p className="mt-1 whitespace-nowrap font-mono text-lg tabular-nums leading-none">{x.t || "--:--"}</p>
        </div>
      ))}
    </div>
  );
}

const KEYS = [
  { n: "C", f: 261.63, k: "a", c: "KeyA" },
  { n: "D", f: 293.66, k: "s", c: "KeyS" },
  { n: "E", f: 329.63, k: "d", c: "KeyD" },
  { n: "F", f: 349.23, k: "f", c: "KeyF" },
  { n: "G", f: 392.0, k: "g", c: "KeyG" },
  { n: "A", f: 440.0, k: "h", c: "KeyH" },
  { n: "B", f: 493.88, k: "j", c: "KeyJ" },
  { n: "C", f: 523.25, k: "k", c: "KeyK" },
];
// black keys sit after white key `after` (0-based): C#, D#, F#, G#, A#
const BLACK = [
  { n: "C#", f: 277.18, k: "w", c: "KeyW", after: 0 },
  { n: "D#", f: 311.13, k: "e", c: "KeyE", after: 1 },
  { n: "F#", f: 369.99, k: "t", c: "KeyT", after: 3 },
  { n: "G#", f: 415.3, k: "y", c: "KeyY", after: 4 },
  { n: "A#", f: 466.16, k: "u", c: "KeyU", after: 5 },
];

export function Piano({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const ctx = useRef<AudioContext | null>(null);
  const [down, setDown] = useState<string | null>(null);

  const play = (id: string, f: number) => {
    try {
      if (!ctx.current) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx.current = new AC();
      }
      const c = ctx.current;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.22, c.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.1);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + 1.15);
    } catch {
      /* audio unavailable */
    }
    setDown(id);
    setTimeout(() => setDown((d) => (d === id ? null : d)), 160);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.target instanceof HTMLInputElement) return;
      const w = KEYS.find((k) => k.c === e.code);
      if (w) return play(`w${w.n}${w.k}`, w.f);
      const b = BLACK.find((k) => k.c === e.code);
      if (b) play(`b${b.n}`, b.f);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const base = tone === "dark" ? "bg-white/90 text-black/60" : "bg-[#fffdf7] text-black/50";
  const on = tone === "dark" ? "bg-[#c58bff] text-white" : "bg-[#c8431f] text-white";
  return (
    <div className="relative h-24">
      <div className="flex h-full gap-[3px]">
        {KEYS.map((k) => {
          const id = `w${k.n}${k.k}`;
          return (
            <button
              key={id}
              type="button"
              aria-label={`Play note ${k.n}`}
              onPointerDown={() => play(id, k.f)}
              className={`flex flex-1 items-end justify-center rounded-b-md pb-1.5 font-mono text-[10px] transition-all duration-100 ${
                down === id ? `${on} translate-y-0.5` : base
              } ${tone === "paper" ? "border border-black/10" : ""}`}
            >
              {k.k}
            </button>
          );
        })}
      </div>
      {BLACK.map((b) => {
        const id = `b${b.n}`;
        return (
          <button
            key={id}
            type="button"
            aria-label={`Play note ${b.n}`}
            onPointerDown={() => play(id, b.f)}
            className={`absolute top-0 z-10 flex h-[58%] w-[8%] -translate-x-1/2 items-end justify-center rounded-b-[3px] pb-1 font-mono text-[8px] text-white/70 shadow-[0_3px_5px_rgba(0,0,0,0.35)] transition-all duration-100 ${
              down === id ? "translate-y-0.5 bg-[#c8431f]" : "bg-[#1d1b18]"
            }`}
            style={{ left: `${((b.after + 1) / KEYS.length) * 100}%` }}
          >
            {b.k}
          </button>
        );
      })}
    </div>
  );
}

export function TiltCard({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`group relative [transform-style:preserve-3d] transition-transform duration-200 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${className}`}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.22), transparent 55%)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
