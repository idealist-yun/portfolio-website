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
  { n: "C", f: 261.63, k: "a" },
  { n: "D", f: 293.66, k: "s" },
  { n: "E", f: 329.63, k: "d" },
  { n: "F", f: 349.23, k: "f" },
  { n: "G", f: 392.0, k: "g" },
  { n: "A", f: 440.0, k: "h" },
  { n: "B", f: 493.88, k: "j" },
  { n: "C", f: 523.25, k: "k" },
];

export function Piano({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const ctx = useRef<AudioContext | null>(null);
  const [down, setDown] = useState<number | null>(null);

  const play = (i: number) => {
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
      o.frequency.value = KEYS[i].f;
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.22, c.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.1);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + 1.15);
    } catch {
      /* audio unavailable */
    }
    setDown(i);
    setTimeout(() => setDown((d) => (d === i ? null : d)), 160);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const i = KEYS.findIndex((k) => k.k === e.key.toLowerCase());
      if (i >= 0 && !(e.target instanceof HTMLInputElement)) play(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const base = tone === "dark" ? "bg-white/90 text-black/60" : "bg-[#fffdf7] text-black/50";
  const on = tone === "dark" ? "bg-[#c58bff] text-white" : "bg-[#c8431f] text-white";
  return (
    <div className="flex h-24 gap-[3px]">
      {KEYS.map((k, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Play note ${k.n}`}
          onPointerDown={() => play(i)}
          className={`flex flex-1 items-end justify-center rounded-b-md pb-1.5 font-mono text-[10px] transition-all duration-100 ${
            down === i ? `${on} translate-y-0.5` : base
          } ${tone === "paper" ? "border border-black/10" : ""}`}
        >
          {k.k}
        </button>
      ))}
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
